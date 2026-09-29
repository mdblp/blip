import * as core from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
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
  constructor(scope: Construct, id: string, distDir: string, props: WebStackProps, isUnderMaintenance = false) {
    super(scope, id, props);

    // Create the bucket
    const bucket = new s3.Bucket(this, `${props.rootBucketName}.${props.prefix}`, {
      bucketName: `${props.rootBucketName}.${props.prefix}`,
      removalPolicy: core.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      // S3_MANAGED (SSE-S3), not KMS: the OAI on this bucket cannot read SSE-KMS objects.
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: true,
      lifecycleRules: [{ noncurrentVersionExpiration: Duration.days(30) }],
    });
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, `${id}-originAccessIdentity`,{})
    // No explicit bucket.grantRead() here: origins.S3BucketOrigin.withOriginAccessIdentity()
    // below grants read access itself at bind time. Granting twice would add a
    // duplicate statement to the bucket policy, which R2 must not touch at all.
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
              resource: `parameter/${props.FrontAppName}/${props.prefix}/lambda-edge-arn`
            })
          ]
        })
      ]),
      onUpdate: {
        // will also be called for a CREATE event
        service: 'SSM',
        action: 'getParameter',
        parameters: {
          Name: `/${props.FrontAppName}/${props.prefix}/lambda-edge-arn`
        },
        region: 'us-east-1',
        // Refetch the edge lambda ARN whenever the edge function could have changed,
        // and only then. Using Date.now() here made the physical id differ on every
        // synth, so the custom resource was replaced and the distribution updated on
        // every deploy — which meant `cdk diff` was never clean and could not be used
        // as a release gate. The code fingerprint covers changes to the handler, and
        // the version covers a redeploy of the same code under a new release.
        physicalResourceId: rsc.PhysicalResourceId.of(
          `${core.FileSystem.fingerprint(`${distDir}/lambda`)}-${props.version}`
        )
      }
    });

    // AWS variable are required here for getting dns zone
    const zone = route53.HostedZone.fromLookup(this, 'domainName', {
      domainName: props.zone
    });

    // Create the Certificate
    // Here this construct is deprecated in v2 however still possible to use it
    // and we cannot migrate to the  new one due to this https://github.com/aws/aws-cdk/discussions/23931
    const cert = new acm.DnsValidatedCertificate(this, `${id}-certificate`, {
      hostedZone: zone,
      domainName: props.domainName,
      subjectAlternativeNames: [props.altDomainName],
      region: 'us-east-1',
    });
    // R3a, ahead of R3b's move to a native us-east-1 acm.Certificate: this
    // construct's delete handler polls ACM's InUseBy for ~3 minutes then
    // throws, rolling the stack back — a CloudFront distribution keeps a
    // cert "in use" well past that window. Unlike a normal CDK resource,
    // this doesn't set CloudFormation's own DeletionPolicy — it passes a
    // RemovalPolicy property into the custom resource, read by its own
    // backing Lambda to decide whether to call DeleteCertificate at all.
    // R3b's removal of this construct will orphan the underlying cert
    // instead of failing to delete it; the orphan needs manual cleanup after.
    cert.applyRemovalPolicy(core.RemovalPolicy.RETAIN);

    // Create the distribution
    const appOrigin = origins.S3BucketOrigin.withOriginAccessIdentity(bucket, {
      originAccessIdentity,
      originPath: `/${props.FrontAppName}/${props.version}`
    })
    // withBucketDefaults, not withOriginAccessIdentity: preserves this origin's
    // current no-OAI state exactly (a known separate defect — fixing it is out
    // of scope for this construct swap).
    const maintenanceOrigin = origins.S3BucketOrigin.withBucketDefaults(bucket, {
      originPath: '/maintenance'
    })

    const appBehavior: cloudfront.BehaviorOptions = {
      origin: appOrigin,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      edgeLambdas: [
        {
          eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
          functionVersion: lambda.Version.fromVersionArn(this, `${props.prefix}-${props.FrontAppName}-request-viewer`, lambdaParameter.getResponseField('Parameter.Value'))
        }
      ]
    }
    const maintenanceBehavior: cloudfront.BehaviorOptions = {
      origin: maintenanceOrigin,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED
    }

    const distribution = new cloudfront.Distribution(this, `${id}-cloudfront`, {
      comment: `cloudfront deployment for ${props.prefix} ${props.FrontAppName} ${props.version}`,
      defaultRootObject: 'index.html', // modern L2 default is none — breaks maintenance mode's `/`
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // modern L2 default is PRICE_CLASS_ALL
      domainNames: [props.domainName, props.altDomainName],
      certificate: cert,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      defaultBehavior: isUnderMaintenance ? maintenanceBehavior : appBehavior,
      additionalBehaviors: isUnderMaintenance
        ? { '/disabled/*': appBehavior }
        : { '/maintenance/*': maintenanceBehavior },
      errorResponses: [
        { httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/index.html' },
        { httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/index.html' }
      ]
    });

    // MIGRATION GUARD: keep the logical ID minted by the removed
    // CloudFrontWebDistribution L2. Without this, CloudFormation creates a
    // SECOND distribution and fails on CNAMEAlreadyExists — the alias is
    // already claimed by the live one. See lib/legacy-distribution-ids.ts.
    ;(distribution.node.defaultChild as cloudfront.CfnDistribution)
      .overrideLogicalId(props.legacyDistributionLogicalId)

    // associate the distribution to a dns record
    new route53.CnameRecord(this, `${id}-websitealiasrecord`, {
      zone: zone,
      recordName: props.domainName,
      domainName: distribution.distributionDomainName,
      ttl: Duration.minutes(5)
    });
    // altDomainName is required, so the record is no longer conditional. Every
    // environment already sets ALT_DOMAIN_NAME (see ylp/blip.env.jinja); one that
    // does not now fails at synth rather than quietly publishing a single alias.
    new route53.CnameRecord(this, `${id}-websitealiasrecord2`, {
      zone: zone,
      recordName: props.altDomainName,
      domainName: distribution.distributionDomainName,
      ttl: Duration.minutes(5)
    });

    //  Publish the site content to the S3 bucket (with --delete and invalidation)
    new s3deploy.BucketDeployment(this, `${id}-deploymentwithinvalidation`, {
      sources: [s3deploy.Source.asset(`${distDir}/static`)],
      destinationBucket: bucket,
      destinationKeyPrefix: `${props.FrontAppName}/${props.version}`,
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
