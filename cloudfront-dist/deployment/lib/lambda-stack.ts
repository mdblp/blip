import * as core from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as ssm from 'aws-cdk-lib/aws-ssm'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'
import { EdgeStackProps } from './props/EdgeStackProps'

export class LambdaStack extends core.Stack {

  private functionName: string

  constructor(parent: Construct, id: string, distDir: string, props: EdgeStackProps) {
    super(parent, id, props)

    const prefix = props.prefix
    this.functionName = `${prefix}-blip-request-viewer`

    const override = new lambda.Function(this, this.functionName, {
      functionName: this.functionName,
      runtime: lambda.Runtime.NODEJS_22_X,    // execution environment
      code: lambda.Code.fromAsset(`${distDir}/lambda`),  // code loaded from "lambda" directory
      // Built from targetEnvironment, not prefix: server/cloudfront-gen-lambda.js
      // names the generated file from TARGET_ENVIRONMENT, and prefix can differ
      // from it (e.g. several parallel stacks sharing one app environment).
      handler: `cloudfront-${props.targetEnvironment}-blip-request-viewer.handler`,
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
      // Was hardcoded to `/blip/...`, read on the other side as
      // `/${FrontAppName}/...` — only ever worked because FRONT_APP_NAME is
      // always "blip". Named from frontAppName on both sides now.
      parameterName: `/${props.frontAppName}/${prefix}/lambda-edge-arn`,
      description: 'CDK parameter stored for cross region Edge Lambda',
      stringValue: version.functionArn
    })

    // R3b: the certificate moves here from the web stack. The modern
    // acm.Certificate creates its DNS validation records in the stack it's
    // declared in, and can't create a us-east-1 cert from a stack deployed
    // elsewhere (aws/aws-cdk#23931) — this stack already is the "separate
    // us-east-1 stack" that discussion names as the workaround. Looked up
    // again here rather than passed cross-stack, same reasoning as the
    // lambda ARN: avoids CDK's experimental crossRegionReferences.
    const zone = route53.HostedZone.fromLookup(this, 'domainName', { domainName: props.zone })
    const cert = new acm.Certificate(this, `${id}-certificate`, {
      domainName: props.domainName,
      subjectAlternativeNames: [props.altDomainName],
      validation: acm.CertificateValidation.fromDns(zone)
    })

    new ssm.StringParameter(this, 'certificate-arn', {
      parameterName: `/${props.frontAppName}/${prefix}/certificate-arn`,
      description: 'CDK parameter stored for cross region ACM certificate',
      stringValue: cert.certificateArn
    })
  }

  /**
  * Get the name of the lambda
  */
  public get FunctionName(): string {
    return this.functionName
  }

}
