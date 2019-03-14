FROM node:6.10.3-alpine

WORKDIR /app

COPY package.json package.json

RUN mkdir -p dist node_modules
COPY ./node_modules/@tidepool ./node_modules
COPY ./node_modules/tideline ./node_modules
RUN chown -R node:node .
USER node

RUN yarn install && \
    yarn cache clean

COPY . .

CMD ["npm", "run", "server"]
