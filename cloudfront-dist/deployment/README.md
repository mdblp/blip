# Welcome to the sub project cloudfront deployment

this project allow to deploy a static site to AWS cloudfront service.
it is able to create all required infrastructure components to deploy a cloud-front distribution:

* an S3 bucket
* certificate
* DNSrecords

## Getting Started

you will find below how to perform manual local deployment.

### Prerequisites

you need to have the software below :

* a node package manager: npm
* node version >=16.0
* the aws CDK cli called cdk.
* a linux shell

After the installation of the pre-requisites software you need to build a blip package and the lambda

```sh
cd blip/
export TARGET_ENVIRONMENT=<target env>
npm install
source ./config/env.$TARGET_ENVIRONMENT.sh && npm run build && npm run gen-lambda
```

### Installation

In the directory cloudfront-dist/deployment (cd cloudfront-dist/deployment):

1. Install or update the AWS CDK CLI from npm/yarn (requires Node.js ≥ 10.13.0). We recommend using a version in Active LTS

    ```bash
    npm install -g aws-cdk
    ```

2. Install NPM packages

    ```sh
    npm install
    ```

3. Create a .env file based on .env.template and full fill it based on your need

```sh
cp .env.template .env
```

*tips:*
you could also used your AWS profile to interact with aws apis
export AWS_PROFILE=fso-dev

## Usage

now that the installation is complete, you could perform a deployment:

```sh
source .env #or whatever your env file is called
cdk synth # to test the deployment
cdk deploy <STACK_PREFIX_NAME>-blip
```

### Set the web site in maintenance mode
To force the display of a maintenance page you need to set the env var `MAINTENANCE` to `true` and then execute a deployment as described above.  
To revert from a maintenance state to a "normal" state make sure to reset the env var `MAINTENANCE` to `false` and then (re)execute a deployment.  

*tips:*

* if you did not install cdk cli globally you will find it here => ./node_modules/.bin/cdk

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Tests

```sh
npm ci
npm run build   # typecheck
npm test        # synthesize the stacks and assert on the templates
```

The tests run offline: no AWS credentials, no network, and no built `dist/`. Two details make that
work, and both are easy to break by accident:

* **Asset paths.** `lambda.Code.fromAsset()` and `s3deploy.Source.asset()` throw inside the stack
  constructor when their directory is missing, so the stacks cannot even be instantiated without one.
  `distDir` is a constructor parameter, so the tests pass `test/fixtures/app-dist`. The fixture handler
  filename must match the `prefix` the tests use, because the stack builds its handler name from it.
  The directory is `app-dist` rather than `dist` because the repository root `.gitignore` ignores
  `dist/`, which would leave the fixtures uncommitted and break CI on a fresh checkout.
* **The hosted zone.** `HostedZone.fromLookup()` does not need credentials — CDK records the miss and
  returns a dummy — but it does need a concrete account and region, and without a seeded context every
  assertion about the zone would be made against the string `"DUMMY"`. `test/helpers/synth.ts` seeds
  it; the context key is `hosted-zone:account=…:domainName=…:region=…`, with the properties sorted
  alphabetically.

Tests live in `test/`, never in `lib/` — the root `Dockerfile` copies `lib/` wholesale into the
published image.

Some cases are written as `it.failing`. Those are known defects that a later change will fix; they
pass while the defect exists and start failing the moment it is fixed, which is the signal to delete
the marker. Do not "fix" one by removing the assertion.

Snapshots under `test/__snapshots__/` are a migration harness: a diff there means a CloudFormation
change, and a changed logical ID means a resource replacement. Read the diff rather than running
`jest -u`.

## Useful commands

* `npm run build`   typecheck the stacks (the app runs from TypeScript via ts-node, see `cdk.json`, so nothing consumes compiled output)
* `npm run watch`   typecheck in watch mode
* `npm run test`    run the jest unit tests against the synthesized CloudFormation templates
* `cdk deploy --require-approval never`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
* `docker run -it --dns 8.8.8.8 --env-file ./config/credential-dev.env --env-file ./config/<target env>/blip.env docker.ci.diabeloop.eu/blip:<version> -- ` allow to test the deployement script inside the docker container used by our pipeline/deployment
