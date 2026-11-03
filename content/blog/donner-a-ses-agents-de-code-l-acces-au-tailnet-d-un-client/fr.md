---
title: "Donner à ses agents de code l'accès au tailnet d'un client"
slug: donner-a-ses-agents-de-code-l-acces-au-tailnet-d-un-client
author: "Nicolas Rouanne"
---

Nos sessions Claude Code ne tournent pas sur nos laptops. Chaque dev a son hôte, une VM avec Orca, qui rejoint notre tailnet [Tailscale](https://tailscale.com/) : c'est par là qu'on la pilote depuis le laptop ou le téléphone. Un des projets sur lesquels on travaille a ses machines sur son propre tailnet, et les agents de ce projet doivent les atteindre : appeler leurs API, lancer des scripts, ouvrir un SSH.

Sauf qu'un nœud Tailscale n'appartient qu'à un seul tailnet. L'hôte ne peut pas simplement rejoindre les deux.

## Deux façons de faire

La première, c'est le [partage de machines](https://tailscale.com/kb/1084/sharing) : l'admin du tailnet d'en face partage dans le nôtre chaque machine dont on a besoin. Rien ne change chez nous, mais chaque nouvelle machine est une démarche de plus chez eux.

La seconde : l'hôte rejoint aussi leur tailnet, avec un second nœud. Plus de travail chez nous (un service de plus, une clé de plus dans le coffre, et chaque outil doit savoir passer par ce nœud), mais en autonomie. C'est celle qu'on a prise.

## Pourquoi pas une seconde interface

Le premier nœud de l'hôte crée une interface réseau, `tailscale0`. Ses adresses viennent des mêmes plages sur tous les tailnets : `100.64.0.0/10` en IPv4, `fd7a:115c:a1e0::/48` en IPv6, où vivent aussi les adresses [4via6](https://tailscale.com/kb/1201/4via6-subnets) des sous-réseaux routés. Deux interfaces se disputeraient les mêmes routes.

Le second nœud tourne donc en [userspace networking](https://tailscale.com/kb/1112/userspace-networking) : pas d'interface, pas de route dans le noyau. On lui parle par un proxy SOCKS5 qu'il expose sur localhost.

## Le service

Dans le `compose.yaml` de l'hôte :

```yaml
tailscale-2:
  image: tailscale/tailscale:v1.104.4
  container_name: tailscale-2
  profiles: [tailnet2]
  network_mode: host
  environment:
    TS_AUTHKEY: ${TS2_AUTHKEY:-}
    TS_AUTH_ONCE: "true"
    TS_HOSTNAME: ${TS2_HOSTNAME:-${TS_HOSTNAME:-orca-host}}
    TS_STATE_DIR: /var/lib/tailscale
    TS_USERSPACE: "true"
    TS_SOCKS5_SERVER: 127.0.0.1:1055
    TS_EXTRA_ARGS: --accept-routes
    TS_TAILSCALED_EXTRA_ARGS: --port=0
  volumes:
    - ${ORCA_DATA:-./data}/tailscale-2:/var/lib/tailscale
  restart: unless-stopped
```

Ce que chaque ligne fait là :

- `TS_SOCKS5_SERVER` sur `127.0.0.1` : le proxy n'écoute que sur la machine elle-même.
- `--accept-routes` : on prend les routes de sous-réseau qu'annonce leur tailnet, 4via6 compris. Sans ça, on ne voit que leurs nœuds Tailscale, pas les machines derrière leur routeur.
- `--port=0` : le port UDP 41641 reste au premier nœud. Le pare-feu n'ouvre pas le port aléatoire du second ; il se connecte par les réponses et les relais DERP, comme n'importe quel nœud derrière un NAT.
- son propre dossier d'état, pour que la seconde identité survive à un redémarrage sans toucher à la première.

Compose ne sait pas démarrer un service selon une variable, c'est donc le profil qui l'allume. Le script de démarrage de l'hôte ne l'active que si la clé est dans la config :

```sh
COMPOSE_PROFILES=$(sed -n 's/^TS2_AUTHKEY=//p' /var/lib/orca/env | tail -n 1 | sed 's/..*/tailnet2/')
```

Sans ça, chaque hôte de l'équipe ferait tourner un nœud inactif avec un proxy vers nulle part. Pour l'activer, deux lignes dans le `.env.tpl` de l'hôte, la clé restant dans 1Password, puis un `make restart` :

```sh
TS2_AUTHKEY={{ op://AI Agents/tailscale-2/authkey }}
# optional: the host's name on that tailnet, else the same as on yours
TS2_HOSTNAME=my-agents
```

## Un tag, pas un membre

La clé d'auth est créée dans la console de leur tailnet, avec un [tag](https://tailscale.com/kb/1068/tags) qu'ils nomment eux-mêmes. Un nœud tagué n'est pas un membre de leur tailnet : il a ce que leur politique d'accès donne au tag, et rien d'autre. Sur ce projet, trois autorisations : l'API d'une machine sur deux ports, le SSH d'une autre, c'est tout.

C'est aussi là qu'est la vraie décision. L'une de ces API n'a pas d'authentification et permet de déployer : donner le port, c'est donner à l'hôte, et à ses agents, le droit de déployer. On l'a écrit noir sur blanc dans la doc du projet, pour que ce soit un choix et pas un oubli.

## Pointer les outils, un par un

Seules les commandes qu'on pointe sur le proxy passent par leur tailnet. Pas de `ALL_PROXY` global : GitHub, Anthropic et le reste dépendraient alors de leur réseau.

```sh
curl -x socks5h://127.0.0.1:1055 http://my-machine:8080
ssh -o ProxyCommand='docker exec -i tailscale-2 tailscale nc %h %p' my-machine
docker exec tailscale-2 tailscale status
```

Le `h` de `socks5h` compte : c'est le proxy qui résout le nom, donc le MagicDNS de leur tailnet. Les noms des machines marchent comme sur un laptop connecté chez eux.

Côté projet, les scripts lisent une variable et ne passent par le proxy que pour les connexions vers ses machines ; le stockage objet et le reste restent en direct :

```python
# SOCKS5 proxy to the project's machines, for a host that reaches the tailnet
# only through one (e.g. socks5h://127.0.0.1:1055). Unset: direct connection.
PROXY = os.environ.get("DEVICE_PROXY")

httpx.get(STATUS_URL, timeout=20, proxy=PROXY)
websockets.connect(url, max_size=None, proxy=PROXY or True)
```

`httpx` a besoin de l'extra `httpx[socks]`, `websockets` de `python-socks`. `proxy=True` est la valeur par défaut de `websockets` : variable absente, rien ne change.

## Le revers

Chaque outil doit être prévenu du proxy, et tous ne savent pas faire. Un script en `urllib` ne parle pas SOCKS : on l'a laissé de côté, il tourne de toute façon côté projet. Et au moment où j'écris, le service tourne sur l'hôte, mais le premier vrai aller-retour attend encore la clé côté projet 😅

Le compose et le README sont dans [qrafttech/orca-host](https://github.com/qrafttech/orca-host#a-second-tailnet).
