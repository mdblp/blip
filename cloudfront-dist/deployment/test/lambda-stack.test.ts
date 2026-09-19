/**
 * Property assertions for the us-east-1 Lambda@Edge stack.
 */
import { Match } from 'aws-cdk-lib/assertions'
import { synthEdge, PREFIX } from './helpers/synth'

describe('edge function', () => {
  it('declares the function name and handler the rest of the system expects', () => {
    // The handler name is built from STACK_PREFIX_NAME while the file it refers
    // to is generated from TARGET_ENVIRONMENT (see server/cloudfront-gen-lambda.js).
    // Nothing validates that coupling at deploy time; if the two diverge, every
    // request at the edge fails with "Cannot find module".
    synthEdge().template.hasResourceProperties('AWS::Lambda::Function', {
      FunctionName: `${PREFIX}-blip-request-viewer`,
      Runtime: 'nodejs22.x',
      Handler: `cloudfront-${PREFIX}-blip-request-viewer.handler`
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
    // with no obvious cause.
    synthEdge().template.hasResourceProperties('AWS::SSM::Parameter', {
      Name: `/blip/${PREFIX}/lambda-edge-arn`,
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
