#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StaticWebSiteStack } from '../lib/staticwebsite-stack';
import { LambdaStack } from '../lib/lambda-stack';
import { appStackName, edgeStackName, parseEnv } from '../lib/config';

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
    region: 'us-east-1' // hardcoded because it should not change with current version of AWS !
  }
}, config.prefix);

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
  rootBucketName: config.rootBucketName
}, config.maintenance).addDependency(ls);
