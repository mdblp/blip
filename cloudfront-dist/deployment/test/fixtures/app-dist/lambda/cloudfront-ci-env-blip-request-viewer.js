/**
 * Placeholder edge handler for CDK synthesis tests.
 *
 * The filename is load-bearing: LambdaStack builds its handler as
 * `cloudfront-${targetEnvironment}-blip-request-viewer.handler`, so this must
 * match the `TARGET_ENVIRONMENT` fixture ('ci-env'), not `PREFIX` ('ci') — that
 * mismatch is exactly the bug this naming convention exists to prevent. CDK
 * does not verify that the handler resolves, which is why the naming is kept
 * honest here.
 */
exports.handler = async (event, context, callback) => {
  callback(null, event.Records[0].cf.request)
}