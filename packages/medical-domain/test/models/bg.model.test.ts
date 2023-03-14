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

import { isBg, isBgUnit } from '../../src/domains/models/medical/datum/bg.model'

import { DatumType } from '../../src/domains/models/medical/datum/enums/datum-type.enum'
import * as baseDatum from '../../src/domains/models/medical/datum/basics/base-datum.model'

const isBaseDatumMock = jest.spyOn(baseDatum, 'isBaseDatum')
const wellFormedBg = {
  type: 'cbg',
  units: 'mg/dL',
  value: 200,
  localDate: '2023-03-01T00:00:00Z',
  isoWeekday: 'wednesday',
  msPer24: 2000
}

describe('isBg', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should return true with a record with all required keys/types', () => {
    isBaseDatumMock.mockReturnValue(true)
    const bgTypes = [DatumType.Cbg, DatumType.Smbg]
    for (const bgType of [DatumType.Cbg, DatumType.Smbg]) {
      const test = isBg({
        ...wellFormedBg,
        type: bgType
      })
      expect(test).toEqual(true)
    }
    expect(isBaseDatumMock).toHaveBeenCalledTimes(bgTypes.length)
  })

  it('should return false with an object that is not a baseDatum', () => {
    isBaseDatumMock.mockReturnValue(false)
    const testedValue = {}
    const test = isBg(testedValue)
    expect(test).toEqual(false)
    expect(isBaseDatumMock).toHaveBeenCalledTimes(1)
  })

  it('should return false with a record that has no valid unit', () => {
    isBaseDatumMock.mockReturnValue(true)
    const testedValue = {}
    const test = isBg(testedValue)
    expect(test).toEqual(false)
    expect(isBaseDatumMock).toHaveBeenCalledTimes(1)
  })

  it('should return false with a record that has no valid type', () => {
    isBaseDatumMock.mockReturnValue(true)
    const testedValue = {
      ...wellFormedBg,
      type: 'unknown-type'
    }
    const test = isBg(testedValue)
    expect(test).toEqual(false)
    expect(isBaseDatumMock).toHaveBeenCalledTimes(1)
  })
})

describe('isBgUnit', () => {
  it('should return true with a all known units', () => {
    const bgUnits = ['mg/dL', 'mmol/L']
    for (const bgUnit of bgUnits) {
      const test = isBgUnit(bgUnit)
      expect(test).toEqual(true)
    }
  })

  it('should return false with a wrongly type unit', () => {
    const wrongTypes = [0, false, {}, null, undefined, []]
    for (const wrongType of wrongTypes) {
      const test = isBgUnit(wrongType)
      expect(test).toEqual(false)
    }
  })

  it('should return false with an uknown bg unit', () => {
    const test = isBgUnit('kilogram/m3')
    expect(test).toEqual(false)
  })
})
