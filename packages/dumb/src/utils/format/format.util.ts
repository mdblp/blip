/*
 * Copyright (c) 2022-2025, Diabeloop
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

import { formatLocalizedFromUTC, getHourMinuteFormat } from '../datetime/datetime.util'
import { type BgUnit, type TimePrefs, Unit } from 'medical-domain'
import { min } from 'lodash'
import * as d3 from 'd3'

const NO_VALUE_STRING = '--'

const EXPONENTIAL_LOW_VALUE = 1e-2
const EXPONENTIAL_HIGH_VALUE = 9999

const NO_DECIMAL_LENGTH = 1
const DEFAULT_DECIMAL_LENGTH = 2

const ONE_DIGIT_STRING_FORMAT = '.1f'
const NO_DIGIT_STRING_FORMAT = 'd'

export const formatInputTime = (utcTime: string, timePrefs: TimePrefs): string => {
  return formatLocalizedFromUTC(utcTime, timePrefs, getHourMinuteFormat())
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
  if (valueAbsolute < EXPONENTIAL_LOW_VALUE || valueAbsolute > EXPONENTIAL_HIGH_VALUE) {
    return valueNumber.toExponential(2)
  }

  return valueNumber.toFixed(decimalsCount)
}

export const formatBgValue = (value: number, bgUnits?: BgUnit): string => {
  const unit = bgUnits ?? Unit.MilligramPerDeciliter
  const isUnitMmolPerLiter = unit === Unit.MmolPerLiter

  const valueFormat = isUnitMmolPerLiter ? ONE_DIGIT_STRING_FORMAT : NO_DIGIT_STRING_FORMAT
  return d3.format(valueFormat)(value)
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
/**
 * formatDecimalNumber
 * @param {Number} val - numeric value to format
 * @param {Number} [places] - optional number of decimal places to display;
 *                            if not provided, will display as integer (0 decimal places)
 *
 * @return {String} numeric value rounded to the desired number of decimal places
 */
export const formatDecimalNumber = (val: number, places = 0): string => {
  if (!places) {
    return d3.format('d')(val)
  }
  return d3.format(`.${places}f`)(val)
}

export const formatInsulin = (value: number): string => {
  const decimalLength = getDecimalLength(value)
  return formatDecimalNumber(value, decimalLength)
}

const getDecimalLength = (value: number): number => {
  const valueString = value.toString()

  if (!valueString.includes('.')) {
    return NO_DECIMAL_LENGTH
  }
  const length = valueString.split('.')[1].length
  return min([length, DEFAULT_DECIMAL_LENGTH]) as number
}
