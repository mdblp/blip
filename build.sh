#!/bin/sh -eu

# add configuration
. ./config/env.docker.sh

npm run build
