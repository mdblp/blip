#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { StaticWebSiteStack } from '../lib/staticwebsite-stack';
import { LambdaStack } from '../lib/lambda-stack';
import * as path from 'path';

// Variable
const AWS_ACCOUNT = process.env.AWS_ACCOUNT;
const AWS_DEFAULT_REGION = process.env.AWS_DEFAULT_REGION;
const BUCKET = 'com.diabeloop.yourloops-cf';
const maintenance = process.env.MAINTENANCE === "true";

function envValue(v: string | undefined, envName: string): string {
  if (typeof v === 'string' && v.length > 0) {
    return v;
  }
  throw new Error(`Invalid environnement value ${envName}`);
}

function envStrToArray(val: string | undefined, envName: string): string[] | null {
  let retArray: string[] | null = null;
  if (typeof val === "string" && val.length > 0) {
    const a: string[] = JSON.parse(val);
    if (!Array.isArray(a)) {
      throw new Error(`Invalid env ${envName}: Not an array`);
    }
    if (a.length > 0) {
      for (const d of a) {
        envValue(d, envName);
      }
      retArray = a;
    }
  }

  return retArray;
}

function main() {
  const domainName = envValue(process.env.DOMAIN_NAME, 'DOMAIN_NAME');
  const zone = envValue(process.env.DNS_ZONE, 'DNS_ZONE');
  const frontAppName = envValue(process.env.FRONT_APP_NAME, 'FRONT_APP_NAME');
  const stackPrefixName = envValue(process.env.STACK_PREFIX_NAME, 'STACK_PREFIX_NAME');
  const stackVersion = envValue(process.env.STACK_VERSION, 'STACK_VERSION');

  const lamdaEdgeStackName = `${stackPrefixName}-${frontAppName}-lambda-edge`;
  const appStackName = `${stackPrefixName}-${frontAppName}`;

  const app = new cdk.App();

  let distDir = path.resolve(__dirname, '../../../dist');
  if (process.env.DIST_DIR !== undefined && process.env.DIST_DIR !== '') {
    distDir = path.resolve(process.env.DIST_DIR);
  }
  console.info(`Using app dist directory: '${distDir}'`);

  // Create edge Lambda
  const ls = new LambdaStack(app, lamdaEdgeStackName, distDir, {
    env: {
      region: 'us-east-1' // hardcoded because it should not change with current version of AWS !
    }
  },
  stackPrefixName
  );

  // Create resource needed to static hosting with cloudfront
  new StaticWebSiteStack(app, appStackName, distDir, {
    env: {
      account: AWS_ACCOUNT,
      region: AWS_DEFAULT_REGION
    },
    domainName,
    altDomainNames: envStrToArray(process.env.ALT_DOMAIN_NAMES, 'ALT_DOMAIN_NAMES'),
    subjectAlternativeNames: envStrToArray(process.env.SUBJECT_ALTERNATIVE_NAMES, 'SUBJECT_ALTERNATIVE_NAMES'),
    zone,
    frontAppName,
    prefix: stackPrefixName,
    version: stackVersion,
    rootBucketName: BUCKET
  }, maintenance).addDependency(ls);
}

main();
