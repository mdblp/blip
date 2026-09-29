/**
 * The CloudFront distribution's CloudFormation logical ID, per stack, from
 * before the CloudFrontWebDistribution -> Distribution migration (R2).
 *
 * These values are per-stack, not portable: CDK's logical ID hash is computed
 * from the construct-ID text, which embeds the stack id (hence STACK_PREFIX_NAME).
 * Never compute or guess one — read it from the real deployed stack:
 *
 *   aws cloudformation describe-stack-resources --stack-name <stackId> \
 *     --query "StackResources[?ResourceType=='AWS::CloudFront::Distribution'].[LogicalResourceId]"
 *
 * and add it here before migrating that stack. A stack missing from this map
 * fails synth loudly rather than attempting the migration blind.
 */
const LEGACY_DISTRIBUTION_LOGICAL_IDS: Record<string, string> = {
  // Test fixture (test/helpers/synth.ts WEB_STACK_ID) — keeps the "migration
  // guard" test in staticwebsite-stack.test.ts green.
  'ci-blip': 'ciblipcloudfrontCFDistribution78F41495',
  // Disposable rehearsal stack, not a real named environment.
  'sandbox-v2-blip': 'sandboxv2blipcloudfrontCFDistributionEF30200D'
}

export function legacyDistributionLogicalId(stackId: string): string {
  const id = LEGACY_DISTRIBUTION_LOGICAL_IDS[stackId]
  if (id === undefined) {
    throw new Error(
      `No legacy distribution logical ID recorded for stack "${stackId}". Run ` +
      `'aws cloudformation describe-stack-resources --stack-name ${stackId} --query ` +
      '"StackResources[?ResourceType==\'AWS::CloudFront::Distribution\'].[LogicalResourceId]"\' ' +
      'against the real deployed stack and add the value here before migrating it.'
    )
  }
  return id
}
