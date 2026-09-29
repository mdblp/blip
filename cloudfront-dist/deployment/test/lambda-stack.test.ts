/**
 * Property assertions for the us-east-1 Lambda@Edge stack.
 */
import { Match } from 'aws-cdk-lib/assertions'
import { synthEdge, PREFIX, TARGET_ENVIRONMENT, FRONT_APP, ZONE, ZONE_ID } from './helpers/synth'

describe('edge function', () => {
  it('declares the function name and handler the rest of the system expects', () => {
    // FunctionName (AWS resource naming) is built from STACK_PREFIX_NAME, which
    // can vary across several parallel stacks. Handler must instead match the
    // file server/cloudfront-gen-lambda.js actually generates, which is named
    // from TARGET_ENVIRONMENT — a different, app-identity concept. The fixture
    // constants are deliberately different values to prove this stays decoupled.
    synthEdge().template.hasResourceProperties('AWS::Lambda::Function', {
      FunctionName: `${PREFIX}-blip-request-viewer`,
      Runtime: 'nodejs22.x',
      Handler: `cloudfront-${TARGET_ENVIRONMENT}-blip-request-viewer.handler`
    })
  })

  it('is assumable by both lambda and edgelambda', () => {
    // Lambda@Edge requires both principals. CompositePrincipal renders as two
    // separate statements rather than one Service array.
    synthEdge().template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'sts:AssumeRole',
            Principal: { Service: 'lambda.amazonaws.com' }
          }),
          Match.objectLike({
            Action: 'sts:AssumeRole',
            Principal: { Service: 'edgelambda.amazonaws.com' }
          })
        ])
      })
    })
  })

  it('publishes the version ARN to the parameter the web stack reads', () => {
    // This parameter name is the only contract between the two stacks and it is
    // a plain string on both sides, so a typo would surface as a failed deploy
    // with no obvious cause. Named from frontAppName on both sides (R3b) — was
    // hardcoded "blip" here, only ever matching the web stack's dynamic read
    // side because FRONT_APP_NAME happens to always equal "blip".
    synthEdge().template.hasResourceProperties('AWS::SSM::Parameter', {
      Name: `/${FRONT_APP}/${PREFIX}/lambda-edge-arn`,
      Type: 'String'
    })
  })

  it('retains the published version instead of letting CloudFormation delete it', () => {
    // Every code change publishes a new Version (new logical ID), orphaning the
    // previous one. Lambda@Edge refuses to delete a version that's still
    // associated with a CloudFront distribution, and replicas take hours to
    // clean up even after disassociating — so CloudFormation's delete attempt
    // during cleanup fails with DELETE_FAILED. Retaining means it never tries.
    synthEdge().template.hasResource('AWS::Lambda::Version', {
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain'
    })
  })
})

describe('certificate (R3b)', () => {
  // Moved here from the web stack: the modern acm.Certificate creates its DNS
  // validation records in the stack it's declared in, and can't create a
  // us-east-1 cert from a stack deployed elsewhere (aws/aws-cdk#23931) — this
  // stack already is the "separate us-east-1 stack" workaround that
  // discussion names. A typed resource now, unlike the old untyped custom
  // resource — that's the point of the migration, not incidental.
  it('requests a certificate covering both domains, validated via DNS', () => {
    synthEdge().template.hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: `app.${ZONE}`,
      SubjectAlternativeNames: [`www.${ZONE}`],
      ValidationMethod: 'DNS',
      DomainValidationOptions: Match.arrayWith([
        Match.objectLike({ DomainName: `app.${ZONE}`, HostedZoneId: ZONE_ID })
      ])
    })
  })

  it('publishes the certificate ARN to the parameter the web stack reads', () => {
    synthEdge().template.hasResourceProperties('AWS::SSM::Parameter', {
      Name: `/${FRONT_APP}/${PREFIX}/certificate-arn`,
      Type: 'String'
    })
  })
})

describe('known defects', () => {
  // The function is given an explicitly constructed role. CDK only attaches
  // AWSLambdaBasicExecutionRole to roles it creates itself, so this role has no
  // policies at all and the function cannot write CloudWatch Logs — leaving the
  // component that enforces the CSP on every page load with no audit trail.
  it.failing('can write CloudWatch logs', () => {
    synthEdge().template.hasResourceProperties('AWS::IAM::Role', {
      ManagedPolicyArns: Match.arrayWith([
        Match.objectLike({
          'Fn::Join': Match.arrayWith([
            Match.arrayWith([Match.stringLikeRegexp('AWSLambdaBasicExecutionRole')])
          ])
        })
      ])
    })
  })
})
