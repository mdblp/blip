#!/bin/bash -eu

if [ "${TRAVIS_NODE_VERSION}" != "6.10.2" ]; then
    exit 0
fi

if [ -n "${TRAVIS_TAG:-}" ]; then
    npm publish
fi
