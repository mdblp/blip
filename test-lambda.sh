#!/bin/bash
set -eu

export TARGET_ENVIRONMENT='test'
export API_HOST='https://api.example.com'
export BRANDING='diabeloop_blue'
export APP_VERSION='1.2.3-test'

rm -rf 'dist'
mkdir -pv 'dist/static'
cp -v 'templates/index.html' 'dist/static/'
cp -v "branding/diabeloop/blue/favicon.ico" 'dist/static/branding_diabeloop_blue_favicon.ico'
npm run gen-lambda
# The same release, built for maintenance mode
TARGET_ENVIRONMENT='test-maintenance' MAINTENANCE='true' npm run gen-lambda
mocha test/lambda/cloudfront-gen-lambda.test.js
