FROM node:12.18.3-alpine AS base
ENV AWS_CDK_VERSION=1.61.0
WORKDIR /dist
RUN npm install -g aws-cdk@${AWS_CDK_VERSION}

# This part contains the deployment source code only
FROM node:12.18.3-alpine as deployment
WORKDIR /cloudfront-dist
COPY ./cloudfront-dist/deployment/bin ./deployment/bin
COPY ./cloudfront-dist/deployment/lib ./deployment/lib
COPY ./cloudfront-dist/assets ./assets
COPY ./cloudfront-dist/deployment/package.json ./deployment/package.json
COPY ./cloudfront-dist/deployment/package-lock.json ./deployment/package-lock.json
COPY ./cloudfront-dist/deployment/.npmignore ./deployment/npmignore
COPY ./cloudfront-dist/deployment/tsconfig.json ./deployment/tsconfig.json
COPY ./cloudfront-dist/deployment/cdk.json ./deployment/cdk.json
COPY ./cloudfront-dist/deploy.sh ./deploy.sh
RUN cd deployment && npm install

# this part contains the site content
FROM node:12.18.3-alpine as content
WORKDIR /content
COPY ./dist/static ./static-dist/
COPY ./templates ./templates

# this part contains the aws lambda middleware
FROM node:12.18.3-alpine as lambda
WORKDIR /server
COPY ./server .
RUN npm install

FROM base as final
RUN apk --no-cache update && \
  apk --no-cache upgrade && \
  apk add --no-cache --virtual .user-deps shadow && \
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
WORKDIR /dist
COPY --from=lambda /server ./server
COPY --from=deployment /cloudfront-dist ./cloudfront-dist
COPY --from=deployment /cloudfront-dist/deploy.sh ./deploy.sh
COPY --from=content /content/static-dist ./static
COPY --from=content /content/templates ./templates
RUN chown -R node:node /dist
ENTRYPOINT [ "/bin/sh" ]
CMD [ "deploy.sh" ]