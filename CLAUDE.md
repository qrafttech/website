# Website Project

## Running

The app runs in Docker (`compose.yaml`), so it does not depend on the host's Node. `make up` starts the dev server, `make url` prints its address.

## Formatting

Always run prettier and lint before committing changes (the dev container must be up):

```bash
make format
make lint
```
