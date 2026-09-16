/**
 * The content bucket.
 *
 * Everything below the first block is written as `it.failing` on purpose: these
 * are gaps identified by the IEC 81001-5-1 audit that R1 will close. Recording
 * them as tracked failing tests rather than as a list in a document means the
 * suite itself reports when each one is fixed.
 */
import { Match } from 'aws-cdk-lib/assertions'
import { synthWeb } from './helpers/synth'

describe('current behaviour', () => {
  it('destroys the bucket and its contents when the stack is deleted', () => {
    // Pinned so that changing it has to be a deliberate act with a visible diff,
    // not a side effect of some other edit. R1 flips this to Retain, at which
    // point this test is updated in the same commit.
    synthWeb().template.hasResource('AWS::S3::Bucket', {
      DeletionPolicy: 'Delete',
      UpdateReplacePolicy: 'Delete'
    })
  })
})

describe('tracked hardening gaps', () => {
  it.failing('blocks all public access', () => {
    synthWeb().template.hasResourceProperties('AWS::S3::Bucket', {
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true
      }
    })
  })

  it.failing('states its encryption at rest explicitly', () => {
    synthWeb().template.hasResourceProperties('AWS::S3::Bucket', {
      BucketEncryption: Match.objectLike({
        ServerSideEncryptionConfiguration: Match.anyValue()
      })
    })
  })

  it.failing('denies non-TLS access', () => {
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

  it.failing('retains previous versions of deployed objects', () => {
    // BucketDeployment prunes by default, so without versioning a bad release
    // overwrites the previous one irrecoverably. Must ship together with a
    // lifecycle rule expiring noncurrent versions, or storage grows forever.
    synthWeb().template.hasResourceProperties('AWS::S3::Bucket', {
      VersioningConfiguration: { Status: 'Enabled' }
    })
  })

  it.failing('records CloudFront access logs', () => {
    synthWeb().template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: Match.objectLike({
        Logging: Match.objectLike({ Bucket: Match.anyValue() })
      })
    })
  })
})
