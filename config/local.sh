## Common
export API_HOST='http://localhost:3000'
export WEBPACK_DEVTOOL='source-map'
export PORT='3001'

# Diabeloop specific
export BRANDING='diabeloop_blue'
export LATEST_TERMS='1970-01-01'
export LATEST_TRAINING='1970-01-01'
export LATEST_RELEASE='2022-03-03'
export YLPZ_RA_LAD_FR='intended-use.fr'
export YLPZ_RA_LAD_EN='intended-use.en'
export YLPZ_RA_LAD_NL='intended-use.nl'
export YLPZ_RA_LAD_IT='intended-use.it'
export YLPZ_RA_LAD_ES='intended-use.es'
export YLPZ_RA_LAD_DE='intended-use.de'
export IDLE_TIMEOUT_MS=1800000
export EATING_SHORTLY_ENABLED=true
export METRICS_CLICKODROME_ENABLED=true
export DATE_OF_BIRTH_HIDDEN=false
export CONTACT_SUPPORT_WEB_URL='https://example.com/'
export HELP_WEB_URL='https://example.com/'

# External services:
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
# Crowdin translation service (enabled / disabled):
export CROWDIN='disabled'
# axeptio.eu cookie banner
export COOKIE_BANNER_CLIENT_ID='disabled'
# Environement for CloudFront config:
export TARGET_ENVIRONMENT='dev'
