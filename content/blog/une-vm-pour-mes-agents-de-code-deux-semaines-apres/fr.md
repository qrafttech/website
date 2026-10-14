---
title: "Une VM pour mes agents de code, deux semaines après"
slug: une-vm-pour-mes-agents-de-code-deux-semaines-apres
date: 2026-10-15
author: "Nicolas Rouanne"
---

Il y a deux semaines, j'ai raconté comment [sortir Claude Code de mon ordi](https://qraft.tech/blog/ship-my-laptop-sortir-claude-code-de-mon-ordi) : une VM par personne, [Orca](https://github.com/stablyai/orca) dessus, pilotée depuis le laptop ou le téléphone. Le 13 octobre, je l'ai présenté au petit déjeuner Tech My Breath Away, à une quinzaine de devs de plusieurs équipes. L'un d'eux l'utilisait tous les jours depuis une semaine, et la discussion m'en a plus appris que mes slides.

Les slides sont ici : [Ship my laptop](https://claude.ai/artifact/L48TMHLP5Z5HpBCUHJty8W). Le repo est public : [qrafttech/orca-host](https://github.com/qrafttech/orca-host).

## 1. Où tournent les agents de chacun

J'ai ouvert sur un sondage : laptop, sessions cloud de Claude Code, machine à soi, ou CI ? Personne n'a répondu avec un seul chiffre. Le laptop pour le travail interactif, le cloud quand il n'y a plus de crédits, un Mac mini sous un bureau, des VM sur le laptop lui-même, et des petites GitHub Actions qui commentent les PR. Tout le monde fait un mélange.

Ce que je veux tient en quatre mots : partout, mes outils, isolé, reproductible. Le deuxième est celui qu'on sous-estime. Au fil des mois, un laptop accumule des CLI, des serveurs MCP et des fichiers de conf (Google, Slack, Notion, Cloudflare, gcloud…), et rien ne dit lesquels tant qu'on n'a pas essayé de faire tourner le même agent ailleurs.

→ [Ship my laptop](https://qraft.tech/blog/ship-my-laptop-sortir-claude-code-de-mon-ordi), l'article précédent.

## 2. Pourquoi pas des machines éphémères

J'aime bien les machines jetables : un bac à sable par tâche, tué à la fin, seul le code reste. C'est même plutôt écologique, une machine qu'on n'utilise pas est une machine éteinte. Je n'y suis pas arrivé. Chaque tâche réinstalle ses dépendances et ses images, mes outils et mes comptes ne suivent pas, une session ne se reprend pas depuis le téléphone, et la base part avec la machine. Trop de glue.

Je suis donc parti sur l'autre pattern, celui du [remote agent d'Adrien](https://github.com/qrafttech/remote-agent) sur un VPS : une machine à soi, toujours allumée. Dans orca-host, la partie commune est une image publique, et chacun ajoute ses outils par-dessus :

```docker
# mon image : la base commune, plus le serveur MCP Slack
FROM ghcr.io/qrafttech/orca-host:main@sha256:d3037738da13…
ARG SLACK_MCP_VERSION=1.3.0
RUN curl -fsSL -o /tmp/slack-mcp-server \
      "https://github.com/korotovsky/slack-mcp-server/releases/download/v${SLACK_MCP_VERSION}/slack-mcp-server-linux-${TARGETARCH}" \
 && echo "$sha  /tmp/slack-mcp-server" | sha256sum -c - \
 && install -m 755 /tmp/slack-mcp-server /usr/local/bin/slack-mcp-server
```

Les secrets restent dans 1Password : le fichier de config ne contient que des références, l'hôte les résout à chaque démarrage.

```bash
TS_AUTHKEY={{ op://Vault/tailscale/authkey }}
GH_TOKEN={{ op://Vault/github/token }}
```

→ [README](https://github.com/qrafttech/orca-host#readme), [architecture.md](https://github.com/qrafttech/orca-host/blob/main/.claude/knowledge/architecture.md).

## 3. Ce qu'une semaine d'usage quotidien a montré

Un dev qui avait passé le projet de son équipe dessus une semaine plus tôt a partagé deux choses.

La bonne : une routine programmée qui supprime le code mort. Sa consigne, c'est de prouver que ce qu'elle supprime n'est vraiment plus utilisé. Dans les sessions cloud de Claude Code, elle trouvait peu de choses, faute d'outils pour vérifier. Sur la VM, avec les mêmes outils de dev que sur son laptop, elle a trouvé 3 000 lignes de plus à supprimer, toutes justes.

La moins bonne : une tâche horaire qui traite ses commentaires de review a laissé ses sessions Claude ouvertes. Pendant le week-end elles ont rempli le CPU de la VM, et le lundi matin il ne pouvait plus s'y connecter. Un Claude en local a trouvé comment réinitialiser les sessions, cinq minutes, mais c'est le genre de bêtise qu'un laptop pardonne et qu'une machine de 16 Go partagée ne pardonne pas.

```hcl
variable "machine_type" {
  description = "About 4 GB RAM per Compose stack: e2-standard-4 = 3 stacks and Orca."
  default     = "e2-standard-4"
}
```

→ [terraform/variables.tf](https://github.com/qrafttech/orca-host/blob/main/terraform/variables.tf).

## 4. Une session inactive n'est pas gratuite

Une session Claude Code garde environ 500 Mo de RAM, même quand personne ne lui a parlé depuis des jours. Les sessions en background restent vivantes tant qu'on ne les ferme pas. Orca affiche la consommation de chaque session en bas à droite et permet de la tuer de là, ça vaut le coup d'y jeter un œil de temps en temps. J'en avais une vingtaine d'ouvertes ce matin-là, ma tête lâche bien avant la VM.

## 5. Ce que le projet apporte

L'hôte ne connaît aucun projet. C'est le projet qui dit, dans un `orca.yaml` à sa racine, quoi lancer à la création et à la suppression d'un worktree. Un piège : le hook de setup est tué au bout de deux minutes, trop court pour monter une stack complète et remplir sa base. La parade, c'est un onglet par défaut, qui n'a pas de timeout :

```yaml
scripts:
  setup: bin/worktree init "$ORCA_WORKTREE_PATH"
  archive: cd "$ORCA_WORKTREE_PATH" && docker compose --env-file .env.worktree down -v

defaultTabs:
  - title: stack
    command: bin/worktree init && bin/worktree start --setup-db
```

La démo en live est tombée pile dessus : deux setups lancés en parallèle qui se battaient pour un port. Le collègue qui l'utilise tous les jours a aussi remplacé les URL en `localhost` par l'adresse de la VM, pour que l'app s'ouvre dans son propre navigateur.

→ [La doc d'Orca](https://github.com/stablyai/orca).

## 6. Les petits trucs qui font la différence

- J'ai pas mal pris le train ces dernières semaines. Avec un agent en local, chaque coupure réseau casse le prompt. Là, mon lien avec la VM tombe une minute, et l'agent continue de travailler, avec sa base et ses tests.
- La review dans l'IDE : je laisse des notes sur le diff et je les envoie à l'agent, au lieu de commentaires GitHub que l'agent doit ensuite lire et traiter. Moins de bruit sur la PR.
- Fermer le laptop et partir. Ça paraît bête, c'est celui que je préfère.

## Ce qui reste

- **Les binaires par projet.** Si le projet A veut une version de ffmpeg et le projet B une autre, l'image par personne ne règle rien. C'est le rôle du paradigme éphémère, et je n'y suis pas.
- **Le coût.** Environ 126 $/mois sur GCP, contre environ 25 € HT pour un VPS OVH comparable, sans l'OS immuable, Secret Manager ni le disque répliqué. La migration vers OVH est la prochaine issue.
- **Un seul tailnet à la fois.** Un de mes projets vit sur un autre tailnet, et Tailscale ne se connecte qu'à un seul. Un proxy entre les deux, ou un deuxième hôte.
- **La voix.** J'aimerais ne plus faire que parler aux agents. La dictée dans Claude Code ou Orca est loin du mode conversationnel des apps mobiles, et en franglais c'est pire.
- **La config ne s'arrête jamais.** On passe beaucoup de temps à configurer tout ça pour, peut-être, aller plus vite. Je passe à peu près une journée par semaine sur mon environnement de dev. Ne rien faire, c'est passer à côté, ne faire que ça, c'est ne rien livrer.
- **La nuit.** Ni moi ni d'autres n'arrivons à exploiter les agents la nuit : quoi qu'ils fassent, il faut le relire, et personne n'a envie de merger du code qu'il n'a pas lu.
