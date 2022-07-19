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

/* the logic here (and the tests) are a port of tideline's
   js/plot/util/commonbolus.js */

import _ from 'lodash'

import { formatDecimalNumber, formatPercentage } from './format'

/**
 * fixFloatingPoint
 * @param {number} n value
 *
 * @return {number} numeric value rounded to 3 decimal places
 */
function fixFloatingPoint(n) {
  return Number.parseFloat(formatDecimalNumber(n, 3))
}

/**
 * getBolusFromInsulinEvent
 * @param {Object} insulinEvent - a Tidepool wizard or bolus object
 *
 * @return {Object} a Tidepool bolus object
 */
export function getBolusFromInsulinEvent(insulinEvent) {
  if (_.isObject(insulinEvent.bolus)) {
    return insulinEvent.bolus
  }
  return insulinEvent
}

// From packages/tideline/js/plot/util/drawbolus.js
export const BolusTypes = {
  meal: 1,
  micro: 2,
  manual: 3
}

/**
 *
 * @param {object} b bolus or wizard
 */
export function getBolusType(b) {
  if (b.type === 'wizard') {
    return BolusTypes.meal
  }
  const bolus = getBolusFromInsulinEvent(b)
  if (bolus.subType === 'pen' || bolus.prescriptor === 'manual') {
    return BolusTypes.manual
  }
  if (bolus.subType === 'biphasic') {
    return BolusTypes.meal
  }
  return BolusTypes.micro
}

/**
 * getCarbs
 * @param {Object} insulinEvent - a Tidepool wizard or bolus object
 *
 * @return {Number} grams of carbs input into bolus calculator
 *                  Number.NaN if bolus calculator not used; null if no carbInput
 */
export function getCarbs(insulinEvent) {
  if (insulinEvent.type !== 'wizard') {
    return Number.NaN
  }
  return _.get(insulinEvent, 'carbInput', null)
}

/**
 * getProgrammed
 * @param {object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {number} value of insulin programmed for delivery in the given insulinEvent
 */
export function getProgrammed(insulinEvent) {
  let bolus = insulinEvent
  if (_.get(insulinEvent, 'type') === 'wizard') {
    bolus = getBolusFromInsulinEvent(insulinEvent)
    if (!(Number.isFinite(bolus.normal) || Number.isFinite(bolus.extended))) {
      return Number.NaN
    }
  }
  if (Number.isFinite(bolus.extended) && Number.isFinite(bolus.expectedExtended)) {
    if (Number.isFinite(bolus.normal)) {
      if (Number.isFinite(bolus.expectedNormal)) {
        return fixFloatingPoint(bolus.expectedNormal + bolus.expectedExtended)
      }
      return fixFloatingPoint(bolus.normal + bolus.expectedExtended)
    }
    return bolus.expectedExtended
  } else if (Number.isFinite(bolus.extended)) {
    if (Number.isFinite(bolus.normal)) {
      if (Number.isFinite(bolus.expectedNormal)) {
        // this situation should not exist!
        throw new Error(
          'Combo bolus found with a cancelled `normal` portion and non-cancelled `extended`!'
        )
      }
      return fixFloatingPoint(bolus.normal + bolus.extended)
    }
    return bolus.extended
  }
  return Number.isFinite(bolus.expectedNormal) ? bolus.expectedNormal : bolus.normal
}

/**
 * getRecommended
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {Number} total recommended insulin dose
 */
export function getRecommended(insulinEvent) {
  // a simple manual/"quick" bolus won't have a `recommended` field
  if (_.isEmpty(insulinEvent.recommended)) {
    return Number.NaN
  }
  const netRecommendation = _.get(insulinEvent, 'recommended.net', null)
  if (netRecommendation !== null) {
    return netRecommendation
  }
  let rec = 0
  rec += _.get(insulinEvent, 'recommended.carb', 0)
  rec += _.get(insulinEvent, 'recommended.correction', 0)

  return fixFloatingPoint(rec)
}

/**
 * getDelivered
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {Number} units of insulin delivered in this insulinEvent
 */
export function getDelivered(insulinEvent) {
  let bolus = insulinEvent
  if (_.get(insulinEvent, 'type') === 'wizard') {
    bolus = getBolusFromInsulinEvent(insulinEvent)
    if (!_.inRange(bolus.normal, Infinity) && !_.inRange(bolus.extended, Infinity)) {
      return Number.NaN
    }
  }
  if (Number.isFinite(bolus.extended)) {
    if (Number.isFinite(bolus.normal)) {
      return fixFloatingPoint(bolus.extended + bolus.normal)
    }
    return bolus.extended
  }
  return bolus.normal
}

/**
 * getDuration
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {Number} duration value in milliseconds
 */
export function getDuration(insulinEvent) {
  let bolus = insulinEvent
  if (_.get(insulinEvent, 'type') === 'wizard') {
    bolus = getBolusFromInsulinEvent(insulinEvent)
  }
  // don't want truthiness here because want to return duration
  // from a bolus interrupted immediately (duration = 0)
  if (!_.inRange(bolus.duration, Infinity)) {
    return Number.NaN
  }
  return bolus.duration
}

/**
 * getExtended
 * @param {Object} insulinEvent - a Tidepool wizard or bolus object
 *
 * @return {Number} units of insulin delivered over an extended duration
 */
