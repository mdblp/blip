#!/bin/bash -eu

. "${NVM_DIR}/nvm.sh"
. version.sh

service=blip

nvm ls "${START_NODE_VERSION}" > /dev/null || { echo "ERROR: Node version ${START_NODE_VERSION} not installed"; exit 1; }
nvm use --delete-prefix "${START_NODE_VERSION}"

. config/env.sh

npm run build-config
forever -a -o ../$service.log -e ../$service.error.log --uid $service start server.js
