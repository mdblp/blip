FROM node:22-alpine3.20 as base
RUN apk --no-cache update && \
    apk --no-cache upgrade && \
    apk --no-cache add curl && \
    npm install -g npm@10.2.5

# this part contains the site content
FROM base AS content
WORKDIR /content
COPY ./dist/static ./static-dist/
COPY ./dist/public ./public-dist/
COPY ./templates ./templates
COPY ./locales ./locales

# this part contains the aws lambda middleware
FROM base AS lambda
RUN apk add --no-cache openssl
WORKDIR /server
COPY ./server .
RUN openssl req -nodes -new -x509 -keyout blip.key -out blip.cert -subj "/C=FR/ST=France/L=Grenoble/O=Diabeloop/OU=Platforms/CN=platforms@diabeloop.fr"
RUN npm install

FROM base AS final
# Set by CI (<changelog semver>-<short commit id>, same as the image tag); the release uses this value, the deployment cannot override it.
ARG APP_VERSION
RUN test -n "$APP_VERSION" || { echo "ERROR: --build-arg APP_VERSION is required (e.g. 1.2.3-abcdef0)" >&2; exit 1; }
# aws-cli, jq and zip are what cloudfront-dist/deploy.sh releases with; mailcap provides /etc/mime.types,
# which `aws s3 sync` reads to set each file's Content-Type.
RUN \
  apk add --no-cache --virtual .user-deps shadow && \
  apk --no-cache add bash aws-cli jq zip mailcap && \
  usermod -u 10669 node && groupmod -g 10669 node && \
  apk del .user-deps
ENV AWS_ACCESS_KEY_ID=
ENV AWS_SECRET_ACCESS_KEY=
ENV AWS_ACCOUNT=
ENV AWS_DEFAULT_REGION=
ENV STACK_PREFIX_NAME=
ENV APP_VERSION=$APP_VERSION
ENV DOMAIN_NAME=
ENV MAINTENANCE=false
ENV EVIDENCE_DIR=/evidence
ENV API_HOST=
ENV DIST_DIR=/dist
ENV ALLOW_SEARCH_ENGINE_ROBOTS=
ENV AUTH0_DOMAIN=
ENV AUTH0_CLIENT_ID=
WORKDIR /dist
RUN \
  chown -v node:node /dist && \
  chmod -v 750 /dist && \
  mkdir -v /evidence && \
  chown -v node:node /evidence && \
  echo "$APP_VERSION" > /dist/VERSION && \
  chown -v root:root /dist/VERSION && \
  chmod -v 444 /dist/VERSION
COPY --from=lambda --chown=node:node /server ./server
COPY --chown=root:root --chmod=755 ./cloudfront-dist/deploy.sh ./deploy.sh
COPY --from=content --chown=node:node /content/static-dist ./static
# Using `root` owner to prevent security risk (but the prevention is only for the `public` folder, see YLP-3292)
COPY --from=content --chown=root:root --chmod=755 /content/public-dist ./public
COPY --from=content --chown=node:node /content/templates ./templates
COPY --from=content --chown=node:node /content/locales ./locales
ENTRYPOINT [ "/bin/bash" ]
CMD [ "deploy.sh" ]
