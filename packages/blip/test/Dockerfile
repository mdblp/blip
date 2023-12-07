FROM node:lts-alpine AS base
RUN \
  apk update && \
  apk  upgrade && \
  apk add git openssh-client wget chromium && \
  npm install --global npm@latest
ENV CHROME_BIN=/usr/bin/chromium-browser

# Create this target to avoid doing an npm install at each tests
FROM base AS test-base
WORKDIR /app
COPY package.json .npmrc ./
ARG npm_token
ENV nexus_token=$npm_token
RUN \
  chown -R node:node /app && \
  npm install

FROM test-base AS test
COPY . .
RUN npm test
