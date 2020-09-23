#!/bin/sh -eu

# WORK ONLY with the docker images !
mv cloudfront-dist/static-dist/$FRONT_APP_NAME/index.html cloudfront-dist/pre-compiled-index.html && \
    # Require TARGET_ENVIRONMENT=test 
    npm run gen-lambda && \
    # Deploy, move to deployement dir in order to have access to the app in cdk.json 
    cd cloudfront-dist/deployment && \
    echo "run cdk deploy --require-approval never $STACK_PREFIX_NAME-$FRONT_APP_NAME" && \
    cdk deploy --require-approval never $STACK_PREFIX_NAME-$FRONT_APP_NAME