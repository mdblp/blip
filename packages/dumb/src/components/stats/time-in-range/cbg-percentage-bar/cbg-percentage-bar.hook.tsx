/*
 * Copyright (c) 2022-2025, Diabeloop
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

import { useMemo } from 'react'
import cbgTimeStatStyles from './cbg-percentage-bar.css'
import stylesColors from '../../common/cbg-colors.css'
import { formatDuration } from '../../../../utils/datetime/datetime.util'
import { CBGStatType } from '../../../../models/stats.model'

export interface CBGPercentageBarHookProps {
  type: CBGStatType
  id: string
  isDisabled: boolean
  total: number
  value: number
  isReducedSize?: boolean
}

interface CBGPercentageBarHookReturn {
  barClasses: string
  barValue: string
  hasValues: boolean
  percentage: number
  percentageClasses: string
  rectangleClasses: string
}

export const useCBGPercentageBar = (props: CBGPercentageBarHookProps): CBGPercentageBarHookReturn => {
  const { type, id, isDisabled, total, value, isReducedSize } = props
  const hasValues = total !== 0
  const percentage = hasValues ? Math.round(value / total * 100) : 0
  const rectangleBackgroundClass = isDisabled ? cbgTimeStatStyles['disabled-rectangle'] : stylesColors[`${id}-background`]
  const labelClass = isDisabled ? cbgTimeStatStyles['disabled-label'] : stylesColors[`${id}-color`]
  const rectangleShapeClass = isReducedSize ? cbgTimeStatStyles['rectangle-reduced'] : cbgTimeStatStyles.rectangle
  const rectangleClasses = `${rectangleShapeClass} ${rectangleBackgroundClass}`
  const durationBackgroundClasses =  isDisabled ? cbgTimeStatStyles['disabled-duration'] : stylesColors[`${id}-duration-background`]
  const barClasses = `${cbgTimeStatStyles['bar-value']} ${durationBackgroundClasses}`
  const percentageClasses = `${cbgTimeStatStyles['percentage-value']} ${labelClass}`

  const barValue = useMemo(() => {
    switch (type) {
      case CBGStatType.TimeInRange:
      case CBGStatType.TimeInTightRange:
        return formatDuration(value, true)
      case CBGStatType.ReadingsInRange:
        return (Math.round(value * 10) / 10).toString()
      default:
        throw Error(`Unknown stat type ${type}`)
    }
  }, [type, value])

  return useMemo(() => ({
    barValue,
    hasValues,
    percentage,
    percentageClasses,
    rectangleClasses,
    barClasses
  }), [
    barValue,
    hasValues,
    percentage,
    percentageClasses,
    rectangleClasses,
    barClasses
  ])
}
