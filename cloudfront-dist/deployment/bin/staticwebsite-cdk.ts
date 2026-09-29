#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StaticWebSiteStack } from '../lib/staticwebsite-stack';
import { LambdaStack } from '../lib/lambda-stack';
import { appStackName, edgeStackName, parseEnv } from '../lib/config';
import { legacyDistributionLogicalId } from '../lib/legacy-distribution-ids';

// Configuration is parsed and validated up front so a missing variable fails
// here, with the variable named, rather than reaching the deployed template as
// the string "undefined". Stack construction lives in lib/ and takes explicit
// props, which is what makes it testable.
const config = parseEnv(process.env);

console.info(`Using app dist directory: '${config.distDir}'`);

const app = new cdk.App();

// Create edge Lambda
const ls = new LambdaStack(app, edgeStackName(config), config.distDir, {
  env: {
    account: config.awsAccount, // concrete account+region, needed for this stack's own hosted-zone lookup (R3b)
    region: 'us-east-1' // hardcoded because it should not change with current version of AWS !
  },
  prefix: config.prefix,
  targetEnvironment: config.targetEnvironment,
  frontAppName: config.frontAppName,
  domainName: config.domainName,
  altDomainName: config.altDomainName,
  zone: config.zone
});

// Create ressouce needed to static hosting with cloudfront
new StaticWebSiteStack(app, appStackName(config), config.distDir, {
  env: {
    account: config.awsAccount,
    region: config.region
  },
  domainName: config.domainName,
  altDomainName: config.altDomainName,
  zone: config.zone,
  FrontAppName: config.frontAppName,
  prefix: config.prefix,
  version: config.version,
  rootBucketName: config.rootBucketName,
  legacyDistributionLogicalId: legacyDistributionLogicalId(appStackName(config))
}, config.maintenance).addDependency(ls);
