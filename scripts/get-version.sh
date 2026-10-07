#!/bin/bash
# Print the version of the app for the current commit, to be baked into the docker image (--build-arg APP_VERSION).
#   commit tagged v<x>  -> v<x>-<short sha>   (if several v* tags point at HEAD, the first in version order wins)
#   commit not tagged   -> <short sha>
# The result only contains [0-9A-Za-z._-], as required by server/cloudfront-gen-lambda.js.
set -euo pipefail

short=$(git rev-parse --short=7 HEAD)
tag=$(git tag --points-at HEAD --list 'v*' --sort=version:refname | head -n 1)

if [[ -n "$tag" ]]; then
  echo "${tag}-${short}"
else
  echo "${short}"
fi
