---
title: "Passer DNS et certs SSL en Terraform — Cloudflare et cert-manager"
slug: passer-dns-et-certs-ssl-en-terraform-cloudflare-et-cert-manager
date: 2026-05-18
author: "Nicolas Rouanne"
---

**Avant** : tous les 3 mois, lancer un script pour renouveler 5 certificats SSL à la main. Copier/coller fullchain et private key dans des GitHub Actions secrets. On oublie une fois, la prod tombe.

**Après** : `terraform apply`. Les certs se renouvellent tout seuls à J-30. Les changements DNS passent par une pull request.

Episto fait tourner une plateforme Kubernetes sur GKE, derrière Cloudflare. Une soixantaine de records DNS, quelques hostnames publics, cinq certificats SSL. Voici comment on a fait passer le tout — DNS, certs, configuration SSL Cloudflare — sous Terraform, et comment on s'est débarrassé du rituel trimestriel.

## L'ancien rituel

Tous les 3 mois, même runbook, mêmes 7 étapes :

1. Créer un token Cloudflare à durée de vie courte (DNS:Edit sur la zone).
2. Lancer le script de renouvellement depuis le repo infra.
3. Le script appelle [`acme.sh`](https://github.com/acmesh-official/acme.sh) qui négocie 5 certs (ZeroSSL en server par défaut).
4. Il supprime puis recrée les Secrets TLS dans Kubernetes (staging + production).
5. Il imprime fullchain et private key en base64 sur le terminal.
6. Copier/coller dans les GitHub Actions secrets : `PR_CERT_FULLCHAIN`, `PR_CERT_PRIV_KEY`.
7. Si des PR environments tournent : les supprimer et les recréer pour qu'ils relisent les secrets.

Vérification :

```bash
$ curl -v https://app.episto.fr 2>&1 | grep "expire date"
*  expire date: May 19 23:59:59 2026 GMT
```

C'est fragile. La date d'expiration vit dans le calendrier de quelqu'un. Le renouvellement est une opération manuelle, donc on la repousse. C'est arrivé une fois : on a oublié, la production est tombée, et on s'en est rendu compte parce que les clients ont écrit. Cette panne est la raison pour laquelle cette migration existe.

## 1. DNS en Terraform

Première étape : mettre tous les records DNS dans le code. L'outil [`cf-terraforming`](https://github.com/cloudflare/cf-terraforming) lit une zone Cloudflare live et la transcrit en HCL Terraform avec les blocks d'import qui vont bien. Une commande par type de ressource :

```bash
export CLOUDFLARE_API_TOKEN=<scoped token>
ZONE=<zone-id>

cf-terraforming generate --token "$CLOUDFLARE_API_TOKEN" --zone "$ZONE" \
  --resource-type cloudflare_dns_record --modern-import-block \
  > dns.tf

cf-terraforming import --token "$CLOUDFLARE_API_TOKEN" --zone "$ZONE" \
  --resource-type cloudflare_dns_record --modern-import-block \
  > imports.tf

terraform init && terraform apply
```

Les labels auto-générés (`terraform_managed_resource_<hash>_<idx>`) sont illisibles. On les renomme à la main avec quelque chose d'exploitable : `app`, `mx_google_primary`, `dkim_google`, `brevo_verification_1`. Seul le label Terraform change — l'import ID reste lié au record live, donc Terraform ne tente rien de destructif.

Structure du module, rien d'exotique :

```text
terraform/cloudflare/
├── versions.tf       # cloudflare/cloudflare ~> 5
├── providers.tf      # api_token via env
├── backend.tf        # state en object storage
├── locals.tf         # zone_id
└── dns.tf            # tous les cloudflare_dns_record
```

Après le premier apply, `imports.tf` est supprimé et `terraform plan` retourne `No changes`. À partir de là, chaque modification DNS passe par une PR, avec un diff lisible par un collègue.

Le vrai gain métier, c'est la traçabilité. Avant, les records DNS étaient édités directement dans le dashboard Cloudflare, sans autre historique que le log Cloudflare. Maintenant, chaque modification est un commit, une PR, une review.

Docs : [Cloudflare Terraform provider](https://developers.cloudflare.com/terraform/) — avec le [llms-full.txt](https://developers.cloudflare.com/terraform/llms-full.txt) agent-friendly — et [cf-terraforming](https://github.com/cloudflare/cf-terraforming).

## 2. Plan en CI, apply au merge

Du Terraform sans garde-fou n'en est pas vraiment un. Le garde-fou, c'est `terraform plan` qui tourne sur chaque pull request, avec la sortie postée dans la PR pour que le reviewer puisse lire le diff avant d'approuver. `apply` tourne après le merge sur `main`, avec un lock de concurrence pour éviter que deux applies ne tournent en parallèle.

```yaml
# .github/workflows/cloudflare-terraform.yml
on:
  pull_request:
    paths: ['terraform/cloudflare/**', '.github/workflows/cloudflare-terraform.yml']
  push:
    branches: [main]
    paths: ['terraform/cloudflare/**']

concurrency:
  group: cloudflare-terraform
  cancel-in-progress: false   # ne jamais cancel un apply en cours
```

Quelques choix de design qui valent le coup :

- Plan posté en commentaire sticky sur la PR — on l'édite à chaque push, on ne spamme pas. Le reviewer voit le dernier diff, pas un mur de versions périmées.
- Plan tronqué à 65k caractères (la limite GitHub pour un comment). Au-delà, le plan complet est uploadé comme artefact du workflow.
- Bruit des lignes `refresh` et `import` filtré pour que le diff reflète un vrai changement, pas une réconciliation d'état.

## 3. cert-manager + Let's Encrypt

Le DNS dans Terraform, c'était la moitié facile. Le rituel manuel vivait dans les certificats.

Premier plan : Cloudflare _Origin CA_ — des certs avec une durée de 15 ans, signés par Cloudflare, donc rien à renouveler. On l'a abandonné. Les certs Origin CA ne sont pas reconnus par les navigateurs, ce qui veut dire qu'on ne peut pas atteindre l'origin en HTTPS direct pour debugger, faire du monitoring externe, ou quand le proxy Cloudflare est OFF. Le jour où on a besoin de contourner Cloudflare pour diagnostiquer un problème, on le découvre à la dure.

Le pivot : Let's Encrypt via [cert-manager](https://cert-manager.io/), challenge DNS-01 sur Cloudflare, renouvellement auto par le controller environ 30 jours avant l'expiration. De vrais certs reconnus par les navigateurs sur l'origin. Le renouvellement devient un job de controller Kubernetes qu'on ne regarde plus jamais.

Le Helm release :

```hcl
# modules/cert-manager/main.tf
resource "helm_release" "cert_manager" {
  name             = "cert-manager"
  repository       = "https://charts.jetstack.io"
  chart            = "cert-manager"
  version          = "v1.16.2"
  namespace        = "cert-manager"
  create_namespace = true

  set {
    name  = "installCRDs"
    value = "true"
  }
}

resource "kubernetes_secret_v1" "cloudflare_api_token" {
  metadata {
    name      = "cloudflare-api-token"
    namespace = "cert-manager"
  }
  data = { "api-token" = var.cloudflare_api_token }
}
```

Un issuer cluster-wide qui pointe vers Let's Encrypt production, avec le token Cloudflare branché pour le solver DNS-01 :

```hcl
resource "kubernetes_manifest" "cluster_issuer" {
  manifest = {
    apiVersion = "cert-manager.io/v1"
    kind       = "ClusterIssuer"
    metadata   = { name = "letsencrypt-prod" }
    spec = {
      acme = {
        server = "https://acme-v02.api.letsencrypt.org/directory"
        email  = "tech@example.com"
        privateKeySecretRef = { name = "letsencrypt-prod" }
        solvers = [{
          dns01 = {
            cloudflare = {
              apiTokenSecretRef = {
                name = "cloudflare-api-token"
                key  = "api-token"
              }
            }
          }
        }]
      }
    }
  }
}
```

Un Certificate par hostname. cert-manager écrit le résultat dans le Secret nommé et le rafraîchit avant expiration :

```hcl
resource "kubernetes_manifest" "api_tls" {
  manifest = {
    apiVersion = "cert-manager.io/v1"
    kind       = "Certificate"
    metadata   = { name = "api-tls", namespace = "backoffice" }
    spec = {
      secretName = "api-tls"
      issuerRef  = { name = "letsencrypt-prod", kind = "ClusterIssuer" }
      dnsNames   = ["app.episto.fr"]
    }
  }
}
```

Pourquoi DNS-01 et pas HTTP-01 :

- Marche derrière le proxy Cloudflare — HTTP-01 nécessiterait que l'origin réponde sur `/.well-known/acme-challenge/`, ce qui ne marche pas quand le trafic est proxyfié.
- Supporte les wildcards, ce qui est indispensable pour les sous-domaines de preview PR.
- Réutilise le même token Cloudflare que la stack DNS. Un seul secret à gérer.

Astuce de migration : les Ingress ne bougent pas. Les `kubernetes_secret_v1.tls` existants ont déjà `lifecycle { ignore_changes = [data] }`, donc cert-manager écrit le nouveau cert dans le même Secret. Le load balancer GCP picks up le nouveau cert en ~5 secondes, sans coupure.

Apply, puis vérification :

```bash
$ kubectl -n backoffice get certificate api-tls
NAME      READY   SECRET    AGE
api-tls   True    api-tls   2m

$ curl -v https://app.episto.fr 2>&1 | grep -E "issuer|expire"
*  issuer: C=US; O=Let's Encrypt; CN=R10
*  expire date: Aug 17 12:00:00 2026 GMT
```

Docs : [cert-manager DNS-01 avec Cloudflare](https://cert-manager.io/docs/configuration/acme/dns01/cloudflare/), [ressource Certificate](https://cert-manager.io/docs/usage/certificate/), [rate limits Let's Encrypt](https://letsencrypt.org/docs/rate-limits/).

## 4. Full Strict + proxy

Avec des certs reconnus par les navigateurs sur l'origin, on peut enfin activer le proxy Cloudflare et passer le mode SSL de la zone en **Full Strict**. Cloudflare valide le certificat de l'origin (signé Let's Encrypt, donc trusted) avant de proxyfier le trafic. Le navigateur voit un cert Cloudflare ; l'origin sert un vrai cert Let's Encrypt. Les deux bouts sont satisfaits.

```hcl
resource "cloudflare_zone_setting" "ssl" {
  zone_id    = local.zone_id
  setting_id = "ssl"
  value      = "strict"
}

resource "cloudflare_dns_record" "app" {
  zone_id = local.zone_id
  name    = "app"
  type    = "A"
  content = "<origin-ip>"
  proxied = true
  ttl     = 1
}
```

Pourquoi ça compte : avec le proxy activé et Full Strict en place, Cloudflare absorbe le DDoS, cache les assets statiques et fournit WAF + bot management, sans jamais affaiblir la sécurité entre Cloudflare et l'origin. Le grand classique "marche en curl, plante dans le navigateur" disparaît.

Doc : [Cloudflare SSL modes](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/).

## Ce qui reste

- Les PR preview environments sont encore sur l'ancien workflow ZeroSSL. Les migrer vers des sous-domaines proxyfiés avec cert-manager est le prochain chantier.
- Le rename des 56 labels Terraform a été fait à la main. Pour une zone plus grosse, il faut scripter (`jq` sur le state + `terraform state mv`).
- Le token Cloudflare vit toujours à deux endroits : un password manager (pour le travail local et l'input Terraform de cert-manager) et un secret CI. La rotation automatique est un autre chantier.
- Full Strict + proxy tourne en staging. Le déploiement sur les hostnames de production est la dernière étape avant de pouvoir supprimer définitivement le script trimestriel.

## Références

- Cloudflare Terraform provider : [developers.cloudflare.com/terraform](https://developers.cloudflare.com/terraform/)
- cf-terraforming : [github.com/cloudflare/cf-terraforming](https://github.com/cloudflare/cf-terraforming)
- cert-manager : [cert-manager.io/docs](https://cert-manager.io/docs/)
- Let's Encrypt rate limits : [letsencrypt.org/docs/rate-limits](https://letsencrypt.org/docs/rate-limits/)
- Cloudflare SSL modes : [developers.cloudflare.com/ssl/origin-configuration/ssl-modes](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/)
- acme.sh : [github.com/acmesh-official/acme.sh](https://github.com/acmesh-official/acme.sh)
