#!/bin/bash
set -eu
# WORK ONLY with the docker images !
# Require TARGET_ENVIRONMENT=test
echo "Current user: $(whoami)"

echo " $(ls ./static/)"

if [[ -n "${BRANDING}" ]] && [[ ! -f "./static/branding_${BRANDING}_logo.svg" ]]
then
  echo "ERROR: Branding value is incorrect!"
  exit 1
fi

cd server
npm run gen-robot
npm run gen-sitemap
npm run gen-lambda
cd ..
rm -v ./static/index.html
# Deploy, move to deployement dir in order to have access to the app in cdk.json
cd cloudfront-dist/deployment

# NOTE: do not add a `cdk destroy` fallback here. The content bucket is declared
# with removalPolicy DESTROY and autoDeleteObjects, and it holds every deployed
# version under blip/<version>, so destroying the stack deletes all of them and
# every rollback target with them. A failed deploy is recovered by fixing the
# cause and redeploying, or by redeploying the previous STACK_VERSION.

echo "run cdk deploy --require-approval never $STACK_PREFIX_NAME-$FRONT_APP_NAME"
npm run cdk -- deploy --require-approval never $STACK_PREFIX_NAME-$FRONT_APP_NAME

# https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap#addsitemap
if [ "${ALLOW_SEARCH_ENGINE_ROBOTS}" = "true" ]
then
  echo "Notify google about the change"
  curl "https://www.google.com/ping?sitemap=https://${DOMAIN_NAME}/sitemap.xml"
else
  echo "Search engine not allowed, not pinging google"
fi
