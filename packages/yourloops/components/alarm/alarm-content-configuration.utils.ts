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
import { UnitsType } from '../../lib/units/models/enums/units-type.enum'
import { convertBG } from '../../lib/units/units.util'
import { DEFAULT_THRESHOLDS_IN_MGDL, Thresholds } from '../../lib/patient/models/alarm.model'

export const PERCENTAGES = [...new Array(21)]
  .map((_each, index) => `${index * 5}%`).slice(1, 21)

export const isInvalidPercentage = (value: number): boolean => {
  return !PERCENTAGES.includes(`${value}%`)
}

export const onBasicDropdownSelect = (value: string, setValue: React.Dispatch<{ value?: number, error: boolean }>): void => {
  setValue({
    value: parseFloat(value),
    error: false
  })
}

export const buildThresholds = (bgUnit: UnitsType): Thresholds => {
  if (bgUnit === UnitsType.MMOLL) {
    return {
      minHighBg: Math.round(convertBG(DEFAULT_THRESHOLDS_IN_MGDL.minHighBg, UnitsType.MGDL) * 10) / 10,
      maxHighBg: Math.round(convertBG(DEFAULT_THRESHOLDS_IN_MGDL.maxHighBg, UnitsType.MGDL) * 10) / 10,
      minVeryLowBg: Math.round(convertBG(DEFAULT_THRESHOLDS_IN_MGDL.minVeryLowBg, UnitsType.MGDL) * 10) / 10,
      maxVeryLowBg: Math.round(convertBG(DEFAULT_THRESHOLDS_IN_MGDL.maxVeryLowBg, UnitsType.MGDL) * 10) / 10,
      minLowBg: Math.round(convertBG(DEFAULT_THRESHOLDS_IN_MGDL.minLowBg, UnitsType.MGDL) * 10) / 10,
      maxLowBg: Math.round(convertBG(DEFAULT_THRESHOLDS_IN_MGDL.maxLowBg, UnitsType.MGDL) * 10) / 10
    }
  }
  return { ...DEFAULT_THRESHOLDS_IN_MGDL }
}
