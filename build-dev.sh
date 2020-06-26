#!/bin/sh -eu

# add configuration
. ./config/env.docker.sh

export NODE_OPTIONS='--max-old-space-size=4096'
export USE_WEBPACK_DEV_SERVER="false"
npm run build-dev
