#!/bin/bash
set -eu

# add configuration
source ./config/.env.sh

export NODE_OPTIONS='--max-old-space-size=4096'
npm run build
ls -al dist
npm run gen-lambda
ls -al dist
