---
title: "Deux semaines d'agents de code sur une VM"
slug: deux-semaines-d-agents-de-code-sur-une-vm
author: "Nicolas Rouanne"
---

Au cowork, on avait pris l'habitude de traverser l'open space le laptop à moitié ouvert, pour ne pas couper la session de l'agent. Il y a deux semaines, j'ai raconté comment j'en étais sorti : [une VM par personne, avec Orca dessus](https://qraft.tech/blog/ship-my-laptop-sortir-claude-code-de-mon-ordi), pilotée depuis le laptop ou le téléphone.

Depuis, je l'ai présenté à une quinzaine de devs, dont un qui s'en sert tous les jours. Voici ce que deux semaines d'usage ont montré, le bon comme le moins bon.

📷 _\[Image : photo du cowork — cowork_open_space.jpg\]_

## 1. Le principe, en un schéma

Une VM toujours allumée, accessible uniquement par [Tailscale](https://tailscale.com/). Dessus, [Orca](https://github.com/stablyai/orca) lance une branche, une stack et une session Claude Code par tâche. Un disque garde le code, les sessions et les images Docker, même quand on recrée la machine.

📷 _\[Image : schéma d'architecture — diagram.png\]_

La partie commune est une image publique, [qrafttech/orca-host](https://github.com/qrafttech/orca-host). Chacun y ajoute ses propres outils en quelques lignes :

```docker
# mon image : la base commune, plus le serveur MCP Slack
FROM ghcr.io/qrafttech/orca-host:main@sha256:d3037738da13…
ARG SLACK_MCP_VERSION=1.3.0
RUN curl -fsSL -o /tmp/slack-mcp-server \
      "https://github.com/korotovsky/slack-mcp-server/releases/download/v${SLACK_MCP_VERSION}/slack-mcp-server-linux-${TARGETARCH}" \
 && echo "$sha  /tmp/slack-mcp-server" | sha256sum -c - \
 && install -m 755 /tmp/slack-mcp-server /usr/local/bin/slack-mcp-server
```

Les secrets restent dans 1Password : la config ne contient que des références, résolues à chaque démarrage.

```bash
TS_AUTHKEY={{ op://Vault/tailscale/authkey }}
GH_TOKEN={{ op://Vault/github/token }}
```

C'est ce point qu'on sous-estime : au fil des mois, un laptop accumule des CLI, des serveurs MCP et des fichiers de conf, et on ne sait pas lesquels comptent tant qu'on n'a pas essayé de faire tourner le même agent ailleurs.

→ [README](https://github.com/qrafttech/orca-host#readme), [architecture.md](https://github.com/qrafttech/orca-host/blob/main/.claude/knowledge/architecture.md).

## 2. Pourquoi pas une machine jetable par tâche

C'était mon premier choix : un bac à sable par tâche, détruit une fois la tâche finie, seul le code reste. Je n'y suis pas arrivé, pour quatre raisons :

- **Le démarrage.** Chaque tâche réinstalle ses dépendances, ses images et sa base.
- **L'environnement.** Mes outils et mes comptes ne suivent pas.
- **La session.** On ne reprend pas une tâche en route depuis son téléphone.
- **Les données.** La base part avec la machine.

Sur une VM à soi, tout ça est déjà là. Un dev qui l'utilise le résume mieux que moi : « Avant, j'attendais cinq minutes l'environnement de PR. Là, je demande une modif et je recharge. »

→ Le même pattern, sur un VPS : [le remote agent d'Adrien](https://github.com/qrafttech/remote-agent).

## 3. Le meilleur résultat : 3 000 lignes de code mort

Ce dev a une routine programmée qui supprime le code mort, avec une consigne stricte : prouver que ce qu'elle supprime n'est vraiment plus utilisé. Dans les sessions cloud de Claude Code, elle trouvait peu de choses, faute d'outils pour vérifier. Sur la VM, avec les mêmes outils que sur son laptop, elle a trouvé 3 000 lignes de plus à supprimer. Toutes justes.

C'est pour moi le meilleur argument : l'agent ne devient pas plus malin, il a juste de quoi vérifier ce qu'il avance.

## 4. La pire bêtise : des sessions oubliées tout le week-end

Le même dev avait une tâche horaire qui traite ses commentaires de review. Elle a laissé ses sessions Claude ouvertes, et pendant le week-end elles ont rempli le CPU de la VM. Le lundi matin, impossible de s'y connecter. Un Claude en local a trouvé comment réinitialiser les sessions en cinq minutes, mais c'est le genre d'erreur qu'un laptop pardonne et qu'une machine de 16 Go partagée ne pardonne pas.

Une session Claude Code garde environ 500 Mo de RAM, même quand personne ne lui a parlé depuis des jours. Orca affiche la consommation en bas à droite et permet de tuer une session de là :

📷 _\[Image : capture d'Orca desktop, la consommation mémoire en bas à droite — blog1.png\]_

La VM est dimensionnée en conséquence :

```hcl
variable "machine_type" {
  description = "About 4 GB RAM per Compose stack: e2-standard-4 = 3 stacks and Orca."
  default     = "e2-standard-4"
}
```

J'avais une vingtaine de sessions ouvertes le matin du talk. Honnêtement, ma tête lâche bien avant la VM 😅

→ [terraform/variables.tf](https://github.com/qrafttech/orca-host/blob/main/terraform/variables.tf).

## 5. Ce que chaque projet doit fournir

L'hôte ne connaît aucun projet. C'est le projet qui dit, dans un `orca.yaml` à sa racine, quoi lancer à la création et à la suppression d'une tâche.

Un piège : le script de setup est coupé au bout de deux minutes, trop court pour monter une stack complète et remplir sa base. La parade, c'est un onglet ouvert par défaut, qui n'a pas de limite de temps :

```yaml
scripts:
  setup: bin/worktree init "$ORCA_WORKTREE_PATH"
  archive: cd "$ORCA_WORKTREE_PATH" && docker compose --env-file .env.worktree down -v

defaultTabs:
  - title: stack
    command: bin/worktree init && bin/worktree start --setup-db
```

Autre détail : chaque tâche a ses propres ports. La démo en live est d'ailleurs tombée pile dessus : deux setups lancés en parallèle qui se battaient pour le même port. Et pour ouvrir l'app dans son propre navigateur, il suffit de remplacer `localhost` par l'adresse de la VM sur le tailnet.

→ [La doc d'Orca](https://github.com/stablyai/orca).

## 6. Au quotidien

📷 _\[Image : Orca mobile, la liste des tâches et le terminal d'une tâche — blog5.png\]_

- **Le train.** Avec un agent en local, chaque coupure réseau casse le prompt. Là, mon lien avec la VM tombe une minute, et l'agent continue de travailler, avec sa base et ses tests.
- **La review dans l'IDE.** Je laisse des notes sur le diff et je les envoie à l'agent, au lieu de commentaires GitHub qu'il doit ensuite lire et traiter. Moins de bruit sur la PR.
- **Fermer le laptop et partir.** Ça paraît bête, c'est celui que je préfère.

## Ce qui reste

- **Les binaires par projet.** Si un projet veut une version de ffmpeg et un autre une autre, l'image par personne ne règle rien. C'est là que les machines jetables reprennent l'avantage.
- **Le coût.** Environ 126 $/mois sur GCP, contre environ 25 € HT pour un VPS OVH comparable (sans l'OS immuable, Secret Manager ni le disque répliqué). La migration vers OVH est la prochaine étape.
- **Un seul tailnet à la fois.** Un de mes projets vit sur un autre tailnet, et Tailscale ne se connecte qu'à un seul. Il faudra un proxy entre les deux, ou un deuxième hôte.
- **La voix.** J'aimerais ne plus faire que parler aux agents. La dictée dans Claude Code ou Orca est loin du mode conversationnel des apps mobiles, et en franglais c'est pire.
- **La config ne s'arrête jamais.** Je passe à peu près une journée par semaine sur mon environnement de dev. Ne rien faire, c'est passer à côté. Ne faire que ça, c'est ne rien livrer.
- **La nuit.** Personne autour de la table n'arrive à faire travailler les agents la nuit : quoi qu'ils produisent, il faut le relire, et personne n'a envie de merger du code qu'il n'a pas lu.

Les slides du talk sont [ici](https://claude.ai/artifact/L48TMHLP5Z5HpBCUHJty8W), le repo est [public](https://github.com/qrafttech/orca-host). Issues et PR bienvenues.
