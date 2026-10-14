---
title: "Moving DNS and SSL certificates to Terraform — Cloudflare and cert-manager"
slug: moving-dns-and-ssl-certificates-to-terraform-cloudflare-and-cert-manager
date: 2026-05-18
author: "Nicolas Rouanne"
---

**Before**: every 3 months, run a script to renew 5 SSL certificates by hand. Copy/paste fullchain and private key into GitHub Actions secrets. Miss the deadline once and production goes down.

**After**: `terraform apply`. Certificates renew themselves at T-30 days. DNS changes go through pull request review.

Episto runs a Kubernetes platform on GKE, fronted by Cloudflare. About sixty DNS records, a handful of public hostnames, five SSL certificates. This is how we moved the lot — DNS, certs, Cloudflare SSL settings — under Terraform, and got rid of the quarterly fire drill.

## The old ritual

Every 3 months, the same runbook, the same seven steps:

1. Create a short-lived Cloudflare token (DNS:Edit on the zone).
2. Run the renewal script from the infra repo.
3. The script calls [`acme.sh`](https://github.com/acmesh-official/acme.sh) to negotiate 5 certs (ZeroSSL by default).
4. It deletes and recreates the TLS Secrets in Kubernetes (staging + production).
5. It prints fullchain and private key in base64 to the terminal.
6. Copy/paste into GitHub Actions secrets: `PR_CERT_FULLCHAIN`, `PR_CERT_PRIV_KEY`.
7. If PR environments are running: delete and recreate them so they pick up the new secrets.

Verification:

```bash
$ curl -v https://app.episto.fr 2>&1 | grep "expire date"
*  expire date: May 19 23:59:59 2026 GMT
```

This is brittle. The expiry date lives in someone's calendar. The renewal is a manual operation, so it gets postponed. It happened once: we forgot, production went down, and we only realised when customers wrote in. That outage is the reason this migration exists.

## 1. DNS in Terraform

First step: get every DNS record into source control. The [`cf-terraforming`](https://github.com/cloudflare/cf-terraforming) tool dumps a live Cloudflare zone into Terraform HCL plus the matching import blocks. One command per resource type:

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

The auto-generated labels (`terraform_managed_resource_<hash>_<idx>`) are unreadable, so they get renamed by hand to something usable: `app`, `mx_google_primary`, `dkim_google`, `brevo_verification_1`. Only the Terraform label changes — the import ID stays bound to the live record, so Terraform doesn't try to recreate anything.

Module layout, nothing exotic:

```text
terraform/cloudflare/
├── versions.tf       # cloudflare/cloudflare ~> 5
├── providers.tf      # api_token from env
├── backend.tf        # state in object storage
├── locals.tf         # zone_id
└── dns.tf            # every cloudflare_dns_record
```

After the first apply, `imports.tf` is deleted and `terraform plan` returns `No changes`. From this point on every DNS edit is a PR, with a diff a teammate can review.

The business gain is the audit trail. DNS records used to be edited directly in the Cloudflare dashboard, with no history beyond Cloudflare's own log. Now every change is a commit, a PR, a code review.

Docs: [Cloudflare Terraform provider](https://developers.cloudflare.com/terraform/) — including the agent-friendly [llms-full.txt](https://developers.cloudflare.com/terraform/llms-full.txt) — and [cf-terraforming](https://github.com/cloudflare/cf-terraforming).

## 2. Plan in CI, apply on merge

Terraform code on its own isn't a guardrail. The guardrail is `terraform plan` running on every pull request, with the output posted back into the PR so a reviewer can read the diff before approving. `apply` runs after merge to `main`, with a concurrency lock so two applies never run in parallel.

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
  cancel-in-progress: false   # never cancel a running apply
```

A few design choices worth calling out:

- Plan posted as a sticky PR comment — edited in place rather than spammed on every push. Reviewers see the latest diff, not a wall of stale ones.
- Plan truncated to 65k characters (GitHub's comment limit). Beyond that, the full plan is uploaded as a workflow artifact.
- Noise from `refresh` and `import` lines is filtered out so the diff reads as actual change, not state reconciliation.

## 3. cert-manager + Let's Encrypt

DNS in Terraform was the easy half. Certificates are where the manual ritual lived.

The first plan was Cloudflare _Origin CA_: certs with a 15-year lifetime, signed by Cloudflare, so there's nothing to renew. We abandoned it. Origin CA certs aren't trusted by browsers, which means you can't reach the origin in plain HTTPS for debugging, external uptime monitoring, or whenever the Cloudflare proxy is turned off. The day you need to bypass Cloudflare to diagnose something, you find out the hard way.

The pivot: Let's Encrypt via [cert-manager](https://cert-manager.io/), DNS-01 challenge on Cloudflare, auto-renewed by the controller about 30 days before expiry. Real, browser-trusted certs on the origin. The renewal becomes a Kubernetes controller job we never look at again.

The Helm release:

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

A cluster-wide issuer pointing at Let's Encrypt production, with the Cloudflare token wired in for the DNS-01 solver:

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

One Certificate per hostname. cert-manager writes the result into the named Secret and refreshes it before expiry:

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

Why DNS-01 and not HTTP-01:

- Works behind the Cloudflare proxy — HTTP-01 would need the origin to answer on `/.well-known/acme-challenge/`, which doesn't work when traffic is proxied.
- Supports wildcards, which we need for per-PR preview subdomains.
- Reuses the same Cloudflare token already in the DNS stack. One secret to manage.

Migration trick: the Ingress resources don't change at all. The existing `kubernetes_secret_v1.tls` already have `lifecycle { ignore_changes = [data] }`, so cert-manager writes the new cert into the same Secret name. The GCP load balancer picks up the new cert in about 5 seconds, with no downtime.

Apply, then verify:

```bash
$ kubectl -n backoffice get certificate api-tls
NAME      READY   SECRET    AGE
api-tls   True    api-tls   2m

$ curl -v https://app.episto.fr 2>&1 | grep -E "issuer|expire"
*  issuer: C=US; O=Let's Encrypt; CN=R10
*  expire date: Aug 17 12:00:00 2026 GMT
```

Docs: [cert-manager DNS-01 with Cloudflare](https://cert-manager.io/docs/configuration/acme/dns01/cloudflare/), [Certificate resource](https://cert-manager.io/docs/usage/certificate/), [Let's Encrypt rate limits](https://letsencrypt.org/docs/rate-limits/).

## 4. Full Strict + proxy

With browser-trusted certs on the origin, we can finally turn on the Cloudflare proxy and switch the zone's SSL mode to **Full Strict**. Cloudflare validates the origin certificate (signed by Let's Encrypt, so trusted) before proxying any traffic. The browser sees a Cloudflare-issued cert; the origin still serves a real Let's Encrypt cert. Both ends are happy.

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

Why this matters: with the proxy on and Full Strict enabled, Cloudflare absorbs DDoS, caches static assets, and gives WAF + bot management for free, without ever weakening the security between Cloudflare and the origin. The classic "works in curl, breaks in browser" failure mode goes away.

Doc: [Cloudflare SSL modes](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/).

## What's still pending

- PR preview environments are still on the legacy ZeroSSL workflow. Migrating them to proxied subdomains with cert-manager is the next chunk.
- Renaming the 56 Terraform labels was done by hand. For a bigger zone, this needs to be scripted (`jq` on the state file + `terraform state mv`).
- The Cloudflare API token still lives in two places: a password manager (for local work and the cert-manager Terraform input) and a CI secret. Automatic rotation is a separate project.
- Full Strict + proxy is live on staging. Rolling it out to production hostnames is the last step before the quarterly script can be deleted for good.

## References

- Cloudflare Terraform provider: [developers.cloudflare.com/terraform](https://developers.cloudflare.com/terraform/)
- cf-terraforming: [github.com/cloudflare/cf-terraforming](https://github.com/cloudflare/cf-terraforming)
- cert-manager: [cert-manager.io/docs](https://cert-manager.io/docs/)
- Let's Encrypt rate limits: [letsencrypt.org/docs/rate-limits](https://letsencrypt.org/docs/rate-limits/)
- Cloudflare SSL modes: [developers.cloudflare.com/ssl/origin-configuration/ssl-modes](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/)
- acme.sh: [github.com/acmesh-official/acme.sh](https://github.com/acmesh-official/acme.sh)
