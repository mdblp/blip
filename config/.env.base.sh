## Common
# Public API entry point
export API_HOST='http://api-public:3000'
export WEBPACK_DEVTOOL='source-map'
export PORT='3000'

# Diabeloop specific
export BRANDING='diabeloop_blue'
export PWD_MIN_LENGTH='10'
export PWD_MAX_LENGTH='72'
export MAX_FAILED_LOGIN_ATTEMPTS='5'
export DELAY_BEFORE_NEXT_LOGIN_ATTEMPT='1'
export LATEST_TERMS='1970-01-01'

# External services:
# URL to HELP system
export HELP_SCRIPT_URL='disabled'
export HELP_PAGE_URL='https://diabeloop.zendesk.com'
# url to web server hosting the asset files
# such as terms of use, data privacy, etc.
export ASSETS_URL='https://example.com/'
# Metrics service to use (disabled, highwater, matomo)
export METRICS_SERVICE='disabled'
# Metrics service Matomo URL (used only when METRICS_SERVICE='matomo'):
export MATOMO_TRACKER_URL='disabled'
export MATOMO_TRACKER_SITEID='0'
export SUPPORT_WEB_ADDRESS='https://example.com/'
# Stonly service https://stonly.com/ (enabled / disabled):
export STONLY_WID='disabled'
# axeptio.eu cookie banner
export COOKIE_BANNER_CLIENT_ID='disabled'
# Environement for CloudFront config:
export TARGET_ENVIRONMENT='dev'

# Auth0 configuration (yourloops-front-dev app)
export AUTH0_DOMAIN="yourloops-dev.eu.auth0.com"
export AUTH0_CLIENT_ID="HDp2TbUBxOeR6A9dEfII94HfzmUokQK6"
