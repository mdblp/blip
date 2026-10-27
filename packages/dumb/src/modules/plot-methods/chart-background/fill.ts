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

const BASAL_GUIDELINE_VALUES = [0, 1]

interface Guideline {
  class: string
  height: number
  chip?: {
    label: string
    class: string
  }
}

export const getBgGuidelines = (targetValue: string | undefined, chart: { options: { bgClasses: BgClasses }}, extent: [number, number]): Guideline[] => {
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
      class: 'd3-line-bg-threshold-very-high',
      height: veryHighValue,
      chip: {
        label: veryHighValue.toString(),
        class: 'd3-line-bg-very-high-chip'
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
    // "0" is always drawn; other guideline values are only drawn if our data reaches them
    .filter((value) => value === 0 || extent[1] >= value)
    .map((value) => ({
      class: 'd3-line-basal-threshold',
      height: value,
      chip: {
        label: value.toString(),
        class: 'd3-line-basal-chip'
      }
    }))
}

export const getIobGuidelines = (maxIobValue: number): Guideline[] => {
  const guidelines: Guideline[] = [{
    class: 'd3-line-iob-threshold',
    height: 0,
    chip: {
      label: '0',
      class: 'd3-line-iob-chip'
    }
  }]

  if (maxIobValue > 0) {
    const formattedMaxIobValue = Math.ceil(maxIobValue * 10) / 10

    guidelines.push({
      class: 'd3-line-iob-threshold',
      height: formattedMaxIobValue,
      chip: {
        label: formattedMaxIobValue.toString(),
        class: 'd3-line-iob-chip'
      }
    })
  }

  return guidelines
}
