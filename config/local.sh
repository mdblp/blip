## Common
export API_HOST='http://localhost:3000'
export WEBPACK_DEVTOOL='source-map'
export PORT='3001'

# Diabeloop specific
export BRANDING='diabeloop_blue'
export LATEST_TERMS='1970-01-01'
export LATEST_TRAINING='1970-01-01'
export LATEST_RELEASE='2022-03-03'
export YLPZ_RA_LAD_001_FR_REV=3
export YLPZ_RA_LAD_001_EN_REV=3
export YLPZ_RA_LAD_001_NL_REV=0
export YLPZ_RA_LAD_001_IT_REV=0
export YLPZ_RA_LAD_001_ES_REV=0
export YLPZ_RA_LAD_001_DE_REV=0
export IDLE_TIMEOUT_MS=1800000
export BANNER_ENABLED=false
export BANNER_LABEL_EN=""
export BANNER_LABEL_ES=""
export BANNER_LABEL_DE=""
export BANNER_LABEL_FR=""
export BANNER_LABEL_IT=""
export BANNER_LABEL_NL=""

# External services:
# URL to HELP system
export HELP_SCRIPT_URL='https://static.zdassets.com/ekr/snippet.js?key=803ccad8-73e6-4b21-90e5-aaa4aeb13d9a'
export HELP_PAGE_URL='https://testnewbranddbl.zendesk.com'
# url to web server hosting the asset files
# such as terms of use, data privacy, etc.
export ASSETS_URL='https://example.com/'
# Metrics service to use (disabled, highwater, matomo)
export METRICS_SERVICE='disabled'
# True to not check for consents in seagull profile
export METRICS_FORCED='false'
# Metrics service Matomo URL (used only when METRICS_SERVICE='matomo'):
export MATOMO_TRACKER_URL='disabled'
export MATOMO_TRACKER_SITEID='0'
export SUPPORT_WEB_ADDRESS='https://example.com/'
export CONTACT_SUPPORT_WEB_URL='https://example.com/'
# Crowdin translation service (enabled / disabled):
export CROWDIN='disabled'
# Stonly service https://stonly.com/ (Stonly ID / disabled):
export STONLY_WID='disabled'
# axeptio.eu cookie banner
export COOKIE_BANNER_CLIENT_ID='disabled'
# Environement for CloudFront config:
export TARGET_ENVIRONMENT='dev'
