import * as core from 'aws-cdk-lib';

/**
 * Every field is required on purpose. These values all end up interpolated into
 * resource names, CloudFront aliases and origin paths, so an absent one used to
 * reach the deployed template as the literal string "undefined" rather than
 * failing the synth. See lib/config.ts for where they come from.
 */
export interface WebStackProps extends core.StackProps {
    domainName: string;
    altDomainName: string;
    zone: string;
    FrontAppName: string;
    version: string;
    prefix: string;
    rootBucketName: string;
}
