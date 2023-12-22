# This part contains the deployment source code only
FROM node:18-alpine3.19 as base
RUN apk --no-cache update && \
    apk --no-cache upgrade && \
    apk --no-cache add curl && \
    npm install -g npm@10.2.5

FROM base AS deployment
WORKDIR /cloudfront-dist
COPY ./cloudfront-dist/deployment/bin ./deployment/bin
COPY ./cloudfront-dist/deployment/lib ./deployment/lib
COPY ./cloudfront-dist/assets ./assets
COPY ./cloudfront-dist/deployment/package.json ./deployment/package.json
COPY ./cloudfront-dist/deployment/package-lock.json ./deployment/package-lock.json
COPY ./cloudfront-dist/deployment/.npmignore ./deployment/.npmignore
COPY ./cloudfront-dist/deployment/tsconfig.json ./deployment/tsconfig.json
COPY ./cloudfront-dist/deployment/cdk.json ./deployment/cdk.json
COPY ./cloudfront-dist/deploy.sh ./deploy.sh
RUN cd deployment && npm install

# this part contains the site content
FROM base AS content
WORKDIR /content
COPY ./dist/static ./static-dist/
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
RUN \
  apk add --no-cache --virtual .user-deps shadow && \
  apk --no-cache add bash && \
  usermod -u 10669 node && groupmod -g 10669 node && \
  apk del .user-deps
ENV AWS_ACCESS_KEY_ID=
ENV AWS_SECRET_ACCESS_KEY=
ENV AWS_ACCOUNT=
ENV AWS_DEFAULT_REGION='eu-west-1'
ENV STACK_PREFIX_NAME=
ENV STACK_VERSION=
ENV DNS_ZONE=
ENV DOMAIN_NAME=
ENV ALT_DOMAIN_NAME=
ENV BUCKET=
ENV FRONT_APP_NAME=blip
ENV TARGET_ENVIRONMENT=
ENV API_HOST=
ENV DIST_DIR=/dist
ENV ALLOW_SEARCH_ENGINE_ROBOTS=
ENV AUTH0_DOMAIN=
ENV AUTH0_CLIENT_ID=
WORKDIR /dist
RUN \
  chown -v node:node /dist && \
  chmod -v 750 /dist
COPY --from=lambda --chown=node:node /server ./server
COPY --from=deployment --chown=node:node /cloudfront-dist ./cloudfront-dist
COPY --from=deployment --chown=node:node /cloudfront-dist/deploy.sh ./deploy.sh
COPY --from=content --chown=node:node /content/static-dist ./static
COPY --from=content --chown=node:node /content/templates ./templates
COPY --from=content --chown=node:node /content/locales ./locales
ENTRYPOINT [ "/bin/bash" ]
CMD [ "deploy.sh" ]
