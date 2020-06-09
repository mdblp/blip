FROM node:lts-alpine AS base
RUN apk --no-cache update \
  && apk --no-cache upgrade \
  && npm install --global npm@latest

FROM base AS production
WORKDIR /app
COPY . .
RUN chown -v node /app/dist/index.html \
  && chown -v node /app/dist

USER node
CMD ["sh", "start.sh"]
