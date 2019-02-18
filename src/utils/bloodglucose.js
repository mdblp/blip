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

import _ from 'lodash';

import { MGDL_PER_MMOLL } from './constants';

import { formatBgValue } from './format.js';

/**
 * classifyBgValue
 * @param {Object} bgBounds - object describing boundaries for blood glucose categories
 * @param {Number} bgValue - integer or float blood glucose value in either mg/dL or mmol/L
 * @param {String} classificationType - 'threeWay' or 'fiveWay'
 *
 * @return {String} bgClassification - low, target, high
 */
export function classifyBgValue(bgBounds, bgValue, classificationType = 'threeWay') {
  if (_.isEmpty(bgBounds) ||
  !_.isNumber(_.get(bgBounds, 'targetLowerBound')) ||
  !_.isNumber(_.get(bgBounds, 'targetUpperBound'))) {
    throw new Error(
      'You must provide a `bgBounds` object with a `targetLowerBound` and a `targetUpperBound`!'
    );
  }
  if (!_.isNumber(bgValue) || !_.gt(bgValue, 0)) {
    throw new Error('You must provide a positive, numerical blood glucose value to categorize!');
  }
  const { veryLowThreshold, targetLowerBound, targetUpperBound, veryHighThreshold } = bgBounds;
  if (classificationType === 'fiveWay') {
    if (bgValue < veryLowThreshold) {
      return 'veryLow';
    } else if (bgValue >= veryLowThreshold && bgValue < targetLowerBound) {
      return 'low';
    } else if (bgValue > targetUpperBound && bgValue <= veryHighThreshold) {
      return 'high';
    } else if (bgValue > veryHighThreshold) {
      return 'veryHigh';
    }
    return 'target';
  }
  if (bgValue < targetLowerBound) {
    return 'low';
  } else if (bgValue > targetUpperBound) {
    return 'high';
  }
  return 'target';
}

/**
 * calcBgPercentInCategories
 * @param {Array} data - Array of Tidepool cbg or smbg data
 * @param {Object} bgBounds - object describing boundaries for blood glucose categories
 *
 * @return {Object} bgPercentInCategories - object w/keys veryLow, low, target, high, veryHigh
 *                  and 0.0 to 1.0 percentage values
 */
export function calcBgPercentInCategories(data, bgBounds) {
  const bgPercentInCategories = {};
  const grouped = _.groupBy(data, (d) => (classifyBgValue(bgBounds, d.value, 'fiveWay')));
  _.each(['veryLow', 'low', 'target', 'high', 'veryHigh'], (key) => {
    bgPercentInCategories[key] = ((grouped[key] && grouped[key].length) || 0) / data.length;
  });
  return bgPercentInCategories;
}

/**
 * convertToMmolL
 * @param {Number} bgVal - blood glucose value in mg/dL
 *
 * @return {Number} convertedBgVal - blood glucose value in mmol/L, unrounded
 */
export function convertToMmolL(val) {
  return (val / MGDL_PER_MMOLL);
}

/**
 * reshapeBgClassesToBgBounds
 * @param {Object} bgPrefs - bgPrefs object from blip containing tideline-style bgClasses
 *
 * @return {Object} bgBounds - @tidepool/viz-style bgBounds
 */
export function reshapeBgClassesToBgBounds(bgPrefs) {
  const { bgClasses } = bgPrefs;
  const bgBounds = {
    veryHighThreshold: bgClasses.high.boundary,
    targetUpperBound: bgClasses.target.boundary,
    targetLowerBound: bgClasses.low.boundary,
    veryLowThreshold: bgClasses['very-low'].boundary,
  };

  return bgBounds;
}

/**
 * Generate BG Range Labels for a given set of bg prefs
 *
 * @export
 * @param {Object} bgPrefs - bgPrefs object containing viz-style bgBounds and the bgUnits
 * @returns {Object} bgRangeLabels - map of labels keyed by bgClassification
 */
export function generateBgRangeLabels(bgPrefs) {
  const { bgBounds, bgUnits } = bgPrefs;
  const thresholds = _.mapValues(bgBounds, threshold => formatBgValue(threshold, bgPrefs));

  return {
    veryLow: `below ${thresholds.veryLowThreshold} ${bgUnits}`,
    low: `between ${thresholds.veryLowThreshold} - ${thresholds.targetLowerBound} ${bgUnits}`,
    target: `between ${thresholds.targetLowerBound} - ${thresholds.targetUpperBound} ${bgUnits}`,
    high: `between ${thresholds.targetUpperBound} - ${thresholds.veryHighThreshold} ${bgUnits}`,
    veryHigh: `above ${thresholds.veryHighThreshold} ${bgUnits}`,
  };
}

/**
 * getOutOfRangeThreshold
 * @param {Object} bgDatum
 * @return Object containing out of range threshold or null
 */
export function getOutOfRangeThreshold(bgDatum) {
  const outOfRangeAnnotation = _.find(
    bgDatum.annotations || [], (annotation) => (annotation.code === 'bg/out-of-range')
  );
  return outOfRangeAnnotation ?
    { [outOfRangeAnnotation.value]: outOfRangeAnnotation.threshold } : null;
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
    let datumWeight = 1;
    const deviceId = _.get(datum, 'deviceId', '');

    // Because our decision as to whether or not there's enough cgm data to warrant using
    // it to calculate average BGs is based on the expected number of readings in a day,
    // we need to adjust the weight of a for the Freestyle Libre datum, as it only
    // collects BG samples every 15 minutes as opposed the default 5 minutes from dexcom.
    if (datum.type === 'cbg' && deviceId.indexOf('AbbottFreeStyleLibre') === 0) {
      datumWeight = 3;
    }

    return total + datumWeight;
  }, 0);
}
