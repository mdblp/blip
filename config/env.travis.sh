#!/bin/sh

# To simulate a PR build in travis for local build test
export TRAVIS_NODE_VERSION="$(node --version)"
export TRAVIS_BRANCH="$(git branch --show-current 2> /dev/null || git rev-parse --abbrev-ref HEAD)"
export TRAVIS_PULL_REQUEST="true"
export TRAVIS_REPO_SLUG="mdblp/blip"
