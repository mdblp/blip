/**
 * Define the URLs of the external files (PDF) used in the app.
 * Copyright (c) 2026, Diabeloop
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 */

import * as blipConfig from './config.app'

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
