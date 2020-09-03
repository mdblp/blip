#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { StaticWebSiteStack } from '../lib/staticwebsite-stack';
import { LambdaStack } from '../lib/lambda-stack';

// Variable
const AWS_ACCOUNT = '175264504000';
const AWS_DEFAULT_REGION = 'eu-west-1';
const STACK_PREFIX_NAME = 'preview';
const STACK_VERSION = '1.1.0';
const LAMBDA_EDGE_STACK_NAME = `${STACK_PREFIX_NAME}-blip-lambda-edge`;
const BLIP_STACK_NAME = `${STACK_PREFIX_NAME}-blip`;
const DOMAIN_NAME = 'static.preview.your-loops.dev';
const DNS_ZONE = 'preview.your-loops.dev';
const BUCKET = 'com.diabeloop.dev.yourloops.cloudfront';

const app = new cdk.App();

// Create edge Lambda
const ls = new LambdaStack(app, LAMBDA_EDGE_STACK_NAME, {
  env: {
        region: 'us-east-1' // harcored because it should not change !
      }
  },
  STACK_PREFIX_NAME);

// Create ressouce needed to static hosting with cloudfront
new StaticWebSiteStack(app, BLIP_STACK_NAME,  {
    env: {
      account: AWS_ACCOUNT,
      region: AWS_DEFAULT_REGION
    },
    domainName: DOMAIN_NAME,
    zone: DNS_ZONE, 
    prefix: STACK_PREFIX_NAME, 
    version: STACK_VERSION,
    bucketName: BUCKET
  }).addDependency(ls);
