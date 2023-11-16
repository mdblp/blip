/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2016, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

import i18next from 'i18next'

const t = i18next.t.bind(i18next)

export const BG_HIGH = 'High'
export const BG_LOW = 'Low'

export const LBS_PER_KG = 2.2046226218

export const CGM_READINGS_ONE_DAY = 288
export const CGM_DATA_KEY = 'cbg'
export const BGM_DATA_KEY = 'smbg'
export const NO_CGM = 'noCGM'
export const CGM_CALCULATED = 'calculatedCGM'
export const NOT_ENOUGH_CGM = 'notEnoughCGM'

export const NO_SITE_CHANGE = 'noSiteChange'
export const SITE_CHANGE = 'siteChange'
export const SITE_CHANGE_RESERVOIR = 'reservoirChange'
export const SITE_CHANGE_TUBING = 'tubingPrime'
export const SITE_CHANGE_CANNULA = 'cannulaPrime'

export const AUTOMATED_DELIVERY = 'automatedDelivery'
export const SCHEDULED_DELIVERY = 'scheduledDelivery'

export const SECTION_TYPE_UNDECLARED = 'undeclared'

export const DIABELOOP = 'Diabeloop'
export const DEFAULT_MANUFACTURER = 'default'

export const getPumpVocabularies = () => ({
  [DIABELOOP]: {
    [SITE_CHANGE_RESERVOIR]: t('Change Cartridge'),
    [SITE_CHANGE_TUBING]: t('Fill Tubing'),
    [SITE_CHANGE_CANNULA]: t('Fill Cannula'),
    [AUTOMATED_DELIVERY]: t('Loop mode'),
    [SCHEDULED_DELIVERY]: t('Loop mode off')
  },
  default: {
    [SITE_CHANGE_RESERVOIR]: t('Change Cartridge'),
    [SITE_CHANGE_TUBING]: t('Fill Tubing'),
    [SITE_CHANGE_CANNULA]: t('Fill Cannula'),
    [AUTOMATED_DELIVERY]: t('Automated'),
    [SCHEDULED_DELIVERY]: t('Manual')
  }
})

export const AUTOMATED_BASAL_DEVICE_MODELS = {
  [DIABELOOP]: true
}
