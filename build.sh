#!/bin/bash
set -eu

# add configuration
source ./config/.env.sh

export NODE_OPTIONS='--max-old-space-size=4096'
npm run build
npm run gen-lambda
