# Build for running tests via docker
FROM node:10.15.3-alpine as base
RUN \
  echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories \
  && apk --no-cache  update \
  && apk --no-cache  upgrade \
  && npm config set unsafe-perm true \
  && apk add --no-cache git openssh-client wget fontconfig bash udev ttf-opensans chromium \
  && npm install --global npm@latest
ENV \
  CHROME_BIN=/usr/bin/chromium-browser \
  LIGHTHOUSE_CHROMIUM_PATH=/usr/bin/chromium-browser \
  NODE_ENV=development

# Build current dependencies
FROM base as dependencies
WORKDIR /app
RUN \
  mkdir -p dist node_modules \
  && chown -R node:node . \
  # Allow to do an 'npm link' since it is where npm is globally installed
  && chown node /usr/local/lib/node_modules
USER node
ARG npm_token
ENV nexus_token=$npm_token
COPY package.json .npmrc package-lock.json ./
RUN npm install

FROM dependencies as devDependencies
COPY --chown=node . .
RUN sh -e /app/packageMounts/npm-link.sh

### Stage 4 - Linting and unit testing
FROM devDependencies as test
ENV NODE_ENV=test
CMD ["npm", "test"]
