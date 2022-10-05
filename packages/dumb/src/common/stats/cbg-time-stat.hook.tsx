/**
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

import { useCallback, useMemo } from 'react'
import styles from './cbg-time-stat.css'
import { formatDuration } from '../../utils/datetime'

export interface CBGTimeStatHookProps {
  hoveredStatId: string | null
  id: string
  legendTitle: string
  onMouseLeave: Function
  onMouseOver: Function
  title: string
  total: number
  value: number
}

interface CBGTimeStatHookReturn {
  handleMouseOver: Function
  handleMouseLeave: Function
  hasValues: boolean
  percentage: number
  percentageClasses: string
  rectangleClasses: string
  timeClasses: string
  time: string
}

export const useCBGTimeStat = (props: CBGTimeStatHookProps): CBGTimeStatHookReturn => {
  const { hoveredStatId, id, legendTitle, onMouseLeave, onMouseOver, title, total, value } = props
  const time = formatDuration(value, { condensed: true })
  const hasValues = total !== 0
  const percentage = hasValues ? Math.round(value / total * 100) : 0
  const isDisabled = !hasValues || (hoveredStatId && hoveredStatId !== id)
  const rectangleBackgroundClass = isDisabled ? styles['disabled-rectangle'] : styles[`${id}-background`]
  const labelClass = isDisabled ? styles['disabled-label'] : styles[`${id}-label`]

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const rectangleClasses = `${styles.rectangle} ${rectangleBackgroundClass}`
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const timeClasses = `${styles.time} ${labelClass}`
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const percentageClasses = `${styles['percentage-value']} ${labelClass}`

  const handleMouseOver = useCallback(() => {
    if (!isDisabled) {
      onMouseOver(id, title, legendTitle)
    }
  }, [id, isDisabled, legendTitle, onMouseOver, title])

  const handleMouseLeave = useCallback(() => {
    if (!isDisabled) {
      onMouseLeave()
    }
  }, [isDisabled, onMouseLeave])

  return useMemo(() => ({
    handleMouseOver,
    handleMouseLeave,
    hasValues,
    percentage,
    percentageClasses,
    rectangleClasses,
    timeClasses,
    time
  }), [
    handleMouseLeave,
    handleMouseOver,
    hasValues,
    percentage,
    percentageClasses,
    rectangleClasses,
    time,
    timeClasses
  ])
}
