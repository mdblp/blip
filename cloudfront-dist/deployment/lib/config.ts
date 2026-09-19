/**
 * Deployment configuration, parsed and validated from the environment.
 *
 * Kept free of CDK imports so it can be unit tested on its own, and separate
 * from stack construction so the stacks can be built in tests from explicit
 * props rather than from whatever happens to be in `process.env`.
 *
 * The validation matters more than it looks: before this existed, every value
 * reached the template through `${props?.x}` interpolation, so a missing
 * DOMAIN_NAME did not fail the deploy — it produced the literal string
 * "undefined" as a CloudFront alias, and the first sign of trouble was in
 * production.
 */
import * as path from 'path'

/**
 * The bucket name is deliberately a constant and not read from the environment.
 *
 * A BUCKET variable is defined in the Dockerfile, docker.template.env and
 * .env.template, and all of them are ignored. Wiring it up would change both the
 * bucket name and the construct's logical ID; because the name is set explicitly
 * and S3 names are globally unique, CloudFormation would attempt a replacement
 * that cannot succeed. Leave this alone, and delete the unused variable from the
 * templates instead.
 */
export const ROOT_BUCKET_NAME = 'com.diabeloop.yourloops-cf'

export interface DeploymentConfig {
  awsAccount: string
  region: string
  prefix: string
  version: string
  domainName: string
  altDomainName: string
  zone: string
  frontAppName: string
  rootBucketName: string
  distDir: string
  maintenance: boolean
}

const REQUIRED = [
  'AWS_ACCOUNT',
  'AWS_DEFAULT_REGION',
  'STACK_PREFIX_NAME',
  'STACK_VERSION',
  'DOMAIN_NAME',
  'ALT_DOMAIN_NAME',
  'DNS_ZONE',
  'FRONT_APP_NAME'
] as const

function required(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name]
  if (value === undefined || value.trim() === '') {
    throw new Error(`Missing required environment variable ${name}`)
  }
  return value.trim()
}

export function parseEnv(env: NodeJS.ProcessEnv): DeploymentConfig {
  // Report every missing variable at once. An operator running this by hand
  // should not have to rerun the deployment container eight times to discover
  // eight omissions.
  const missing = REQUIRED.filter((name) => {
    const value = env[name]
    return value === undefined || value.trim() === ''
  })
  if (missing.length > 0) {
    throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`)
  }

  // Default resolves to <repo>/dist, matching the layout the Dockerfile creates.
  // lib/ and bin/ sit at the same depth, so this is the path the entrypoint used
  // before the configuration moved here.
  const distDir = env.DIST_DIR !== undefined && env.DIST_DIR.trim() !== ''
    ? path.resolve(env.DIST_DIR.trim())
    : path.resolve(__dirname, '../../../dist')

  return {
    awsAccount: required(env, 'AWS_ACCOUNT'),
    region: required(env, 'AWS_DEFAULT_REGION'),
    prefix: required(env, 'STACK_PREFIX_NAME'),
    version: required(env, 'STACK_VERSION'),
    domainName: required(env, 'DOMAIN_NAME'),
    altDomainName: required(env, 'ALT_DOMAIN_NAME'),
    zone: required(env, 'DNS_ZONE'),
    frontAppName: required(env, 'FRONT_APP_NAME'),
    rootBucketName: ROOT_BUCKET_NAME,
    distDir,
    maintenance: env.MAINTENANCE === 'true'
  }
}

export function appStackName(config: DeploymentConfig): string {
  return `${config.prefix}-${config.frontAppName}`
}

export function edgeStackName(config: DeploymentConfig): string {
  return `${config.prefix}-${config.frontAppName}-lambda-edge`
}
