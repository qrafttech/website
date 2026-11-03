---
title: "Giving your coding agents access to a client's tailnet"
slug: giving-your-coding-agents-access-to-a-client-s-tailnet
author: "Nicolas Rouanne"
---

Our Claude Code sessions don't run on our laptops. Each dev has a host, a VM running Orca, joined to our [Tailscale](https://tailscale.com/) tailnet: that's how we drive it from a laptop or a phone. One of the projects we work on keeps its machines on a tailnet of its own, and the agents on that project need to reach them: call their APIs, run scripts, open an SSH session.

A Tailscale node belongs to a single tailnet, though. The host can't just join both.

## Two ways to do it

The first is [device sharing](https://tailscale.com/kb/1084/sharing): the admin of the other tailnet shares each machine we need into ours. Nothing changes on our side, but every new machine is one more step on theirs.

The second: the host joins their tailnet too, as a second node. More work for us (one more service, one more key in the vault, and every tool has to be told how to go through that node), but self-service. That's the one we picked.

## Why not a second interface

The host's first node creates a network interface, `tailscale0`. Its addresses come from the same ranges on every tailnet: `100.64.0.0/10` in IPv4, `fd7a:115c:a1e0::/48` in IPv6, which also holds the [4via6](https://tailscale.com/kb/1201/4via6-subnets) addresses of routed subnets. Two interfaces would fight over the same routes.

So the second node runs in [userspace networking](https://tailscale.com/kb/1112/userspace-networking) mode: no interface, no route in the kernel. You talk to it through a SOCKS5 proxy it exposes on localhost.

## The service

In the host's `compose.yaml`:

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

What each line is there for:

- `TS_SOCKS5_SERVER` on `127.0.0.1`: the proxy only listens on the machine itself.
- `--accept-routes`: take the subnet routes their tailnet advertises, 4via6 included. Without it you only see their Tailscale nodes, not the machines behind their subnet router.
- `--port=0`: UDP port 41641 stays with the first node. The firewall doesn't open the second node's random port; it connects through replies and DERP relays, like any node behind a NAT.
- its own state directory, so the second identity survives a restart without touching the first one.

Compose can't start a service based on a variable alone, so the profile is what turns it on. The host's startup script enables it only when the key is in the config:

```sh
COMPOSE_PROFILES=$(sed -n 's/^TS2_AUTHKEY=//p' /var/lib/orca/env | tail -n 1 | sed 's/..*/tailnet2/')
```

Otherwise every host on the team would run an idle node with a proxy to nowhere. To turn it on, two lines in the host's `.env.tpl`, the key itself staying in 1Password, then a `make restart`:

```sh
TS2_AUTHKEY={{ op://AI Agents/tailscale-2/authkey }}
# optional: the host's name on that tailnet, else the same as on yours
TS2_HOSTNAME=my-agents
```

## A tag, not a member

The auth key is created in their tailnet's admin console, with a [tag](https://tailscale.com/kb/1068/tags) they name themselves. A tagged node is not a member of their tailnet: it gets what their access policy grants the tag, and nothing more. On this project, three grants: one machine's API on two ports, SSH on another machine, nothing else.

That's also where the real decision sits. One of those APIs has no authentication and can deploy: granting the port means granting the host, and its agents, the right to deploy. We wrote it down in the project's docs, so that it's a choice and not an oversight.

## Pointing tools at it, one by one

Only the commands you point at the proxy go through their tailnet. No global `ALL_PROXY`: GitHub, Anthropic and the rest would then depend on their network.

```sh
curl -x socks5h://127.0.0.1:1055 http://my-machine:8080
ssh -o ProxyCommand='docker exec -i tailscale-2 tailscale nc %h %p' my-machine
docker exec tailscale-2 tailscale status
```

The `h` in `socks5h` matters: the proxy resolves the name, so their tailnet's MagicDNS does. Machine names work as they would on a laptop connected to their tailnet.

On the project side, the scripts read one variable and only send the connections to its machines through the proxy; object storage and everything else stay direct:

```python
# SOCKS5 proxy to the project's machines, for a host that reaches the tailnet
# only through one (e.g. socks5h://127.0.0.1:1055). Unset: direct connection.
PROXY = os.environ.get("DEVICE_PROXY")

httpx.get(STATUS_URL, timeout=20, proxy=PROXY)
websockets.connect(url, max_size=None, proxy=PROXY or True)
```

`httpx` needs the `httpx[socks]` extra, `websockets` needs `python-socks`. `proxy=True` is the `websockets` default, so with the variable unset nothing changes.

## The flip side

Every tool has to be told about the proxy, and not all of them can be. A script built on `urllib` doesn't speak SOCKS: we left it out, since it runs on the project's side anyway. And as I write this, the service is running on the host, but the first real round trip is still waiting for the key on the project's side 😅

The compose file and the README are in [qrafttech/orca-host](https://github.com/qrafttech/orca-host#a-second-tailnet).
