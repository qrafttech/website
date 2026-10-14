FROM node:22-alpine
# node_modules lives in a named volume: it takes this directory's owner, `node` (uid 1000, as on the host)
RUN mkdir -p /app/node_modules && chown -R node:node /app
USER node
WORKDIR /app
