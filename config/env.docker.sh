## external
. ./config/shared.sh

export API_HOST=http://localhost:8009
export DEV_TOOLS=false
export DISCOVERY_HOST=localhost:8000
export NODE_ENV=production
export PORT=3000
export PUBLISH_HOST=hakken
export WEBPACK_DEVTOOL=cheap-module-eval-source-map
export SERVICE_NAME=blip

#Diabeloop specific
export ALLOW_CHANGE_EMAIL=false
export I18N_ENABLED=true
export ALLOW_CHANGE_PASSWORD=false
export ALLOW_CHANGE_LANG=false
export HIDE_DONATE=true
export HIDE_DEXCOM_BANNER=true
export HIDE_UPLOAD_LINK=true
export BRANDING='diabeloop'
export PASSWORD_MIN_LENGTH=10
export PASSWORD_MAX_LENGTH=72