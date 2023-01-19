/*
 * Copyright (c) 2022-2023, Diabeloop
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import _, { isNumber } from 'lodash'
import { BgBounds, BgClass, ClassificationType } from '../../models/blood-glucose.model'
import { BgClasses } from 'medical-domain'

export const convertBgClassesToBgBounds = (bgClasses: BgClasses): BgBounds => {
  return {
    veryHighThreshold: bgClasses.high.boundary,
    targetUpperBound: bgClasses.target.boundary,
    targetLowerBound: bgClasses.low.boundary,
    veryLowThreshold: bgClasses['very-low'].boundary
  }
}

export const getBgClass = (bgBounds: BgBounds, bgValue?: number, classificationType = ClassificationType.ThreeWay): BgClass => {
  if (!bgBounds || !isNumber(bgBounds.targetLowerBound) || !isNumber(bgBounds.targetUpperBound)) {
    throw new Error(
      'You must provide a `bgBounds` object with a `targetLowerBound` and a `targetUpperBound`!'
    )
  }
  if (!isNumber(bgValue) || bgValue <= 0) {
    throw new Error('You must provide a positive, numerical blood glucose value to categorize!')
  }

  const { veryLowThreshold, targetLowerBound, targetUpperBound, veryHighThreshold } = bgBounds

  if (classificationType !== ClassificationType.FiveWay) {
    return bgValue < targetLowerBound ? BgClass.Low : bgValue > targetUpperBound ? BgClass.High : BgClass.Target
  }

  if (bgValue < veryLowThreshold) {
    return BgClass.VeryLow
  }
  if (bgValue >= veryLowThreshold && bgValue < targetLowerBound) {
    return BgClass.Low
  }
  if (bgValue > targetUpperBound && bgValue <= veryHighThreshold) {
    return BgClass.High
  }
  if (bgValue > veryHighThreshold) {
    return BgClass.VeryHigh
  }
  return BgClass.Target
}

/**
 * classifyBgValue
 * @param {Object} bgBounds - object describing boundaries for blood glucose categories
 * @param {number} bgValue - integer or float blood glucose value in either mg/dL or mmol/L
 * @param {"threeWay" | "fiveWay"} classificationType - 'threeWay' or 'fiveWay'
 *
 * @return {String} bgClassification - low, target, high
 */
export const classifyBgValue = (bgBounds: BgBounds, bgValue: number, classificationType = 'threeWay'): string => {
  if (_.isEmpty(bgBounds) ||
    !_.isNumber(_.get(bgBounds, 'targetLowerBound')) ||
    !_.isNumber(_.get(bgBounds, 'targetUpperBound'))) {
    throw new Error(
      'You must provide a `bgBounds` object with a `targetLowerBound` and a `targetUpperBound`!'
    )
  }
  if (!_.isNumber(bgValue) || !_.gt(bgValue, 0)) {
    throw new Error('You must provide a positive, numerical blood glucose value to categorize!')
  }
  const { veryLowThreshold, targetLowerBound, targetUpperBound, veryHighThreshold } = bgBounds
  if (classificationType === 'fiveWay') {
    if (bgValue < veryLowThreshold) {
      return 'veryLow'
    } else if (bgValue >= veryLowThreshold && bgValue < targetLowerBound) {
      return 'low'
    } else if (bgValue > targetUpperBound && bgValue <= veryHighThreshold) {
      return 'high'
    } else if (bgValue > veryHighThreshold) {
      return 'veryHigh'
    }
    return 'target'
  }
  if (bgValue < targetLowerBound) {
    return 'low'
  } else if (bgValue > targetUpperBound) {
    return 'high'
  }
  return 'target'
}
