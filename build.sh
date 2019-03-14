#!/bin/sh -eu

rm -rf node_modules

TIME="$(date +%s)"
yarn --production
TIME="$(($(date +%s)-TIME))"

echo "yarn install completed in ${TIME} seconds"

yarn build-app

# add configuration
. ./config/env.docker.sh 
npm run build-config
