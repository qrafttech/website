---
title: "Giving your coding agents access to a client's tailnet"
slug: giving-your-coding-agents-access-to-a-client-s-tailnet
author: "Nicolas Rouanne"
---

Our coding agents run on one VM per dev, connected to our [Tailscale](https://tailscale.com/) network. One of our clients keeps its machines on its own Tailscale network, and our agents need to reach them. The catch: a machine can only be on one Tailscale network at a time.

The fix is one more container on the VM: a second Tailscale, connected to the client's network, which creates no network interface but opens a proxy on the machine.

```text
                     ┌─ tailscale   ──► our network
Agents' VM ──────────┤
                     └─ tailscale-2 ──► client's network
                        (proxy 127.0.0.1:1055)
```

```yaml
tailscale-2:
  image: tailscale/tailscale
  network_mode: host
  environment:
    TS_AUTHKEY: ${TS2_AUTHKEY}
    TS_USERSPACE: "true"
    TS_SOCKS5_SERVER: 127.0.0.1:1055
```

From then on, only the commands you send through the proxy go to the client. Everything else (GitHub, Claude…) goes out as usual:

```sh
curl -x socks5h://127.0.0.1:1055 http://client-machine:8080
```

On the client's side, the auth key carries a tag. The VM isn't a member of their network: it only reaches the machines and ports they opened to that tag. They decide what our agents can touch.

The full compose file is in [qrafttech/orca-host](https://github.com/qrafttech/orca-host#a-second-tailnet).
