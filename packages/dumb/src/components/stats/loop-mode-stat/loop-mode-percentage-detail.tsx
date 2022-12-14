/*
 * Copyright (c) 2020-2022, Diabeloop
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
import styles from './loop-mode-stat.css'
import { useTranslation } from 'react-i18next'
import { formatDuration } from '../../../utils/datetime/datetime.util'

interface LoopModePercentageDetailProps {
  className: string
  percentage: number
  transform: string
  value: number
}

export const LoopModePercentageDetail: FunctionComponent<LoopModePercentageDetailProps> = (props) => {
  const { className, percentage, transform, value } = props
  const { t } = useTranslation('main')

  const isPercentageValid = !Number.isNaN(percentage)

  return (
    <g className={className} transform={transform}>
      <text className={styles.labelValueUnits} textAnchor="middle">
        <tspan className={styles.legendLabelValue}>{isPercentageValid ? percentage : t('N/A') }</tspan>
        {isPercentageValid && <tspan className={styles.legendLabelUnits} dy="-4">%</tspan>}
      </text>
      {isPercentageValid &&
        <text
          className={styles.labelRawValue}
          textAnchor="middle"
          dy="12"
        >
          {formatDuration(value, { condensed: true })}
        </text>
      }
    </g>
  )
}
