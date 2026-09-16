/**
 * Placeholder edge handler for CDK synthesis tests.
 *
 * The filename is load-bearing: LambdaStack builds its handler as
 * `cloudfront-${prefix}-blip-request-viewer.handler`, so this must match the
 * `prefix` the tests use ('ci'). CDK does not verify that the handler resolves,
 * which is precisely why the naming is kept honest here.
 */
exports.handler = async (event, context, callback) => {
  callback(null, event.Records[0].cf.request)
}