#!/bin/bash
set -eu

# add configuration
source ./config/.env.sh
source ./artifact-lang.sh

export NODE_OPTIONS='--max-old-space-size=4096'
retrieveLanguageParameters
npm run build
npm run gen-lambda
