import * as core from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as rsc from 'aws-cdk-lib/custom-resources';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { WebStackProps } from './props/WebStackProps';
import * as path from 'path';

export class StaticWebSiteStack extends core.Stack {
  constructor(scope: Construct, id: string, distDir: string, props?: WebStackProps, isUnderMaintenance=false) {
    super(scope, id, props);

    // Create the bucket
    const bucket = new s3.Bucket(this, `${props?.rootBucketName}.${props?.prefix}`, {
      bucketName: `${props?.rootBucketName}.${props?.prefix}`,
      removalPolicy: core.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, `${id}-originAccessIdentity`,{})
    bucket.grantRead(originAccessIdentity)
    // Retrieve the Lambda arn
    const lambdaParameter = new rsc.AwsCustomResource(this, `${id}-GetParameter`, {
      policy: rsc.AwsCustomResourcePolicy.fromStatements([
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['ssm:GetParameter*'],
          resources: [
            this.formatArn({
              service: 'ssm',
              region: 'us-east-1',
              resource: `parameter/${props?.FrontAppName}/${props?.prefix}/lambda-edge-arn`
            })
          ]
        })
      ]),
      onUpdate: {
        // will also be called for a CREATE event
        service: 'SSM',
        action: 'getParameter',
        parameters: {
          Name: `/${props?.FrontAppName}/${props?.prefix}/lambda-edge-arn`
        },
        region: 'us-east-1',
        physicalResourceId: rsc.PhysicalResourceId.of(Date.now().toString()) // Update physical id to always fetch the latest version
      }
    });

    // AWS variable are required here for getting dns zone
    const zone = route53.HostedZone.fromLookup(this, 'domainName', {
      domainName: `${props?.zone}`
    });

    // Create the Certificate
    // Here this construct is deprecated in v2 however still possible to use it
    // and we cannot migrate to the  new one due to this https://github.com/aws/aws-cdk/discussions/23931
    const cert = new acm.DnsValidatedCertificate(this, `${id}-certificate`, {
      hostedZone: zone,
      domainName: `${props?.domainName}`,
      subjectAlternativeNames: [`${props?.altDomainName}`],
      region: 'us-east-1',
    });


    // Create the distribution
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      `${id}-cloudfront`,
      {
        comment: `cloudfront deployment for ${props?.prefix} ${props?.FrontAppName} ${props?.version}`,
        originConfigs: [
          {
            s3OriginSource: {
              originPath: `/${props?.FrontAppName}/${props?.version}`,
              s3BucketSource: bucket,
              originAccessIdentity: originAccessIdentity
            },
            behaviors: [
              {
                isDefaultBehavior: !isUnderMaintenance,
                pathPattern: isUnderMaintenance ? '/disabled/*' : '*',
                lambdaFunctionAssociations: [
                  {
                    eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
                    lambdaFunction: lambda.Version.fromVersionArn(this, `${props?.prefix}-${props?.FrontAppName}-request-viewer`, lambdaParameter.getResponseField('Parameter.Value') )
                  },
                ],
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
                isDefaultBehavior: isUnderMaintenance,
                pathPattern: isUnderMaintenance ? '*' : '/maintenance/*',
              },
            ],
          },
        ],
        viewerCertificate:
        {
          aliases: [`${props?.domainName}`, `${props?.altDomainName}`],
          props: {
            acmCertificateArn: cert.certificateArn,
            sslSupportMethod: cloudfront.SSLMethod.SNI,
            minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021
          },

        },
        errorConfigurations: [
          {
            errorCode: 403,
            responseCode: 200,
            responsePagePath: '/index.html'
          },
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: '/index.html'
          }
        ]

      }
    );

    // associate the distribution to a dns record
    new route53.CnameRecord(this, `${id}-websitealiasrecord`, {
      zone: zone,
      recordName: `${props?.domainName}`,
      domainName: distribution.distributionDomainName,
      ttl: Duration.minutes(5)
    });
    if (props?.altDomainName !== undefined) {
      new route53.CnameRecord(this, `${id}-websitealiasrecord2`, {
        zone: zone,
        recordName: `${props?.altDomainName}`,
        domainName: distribution.distributionDomainName,
        ttl: Duration.minutes(5)
      });
    }

    //  Publish the site content to the S3 bucket (with --delete and invalidation)
    new s3deploy.BucketDeployment(this, `${id}-deploymentwithinvalidation`, {
      sources: [s3deploy.Source.asset(`${distDir}/static`)],
      destinationBucket: bucket,
      destinationKeyPrefix: `${props?.FrontAppName}/${props?.version}`,
      distribution,
      distributionPaths: ['/*']
    });
    new s3deploy.BucketDeployment(this, `${id}-maintenancepage`, {
      sources: [s3deploy.Source.asset(path.resolve(__dirname, '../../assets/maintenance'))],
      destinationBucket: bucket,
      destinationKeyPrefix: 'maintenance',
      distribution,
      distributionPaths: ['/index.html']
    });

  }
}
