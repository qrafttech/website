# Website Project

## Running

The app runs in Docker (`compose.yaml`), not on the host: the host's Node is too old for Next.js. `make up` starts the dev server, `make url` prints its address.

## Formatting

Always run prettier and lint before committing changes (the dev container must be up):

```bash
make format
make lint
```
