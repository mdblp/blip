import * as core from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as ssm from 'aws-cdk-lib/aws-ssm'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

export class LambdaStack extends core.Stack {

  private functionName: string

  constructor(parent: Construct, id: string, distDir: string, props: core.StackProps, prefix: string, targetEnvironment: string) {
    super(parent, id, props)

    this.functionName = `${prefix}-blip-request-viewer`

    const override = new lambda.Function(this, this.functionName, {
      functionName: this.functionName,
      runtime: lambda.Runtime.NODEJS_22_X,    // execution environment
      code: lambda.Code.fromAsset(`${distDir}/lambda`),  // code loaded from "lambda" directory
      // Built from targetEnvironment, not prefix: server/cloudfront-gen-lambda.js
      // names the generated file from TARGET_ENVIRONMENT, and prefix can differ
      // from it (e.g. several parallel stacks sharing one app environment).
      handler: `cloudfront-${targetEnvironment}-blip-request-viewer.handler`,
      role: new iam.Role(this, 'AllowLambdaServiceToAssumeRole', {
        assumedBy: new iam.CompositePrincipal(
          new iam.ServicePrincipal('lambda.amazonaws.com'),
          new iam.ServicePrincipal('edgelambda.amazonaws.com'),
        )
      })
    })

    // Each deploy that changes the code publishes a new Version (new logical ID),
    // orphaning the previous one. CloudFormation would then try to delete it
    // during cleanup — but Lambda@Edge refuses to delete a version while it's
    // still associated with a CloudFront distribution, and even after
    // disassociating, replicas take hours to clean up across edge locations.
    // That race is what produces DELETE_FAILED. Retaining means CloudFormation
    // never attempts the delete, so it can't fail; old versions accumulate in
    // AWS until manually cleaned up out-of-band (harmless, but worth doing
    // periodically against the per-account code storage quota).
    const version = override.currentVersion
    version.applyRemovalPolicy(core.RemovalPolicy.RETAIN)

    new ssm.StringParameter(this, 'edge-lambda-arn', {
      parameterName: `/blip/${prefix}/lambda-edge-arn`,
      description: 'CDK parameter stored for cross region Edge Lambda',
      stringValue: version.functionArn
    })
  }

  /**
  * Get the name of the lambda
  */
  public get FunctionName(): string {
    return this.functionName
  }

}
