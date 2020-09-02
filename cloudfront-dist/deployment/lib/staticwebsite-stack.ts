import * as core from '@aws-cdk/core';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as rsc from '@aws-cdk/custom-resources';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as route53 from '@aws-cdk/aws-route53';

export class StaticWebSiteStack extends core.Stack {
  constructor(scope: core.Construct, id: string, props?: core.StackProps, prefix?: string, version?: string) {
    super(scope, id, props);

    // Create the bucket
    const bucket = new s3.Bucket(this, `com.diabeloop.dev.yourloops.cloudfront.${prefix}`, {
      bucketName: `com.diabeloop.dev.yourloops.cloudfront.${prefix}`,
      removalPolicy: core.RemovalPolicy.RETAIN,
      publicReadAccess: true,
    });

    const lambdaParameter = new rsc.AwsCustomResource(this, 'GetParameter', {
      policy: rsc.AwsCustomResourcePolicy.fromStatements([
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['ssm:GetParameter*'],
          resources: [
            this.formatArn({
              service: 'ssm',
              region: 'us-east-1',
              resource: `parameter/blip/${prefix}/lambda-edge-arn`
            })
          ]
        })
      ]),
      onUpdate: {
        // will also be called for a CREATE event
        service: 'SSM',
        action: 'getParameter',
        parameters: {
          Name: `/blip/${prefix}/lambda-edge-arn`
        },
        region: 'us-east-1',
        physicalResourceId: rsc.PhysicalResourceId.of(Date.now().toString()) // Update physical id to always fetch the latest version
      }
    })

    const zone =  route53.HostedZone.fromLookup(this, 'domainName', {
      domainName: 'preview.your-loops.dev'
    });

    const cert = new DnsValidatedCertificate(this, 'Certificate', {
      hostedZone: zone,
      domainName: `static.preview.your-loops.dev`,
      region: 'us-east-1',
    });

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      `${id}-cloudfront`,
      {
        comment: `cloudfront deployment for ${prefix} blip ${version}`,
        originConfigs: [
          {
            s3OriginSource: {
              originPath: `/blip/${version}`,
              s3BucketSource: bucket,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                lambdaFunctionAssociations: [
                  {
                    eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
                    lambdaFunction: lambda.Version.fromVersionArn(this, `${prefix}-blip-request-viewer`, lambdaParameter.getResponseField('Parameter.Value') )
                  },
                ],
              },
            ],
          },
          {
            s3OriginSource: {
              originPath: '/legal',
              s3BucketSource: bucket,
            },
            behaviors: [
              {

                isDefaultBehavior: false,
                pathPattern: '/legal/*',
              },
            ],
          },
          { 
            s3OriginSource: {
              originPath: '/legal',
              s3BucketSource: bucket,
            },
            behaviors: [
              {
                // missing cache key 
                isDefaultBehavior: false,
                pathPattern: 'country.json',
              },
            ],
          },
          {
            s3OriginSource: {
              originPath: '/maintenance',
              s3BucketSource: bucket,
            },
            behaviors: [
              {

                isDefaultBehavior: false,
                pathPattern: '/redirect.html',
              },
            ],
          },
          {
            s3OriginSource: {
              originPath: `/blip/portal/${version}`,
              s3BucketSource: bucket,
            },
            behaviors: [
              {

                isDefaultBehavior: false,
                pathPattern: '/portal/*',
              },
            ],
          },
        ],
        viewerCertificate: 
        {
          aliases: ['static.preview.your-loops.dev'],
          props: {
            acmCertificateArn: cert.certificateArn,
            sslSupportMethod: cloudfront.SSLMethod.SNI,
            minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2018
          },

        },
        loggingConfig: {}
      }
    );

    // associate the distribution to a dns record
    new route53.CnameRecord(this, 'WebSiteAliasRecord', {
      zone: zone,
      recordName: `static.preview.your-loops.dev`,
      domainName: distribution.domainName
    });

    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset('../dist')],
      destinationBucket: bucket,
      destinationKeyPrefix: `blip/${version}`,
      distribution, //
      distributionPaths: [`/index.html`], // invalidate previous version
    });

    


  }
}
