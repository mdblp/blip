FROM node:6.10.3-alpine

WORKDIR /app

RUN mkdir -p dist node_modules
COPY ./dist ./dist
COPY ./node_modules ./node_modules
COPY *.js ./
RUN chown -R node:node .
VOLUME /app

CMD ["node", "server"]
