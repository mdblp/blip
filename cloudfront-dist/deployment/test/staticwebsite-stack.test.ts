/**
 * Property assertions for the CloudFront web stack.
 *
 * These lock in the security-relevant parts of the synthesized template. They
 * exist because the stack is about to be migrated off deprecated constructs, and
 * the modern L2 has different defaults for three of the properties asserted here
 * (DefaultRootObject, PriceClass, ViewerProtocolPolicy) — so a migration that
 * forgets to pin them fails these tests rather than production.
 */
import { Match } from 'aws-cdk-lib/assertions'
import { synthWeb, distributionConfig, ZONE, ZONE_ID, VERSION, WEB_STACK_ID } from './helpers/synth'

describe('transport security', () => {
  it('negotiates TLS 1.2 (2021 policy) over SNI', () => {
    synthWeb().template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: Match.objectLike({
        ViewerCertificate: Match.objectLike({
          MinimumProtocolVersion: 'TLSv1.2_2021',
          SslSupportMethod: 'sni-only'
        })
      })
    })
  })

  it('redirects every behaviour to HTTPS', () => {
    // The modern Distribution L2 defaults this to ALLOW_ALL, which would serve
    // plaintext HTTP. Asserted across all behaviours so a new one cannot opt out.
    const config = distributionConfig()
    const behaviours = [config.DefaultCacheBehavior, ...(config.CacheBehaviors ?? [])]

    expect(behaviours.length).toBeGreaterThan(0)
    for (const behaviour of behaviours) {
      expect(behaviour.ViewerProtocolPolicy).toBe('redirect-to-https')
    }
  })
})

describe('distribution settings that the L2 migration must preserve', () => {
  it('serves index.html as the root object', () => {
    // Modern L2 default is no root object at all, which breaks `/` on the
    // maintenance origin.
    expect(distributionConfig().DefaultRootObject).toBe('index.html')
  })

  it('stays on price class 100', () => {
    // Modern L2 default is PRICE_CLASS_ALL — a silent cost and edge-footprint change.
    expect(distributionConfig().PriceClass).toBe('PriceClass_100')
  })

  it('serves both configured domain names', () => {
    expect(distributionConfig().Aliases).toEqual([`app.${ZONE}`, `www.${ZONE}`])
  })
})

describe('SPA routing', () => {
  // CloudFront's own XML error page would both break client-side routing and
  // disclose more than we want, so 403/404 are rewritten to the app entry point.
  it.each([403, 404])('maps %i to /index.html with a 200', (errorCode) => {
    synthWeb().template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: Match.objectLike({
        CustomErrorResponses: Match.arrayWith([
          Match.objectLike({
            ErrorCode: errorCode,
            ResponseCode: 200,
            ResponsePagePath: '/index.html'
          })
        ])
      })
    })
  })
})

describe('origin access', () => {
  it('serves the application origin from the versioned prefix through an OAI', () => {
    const origin = distributionConfig().Origins.find((o: any) => o.Id === 'origin1')

    expect(origin.OriginPath).toBe(`/blip/${VERSION}`)
    expect(origin.S3OriginConfig.OriginAccessIdentity).toBeDefined()
  })

  it('grants no anonymous principal access to the bucket', () => {
    const { template } = synthWeb()
    const policies = Object.values<any>(template.findResources('AWS::S3::BucketPolicy'))

    expect(policies.length).toBeGreaterThan(0)
    for (const policy of policies) {
      for (const statement of policy.Properties.PolicyDocument.Statement) {
        expect(statement.Principal).not.toBe('*')
        expect(statement.Principal?.AWS).not.toBe('*')
      }
    }
  })
})

describe('DNS and certificate', () => {
  it('requests a us-east-1 certificate covering both domains', () => {
    // DnsValidatedCertificate synthesizes as an untyped custom resource. When it
    // is replaced by acm.Certificate this assertion must be rewritten against
    // AWS::CertificateManager::Certificate — that is intentional, it makes the
    // construct swap visible rather than silent.
    synthWeb().template.hasResourceProperties('AWS::CloudFormation::CustomResource', {
      DomainName: `app.${ZONE}`,
      SubjectAlternativeNames: [`www.${ZONE}`],
      HostedZoneId: ZONE_ID,
      Region: 'us-east-1'
    })
  })

  it('points both domains at the distribution by CNAME', () => {
    const { template } = synthWeb()
    template.resourceCountIs('AWS::Route53::RecordSet', 2)

    for (const name of [`app.${ZONE}.`, `www.${ZONE}.`]) {
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Type: 'CNAME',
        Name: name,
        HostedZoneId: ZONE_ID,
        TTL: '300'
      })
    }
  })
})

describe('migration guard', () => {
  it('keeps the distribution logical ID stable', () => {
    // The whole CloudFrontWebDistribution -> Distribution migration depends on
    // this ID not moving: CloudFormation treats a changed logical ID as create +
    // delete, and CloudFront refuses to create a second distribution holding the
    // same alias, so the deploy fails. The replacement construct must call
    // overrideLogicalId with exactly this value.
    const { template } = synthWeb()
    const ids = Object.keys(template.findResources('AWS::CloudFront::Distribution'))

    expect(ids).toEqual([`${WEB_STACK_ID.replace(/-/g, '')}cloudfrontCFDistribution78F41495`])
  })
})
