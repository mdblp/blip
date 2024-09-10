/*
 * Copyright (c) 2023, Diabeloop
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

import Unit from './enums/unit.enum'
import type BaseDatum from './basics/base-datum.model'
import { isBaseDatum } from './basics/base-datum.model'
import { DatumType } from './enums/datum-type.enum'

const MGDL_UNITS = Unit.MilligramPerDeciliter
const MMOLL_UNITS = Unit.MmolPerLiter

const bgUnits = [MGDL_UNITS, MMOLL_UNITS] as const
type BgUnit = typeof bgUnits[number]

function isBgUnit(value: unknown): value is BgUnit {
  if (typeof value === 'string') {
    return bgUnits.includes(value as BgUnit)
  }
  return false
}

type BgType = DatumType.Cbg | DatumType.Smbg

type Bg = BaseDatum & {
  type: BgType
  units: BgUnit
  value: number
  // Used for trends view
  localDate: string
  msPer24: number
}

function isBg(value: unknown): value is Bg {
  if (!isBaseDatum(value)) {
    return false
  }
  const recordValue = value as unknown as Record<string, unknown>
  if (!isBgUnit(recordValue.units)) {
    return false
  }
  return value.type === DatumType.Cbg || value.type === DatumType.Smbg
}

export default Bg
export { type BgType, MGDL_UNITS, MMOLL_UNITS, bgUnits, type BgUnit, isBgUnit, isBg }
