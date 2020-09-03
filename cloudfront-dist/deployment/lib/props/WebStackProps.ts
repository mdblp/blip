import * as core from '@aws-cdk/core';
import * as acm from '@aws-cdk/aws-certificatemanager';

export interface WebStackProps extends core.StackProps {
    domainName?: string;
    zone?: string;
    version?: string;
    prefix?: string;
    rootBucketName?: string;
}