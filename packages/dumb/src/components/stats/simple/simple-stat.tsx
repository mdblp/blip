/*
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

import React, { FunctionComponent, memo } from 'react'
import styles from './simple-stat.css'
import { ChartSummary } from '../common/chart-summary'
import { StatFormats } from '../../../models/stats.model'
import { useSimpleStatHook } from './simple-stat.hook'
import { StatTooltip } from '../../tooltips/stat-tooltip/stat-tooltip'

interface SimpleStatProps {
  annotations: string[]
  showToolTip: boolean
  summaryFormat: StatFormats
  title: string
  total: number
  value: number
}

const SimpleStat: FunctionComponent<SimpleStatProps> = (
  {
    showToolTip = true,
    ...props
  }) => {
  const {
    annotations,
    summaryFormat,
    title,
    total,
    value
  } = props

  const { chartSummaryProps } = useSimpleStatHook({ summaryFormat, total, value })
  return (
    <div className={styles.StatWrapper}>
      <div className={styles.Stat}>
        <div className={styles.statHeader}>
          <div className={styles.chartTitle}>
            {title}
            <span className={styles.chartTitleData}>
              (&nbsp;
              <span>
                {value.toString()}
              </span>
              &nbsp;)
            </span>
            {showToolTip && annotations && (
              <StatTooltip annotations={annotations} />
            )}
          </div>
          <ChartSummary {...chartSummaryProps} />
        </div>
      </div>
    </div>
  )
}

export const SimpleStatMemoized = memo(SimpleStat)
