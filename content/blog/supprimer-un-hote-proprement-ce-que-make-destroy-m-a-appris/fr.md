---
title: "Supprimer un hôte proprement : ce que make destroy m'a appris"
slug: supprimer-un-hote-proprement-ce-que-make-destroy-m-a-appris
date: 2026-11-09
author: "Nicolas Rouanne"
cover: "make-destroy.png"
---

[L'article de la semaine dernière](/blog/mes-agents-de-code-sur-un-vps-ovh-avec-un-seul-script-de-demarrage) finissait avec l'hôte de mes agents de code sur un VPS OVH, et la version GCP qui « marche toujours, depuis le même code ». Ce point-là n'avait été vérifié qu'avec `terraform validate`. Je suis donc allé le prouver sur le vrai hôte GCP, encore sous Flatcar, et ça ne s'est pas passé comme prévu.

## Un disque qui ne change pas d'OS

Le plan, c'était celui que le README décrit pour un changement d'OS : `make rebuild`, une nouvelle VM Debian, et le même disque de données, celui qui porte les checkouts, l'identité Tailscale et la racine de Docker. La VM a démarré, le script de premier démarrage est allé au bout, le fichier d'environnement s'est rendu depuis 1Password. Puis la stack a refusé de démarrer :

```
error creating overlay mount to /var/lib/orca/docker/overlay2/97afca83…/merged: invalid argument
```

Les conteneurs laissés sur le disque par le Docker de Flatcar ne démarrent pas sous celui de Debian. J'aurais pu écrire une migration (vider `/var/lib/orca/docker`, garder le reste), mais elle aurait servi à un hôte, une fois, et le dépôt aurait porté le nom de Flatcar pour toujours. Comme je n'avais pas besoin des données de cet hôte, j'ai choisi de repartir de zéro : créer un nouvel hôte GCP avec le README seul, et supprimer l'ancien.

Sauf que rien ne supprimait un hôte. Le disque de données est en `prevent_destroy`, exprès, pour qu'aucun plan ne le supprime par accident. D'où `make destroy`.

## make destroy

```makefile
destroy:
	@[ -n "$(NAME)" ] || { echo "no name in $(TFVARS)"; exit 1; }
	@[ -n "$(PROJECT)" ] || { echo "no project in $(TFVARS)"; exit 1; }
	@read -p "type $(NAME) to delete it ($(PROJECT), $(ZONE)), its data disk, its snapshots and its state: " n; [ "$$n" = "$(NAME)" ]
	$(TF) init -reconfigure -backend-config=bucket=$(BUCKET) -backend-config=prefix=orca-host/$(NAME) >/dev/null
	if $(TF) state list | grep -qx google_compute_region_disk.data; then \
	  $(TF) state rm google_compute_region_disk.data; fi
	$(TF) destroy $(TF_VARS) -auto-approve
	d=$$(gcloud compute disks list --project $(PROJECT) --format='value(name)' \
	  --filter='name=$(NAME)-data AND region~/$(REGION)$$') && \
	{ [ -z "$$d" ] || gcloud compute disks delete $(NAME)-data --region $(REGION) --project $(PROJECT) --quiet; }
	# puis la même chose pour les snapshots, et le state de l'hôte dans le bucket
```

Elle demande une seule fois le nom de l'hôte. Ensuite, elle sort le disque du state, pour que `prevent_destroy` reste en place pour tous les autres plans, laisse Terraform supprimer le reste, et supprime le disque, ses snapshots et le state avec `gcloud`. Chaque étape saute ce qui n'existe déjà plus : une exécution arrêtée au milieu se relance, tout simplement.

Ce qui est intéressant, c'est tout ce que cette version ne fait plus : chacune de ces lignes vient d'une vraie exécution qui s'est mal passée.

## Quatre bugs trouvés en vrai

**Une virgule.** Avant ça, `make secret` a planté dès le premier essai, sur `unexpected EOF while looking for matching '"'`. Un message d'erreur dans un `$(if …)` disait `make init, make apply`, et en Make, la virgule sépare les arguments de `$(if)` : la recette était coupée en deux. C'était cassé depuis le passage à OVH, sur les deux providers, et personne ne l'avait relancé depuis.

**Une erreur lue comme « déjà supprimé ».** Au premier `make destroy`, Terraform a supprimé ses sept ressources, puis le disque a survécu. La vérification, c'était `gcloud compute disks describe … >/dev/null 2>&1` : gcloud voulait une réauthentification, a échoué avec sa question masquée, et le `if` a compris « le disque n'existe pas ». La correction : un `list` avec un filtre, et un `&&` avant la suppression. Si gcloud échoue, l'étape échoue ; seul un résultat vide veut dire « supprimé ».

**Un nom vide.** Dans un nouveau terminal, sans `TFVARS` exporté, le nom lu dans le fichier est vide, et appuyer sur Entrée à la question suffisait à le « taper ». Maintenant, la commande s'arrête avant de demander.

**Le state du dernier `make init`.** Terraform retient le state sur lequel il a été initialisé la dernière fois. Si c'était celui d'un autre hôte, `make destroy` aurait supprimé les ressources de cet hôte-là. Elle se réinitialise maintenant sur le bon state avant tout le reste, et `plan`, `apply` et `rebuild` aussi, qui avaient le même défaut sans que personne l'ait remarqué.

> [!NOTE]
> Une commande qui supprime a besoin d'une preuve d'absence, pas d'une erreur lue comme une absence. Chacun de ces quatre bugs, c'est une valeur vide ou un échec qui passait pour « rien à faire ».

Le cinquième est arrivé le jour même, en supprimant un vieux state de test : `make destroy NAME=orca-test` sans `TFVARS`, donc le nom venait de la ligne de commande, et le bucket s'appelait `-tfstate`. `destroy` exige maintenant le fichier tfvars, comme toutes les autres commandes.

Le nouvel hôte GCP a ensuite été monté avec le README seul, et l'ancien supprimé. Debian marche sur GCP ; il fallait le faire tourner pour le savoir.

## Des images dérivées qui prennent du retard

Chaque personne fait tourner sa propre image, construite `FROM` l'image de base, avec ses outils : serveurs MCP, `gcloud`, Playwright. Le README disait : activez Dependabot pour suivre la base. Deux de ces images avaient trois et quatre semaines de retard. L'une venait même d'ajouter buildx elle-même, que la base fournissait déjà depuis une semaine.

Dependabot avait bien ouvert la PR de mise à jour, mais personne ne l'a mergée, et il ne la rafraîchit jamais : les deux digests portent le même tag, `main`, donc pour lui une base plus récente n'est pas une nouvelle version. La PR reste là, périmée, et l'image reste sur sa vieille base.

La solution, c'est un workflow, copié dans le dépôt de chaque image dérivée, qui merge cette mise à jour tout seul une fois que la CI a construit et vérifié l'image :

```yaml
on:
  workflow_run:
    workflows: [image]
    types: [completed]

jobs:
  merge:
    if: >-
      github.event.workflow_run.conclusion == 'success' &&
      github.event.workflow_run.actor.login == 'dependabot[bot]' &&
      startsWith(github.event.workflow_run.head_branch, 'dependabot/docker/qrafttech/orca-host-')
    runs-on: ubuntu-latest
    steps:
      - run: gh pr merge "${{ github.event.workflow_run.head_branch }}" --merge --match-head-commit "${{ github.event.workflow_run.head_sha }}"
      - run: gh workflow run image.yml --ref main
```

`--match-head-commit` merge le commit que la CI a testé, et aucun autre. La deuxième ligne est là parce qu'un merge fait avec le token du workflow ne déclenche aucun workflow de push : `main` ne serait pas reconstruite, et les hôtes ne se redéploieraient pas. Rien d'autre de ce qu'ouvre Dependabot n'est mergé automatiquement.

## Et un README pour des humains

La dernière partie est la moins technique : dérouler l'installation pour de vrai a montré que chaque étape demandait une explication. Le README est maintenant écrit en phrases, avec Google Cloud et OVH côte à côte dans un tableau avec leurs prix, un exemple complet pour ajouter ses propres outils, et un tableau des erreurs qu'on rencontre à la première installation, celle de la réauthentification comprise.

Tout est dans [qrafttech/orca-host](https://github.com/qrafttech/orca-host). Sur OVH, `make destroy` dit toujours de résilier le VPS dans le panneau OVH : Terraform n'en résilie jamais.
