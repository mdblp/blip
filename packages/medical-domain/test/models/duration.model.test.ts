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

import { isDuration } from '../../src/domains/models/medical/datum/basics/duration.model'
import * as typeguardUtils from '../../src/domains/utils/typeguard.utils'
import DurationUnit from '../../src/domains/models/medical/datum/enums/duration-unit.enum'

const isRecordMock = jest.spyOn(typeguardUtils, 'isRecord')

const wellFormedValue = {
  duration: {
    units: DurationUnit.Minutes,
    value: 200
  },
  normalEnd: '2023-03-01T00:00:00Z',
  epochEnd: 0
}

describe('isDuration', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should return true with a record with all required keys/types', () => {
    isRecordMock.mockReturnValue(true)
    for (const durationUnit of Object.values(DurationUnit)) {
      const test = isDuration({
        ...wellFormedValue,
        duration: {
          ...wellFormedValue.duration,
          units: durationUnit
        }
      })
      expect(test).toEqual(true)
    }
    expect(isRecordMock).toHaveBeenCalledTimes(Object.keys(DurationUnit).length * 2)
  })

  it('should return false with an object that is not a record', () => {
    isRecordMock.mockReturnValue(false)
    const testedValue = {}
    const test = isDuration(testedValue)
    expect(test).toEqual(false)
    expect(isRecordMock).toHaveBeenCalledTimes(1)
  })

  it('should return false with a record that has an duration that is not a record', () => {
    isRecordMock.mockReturnValueOnce(true).mockReturnValue(false)
    const testedValue = {}
    const test = isDuration(testedValue)
    expect(test).toEqual(false)
    expect(isRecordMock).toHaveBeenCalledTimes(2)
  })

  it('should return false with a record that has a duration unit with the wrong type', () => {
    isRecordMock.mockReturnValue(true)
    const testedValue = {
      ...wellFormedValue,
      duration: {
        units: true,
        value: 200
      }
    }
    const test = isDuration(testedValue)
    expect(test).toEqual(false)
    expect(isRecordMock).toHaveBeenCalledTimes(2)
  })

  it('should return false with a record that has a duration unit with unknown value', () => {
    isRecordMock.mockReturnValue(true)
    const testedValue = {
      ...wellFormedValue,
      duration: {
        units: 'kilograms',
        value: 200
      }
    }
    const test = isDuration(testedValue)
    expect(test).toEqual(false)
    expect(isRecordMock).toHaveBeenCalledTimes(2)
  })

  it('should return false with a record that has a duration value with the wrong type', () => {
    isRecordMock.mockReturnValue(true)
    const testedValue = {
      ...wellFormedValue,
      duration: {
        units: wellFormedValue.duration.units,
        value: '200'
      }
    }
    const test = isDuration(testedValue)
    expect(test).toEqual(false)
    expect(isRecordMock).toHaveBeenCalledTimes(2)
  })

  it('should return false with a record that has a normalEnd with the wrong type', () => {
    isRecordMock.mockReturnValue(true)
    const testedValue = {
      ...wellFormedValue,
      normalEnd: 0
    }
    const test = isDuration(testedValue)
    expect(test).toEqual(false)
    expect(isRecordMock).toHaveBeenCalledTimes(2)
  })

  it('should return false with a record that has an epochEnd with the wrong type', () => {
    isRecordMock.mockReturnValue(true)
    const testedValue = {
      ...wellFormedValue,
      epochEnd: '0'
    }
    const test = isDuration(testedValue)
    expect(test).toEqual(false)
    expect(isRecordMock).toHaveBeenCalledTimes(2)
  })
})
