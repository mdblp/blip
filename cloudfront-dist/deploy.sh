#!/bin/bash
# Release the YourLoops web app to CloudFront: upload this image's files and edge Lambda code, then switch the
# distribution to them.
#
# WORKS ONLY inside the docker image (files in /dist/static, scripts in /dist/server).
#
# Modes:
#   default                       full release
#   DRY_RUN=true                  resolve everything, show what the sync would change, change nothing
#   SWITCH_TO=<lambda-version-arn> only switch the distribution to an already published version (fast rollback)
set -euo pipefail

: "${APP_VERSION:?}" "${STACK_PREFIX_NAME:?}" "${AWS_ACCOUNT:?}" "${AWS_DEFAULT_REGION:?}" "${DOMAIN_NAME:?}"
MAINTENANCE="${MAINTENANCE:-false}"
EDGE_REGION=us-east-1

EVIDENCE="${EVIDENCE_DIR:-/evidence}/${STACK_PREFIX_NAME}-${APP_VERSION}-$(date -u +%Y%m%dT%H%M%SZ)"
BUILD=$(mktemp -d)
mkdir -p "$EVIDENCE"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

param() {
  aws ssm get-parameter --name "/blip/${STACK_PREFIX_NAME}/$1" --query Parameter.Value --output text
}
current_lambda_arn() {
  aws cloudfront get-distribution-config --id "$DIST_ID" \
    --query "DistributionConfig.DefaultCacheBehavior.LambdaFunctionAssociations.Items[?EventType=='viewer-request'].LambdaFunctionARN | [0]" \
    --output text
}

