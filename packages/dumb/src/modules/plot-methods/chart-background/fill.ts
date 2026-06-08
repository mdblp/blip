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

import { BgClasses } from 'medical-domain'
import i18next from 'i18next'

const t = i18next.t.bind(i18next)

interface Guideline {
  class: string
  height: number
  chip?: {
    label: string
    class: string
  }
}

export const getBgGuidelines = (targetValue: string, chart: { options: { bgClasses: BgClasses }}): Guideline[] => {
  const defaultGuidelines: Guideline[] = [
    {
      class: 'd3-line-bg-threshold-low',
      height: chart.options.bgClasses.low
    },
    {
      class: 'd3-line-bg-threshold-high',
      height: chart.options.bgClasses.target
    }
  ]

  if (!targetValue) {
    return defaultGuidelines
  }

  const targetValueNumber = Number(targetValue)

  defaultGuidelines.push({
    class: 'd3-line-bg-target',
    height: targetValueNumber,
    chip: {
      label: t('target'),
      class: 'd3-line-bg-target-chip'
    }
  })

  return defaultGuidelines
}
