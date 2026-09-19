/**
 * Environment parsing and validation.
 *
 * The point of these is the failure cases. Before parseEnv existed, every value
 * reached the template through `${props?.x}` interpolation, so an unset variable
 * produced the literal string "undefined" — as a CloudFront alias, an origin
 * path or a bucket name — and nothing failed until production.
 */
import * as path from 'path'
import { appStackName, edgeStackName, parseEnv, ROOT_BUCKET_NAME } from '../lib/config'

const VALID: NodeJS.ProcessEnv = {
  AWS_ACCOUNT: '111111111111',
  AWS_DEFAULT_REGION: 'eu-west-1',
  STACK_PREFIX_NAME: 'ci',
  STACK_VERSION: '1.2.3',
  DOMAIN_NAME: 'app.ci.your-loops.test',
  ALT_DOMAIN_NAME: 'www.ci.your-loops.test',
  DNS_ZONE: 'ci.your-loops.test',
  FRONT_APP_NAME: 'blip'
}

describe('a complete environment', () => {
  it('parses every value', () => {
    expect(parseEnv(VALID)).toMatchObject({
      awsAccount: '111111111111',
      region: 'eu-west-1',
      prefix: 'ci',
      version: '1.2.3',
      domainName: 'app.ci.your-loops.test',
      altDomainName: 'www.ci.your-loops.test',
      zone: 'ci.your-loops.test',
      frontAppName: 'blip',
      rootBucketName: ROOT_BUCKET_NAME,
      maintenance: false
    })
  })

  it('treats MAINTENANCE as enabled only for the exact string "true"', () => {
    expect(parseEnv({ ...VALID, MAINTENANCE: 'true' }).maintenance).toBe(true)
    for (const value of ['false', 'TRUE', '1', 'yes', '']) {
      expect(parseEnv({ ...VALID, MAINTENANCE: value }).maintenance).toBe(false)
    }
  })

  it('resolves DIST_DIR to an absolute path', () => {
    expect(parseEnv({ ...VALID, DIST_DIR: 'test/fixtures/app-dist' }).distDir)
      .toBe(path.resolve('test/fixtures/app-dist'))
  })

  it('falls back to the dist directory the Dockerfile creates', () => {
    expect(path.isAbsolute(parseEnv(VALID).distDir)).toBe(true)
    expect(parseEnv(VALID).distDir.endsWith('/dist')).toBe(true)
  })

  it('trims surrounding whitespace', () => {
    expect(parseEnv({ ...VALID, DOMAIN_NAME: '  app.example.test  ' }).domainName)
      .toBe('app.example.test')
  })
})

describe('an incomplete environment', () => {
  it.each([
    'AWS_ACCOUNT',
    'AWS_DEFAULT_REGION',
    'STACK_PREFIX_NAME',
    'STACK_VERSION',
    'DOMAIN_NAME',
    'ALT_DOMAIN_NAME',
    'DNS_ZONE',
    'FRONT_APP_NAME'
  ])('rejects a missing %s, naming it', (name) => {
    const env = { ...VALID }
    delete env[name]

    expect(() => parseEnv(env)).toThrow(new RegExp(name))
  })

  it('rejects an empty or whitespace-only value as if it were absent', () => {
    expect(() => parseEnv({ ...VALID, DOMAIN_NAME: '' })).toThrow(/DOMAIN_NAME/)
    expect(() => parseEnv({ ...VALID, DOMAIN_NAME: '   ' })).toThrow(/DOMAIN_NAME/)
  })

  it('reports every missing variable at once', () => {
    // An operator running the deployment container by hand should not have to
    // rerun it once per omission.
    expect(() => parseEnv({})).toThrow(/AWS_ACCOUNT.*FRONT_APP_NAME/)
  })
})

describe('stack names', () => {
  // These are the deployed stack names. Changing either would orphan the existing
  // stack and create a second one alongside it, which then collides on the
  // explicitly named Lambda function.
  it('derives the names the deployed stacks already use', () => {
    const config = parseEnv(VALID)

    expect(appStackName(config)).toBe('ci-blip')
    expect(edgeStackName(config)).toBe('ci-blip-lambda-edge')
  })
})
