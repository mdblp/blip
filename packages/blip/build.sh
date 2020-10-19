#!/bin/sh
set -eu

echo "Current directory: $(pwd)"

# add configuration
source ../../config/env.docker.sh

export NODE_ENV=production
export NODE_OPTIONS='--max-old-space-size=4096'

echo "Building blib..."
webpack
# Use verbose mode, if no usable output in travis to know the reason of the crash:
# webpack --verbose
