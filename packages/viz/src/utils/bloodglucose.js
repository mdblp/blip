/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2017, Tidepool Project
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

import _ from 'lodash'

import { formatBgValue } from './format.js'

import i18next from 'i18next'

const t = i18next.t.bind(i18next)

/**
 * reshapeBgClassesToBgBounds
 * @param {Object} bgPrefs - bgPrefs object from blip containing tideline-style bgClasses
 *
 * @return {Object} bgBounds - tidepool-viz-style bgBounds
 */
export function reshapeBgClassesToBgBounds(bgPrefs) {
  const { bgClasses } = bgPrefs
  const bgBounds = {
    veryHighThreshold: bgClasses.high,
    targetUpperBound: bgClasses.target,
    targetLowerBound: bgClasses.low,
    veryLowThreshold: bgClasses.veryLow
  }

  return bgBounds
}

/**
 * Generate BG Range Labels for a given set of bg prefs
 *
 * @export
 * @param {Object} bgPrefs - bgPrefs object containing viz-style bgBounds and the bgUnits
 * @returns {Object} bgRangeLabels - map of labels keyed by bgClassification
 */
export function generateBgRangeLabels(bgPrefs, opts = {}) {
  const { bgBounds, bgUnits } = bgPrefs
  const thresholds = _.mapValues(bgBounds, threshold => formatBgValue(threshold, bgPrefs))

  if (opts.condensed) {
    return {
      veryLow: `<${thresholds.veryLowThreshold}`,
      low: `${thresholds.veryLowThreshold}-${thresholds.targetLowerBound}`,
      target: `${thresholds.targetLowerBound}-${thresholds.targetUpperBound}`,
      high: `${thresholds.targetUpperBound}-${thresholds.veryHighThreshold}`,
      veryHigh: `>${thresholds.veryHighThreshold}`
    }
  }

  return {
    veryLow: t('below {{value}} {{- units}}', { value: thresholds.veryLowThreshold, units: bgUnits }),
    low: t('between {{low}} - {{high}} {{- units}}', {
      low: thresholds.veryLowThreshold,
      high: thresholds.targetLowerBound,
      units: bgUnits
    }),
    target: t('between {{low}} - {{high}} {{- units}}', {
      low: thresholds.targetLowerBound,
      high: thresholds.targetUpperBound,
      units: bgUnits
    }),
    high: t('between {{low}} - {{high}} {{- units}}', {
      low: thresholds.targetUpperBound,
      high: thresholds.veryHighThreshold,
      units: bgUnits
    }),
    veryHigh: t('above {{value}} {{- units}}', { value: thresholds.veryHighThreshold, units: bgUnits })
  }
}

/**
 * Get the adjusted count of expected CGM data points for devices that do not sample at the default
 * 5 minute interval, such as the Abbot FreeStyle Libre, which samples every 15 mins
 *
 * @param {Array} data - cgm data
 * @return {Integer} count - the weighted count
 */
export function weightedCGMCount(data) {
  return _.reduce(data, (total, datum) => {
    let datumWeight = 1
    const deviceId = _.get(datum, 'deviceId', '')

    // Because our decision as to whether or not there's enough cgm data to warrant using
    // it to calculate average BGs is based on the expected number of readings in a day,
    // we need to adjust the weight of a for the Freestyle Libre datum, as it only
    // collects BG samples every 15 minutes as opposed the default 5 minutes from dexcom.
    if (datum.type === 'cbg' && deviceId.indexOf('AbbottFreeStyleLibre') === 0) {
      datumWeight = 3
    }

    return total + datumWeight
  }, 0)
}
