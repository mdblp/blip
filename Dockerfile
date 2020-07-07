# Build for developers through Docker:
# Use the latests packages to detect potential problems in advance.
#
# docker build --build-arg npm_token="${nexus_token}" -t blip:dev .
# Run:
# docker run -p 3001:3001 blip:dev
FROM node:lts-alpine AS base
RUN apk --no-cache update \
  && apk --no-cache upgrade \
  && apk add --no-cache git openssh-client wget \
  && npm install --global npm@latest

FROM base as build
WORKDIR /app
COPY . .
ARG npm_token
ENV nexus_token=$npm_token
ENV USE_WEBPACK_DEV_SERVER=false
RUN \
  npm install \
  && /bin/sh build-dev.sh

FROM build as dev
USER node
EXPOSE 3001/tcp
ENV PORT=3001
CMD ["npm", "run", "server"]
