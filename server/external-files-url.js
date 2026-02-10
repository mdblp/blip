const blipConfig = require('./config.app')

const SETTINGS_MEMO_FOLDER = 'parameter-memo'

const ALL_SETTINGS_MEMO_FILE_NAMES = [
  'aggressiveness-hyperglycemia',
  'aggressiveness-meal',
  'aggressiveness-normoglycemia',
  'average-meal',
  'hyperglycemia-threshold',
  'hypoglycemia-threshold',
  'target-glucose-level',
  'total-insulin-for-day'
]

export const PRODUCT_LABELLING_URLS = [
  `${blipConfig.ASSETS_URL}${blipConfig.YLPZ_RA_LAD_FR}.pdf`,
  `${blipConfig.ASSETS_URL}${blipConfig.YLPZ_RA_LAD_EN}.pdf`,
  `${blipConfig.ASSETS_URL}${blipConfig.YLPZ_RA_LAD_ES}.pdf`,
  `${blipConfig.ASSETS_URL}${blipConfig.YLPZ_RA_LAD_IT}.pdf`,
  `${blipConfig.ASSETS_URL}${blipConfig.YLPZ_RA_LAD_DE}.pdf`,
  `${blipConfig.ASSETS_URL}${blipConfig.YLPZ_RA_LAD_NL}.pdf`
]

const getSettingsMemoUrlsForLanguage = (languageCode) => {
  return ALL_SETTINGS_MEMO_FILE_NAMES.map(
    (fileName) => `${blipConfig.ASSETS_URL}${SETTINGS_MEMO_FOLDER}/${languageCode}/${fileName}.pdf`
  )
}

export const getAllSettingsMemoUrls = () => {
  return [
    ...getSettingsMemoUrlsForLanguage('en'),
    ...getSettingsMemoUrlsForLanguage('fr'),
    ...getSettingsMemoUrlsForLanguage('es'),
    ...getSettingsMemoUrlsForLanguage('it'),
    ...getSettingsMemoUrlsForLanguage('de'),
    ...getSettingsMemoUrlsForLanguage('nl'),
    ...getSettingsMemoUrlsForLanguage('ja')
  ]
}
