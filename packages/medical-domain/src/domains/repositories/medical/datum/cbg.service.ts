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

import { DatumProcessor } from '../../../models/medical/datum.model'
import BaseDatumService from './basics/base-datum.service'
import Cbg, { Bg, BgUnit, isBgUnit, MGDL_UNITS, MMOLL_UNITS } from '../../../models/medical/datum/cbg.model'
import DatumService from '../datum.service'
import MedicalDataOptions from '../../../models/medical/medical-data-options.model'
import { getTrendsTime } from '../../time/time.service'

const MGDL_PER_MMOLL = 18.01577

/**
 * extracted from packages/tideline/js/data/util/format.js
 * convertBG is a common util function to convert bg values
 * to/from "mg/dL" and "mmol/L"
 * @param {number} value The value to convert
 * @param {BgUnit} unit The unit of the passed value
 * @return: The converted value in the opposite unit
 */
const convertBG = (value: number, unit: BgUnit): number => {
  if (value < 0) {
    throw new Error('Invalid glycemia value')
  }
  switch (unit) {
    case MGDL_UNITS:
      return Math.round(10.0 * value / MGDL_PER_MMOLL) / 10
    case MMOLL_UNITS:
      return Math.round(value * MGDL_PER_MMOLL)
    default:
      throw new Error('Invalid parameter unit')
  }
}

const normalizeBg = (rawData: Record<string, unknown>, opts: MedicalDataOptions, bgType: 'cbg' | 'smbg'): Bg => {
  const base = BaseDatumService.normalize(rawData, opts)
  let bgValue = rawData.value as number
  if (bgValue < 0) {
    throw new Error(`Invalid glycemia value:${bgValue}`)
  }
  let bgUnit = rawData.units as BgUnit
  if (!isBgUnit(bgUnit)) {
    throw new Error(`Invalid glycemia unit:${bgUnit as string}`)
  }
  if (opts.bgUnits !== bgUnit) {
    bgValue = convertBG(bgValue, bgUnit)
    bgUnit = opts.bgUnits
  }

  const bg: Bg = {
    ...base,
    type: bgType,
    units: bgUnit,
    value: bgValue,
    // only used for trends view ?
    ...getTrendsTime(base.epoch, base.timezone)
  }
  return bg
}

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): Cbg => {
  return normalizeBg(rawData, opts, 'cbg') as Cbg
}

const deduplicate = (data: Cbg[], opts: MedicalDataOptions): Cbg[] => {
  return DatumService.deduplicate(data, opts) as Cbg[]
}

const CbgService: DatumProcessor<Cbg> = {
  normalize,
  deduplicate
}

export default CbgService
export { normalizeBg, convertBG }
