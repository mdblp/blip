#!/bin/bash
set -eu
BASEDIR="$(dirname $0)"
. ./version.sh

wget -q -O artifact_node.sh 'https://raw.githubusercontent.com/mdblp/tools/dblp/artifact/artifact_node.sh'
wget -q -O artifact_images.sh 'https://raw.githubusercontent.com/mdblp/tools/dblp/artifact/artifact_images.sh'

declare -a languages
languages=(en fr)

# GIT_TOKEN: Token to access the private repository: see README.md
OWNER=${GIT_OWNER:-mdblp}
REPO=translations
# GIT_BRANCH can be a branch or a tag
# GIT_BRANCH=master
GIT_BRANCH=dblp.0.1.0

if [[ -n "${GIT_TOKEN}" ]]; then
  echo "Having GIT_TOKEN, fetching parameters translation"
  for K in "${languages[@]}"; do
    if [ -f "locales/${K}/parameter.json" ]; then
      mv -vfb "locales/${K}/parameter.json" "locales/${K}/parameter.1.json"
    fi
    curl -s -w "%{http_code}\n" --header "Authorization: token ${GIT_TOKEN}" \
      --header "Accept: application/vnd.github.v3.raw" \
      --output "locales/${K}/parameter.json" "https://api.github.com/repos/${OWNER}/${REPO}/contents/locales/${K}/parameter.json?ref=${GIT_BRANCH}"
  done
else
  echo "No GIT_TOKEN provided, parameters translation will not be available"
fi

bash -eu artifact_images.sh

NO_DEFAULT_PACKAGING="true"
. ./artifact_packaging.sh

bash build.sh
mv -v dist server/dist
buildArchive -d "server"
buildDockerImage -f "server/Dockerfile" -d "server"
buildSOUP
