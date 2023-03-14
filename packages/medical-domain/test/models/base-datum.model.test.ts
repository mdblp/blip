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

import { isBaseDatum } from '../../src/domains/models/medical/datum/basics/base-datum.model'
import * as typeguardUtils from '../../src/domains/utils/typeguard.utils'
import * as baseTime from '../../src/domains/models/medical/datum/basics/base-time.model'
import { DatumType } from '../../src/domains/models/medical/datum/enums/datum-type.enum'

const isRecordMock = jest.spyOn(typeguardUtils, 'isRecord')
const isBaseTimeMock = jest.spyOn(baseTime, 'isBaseTime')

const wellFormedValue = {
  id: '001',
  type: 'basal',
  source: 'Diabeloop'
}

describe('isBaseTime', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should return true with a record + baseTime with all required keys/types', () => {
    isRecordMock.mockReturnValue(true)
    isBaseTimeMock.mockReturnValue(true)
    for (const dataType of Object.values(DatumType)) {
      const test = isBaseDatum({
        ...wellFormedValue,
        type: dataType
      })
      expect(test).toEqual(true)
    }
    expect(isRecordMock).toHaveBeenCalledTimes(Object.keys(DatumType).length)
    expect(isBaseTimeMock).toHaveBeenCalledTimes(Object.keys(DatumType).length)
  })

  it('should return false with an object that is not a record', () => {
    isRecordMock.mockReturnValue(false)
    isBaseTimeMock.mockReturnValue(true)
    const testedValue = {}
    const test = isBaseDatum(testedValue)
    expect(test).toEqual(false)
    expect(isRecordMock).toHaveBeenCalledTimes(1)
    expect(isBaseTimeMock).toHaveBeenCalledTimes(1)
  })

  it('should return false with an object that is not a baseTime', () => {
    isRecordMock.mockReturnValue(true)
    isBaseTimeMock.mockReturnValue(false)
    const testedValue = {}
    const test = isBaseDatum(testedValue)
    expect(test).toEqual(false)
    expect(isBaseTimeMock).toHaveBeenCalledTimes(1)
    expect(isRecordMock).toHaveBeenCalledTimes(0)
  })

  it('should return false with a record that has an id with the wrong type', () => {
    isRecordMock.mockReturnValue(true)
    isBaseTimeMock.mockReturnValue(true)
    const testedValue = {
      ...wellFormedValue,
      id: 0
    }
    const test = isBaseDatum(testedValue)
    expect(test).toEqual(false)
    expect(isBaseTimeMock).toHaveBeenCalledTimes(1)
    expect(isRecordMock).toHaveBeenCalledTimes(1)
  })

  it('should return false with a record that has a type key with the wrong type', () => {
    isRecordMock.mockReturnValue(true)
    isBaseTimeMock.mockReturnValue(true)
    const testedValue = {
      ...wellFormedValue,
      type: 0
    }
    const test = isBaseDatum(testedValue)
    expect(test).toEqual(false)
    expect(isBaseTimeMock).toHaveBeenCalledTimes(1)
    expect(isRecordMock).toHaveBeenCalledTimes(1)
  })

  it('should return false with a record that has a type with unknown value', () => {
    isRecordMock.mockReturnValue(true)
    isBaseTimeMock.mockReturnValue(true)
    const testedValue = {
      ...wellFormedValue,
      type: 'wtf-is-this-type'
    }
    const test = isBaseDatum(testedValue)
    expect(test).toEqual(false)
    expect(isBaseTimeMock).toHaveBeenCalledTimes(1)
    expect(isRecordMock).toHaveBeenCalledTimes(1)
  })

  it('should return false with an record that has a source with the wrong type', () => {
    isRecordMock.mockReturnValue(true)
    const testedValue = {
      ...wellFormedValue,
      source: 10
    }
    const test = isBaseDatum(testedValue)
    expect(test).toEqual(false)
  })

  it('should return false with an record that has a source with unknown value', () => {
    isRecordMock.mockReturnValue(true)
    const testedValue = {
      ...wellFormedValue,
      source: 'unknown'
    }
    const test = isBaseDatum(testedValue)
    expect(test).toEqual(false)
  })
})
