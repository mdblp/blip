#!/bin/sh -eu

# add configuration
. ./config/env.docker.sh

bash -eu artifact_images.sh
npm run build-app
