/*
 * Copyright (c) 2022-2024, Diabeloop
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

import styles from './simple-stat.css'
import { formatDecimalNumber } from '../../../utils/format/format.util'
import { EMPTY_DATA_PLACEHOLDER, StatFormats } from '../../../models/stats.model'
import { type SimpleValueProps } from '../common/simple-value'
import { Unit } from 'medical-domain'

const MINIMUM_PERCENTAGE_VALUE = 0
const MAXIMUM_PERCENTAGE_VALUE = 0.5
const PERCENTAGE_PRECISION_BREAKPOINT = 0.05
const BIG_PRECISION = 2
const SMALL_PRECISION = 1
const DEFAULT_PRECISION = 0

const getPercentagePrecision = (percentage: number): number => {
  if (percentage > MINIMUM_PERCENTAGE_VALUE && percentage < MAXIMUM_PERCENTAGE_VALUE) {
    return percentage < PERCENTAGE_PRECISION_BREAKPOINT ? BIG_PRECISION : SMALL_PRECISION
  }
  return DEFAULT_PRECISION
}

export const buildSimpleValueProps = (format: string, total: number, value: number): SimpleValueProps => {
  const suffix = Unit.Percent

  if (value >= 0) {
    if (format === StatFormats.Cv) {
      return {
        value: formatDecimalNumber(value),
        suffix
      }
    }

    if (format === StatFormats.Gmi) {
      return {
        value: formatDecimalNumber(value, 1),
        suffix
      }
    }
  }

  if (format === StatFormats.Percentage && total >= 0) {
    const percentage = total === 0 ? 0 : (value / total) * 100
    return {
      value: formatDecimalNumber(percentage, getPercentagePrecision(percentage)),
      suffix
    }
  }

  return {
    className: styles.statDisabled,
    value: EMPTY_DATA_PLACEHOLDER,
    suffix: ''
  }
}
