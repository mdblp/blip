/**
 * The content bucket.
 *
 * R1 closed four of the five gaps identified by the IEC 81001-5-1 audit; they
 * are asserted directly below. The fifth ("records CloudFront access logs") is
 * left as `it.failing`: it needs a new log bucket and a `DistributionConfig`
 * change, which falls outside R1's diff gate (bucket + bucket policy only) and
 * is deferred to the train that migrates the distribution.
 */
import { Match } from 'aws-cdk-lib/assertions'
import { synthWeb } from './helpers/synth'

describe('current behaviour', () => {
  it('destroys the bucket and its contents when the stack is deleted', () => {
    // Pinned so that changing it has to be a deliberate act with a visible diff.
    // Deliberately kept this way: the docker image for every released version is
    // retained on ECR (see REFACTOR.md), so a rollback redeploys from there rather
    // than relying on the bucket to survive a stack deletion.
    synthWeb().template.hasResource('AWS::S3::Bucket', {
      DeletionPolicy: 'Delete',
      UpdateReplacePolicy: 'Delete'
    })
  })
})

describe('hardening gaps closed by R1', () => {
  it('blocks all public access', () => {
    synthWeb().template.hasResourceProperties('AWS::S3::Bucket', {
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true
      }
    })
  })

  it('states its encryption at rest explicitly', () => {
    synthWeb().template.hasResourceProperties('AWS::S3::Bucket', {
      BucketEncryption: Match.objectLike({
        ServerSideEncryptionConfiguration: Match.anyValue()
      })
    })
  })

  it('denies non-TLS access', () => {
    const { template } = synthWeb()
    const statements = Object.values<any>(template.findResources('AWS::S3::BucketPolicy'))
      .flatMap((policy) => policy.Properties.PolicyDocument.Statement)

    expect(statements).toContainEqual(
      expect.objectContaining({
        Effect: 'Deny',
        Condition: expect.objectContaining({
          Bool: expect.objectContaining({ 'aws:SecureTransport': 'false' })
        })
      })
    )
  })

  it('retains previous versions of deployed objects, expiring them after 30 days', () => {
    // BucketDeployment prunes by default, so without versioning a bad release
    // overwrites the previous one irrecoverably. Shipped together with a
    // lifecycle rule expiring noncurrent versions, or storage grows forever.
    synthWeb().template.hasResourceProperties('AWS::S3::Bucket', {
      VersioningConfiguration: { Status: 'Enabled' },
      LifecycleConfiguration: Match.objectLike({
        Rules: Match.arrayWith([
          Match.objectLike({
            Status: 'Enabled',
            NoncurrentVersionExpiration: Match.objectLike({ NoncurrentDays: 30 })
          })
        ])
      })
    })
  })
})

describe('tracked hardening gaps', () => {
  it.failing('records CloudFront access logs', () => {
    synthWeb().template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: Match.objectLike({
        Logging: Match.objectLike({ Bucket: Match.anyValue() })
      })
    })
  })
})
