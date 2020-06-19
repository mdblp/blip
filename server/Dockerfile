FROM node:lts-alpine AS base
RUN apk --no-cache update \
  && apk --no-cache upgrade \
  && npm install --global npm@latest

FROM base AS buildServer
WORKDIR /app
COPY . .
RUN \
  npm install \
  && chown -v node /app/dist/index.html \
  && chown -v node /app/dist

FROM buildServer AS production
USER node
CMD ["sh", "start.sh"]
