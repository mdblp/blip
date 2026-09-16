/**
 * Redacts CDK asset hashes from template snapshots.
 *
 * Five constructs in this app carry assets, and four of their hashes come from
 * aws-cdk-lib itself (the BucketDeployment handler, the AwsCustomResource
 * provider, the certificate requestor, the auto-delete-objects provider). Every
 * aws-cdk-lib bump would otherwise rewrite those hashes and bury the change we
 * actually want to review in the diff.
 *
 * What stays visible is everything that matters: logical IDs, resource types and
 * every property. A snapshot diff on this app should read as an infrastructure
 * change, not as dependency noise.
 */
const ASSET_HASH = /^[0-9a-f]{64}(\.zip)?$/

module.exports = {
  test: (value) => typeof value === 'string' && ASSET_HASH.test(value),
  serialize: () => '"[ASSET_HASH]"'
}