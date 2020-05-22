### Stage 0 - Base image
FROM node:10.15.3-alpine as base
WORKDIR /app
RUN \
  mkdir -p dist node_modules \
  && chown -R node:node . \
  && apk --no-cache  update \
  && apk --no-cache  upgrade \
  && npm config set unsafe-perm true \
  && apk add --no-cache git openssh-client wget \
  && npm install --global npm@latest


### Stage 1 - Create cached `node_modules`
# Only rebuild layer if `package.json` has changed
FROM base as dependencies
ARG npm_token
ENV nexus_token=$npm_token
# Run as node user, so that npm run the prepare scripts in dependencies
USER node
COPY .npmrc matomo.js dist server/* ./
RUN npm install


### Stage 2 - Serve docker-compose-ready release
FROM build AS dockerStack
CMD ["sh", "-c", "npm run build-config && npm run server"]
