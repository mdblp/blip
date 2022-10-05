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

import React, { FunctionComponent } from 'react'
import styles from './time-in-range.css'
import { formatDuration } from '../../utils/datetime'

interface TimeInRangeStatsProps {
  id: string
  legendTitle: string
  hoveredStatId: string | null
  onMouseLeave: Function
  onMouseOver: Function
  title: string
  total: number
  value: number
}

export const TimeInRangeStat: FunctionComponent<TimeInRangeStatsProps> = (props: TimeInRangeStatsProps) => {
  const { id, value, total, onMouseLeave, onMouseOver, hoveredStatId, legendTitle, title } = props
  const tooltip = formatDuration(value, { condensed: true })
  const hasValues = total !== 0
  const percentage = hasValues ? Math.round(value / total * 100) : 0
  const isDisabled = !hasValues || (hoveredStatId && hoveredStatId !== id)
  const background = isDisabled ? styles['disabled-rectangle'] : styles[`${id}-background`]
  const label = isDisabled ? styles['disabled-label'] : styles[`${id}-label`]

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const rectangleClasses = `${styles.rectangle} ${background}`
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const tooltipClasses = `${styles.tooltip} ${label}`
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const percentageClasses = `${styles['percentage-value']} ${label}`

  const handleMouseOver = (): void => {
    if (!isDisabled) {
      onMouseOver(id, title, legendTitle)
    }
  }

  const handleMouseLeave = (): void => {
    if (!isDisabled) {
      onMouseLeave()
    }
  }

  return (
    <div
      data-testid={`time-in-range-stat-${id}`}
      className={styles.stat}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.bar} style={{ width: '234px', position: 'relative' }}>
        {hasValues &&
          <div className={rectangleClasses} style={{ width: `${percentage}%` }} />
        }
        <div className={styles.line} style={{ flexGrow: 1 }} />
        <div className={tooltipClasses}>
          {tooltip}
        </div>
      </div>
      {hasValues
        ? (
          <>
            <div className={percentageClasses}>
              {percentage}
            </div>
            <div className={styles['percentage-symbol']}>
              %
            </div>
          </>
          ) : (
          <div className={percentageClasses}>
            --
          </div>
          )
      }
    </div>
  )
}
