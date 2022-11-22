/*
 * Copyright (c) 2022, Diabeloop
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

import { BgBounds, BgPrefs } from '../settings/models'
import { isNumber } from 'lodash'
import { Annotation } from './annotations.util'

export const ANNOTATION_CODE_BG_OUT_OF_RANGE = 'bg/out-of-range'

export enum ClassificationType {
  FiveWay = 'fiveWay',
  ThreeWay = 'threeWay'
}

export enum BgClass {
  High = 'high',
  Low = 'low',
  Target = 'target',
  VeryHigh = 'veryHigh',
  VeryLow = 'veryLow',
}

export const reshapeBgClassesToBgBounds = (bgPrefs: BgPrefs): BgBounds => {
  const { bgClasses } = bgPrefs
  return {
    veryHighThreshold: bgClasses.high.boundary,
    targetUpperBound: bgClasses.target.boundary,
    targetLowerBound: bgClasses.low.boundary,
    veryLowThreshold: bgClasses['very-low'].boundary
  }
}

export const getBgClass = (bgBounds: BgBounds, bgValue: number, classificationType = ClassificationType.ThreeWay): BgClass => {
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

export const getOutOfRangeThreshold = (annotations?: Annotation[]): { [annotation: string]: number } | undefined => {
  if (!annotations || annotations.length === 0) {
    return
  }

  const annotation = annotations.find((annotation: Annotation) => annotation.code === ANNOTATION_CODE_BG_OUT_OF_RANGE)
  if (!annotation || !annotation.threshold) {
    return
  }
  return { [annotation.value]: annotation.threshold }
}
