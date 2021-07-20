import * as core from '@aws-cdk/core';

export interface WebStackProps extends core.StackProps {
    domainName: string;
    altDomainNames: string[] | null;
    subjectAlternativeNames: string[] | null;
    zone: string;
    frontAppName: string;
    version: string;
    prefix: string;
    rootBucketName?: string;
    env?: {
      account?: string;
      region?: string;
    }
}
