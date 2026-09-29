import * as core from 'aws-cdk-lib';

/**
 * Every field is required on purpose — same reasoning as WebStackProps. This
 * stack now creates its own ACM certificate (R3b), which needs the domain
 * names and hosted zone it validates against, and frontAppName to name the
 * SSM parameters it publishes consistently with how the web stack reads them.
 */
export interface EdgeStackProps extends core.StackProps {
    prefix: string;
    targetEnvironment: string;
    frontAppName: string;
    domainName: string;
    altDomainName: string;
    zone: string;
}
