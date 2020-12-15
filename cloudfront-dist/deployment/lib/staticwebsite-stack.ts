import * as core from '@aws-cdk/core';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as rsc from '@aws-cdk/custom-resources';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as route53 from '@aws-cdk/aws-route53';
import { WebStackProps } from './props/WebStackProps';
import { Duration } from '@aws-cdk/core';
import * as path from 'path';

export class StaticWebSiteStack extends core.Stack {
  constructor(scope: core.Construct, id: string, distDir: string, props?: WebStackProps, isUnderMaintenance=false) {
    super(scope, id, props);

    if (typeof props !== "object") {
      throw new Error('Missing props');
    }

    // Create the bucket
    const bucket = new s3.Bucket(this, `${props.rootBucketName}.${props.prefix}`, {
      bucketName: `${props.rootBucketName}.${props.prefix}`,
      removalPolicy: core.RemovalPolicy.DESTROY,
      publicReadAccess: true,
    });

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
              resource: `parameter/${props.frontAppName}/${props.prefix}/lambda-edge-arn`
            })
          ]
        })
      ]),
      onUpdate: {
        // will also be called for a CREATE event
        service: 'SSM',
        action: 'getParameter',
        parameters: {
          Name: `/${props.frontAppName}/${props.prefix}/lambda-edge-arn`
        },
        region: 'us-east-1',
        physicalResourceId: rsc.PhysicalResourceId.of(Date.now().toString()) // Update physical id to always fetch the latest version
      }
    });

    // AWS variable are required here for getting dns zone
    const zone = route53.HostedZone.fromLookup(this, 'domainName', { domainName: props.zone });

    // Create the Certificate
    const allAltDomainNames = (props.altDomainNames ?? []).concat(props.subjectAlternativeNames ?? []);
    console.info(`Certificate alternative domain names: ${JSON.stringify(allAltDomainNames)}`);
    const cert = new DnsValidatedCertificate(this, `${id}-certificate`, {
      hostedZone: zone,
      domainName: props.domainName,
      subjectAlternativeNames: allAltDomainNames,
      region: 'us-east-1',
    });

    // Create the distribution
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      `${id}-cloudfront`,
      {
        comment: `cloudfront deployment for ${props.prefix} ${props.frontAppName} ${props.version}`,
        originConfigs: [
          {
            s3OriginSource: {
              originPath: `/${props.frontAppName}/${props.version}`,
              s3BucketSource: bucket,
            },
            behaviors: [
              {
                isDefaultBehavior: !isUnderMaintenance,
                pathPattern: isUnderMaintenance ? '/disabled/*' : '*',
                lambdaFunctionAssociations: [
                  {
                    eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
                    lambdaFunction: lambda.Version.fromVersionArn(this, `${props.prefix}-${props.frontAppName}-request-viewer`, lambdaParameter.getResponseField('Parameter.Value') )
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
          aliases: [props.domainName].concat(allAltDomainNames),
          props: {
            acmCertificateArn: cert.certificateArn,
            sslSupportMethod: cloudfront.SSLMethod.SNI,
            minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2018
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
    console.info(`Add Route53 CNAME record ${props.domainName}`);
    new route53.CnameRecord(this, `${id}-dns-cname-${props.domainName}`, {
      zone: zone,
      recordName: props.domainName,
      domainName: distribution.distributionDomainName,
      ttl: Duration.minutes(5)
    });
    if (Array.isArray(props.altDomainNames)) {
      for (const altDomainName of props.altDomainNames) {
        console.info(`Add Route53 CNAME record ${altDomainName}`);
        new route53.CnameRecord(this, `${id}-dns-cname-${altDomainName}`, {
          zone: zone,
          recordName: altDomainName,
          domainName: distribution.distributionDomainName,
          ttl: Duration.minutes(5)
        });
      }
    }

    //  Publish the site content to the S3 bucket (with --delete and invalidation)
    new s3deploy.BucketDeployment(this, `${id}-deploymentwithinvalidation`, {
      sources: [s3deploy.Source.asset(`${distDir}/static`)],
      destinationBucket: bucket,
      destinationKeyPrefix: `${props.frontAppName}/${props.version}`,
      distribution,
      distributionPaths: ['/index.html']
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
