import * as core from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as ssm from 'aws-cdk-lib/aws-ssm'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

export class LambdaStack extends core.Stack {

  private functionName: string

  constructor(parent: Construct, id: string, distDir: string, props?: core.StackProps, prefix?: string) {
    super(parent, id, props)

    this.functionName = `${prefix}-blip-request-viewer`

    const override = new lambda.Function(this, this.functionName, {
      functionName: this.functionName,
      runtime: lambda.Runtime.NODEJS_24_X,    // execution environment
      code: lambda.Code.fromAsset(`${distDir}/lambda`),  // code loaded from "lambda" directory
      handler: `cloudfront-${prefix}-blip-request-viewer.handler`,                // file is "hello", function is "handler"
      role: new iam.Role(this, 'AllowLambdaServiceToAssumeRole', {
        assumedBy: new iam.CompositePrincipal(
          new iam.ServicePrincipal('lambda.amazonaws.com'),
          new iam.ServicePrincipal('edgelambda.amazonaws.com'),
        )
      })
    })

    new ssm.StringParameter(this, 'edge-lambda-arn', {
      parameterName: `/blip/${prefix}/lambda-edge-arn`,
      description: 'CDK parameter stored for cross region Edge Lambda',
      stringValue: override.currentVersion.functionArn
    })
  }

  /**
  * Get the name of the lambda
  */
  public get FunctionName(): string {
    return this.functionName
  }

}
