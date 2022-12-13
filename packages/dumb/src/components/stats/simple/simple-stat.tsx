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

import React, { FunctionComponent } from 'react'
import _ from 'lodash'
import styles from './simple-stat.css'
import { formatDecimalNumber } from '../../../utils/format/format.util'
import { ChartTitle } from '../common/chart-title'
import { ChartSummary } from '../common/chart-summary'
import { StatFormats } from '../../../models/stats.model'

interface SimpleStatProps {
  annotations: string[]
  data: {
    data: Datum[]
    total: Datum
  }
  dataFormat: {
    summary: StatFormats
    title: StatFormats
  }
  emptyDataPlaceholder: string
  title: string
  units: string | boolean
  showToolTip: boolean
}

interface Datum {
  id: string
  value: number
  title: string
}

export const SimpleStat: FunctionComponent<SimpleStatProps> = (
  {
    emptyDataPlaceholder = '--',
    units = false,
    showToolTip = true,
    ...props
  }) => {
  const {
    annotations,
    data,
    dataFormat,
    title
  } = props

  const getPercentagePrecision = (percentage: number): number => {
    // We want to show extra precision on very small percentages so that we avoid showing 0%
    // when there is some data there.
    if (percentage > 0 && percentage < 0.5) {
      return percentage < 0.05 ? 2 : 1
    }
    return 0
  }

  const formatDatum = (datum: Datum, format: string): { className?: string, value: string, suffix: string } => {
    const value: number = datum.value
    if (format !== StatFormats.cv && format !== StatFormats.gmi && format !== StatFormats.percentage) {
      return {
        className: styles.statEnabled,
        value: datum.value.toString(),
        suffix: ''
      }
    }
    if (format === StatFormats.cv && value >= 0) {
      return {
        className: value <= 36 ? styles.coefficientVariationTarget : styles.coefficientVariationHigh,
        value: formatDecimalNumber(value),
        suffix: '%'
      }
    }
    if (format === StatFormats.gmi && value >= 0) {
      return {
        className: styles.statEnabled,
        value: formatDecimalNumber(value, 1),
        suffix: '%'
      }
    }

    const total = data.total?.value
    if (format === StatFormats.percentage && total && total >= 0) {
      const val = _.max([value, 0]) ?? 0
      const percentage = (val / total) * 100
      return {
        className: styles.statEnabled,
        value: formatDecimalNumber(percentage, getPercentagePrecision(percentage)),
        suffix: '%'
      }
    }

    return {
      className: styles.statDisabled,
      value: emptyDataPlaceholder,
      suffix: ''
    }
  }

  const getFormattedData = (format: StatFormats): { className?: string, value: string, suffix: string } => {
    if (!data?.data?.[0]) {
      return { value: '', suffix: '' }
    }
    return formatDatum(data.data[0], format)
  }

  const titleData = getFormattedData(dataFormat.title)
  const summaryData = getFormattedData(dataFormat.summary)
  return (
    <div className={styles.StatWrapper}>
      <div className={styles.Stat}>
        <div className={styles.statHeader}>
          <ChartTitle
            annotations={annotations}
            emptyDataPlaceholder={emptyDataPlaceholder}
            showToolTip={showToolTip}
            title={title}
            suffix={titleData.suffix}
            value={titleData.value}
          />
          <ChartSummary
            className={summaryData.className}
            isOpened={true}
            units={units}
            showSummary={true}
            suffix={summaryData.suffix}
            value={summaryData.value}
          />
        </div>
      </div>
    </div>
  )
}
