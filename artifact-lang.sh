#!/bin/bash
set -eu

function retrieveLanguageParameters() {
  declare -a languages
  languages="$(echo 'const l=require("./locales/languages.json"); console.log(Object.getOwnPropertyNames(l.resources).join(" "));' | node -)"
  languages=($languages)

  # GIT_TOKEN: Token to access the private repository: see README.md
  OWNER=${GIT_OWNER:-mdblp}
  REPO=translations
  # GIT_BRANCH can be a branch or a tag
  GIT_BRANCH=master

  if [ -n "${GIT_TOKEN:-}" ]; then
    echo "Having GIT_TOKEN, fetching parameters translation"
    for K in "${languages[@]}"; do
      if [ -f "locales/${K}/parameter.json" ]; then
        rm -v "locales/${K}/parameter.json"
      fi
      echo "Fetching ${K}"
      curl -s -w "%{http_code}\n" --header "Authorization: token ${GIT_TOKEN}" \
        --header "Accept: application/vnd.github.v3.raw" \
        --output "locales/${K}/parameter.json" "https://api.github.com/repos/${OWNER}/${REPO}/contents/locales/${K}/parameter.json?ref=${GIT_BRANCH}"
    done
  else
    echo "No GIT_TOKEN provided, parameters translation will not be available"
  fi
}
