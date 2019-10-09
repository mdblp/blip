#!/bin/bash -e

wget -q -O artifact_node.sh 'https://raw.githubusercontent.com/mdblp/tools/dblp/artifact/artifact_node.sh'
wget -q -O artifact_images.sh 'https://raw.githubusercontent.com/mdblp/tools/dblp/artifact/artifact_images.sh'

declare -a languages
languages=(en fr de)

# token to access the private reporistory
TOKEN=${GIT_TOKEN}
OWNER=mdblp
REPO=translations
# GIT_BRANCH can be a branch or a tag
# GIT_BRANCH=master
GIT_BRANCH=dblp.0.0.1
for K in "${languages[@]}";
    do  cp -f "locales/$K/parameter.json" "locales/$K/parameter.1.json"
        curl --header "Authorization: token $TOKEN" \
         --header 'Accept: application/vnd.github.v3.raw' \
         --verbose \
         --output "locales/$K/parameter.json" "https://api.github.com/repos/$OWNER/$REPO/contents/locales/$K/parameter.json?ref=$GIT_BRANCH"
done

. ./version.sh
bash -eu artifact_images.sh
bash -eu artifact_node.sh