export function getExtended(insulinEvent) {
  const bolus = getBolusFromInsulinEvent(insulinEvent)

  // don't want truthiness here because want to return expectedExtended
  // from a bolus interrupted immediately (extended = 0)
  if (!_.inRange(bolus.extended, Infinity)) {
    return Number.NaN
  }

  return bolus.extended
}

/**
 * getExtendedPercentage
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {string|number} percentage of combo bolus delivered later
 */
export function getExtendedPercentage(insulinEvent) {
  let bolus = insulinEvent
  if (_.get(insulinEvent, 'type') === 'wizard') {
    bolus = getBolusFromInsulinEvent(insulinEvent)
  }
  if (!bolus.normal || !(bolus.extended || bolus.expectedExtended)) {
    return Number.NaN
  }
  const extended = bolus.expectedExtended || bolus.extended
  const programmed = getProgrammed(bolus)
  return formatPercentage(extended / programmed)
}

/**
 * getMaxDuration
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {Number} duration value in milliseconds
 */
export function getMaxDuration(insulinEvent) {
  let bolus = insulinEvent
  if (_.get(insulinEvent, 'type') === 'wizard') {
    bolus = getBolusFromInsulinEvent(insulinEvent)
  }
  // don't want truthiness here because want to return expectedDuration
  // from a bolus interrupted immediately (duration = 0)
  if (!_.inRange(bolus.duration, Infinity)) {
    return Number.NaN
  }
  return bolus.expectedDuration || bolus.duration
}

/**
 * getMaxValue
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {Number} max programmed or recommended value wrt the insulinEvent
 */
export function getMaxValue(insulinEvent) {
  let bolus = insulinEvent
  if (_.get(insulinEvent, 'type') === 'wizard') {
    bolus = getBolusFromInsulinEvent(insulinEvent)
    if (!bolus.normal && !bolus.extended) {
      return Number.NaN
    }
  }
  const programmed = getProgrammed(bolus)
  const recommended = getRecommended(insulinEvent) || 0
  return (recommended > programmed) ? recommended : programmed
}

/**
 * getNormalPercentage
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {string|number} percentage of combo bolus delivered immediately
 */
export function getNormalPercentage(insulinEvent) {
  let bolus = insulinEvent
  if (_.get(insulinEvent, 'type') === 'wizard') {
    bolus = getBolusFromInsulinEvent(insulinEvent)
  }
  if (!(bolus.normal || bolus.expectedNormal) || !(bolus.extended || bolus.expectedExtended)) {
    return Number.NaN
  }
  const normal = bolus.expectedNormal || bolus.normal
  const programmed = getProgrammed(bolus)
  return formatPercentage(normal / programmed)
}

/**
 * getTotalBolus
 * @param {Array} insulinEvents - Array of Tidepool bolus or wizard objects
 *
 * @return {Number} total bolus insulin in units
 */
export function getTotalBolus(insulinEvents) {
  return _.reduce(insulinEvents, (result, insulinEvent) => (
    result + getDelivered(insulinEvent)
  ), 0)
}

/**
 * hasExtended
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {Boolean} whether the bolus has an extended delivery portion
 */
export function hasExtended(insulinEvent) {
  const bolus = getBolusFromInsulinEvent(insulinEvent)

  // NB: intentionally invoking truthiness here
  // a bolus with `extended` value 0 and `expectedExtended` value 0 is pointless to render
  return Boolean(bolus.extended || bolus.expectedExtended) || false
}

/**
 * isInterruptedBolus
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {Boolean} whether the bolus was interrupted or not
 */
export function isInterruptedBolus(insulinEvent) {
  const bolus = getBolusFromInsulinEvent(insulinEvent)

  const cancelledDuringNormal = Boolean(
    Number.isFinite(bolus.normal) &&
    Number.isFinite(bolus.expectedNormal) &&
    bolus.normal !== bolus.expectedNormal
  )

  const cancelledDuringExtended = Boolean(
    Number.isFinite(bolus.extended) &&
    Number.isFinite(bolus.expectedExtended) &&
    bolus.extended !== bolus.expectedExtended
  )

  if (_.inRange(bolus.normal, Infinity)) {
    if (!bolus.extended) {
      return cancelledDuringNormal
    }
    return cancelledDuringNormal || cancelledDuringExtended
  }
  return cancelledDuringExtended
}

/**
 * isOverride
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {Boolean} whether the bolus programmed was larger than the calculated recommendation
 */
export function isOverride(insulinEvent) {
  return getRecommended(insulinEvent) < getProgrammed(insulinEvent)
}

/**
 * isUnderride
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {Boolean} whether the bolus programmed was smaller than the calculated recommendation
 */
export function isUnderride(insulinEvent) {
  return getRecommended(insulinEvent) > getProgrammed(insulinEvent)
}

/**
 * getAnnoations
 * @param {Object} insulinEvent - a Tidebool bolus or wizard object
 *
 * @returns {Array} array of annotations for the bolus or an empty array
 */
export function getAnnotations(insulinEvent) {
  const bolus = getBolusFromInsulinEvent(insulinEvent)
  const annotations = _.get(bolus, 'annotations', [])
  return annotations
}
