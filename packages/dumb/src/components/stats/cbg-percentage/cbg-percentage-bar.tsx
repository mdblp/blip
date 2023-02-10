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

import React, { type FunctionComponent } from 'react'
import styles from './cbg-percentage-bar.css'
import { type CBGStatType, type StatLevel } from '../../../models/stats.model'
import { useCBGPercentageBar } from './cbg-percentage-bar.hook'

export interface CBGPercentageBarProps {
  type: CBGStatType
  id: StatLevel
  isDisabled: boolean
  legendTitle: string
  onMouseEnter: (id: StatLevel, title: string, legendTitle: string, hasValues: boolean) => void
  title: string
  total: number
  value: number
}

const CBGPercentageBar: FunctionComponent<CBGPercentageBarProps> = (props) => {
  const { type, id, isDisabled, onMouseEnter, legendTitle, title, total, value } = props

  const {
    barClasses,
    barValue,
    hasValues,
    percentage,
    percentageClasses,
    rectangleClasses
  } = useCBGPercentageBar({ type, id, isDisabled, total, value })

  return (
    <div
      data-testid={`cbg-percentage-stat-${id}-${type}`}
      className={styles.stat}
      onMouseEnter={() => { onMouseEnter(id, title, legendTitle, total !== 0) }}
    >
      <div className={styles.bar}>
        {hasValues &&
          <div className={rectangleClasses} style={{ width: `${percentage}%` }} />
        }
        <div className={styles.line} />
        <div className={barClasses}>
          {barValue}
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

export const CBGPercentageBarMemoized = React.memo(CBGPercentageBar)
