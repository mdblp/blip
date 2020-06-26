#!/bin/sh
set -e
npm run build-config
exec node server.js
