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
import { useCBGTimeStat } from './cbg-time-stat.hook'

export interface CBGTimeStatProps {
  id: string
  isDisabled: boolean
  onMouseOver: Function
  total: number
  value: number
}

const CBGTimeStat: FunctionComponent<CBGTimeStatProps> = (props: CBGTimeStatProps) => {
  const { id, isDisabled, onMouseOver, total, value } = props

  const {
    hasValues,
    percentage,
    percentageClasses,
    rectangleClasses,
    timeClasses,
    time
  } = useCBGTimeStat({ id, isDisabled, total, value })

  return (
    <div
      data-testid={`cbg-time-stat-${id}`}
      className={styles.stat}
      onMouseOver={() => onMouseOver()}
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

export const CBGTimeStatMemoized = React.memo(CBGTimeStat)
