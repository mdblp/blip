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
import cx from 'classnames'
import styles from './simple-stat.css'
import { formatDecimalNumber } from '../../../utils/format/format.util'
import { ChartTitle } from '../common/chart-title'
import { ChartSummary } from '../common/chart-summary'

enum StatFormats {
  cv = 'cv',
  gmi = 'gmi',
  percentage = 'percentage',
  units = 'units',
  unitsPerKg = 'unitsPerKg'
}

interface StatProps {
  alwaysShowTooltips: boolean
  alwaysShowSummary: boolean
  annotations: string[]
  collapsible: boolean
  data: {
    data: Datum[]
    total: Datum
    dataPaths: {
      input: string | []
      output: string | []
      summary: string
      title: string
    }
  }
  dataFormat: {
    label: StatFormats
    summary: StatFormats
    title: StatFormats
    tooltip: StatFormats
    tooltipTitle: StatFormats
  }
  emptyDataPlaceholder: string
  isOpened: boolean
  title: string
  units: string | boolean
  hideToolTips: boolean
}

interface Datum {
  id: string
  value: number
  title: string
}

export const SimpleStat: FunctionComponent<StatProps> = (
  {
    emptyDataPlaceholder = '--',
    units = false,
    hideToolTips = false,
    ...props
  }) => {
  const {
    annotations,
    data,
    dataFormat,
    title
  } = props

  const statClasses = cx({
    [styles.Stat]: true,
    [styles.isOpen]: false
  })

  /**
   * classifyCvValue
   * @param {number} value - integer or float coefficient of variation (CV) value
   * @return {String} cvClassification - target, high
   */
  const classifyCvValue = (value: number): string => {
    if (value <= 36) {
      return 'target'
    }
    return 'high'
  }

  const formatDatum = (datum: Datum, format: string): { id?: string, value: number | string, suffix: string } => {
    const id = datum.id
    const value: number | string = datum.value
    if (format !== StatFormats.cv && format !== StatFormats.gmi && format !== StatFormats.percentage && format !== StatFormats.unitsPerKg && format !== StatFormats.units) {
      return {
        id,
        value: datum.value,
        suffix: ''
      }
    }
    if (format === StatFormats.cv && value >= 0) {
      return {
        id: classifyCvValue(value),
        value: formatDecimalNumber(value),
        suffix: '%'
      }
    }
    if (format === StatFormats.gmi && value >= 0) {
      return {
        id,
        value: formatDecimalNumber(value, 1),
        suffix: '%'
      }
    }

    const total = _.get(data, 'total.value')
    if (format === StatFormats.percentage && total && total >= 0) {
      const val = _.max([value, 0]) ?? 0
      const percentage = (val / total) * 100
      let precision = 0
      // We want to show extra precision on very small percentages so that we avoid showing 0%
      // when there is some data there.
      if (percentage > 0 && percentage < 0.5) {
        precision = percentage < 0.05 ? 2 : 1
      }
      return {
        id,
        value: formatDecimalNumber(percentage, precision),
        suffix: '%'
      }
    }

    return {
      id: 'statDisabled',
      value: emptyDataPlaceholder,
      suffix: ''
    }
  }

  const getFormattedData = (format: StatFormats): { id?: string, value: number | string, suffix: string } => {
    if (!data?.data?.[0]) {
      return { id: undefined, value: '', suffix: '' }
    }
    return formatDatum(data.data[0], format)
  }

  const titleData = getFormattedData(dataFormat.title)
  const summaryData = getFormattedData(dataFormat.summary)
  return (
    <div className={styles.StatWrapper}>
      <div className={statClasses}>
        <div className={styles.statHeader}>
          <ChartTitle
            annotations={annotations}
            emptyDataPlaceholder={emptyDataPlaceholder}
            hideToolTips={hideToolTips}
            title={title}
            titleData={titleData}
          />
          <ChartSummary isOpened={true} units={units} showSummary={true} summaryData={summaryData} />
        </div>
      </div>
    </div>
  )
}
