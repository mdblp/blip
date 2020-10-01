import * as core from '@aws-cdk/core';

export interface WebStackProps extends core.StackProps {
    domainName?: string;
    zone?: string;
    FrontAppName?: string;
    version?: string;
    prefix?: string;
    rootBucketName?: string;
}