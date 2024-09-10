import * as core from 'aws-cdk-lib';

export interface WebStackProps extends core.StackProps {
    domainName?: string;
    altDomainName?: string;
    zone?: string;
    FrontAppName?: string;
    version?: string;
    prefix?: string;
    rootBucketName?: string;
}
