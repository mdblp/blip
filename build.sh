#!/bin/bash
set -eu

# add configuration
source ./config/.env.sh

# The edge lambda is not generated here: it depends on the deployment environment and the version of the image,
# so cloudfront-dist/deploy.sh generates it at deployment time (see cloudfront-dist/deployment-process.md).
export NODE_OPTIONS='--max-old-space-size=4096'
npm run build
