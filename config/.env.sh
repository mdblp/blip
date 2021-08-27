#!/bin/bash

# source default var
# config is in path due to excution done throuth npm run
source ./config/.env.base.sh

if [[ -f "./config/.env.local" ]]; then
    echo "Load local surchage export variable"
    source ./config/.env.local
fi
