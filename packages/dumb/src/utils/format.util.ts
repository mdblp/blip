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

import { formatLocalizedFromUTC, getHourMinuteFormat } from './datetime.util'
import { TimePrefs } from '../settings/models'
import { InputTime } from '../components/tooltips/physical-tooltip/physical-tooltip'
import { Unit } from '../components/tooltips/parameter-tooltip/parameter-tooltip'

const NO_VALUE_STRING = '--'

export const formatInputTime = (utcTime: InputTime, timePrefs: TimePrefs): string => {
  return formatLocalizedFromUTC(utcTime, timePrefs, getHourMinuteFormat())
}

const convertValueToNumber = (value: string | number): number => {
  if (typeof value === 'string') {
    if (value.includes('.')) {
      return Number.parseFloat(value)
    }
    return Number.parseInt(value, 10)
  }
  return value
}

const getDecimalsCount = (unit: Unit): number => {
  switch (unit) {
    case Unit.Percent:
    case Unit.Minute:
      return 0
    case Unit.Gram:
    case Unit.Kilogram:
    case Unit.InsulinUnit:
    case Unit.MmolPerLiter:
    case Unit.MilligramPerDeciliter:
      return 1
    case Unit.InsulinUnitPerGram:
      return 3
    default:
      return 2
  }
}

export const formatParameterValue = (value: number | string, unit: Unit): string => {
  const valueNumber = convertValueToNumber(value)
  const decimalsCount = getDecimalsCount(unit)

  if (Number.isNaN(valueNumber)) {
    return NO_VALUE_STRING
  }
  if (Number.isInteger(valueNumber) && decimalsCount === 0) {
    return valueNumber.toString(10)
  }

  const valueAbsolute = Math.abs(valueNumber)
  if (valueAbsolute < Number.EPSILON) {
    return valueNumber.toFixed(1)
  }
  if (valueAbsolute < 1e-2 || valueAbsolute > 9999) {
    return valueNumber.toExponential(2)
  }

  return valueNumber.toFixed(decimalsCount)
}
