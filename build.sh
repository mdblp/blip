#!/bin/sh -eu

rm -rf node_modules

TIME="$(date +%s)"
yarn --production
TIME="$(($(date +%s)-TIME))"

echo "yarn install completed in ${TIME} seconds"

# add configuration
. ./config/env.docker.sh 

npm run build
