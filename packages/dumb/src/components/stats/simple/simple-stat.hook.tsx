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

import { useCallback, useMemo } from 'react'
import styles from './simple-stat.hook.css'
import { formatDecimalNumber } from '../../../utils/format/format.util'
import { StatFormats } from '../../../models/stats.model'
import { getPercentagePrecision } from './simple-stat.utils'
import { ChartSummaryProps } from '../common/chart-summary'

interface SimpleStatHookProps {
  summaryFormat: StatFormats
  total: number
  value: number
}

interface SimpleStatHookHookReturn {
  chartSummaryProps: ChartSummaryProps
}

export const EMPTY_DATA_PLACEHOLDER = '--'

export const useSimpleStatHook = (props: SimpleStatHookProps): SimpleStatHookHookReturn => {
  const {
    summaryFormat,
    total,
    value
  } = props

  const buildChartSummaryProps = useCallback((format: string): ChartSummaryProps => {
    if (format !== StatFormats.cv && format !== StatFormats.gmi && format !== StatFormats.percentage) {
      return {
        className: styles.statEnabled,
        value: value.toString(),
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

    if (format === StatFormats.percentage && total && total >= 0) {
      const percentage = (value / total) * 100
      return {
        className: styles.statEnabled,
        value: formatDecimalNumber(percentage, getPercentagePrecision(percentage)),
        suffix: '%'
      }
    }

    return {
      className: styles.statDisabled,
      value: EMPTY_DATA_PLACEHOLDER,
      suffix: ''
    }
  }, [total, value])

  const chartSummaryProps = useMemo(() => buildChartSummaryProps(summaryFormat), [buildChartSummaryProps, summaryFormat])

  return { chartSummaryProps }
}
