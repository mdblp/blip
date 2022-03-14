#!/bin/bash
set -eu

export TARGET_ENVIRONMENT='test'
export API_HOST='https://api.example.com'
export BRANDING='diabeloop/blue'

rm -rf 'dist'
mkdir -pv 'dist/static'
cp -v 'templates/index.html' 'dist/static/'
npm run gen-lambda
mocha test/lambda/cloudfront-gen-lambda.test.js
