/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2014, Tidepool Project
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

/**
 * Used to regroup device parameters in one tooltip, when the changes are too close.
 * This is to avoid superpositions of the icons in the daily view.
 * Format: Duration in milliseconds.
 */
export const AUTOMATED_BASAL_DEVICE_MODELS = {
  Medtronic: ['1580', '1581', '1582', '1780', '1781', '1782'],
  Diabeloop: true
}

export const dateTimeFormats = {
  /** @returns {string} translated 'MMMM D' format */
  get MMMM_D_FORMAT() { return i18next.t('MMMM D') },
  /** @returns {string} translated 'dddd, MMMM D' format */
  get DDDD_MMMM_D_FORMAT() { return i18next.t('dddd, MMMM D') },
  /** @returns {string} translated 'MMM D, YYYY h:mm a' format */
  get MMM_D_YYYY_H_MM_A_FORMAT() { return i18next.t('MMM D, YYYY h:mm a') },
  /** @returns {string} translated 'MMM D, h:mm a' format */
  get MMM_D_H_MM_A_FORMAT() { return i18next.t('MMM D, h:mm a') },
  /** @returns {string} translated 'dddd, h:mm a' format */
  get DDDD_H_MM_A() { return i18next.t('dddd, h:mm a') },
  /** @returns {string} translated 'h:mm a' format */
  get H_MM_A_FORMAT() { return i18next.t('h:mm a') }
}