# Point the distribution's viewer-request at a Lambda version, changing nothing else.
switch_to() {
  local arn=$1
  local before="$EVIDENCE/distribution-before.json" etag associations
  aws cloudfront get-distribution-config --id "$DIST_ID" > "$before"
  etag=$(jq -r .ETag "$before")
  associations=$(jq -r '.DistributionConfig.DefaultCacheBehavior.LambdaFunctionAssociations.Items // [] | .[]
                        | select(.EventType == "viewer-request") | .LambdaFunctionARN' "$before")
  [ "$(wc -l <<<"$associations")" = 1 ] && [ -n "$associations" ] \
    || fail "expected one viewer-request association on $DIST_ID, found: ${associations:-none}"
  if [ "$associations" = "$arn" ]; then
    echo "The distribution already runs $arn"
    return
  fi

  # The config is sent back as read, except for this one ARN: the rest belongs to Terraform.
  jq --arg arn "$arn" '.DistributionConfig
      | .DefaultCacheBehavior.LambdaFunctionAssociations.Items
        |= map(if .EventType == "viewer-request" then .LambdaFunctionARN = $arn else . end)' \
    "$before" > "$EVIDENCE/distribution-config-sent.json"

  echo "Switching $DIST_ID from $associations to $arn"
  aws cloudfront update-distribution --id "$DIST_ID" --if-match "$etag" \
    --distribution-config "file://$EVIDENCE/distribution-config-sent.json" > /dev/null
  echo "Waiting for the distribution to be deployed (several minutes)..."
  aws cloudfront wait distribution-deployed --id "$DIST_ID"
}

# Check what the distribution serves, on its own host and on DOMAIN_NAME once the domain is attached.
verify() {
  local hosts host served status headers
  hosts=$(aws cloudfront get-distribution --id "$DIST_ID" --output json \
    | jq -r --arg domain "$DOMAIN_NAME" '.Distribution.DomainName,
        (.Distribution.DistributionConfig.Aliases.Items // [] | .[] | select(. == $domain))')
  for host in $hosts; do
    served=''
    for _ in 1 2 3 4 5; do
      served=$(curl -fsS "https://${host}/version" || true)
      [ "$served" = "$APP_VERSION" ] && break
      sleep 10
    done
    [ "$served" = "$APP_VERSION" ] || fail "https://${host}/version returns '$served', expected '$APP_VERSION'"

    headers=$(curl -sS -o /dev/null -D - "https://${host}/")
    status=$(head -1 <<<"$headers" | awk '{print $2}')
    if [ "$MAINTENANCE" = "true" ]; then
      [ "$status" = 503 ] || fail "https://${host}/ returns $status, expected 503 (maintenance)"
    else
      [ "$status" = 200 ] || fail "https://${host}/ returns $status, expected 200"
      grep -qi '^content-security-policy:' <<<"$headers" || fail "no Content-Security-Policy on https://${host}/"
    fi
    grep -qi '^strict-transport-security:' <<<"$headers" || fail "no Strict-Transport-Security on https://${host}/"
    echo "Verified https://${host}/: version $served, status $status"
  done
}

# 1. Get account, and where to deploy
caller=$(aws sts get-caller-identity --output json)
[ "$(jq -r .Account <<<"$caller")" = "$AWS_ACCOUNT" ] || fail "the AWS credentials are not for account $AWS_ACCOUNT"

BUCKET=$(param bucket-name)
DIST_ID=$(param distribution-id)
FUNCTION=$(param edge-function-name)
echo "Releasing $APP_VERSION to $STACK_PREFIX_NAME: bucket=$BUCKET distribution=$DIST_ID function=$FUNCTION maintenance=$MAINTENANCE"

if [ -n "${SWITCH_TO:-}" ]; then
  previous=$(current_lambda_arn)
  switch_to "$SWITCH_TO"
  verify
  jq -n --arg env "$STACK_PREFIX_NAME" --arg version "$APP_VERSION" --arg distribution "$DIST_ID" \
        --arg previous "$previous" --arg current "$SWITCH_TO" --arg operator "$(jq -r .Arn <<<"$caller")" \
        '{mode: "switch", $env, $version, $distribution, lambda: {$previous, $current}, $operator}' \
    > "$EVIDENCE/release.json"
  echo "Switched $STACK_PREFIX_NAME to $SWITCH_TO. Evidence: $EVIDENCE"
  exit 0
fi

# 2. Generate robots.txt, sitemap.xml and the edge Lambda for this environment
if [[ -n "${BRANDING:-}" ]] && [[ ! -f "./static/branding_${BRANDING}_logo.svg" ]]; then
  fail "branding '${BRANDING}' has no logo in ./static"
fi
(cd server && npm run gen-robot && npm run gen-sitemap && npm run gen-lambda)
# index.html is served by the Lambda, with a fresh CSP nonce on every request
rm -v ./static/index.html

# 3. Package the Lambda as index.js (the function's handler is index.handler), whatever its file name
shopt -s nullglob
generated=(./lambda/cloudfront-*-blip-request-viewer.js)
shopt -u nullglob
[ ${#generated[@]} -eq 1 ] || fail "expected one generated Lambda file in ./lambda, found ${#generated[@]}"
cp "${generated[0]}" "$BUILD/index.js"
(cd "$BUILD" && zip -X -q lambda.zip index.js)

if [ "${DRY_RUN:-false}" = "true" ]; then
  echo "Dry run. The distribution runs $(current_lambda_arn). The sync would make these changes:"
  aws s3 sync ./static "s3://${BUCKET}/blip/${APP_VERSION}/" --delete --dryrun
  exit 0
fi

# 4. Files, under this version's folder. Nothing serves them until the switch.
aws s3 sync ./static "s3://${BUCKET}/blip/${APP_VERSION}/" --delete --no-progress | tee "$EVIDENCE/s3-sync.log"

# 5. Lambda code. Publishing unchanged code returns the existing version, so a rerun is harmless.
aws lambda update-function-code --region "$EDGE_REGION" --function-name "$FUNCTION" \
  --zip-file "fileb://$BUILD/lambda.zip" > /dev/null
aws lambda wait function-updated-v2 --region "$EDGE_REGION" --function-name "$FUNCTION"
NEW_ARN=$(aws lambda publish-version --region "$EDGE_REGION" --function-name "$FUNCTION" \
  --description "blip ${APP_VERSION}$([ "$MAINTENANCE" = "true" ] && echo ' maintenance')" \
  --query FunctionArn --output text)
echo "Published $NEW_ARN"

# 6. Switch, 7. check
PREVIOUS_ARN=$(current_lambda_arn)
switch_to "$NEW_ARN"
verify

jq -n --arg env "$STACK_PREFIX_NAME" --arg version "$APP_VERSION" --arg bucket "$BUCKET" \
      --arg distribution "$DIST_ID" --arg previous "$PREVIOUS_ARN" --arg current "$NEW_ARN" \
      --arg operator "$(jq -r .Arn <<<"$caller")" --arg maintenance "$MAINTENANCE" \
      '{mode: "release", $env, $version, $bucket, $distribution, lambda: {$previous, $current}, $operator, $maintenance}' \
  > "$EVIDENCE/release.json"
echo "Released $APP_VERSION to $STACK_PREFIX_NAME. Evidence: $EVIDENCE"
