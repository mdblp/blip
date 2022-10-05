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
import styles from './cbg-time-stat.css'
import { formatDuration } from '../../utils/datetime'

interface CBGTimeStatProps {
  hoveredStatId: string | null
  id: string
  legendTitle: string
  onMouseLeave: Function
  onMouseOver: Function
  title: string
  total: number
  value: number
}

export const CBGTimeStat: FunctionComponent<CBGTimeStatProps> = (props: CBGTimeStatProps) => {
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
      data-testid={`cbg-time-stat-${id}`}
      className={styles.stat}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.bar}>
        {hasValues &&
          <div className={rectangleClasses} style={{ width: `${percentage}%` }} />
        }
        <div className={styles.line} />
        <div className={timeClasses}>
          {time}
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
