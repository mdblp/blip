/*
 * Copyright (c) 2026, Diabeloop
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

import type { BgClasses } from 'medical-domain'

const BASAL_GUIDELINE_VALUES = [1]
const BOLUS_GUIDELINE_VALUES = [1, 5]

// Shared, neutral guideline style used by every chart whose guidelines aren't
// a clinical BG threshold (i.e. everything but BG's low/high/target lines)
const NEUTRAL_THRESHOLD_CLASS = 'd3-line-neutral-threshold'
const NEUTRAL_CHIP_CLASS = 'd3-line-neutral-chip'

interface Guideline {
  class: string
  height: number
  chip?: {
    label: string
    class: string
  }
}

export const getBgGuidelines = (targetValue: string | undefined, chart: {
  options: { bgClasses: BgClasses }
}, extent: [number, number]): Guideline[] => {
  const lowValue = chart.options.bgClasses.low
  const highValue = chart.options.bgClasses.target
  const veryHighValue = chart.options.bgClasses.high

  const defaultGuidelines: Guideline[] = [
    {
      class: 'd3-line-bg-threshold-low',
      height: lowValue,
      chip: {
        label: lowValue.toString(),
        class: 'd3-line-bg-low-chip'
      }
    },
    {
      class: 'd3-line-bg-threshold-high',
      height: highValue,
      chip: {
        label: highValue.toString(),
        class: 'd3-line-bg-high-chip'
      }
    }
  ]

  // If the max of our data is lower than the very high threshold, don't draw that guideline
  if (extent[1] >= veryHighValue) {
    defaultGuidelines.push({
      class: NEUTRAL_THRESHOLD_CLASS,
      height: veryHighValue,
      chip: {
        label: veryHighValue.toString(),
        class: NEUTRAL_CHIP_CLASS
      }
    })
  }

  if (!targetValue) {
    return defaultGuidelines
  }

  const targetValueNumber = Number(targetValue)

  defaultGuidelines.push({
    class: 'd3-line-bg-target',
    height: targetValueNumber,
    chip: {
      label: targetValueNumber.toString(),
      class: 'd3-line-bg-target-chip'
    }
  })

  return defaultGuidelines
}

export const getBasalGuidelines = (extent: [number, number]): Guideline[] => {
  return BASAL_GUIDELINE_VALUES
    .filter((value) => extent[1] >= value)
    .map((value) => ({
      class: NEUTRAL_THRESHOLD_CLASS,
      height: value,
      chip: {
        label: value.toString(),
        class: NEUTRAL_CHIP_CLASS
      }
    }))
}

export const getIobGuidelines = (maxIobValue: number): Guideline[] => {
  if (maxIobValue <= 0) {
    return []
  }

  const formattedMaxIobValue = Math.ceil(maxIobValue * 10) / 10

  return [{
    class: NEUTRAL_THRESHOLD_CLASS,
    height: formattedMaxIobValue,
    chip: {
      label: formattedMaxIobValue.toString(),
      class: NEUTRAL_CHIP_CLASS
    }
  }]
}

export const getBolusGuidelines = (maxBolusValue: number): Guideline[] => {
  // Copy before mutating below: BOLUS_GUIDELINE_VALUES is shared across calls, and .push()ing
  // onto it directly would permanently grow it, leaking a larger dataset's ladder into every
  // later call with a smaller maxBolusValue.
  const guidelineValues = [...BOLUS_GUIDELINE_VALUES]

  // Add additional guidelines, up to 7, to cover the data's max value
  while (maxBolusValue > guidelineValues[guidelineValues.length - 1] && guidelineValues.length < 7) {
    const currentMax = guidelineValues[guidelineValues.length - 1]
    const step = currentMax < 10 ? 5 : 10
    // [0, 1, 5, 10, 20, 30, 40]
    guidelineValues.push(currentMax + step)
  }

  return guidelineValues.map((value) => ({
    class: NEUTRAL_THRESHOLD_CLASS,
    height: value,
    chip: {
      label: value.toString(),
      class: NEUTRAL_CHIP_CLASS
    }
  }))
}
