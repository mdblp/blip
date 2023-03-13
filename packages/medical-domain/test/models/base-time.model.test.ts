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

import { isBaseTime } from '../../src/domains/models/medical/datum/basics/base-time.model'
import * as typeguardUtils from '../../src/domains/utils/typeguard.utils'

const isRecordMock = jest.spyOn(typeguardUtils, 'isRecord')
const wellFormedValue = {
  timezone: 'Europe/Paris',
  normalTime: '2023-03-01T00:00:00Z',
  epoch: 0,
  displayOffset: 0,
  guessedTimezone: false
}

describe('isBaseTime', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should return true with a record with all required keys/types', () => {
    isRecordMock.mockReturnValue(true)
    const test = isBaseTime(wellFormedValue)
    expect(test).toEqual(true)
    expect(isRecordMock).toHaveBeenCalledTimes(1)
  })

  it('should return false with an object that is not a record', () => {
    isRecordMock.mockReturnValue(false)
    const testedValue = {}
    const test = isBaseTime(testedValue)
    expect(test).toEqual(false)
    expect(isRecordMock).toHaveBeenCalledTimes(1)
  })

  it('should return false with a record that has a timezone with the wrong type', () => {
    isRecordMock.mockReturnValue(true)
    const testedValue = {
      ...wellFormedValue,
      timezone: 0
    }
    const test = isBaseTime(testedValue)
    expect(test).toEqual(false)
    expect(isRecordMock).toHaveBeenCalledTimes(1)
  })

  it('should return false with an record that has a normalTime with the wrong type', () => {
    isRecordMock.mockReturnValue(true)
    const testedValue = {
      ...wellFormedValue,
      normalTime: 0
    }
    const test = isBaseTime(testedValue)
    expect(test).toEqual(false)
    expect(isRecordMock).toHaveBeenCalledTimes(1)
  })

  it('should return false with an record that has an epoch with the wrong type', () => {
    isRecordMock.mockReturnValue(true)
    const testedValue = {
      ...wellFormedValue,
      epoch: '12'
    }
    const test = isBaseTime(testedValue)
    expect(test).toEqual(false)
  })

  it('should return false with an record that has a displayOffset with the wrong type', () => {
    isRecordMock.mockReturnValue(true)
    const testedValue = {
      ...wellFormedValue,
      displayOffset: '1'
    }
    const test = isBaseTime(testedValue)
    expect(test).toEqual(false)
  })

  it('should return false with an record that has a guessedTimezone with the wrong type', () => {
    isRecordMock.mockReturnValue(true)
    const testedValue = {
      ...wellFormedValue,
      guessedTimezone: 1
    }
    const test = isBaseTime(testedValue)
    expect(test).toEqual(false)
  })
})
