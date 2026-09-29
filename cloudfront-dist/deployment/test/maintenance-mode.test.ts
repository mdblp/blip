/**
 * MAINTENANCE=true swaps which origin serves the default behaviour.
 *
 * This is the least-exercised path in the stack and the one with the most
 * surprising blast radius, because the Lambda@Edge association follows the
 * *behaviour* rather than the distribution. The two `it.failing` cases at the
 * bottom record defects found while writing these tests: they will turn green on
 * their own once fixed, and will fail loudly if someone fixes the code without
 * removing the marker.
 */
import { distributionConfig, originForBehavior, FRONT_APP, VERSION } from './helpers/synth'

describe('normal operation', () => {
  it('serves the application origin with the viewer-request function attached', () => {
    const config = distributionConfig(false)

    expect(originForBehavior(config, config.DefaultCacheBehavior).OriginPath).toBe(`/${FRONT_APP}/${VERSION}`)
    expect(config.DefaultCacheBehavior.LambdaFunctionAssociations).toEqual([
      expect.objectContaining({ EventType: 'viewer-request' })
    ])
  })

  it('exposes the maintenance page only under /maintenance/*', () => {
    const config = distributionConfig(false)
    expect(config.CacheBehaviors).toHaveLength(1)
    const [behaviour] = config.CacheBehaviors

    expect(behaviour.PathPattern).toBe('/maintenance/*')
    expect(originForBehavior(config, behaviour).OriginPath).toBe('/maintenance')
  })
})

describe('maintenance mode', () => {
  it('swaps the default behaviour to the maintenance origin', () => {
    const config = distributionConfig(true)
    expect(originForBehavior(config, config.DefaultCacheBehavior).OriginPath).toBe('/maintenance')
  })

  it('moves the application behind /disabled/*', () => {
    const config = distributionConfig(true)
    expect(config.CacheBehaviors).toHaveLength(1)
    const [behaviour] = config.CacheBehaviors

    expect(behaviour.PathPattern).toBe('/disabled/*')
    expect(originForBehavior(config, behaviour).OriginPath).toBe(`/${FRONT_APP}/${VERSION}`)
  })
})

describe('known defects', () => {
  // D1. templates/lambda-request-viewer.js is what emits Content-Security-Policy
  // and Strict-Transport-Security. Because the association follows the behaviour,
  // maintenance mode serves every response on the default path without either
  // header — a security control that silently disengages in a specific
  // operational state.
  it.failing('keeps the security-header function on the default behaviour in maintenance mode', () => {
    expect(distributionConfig(true).DefaultCacheBehavior.LambdaFunctionAssociations).toEqual([
      expect.objectContaining({ EventType: 'viewer-request' })
    ])
  })

  // D2. The maintenance origin is declared without an origin access identity, so
  // CloudFront fetches anonymously (rendered as an empty-string OriginAccessIdentity
  // since R2's S3BucketOrigin.withBucketDefaults — previously S3OriginConfig: {} with
  // no such key at all; same "no real OAI" meaning either way). The bucket policy
  // only grants the real OAI, and public access is not otherwise allowed, so this
  // origin should be returning 403 — meaning maintenance mode has probably never
  // worked. Confirm against the preview stack before relying on it.
  it.failing('serves the maintenance origin through an origin access identity', () => {
    const origin = distributionConfig(true).Origins.find((o: any) => o.OriginPath === '/maintenance')

    expect(origin.S3OriginConfig.OriginAccessIdentity).not.toBe('')
  })
})
