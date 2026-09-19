/**
 * Synthesis helpers shared by the CDK stack tests.
 *
 * Two things make these stacks awkward to synthesize offline, and both are
 * handled here rather than repeated in every spec:
 *
 *  1. `route53.HostedZone.fromLookup()` performs a context lookup. It does NOT
 *     need credentials — ContextProvider records the miss and returns a dummy
 *     rather than throwing — but it does require a concrete account and region,
 *     and without a seeded context every assertion about the zone would be made
 *     against the literal string "DUMMY". Seeding it costs three lines and makes
 *     the DNS and certificate assertions mean something.
 *
 *  2. `lambda.Code.fromAsset()` and `s3deploy.Source.asset()` throw inside the
 *     stack constructor when their directory is missing, so the stacks cannot be
 *     instantiated at all without real paths. `distDir` is already a constructor
 *     parameter, so the tests point it at `test/fixtures/dist`.
 */
import * as fs from 'fs'
import * as path from 'path'
import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { StaticWebSiteStack } from '../../lib/staticwebsite-stack'
import { LambdaStack } from '../../lib/lambda-stack'
import { WebStackProps } from '../../lib/props/WebStackProps'

export const ACCOUNT = '111111111111'
export const REGION = 'eu-west-1'
export const ZONE = 'ci.your-loops.test'
export const ZONE_ID = 'ZCITESTZONE0001'
export const PREFIX = 'ci'
export const FRONT_APP = 'blip'
export const VERSION = '1.2.3'
export const BUCKET = 'com.diabeloop.yourloops-cf'

export const WEB_STACK_ID = `${PREFIX}-${FRONT_APP}`
export const EDGE_STACK_ID = `${PREFIX}-${FRONT_APP}-lambda-edge`

// Named app-dist, not dist: the repository root .gitignore ignores `dist/`, which
// would silently drop these fixtures and break CI on a fresh checkout.
const FIXTURE_DIST = path.resolve(__dirname, '../fixtures/app-dist')

export const WEB_PROPS: WebStackProps = {
  env: { account: ACCOUNT, region: REGION },
  domainName: `app.${ZONE}`,
  altDomainName: `www.${ZONE}`,
  zone: ZONE,
  FrontAppName: FRONT_APP,
  prefix: PREFIX,
  version: VERSION,
  rootBucketName: BUCKET
}

/**
 * Build an App carrying the same context the CDK CLI would inject, so the tests
 * synthesize what `cdk deploy` actually produces rather than a near-miss.
 */
function newApp(): cdk.App {
  // Read rather than import, so we don't need resolveJsonModule.
  const cdkJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../../cdk.json'), 'utf-8')
  )
  const app = new cdk.App({ context: cdkJson.context })

  // Key format comes from ContextProvider.getKey(): the provider name, then
  // { account, region, ...query } flattened and sorted ALPHABETICALLY — which is
  // why domainName sits between account and region rather than last.
  // The value shape mirrors what the real SDK lookup returns; fromLookup strips
  // the '/hostedzone/' prefix and the trailing dot.
  app.node.setContext(
    `hosted-zone:account=${ACCOUNT}:domainName=${ZONE}:region=${REGION}`,
    { Id: `/hostedzone/${ZONE_ID}`, Name: `${ZONE}.` }
  )
  return app
}

export interface SynthResult {
  app: cdk.App
  stack: cdk.Stack
  template: Template
}

export function synthWeb(isUnderMaintenance = false): SynthResult {
  const app = newApp()
  const stack = new StaticWebSiteStack(
    app, WEB_STACK_ID, FIXTURE_DIST, WEB_PROPS, isUnderMaintenance
  )
  return { app, stack, template: Template.fromStack(stack) }
}

export function synthEdge(): SynthResult {
  const app = newApp()
  const stack = new LambdaStack(
    app, EDGE_STACK_ID, FIXTURE_DIST, { env: { region: 'us-east-1' } }, PREFIX
  )
  return { app, stack, template: Template.fromStack(stack) }
}

/** The distribution config, for assertions that are clearer read than matched. */
export function distributionConfig(isUnderMaintenance = false): any {
  const { template } = synthWeb(isUnderMaintenance)
  const distributions = template.findResources('AWS::CloudFront::Distribution')
  const ids = Object.keys(distributions)
  if (ids.length !== 1) {
    throw new Error(`expected exactly one distribution, found ${ids.length}: ${ids.join(', ')}`)
  }
  return distributions[ids[0]].Properties.DistributionConfig
}
