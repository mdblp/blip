#!/bin/sh

if [ -f 'package.json' ]; then
  cd "$(dirname $0)"
  VERSION="$(grep -E '\s+"version":\s*"([0-9.]+)",' '../package.json' | sed -E 's/\s+"version":\s*"([0-9.]+)",/\1/')"
  echo "Updating version to ${VERSION}"
  sed -i -E "s/\s+\"version\":\s*\"([0-9.]+)\",/  \"version\": \"${VERSION}\",/" package.json
fi
