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
import { formatBgValue } from 'dumb/src/utils/format/format.util'
import { convertBG } from '../../lib/units/units.util'
import { DEFAULT_BG_VALUES, DEFAULT_THRESHOLDS_IN_MGDL } from './alarms.default'
import { type BgValues, type Thresholds } from '../../lib/patient/models/alarms.model'
import { type BgUnit, Unit } from 'medical-domain'

export const PERCENTAGES = [...new Array(21)]
  .map((_each, index) => `${index * 5}%`).slice(1, 21)

export const REGEX_VALUE_BG = /^(\d)*(.)?([0-9]{1})?$/

export const isInvalidPercentage = (value: number): boolean => {
  return !PERCENTAGES.includes(`${value}%`)
}

export const onBasicDropdownSelect = (value: string, setValue: React.Dispatch<{ value?: number, error: boolean }>): void => {
  setValue({
    value: parseFloat(value),
    error: false
  })
}

export const buildThresholds = (bgUnit: BgUnit): Thresholds => {
  if (bgUnit === Unit.MmolPerLiter) {
    return {
      minHighBg: Math.round(convertBG(DEFAULT_THRESHOLDS_IN_MGDL.minHighBg, Unit.MilligramPerDeciliter) * 10) / 10,
      maxHighBg: Math.round(convertBG(DEFAULT_THRESHOLDS_IN_MGDL.maxHighBg, Unit.MilligramPerDeciliter) * 10) / 10,
      minVeryLowBg: Math.round(convertBG(DEFAULT_THRESHOLDS_IN_MGDL.minVeryLowBg, Unit.MilligramPerDeciliter) * 10) / 10,
      maxVeryLowBg: Math.round(convertBG(DEFAULT_THRESHOLDS_IN_MGDL.maxVeryLowBg, Unit.MilligramPerDeciliter) * 10) / 10,
      minLowBg: Math.round(convertBG(DEFAULT_THRESHOLDS_IN_MGDL.minLowBg, Unit.MilligramPerDeciliter) * 10) / 10,
      maxLowBg: Math.round(convertBG(DEFAULT_THRESHOLDS_IN_MGDL.maxLowBg, Unit.MilligramPerDeciliter) * 10) / 10
    }
  }
  return { ...DEFAULT_THRESHOLDS_IN_MGDL }
}

export const buildBgValues = (bgUnit: BgUnit): BgValues => {
  if (bgUnit === Unit.MmolPerLiter) {
    return {
      ...DEFAULT_BG_VALUES,
      bgUnitDefault: Unit.MmolPerLiter,
      highBgDefault: Math.round(convertBG(DEFAULT_BG_VALUES.highBgDefault, Unit.MilligramPerDeciliter) * 10) / 10,
      veryLowBgDefault: Math.round(convertBG(DEFAULT_THRESHOLDS_IN_MGDL.minVeryLowBg, Unit.MilligramPerDeciliter) * 10) / 10,
      lowBgDefault: Math.round(convertBG(DEFAULT_THRESHOLDS_IN_MGDL.minLowBg, Unit.MilligramPerDeciliter) * 10) / 10
    }
  }
  return { ...DEFAULT_BG_VALUES }
}

const convertAndFormatBgValue = (value: number, currentUnit: BgUnit): number => {
  const newUnit = currentUnit === Unit.MilligramPerDeciliter ? Unit.MmolPerLiter : Unit.MilligramPerDeciliter
  const formattedValueString = formatBgValue(convertBG(value, currentUnit), newUnit)

  return newUnit === Unit.MilligramPerDeciliter ? parseInt(formattedValueString) : parseFloat(formattedValueString)
}

export const getConvertedValue = (value: number, currentUnit: BgUnit, requiredUnit: BgUnit): number => {
  const isConversionRequired = currentUnit !== requiredUnit

  return isConversionRequired ? convertAndFormatBgValue(value, currentUnit) : value
}
