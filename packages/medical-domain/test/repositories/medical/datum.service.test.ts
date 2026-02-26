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

'use strict'

import DatumService from '../../../src/domains/repositories/medical/datum.service'
import { defaultMedicalDataOptions } from '../../../src/domains/models/medical/medical-data-options.model'
import BasalService from '../../../src/domains/repositories/medical/datum/basal.service'
import BolusService from '../../../src/domains/repositories/medical/datum/bolus.service'
import CbgService from '../../../src/domains/repositories/medical/datum/cbg.service'
import ConfidentialModeService from '../../../src/domains/repositories/medical/datum/confidential-mode.service'
import DeviceParameterChangeService from '../../../src/domains/repositories/medical/datum/device-parameter-change.service'
import MealService from '../../../src/domains/repositories/medical/datum/meal.service'
import MessageService from '../../../src/domains/repositories/medical/datum/message.service'
import PumpSettingsService from '../../../src/domains/repositories/medical/datum/pump-settings.service'
import ReservoirChangeService from '../../../src/domains/repositories/medical/datum/reservoir-change.service'
import SmbgService from '../../../src/domains/repositories/medical/datum/smbg.service'
import WarmUpService from '../../../src/domains/repositories/medical/datum/warm-up.service'
import WizardService from '../../../src/domains/repositories/medical/datum/wizard.service'
import ZenModeService from '../../../src/domains/repositories/medical/datum/zen-mode.service'
import { type DatumProcessor } from '../../../src/domains/models/medical/datum.model'
import type Datum from '../../../src/domains/models/medical/datum.model'
import { createRandomBasal, createRandomCbg, createRandomConfidentialMode, createRandomPhysicalActivity, createRandomReservoirChange, createRandomSmbg, createRandomWarmUp, createRandomZenMode } from '../../data-generator'
import { defaultWeekDaysFilter } from '../../../src/domains/models/time/date-filter.model'
import WeekDays from '../../../src/domains/models/time/enum/weekdays.enum'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const knownTypes: Array<{ data: Record<string, unknown>, service: DatumProcessor<any> }> = [
  {
    data: { type: 'basal' },
    service: BasalService
  },
  {
    data: { type: 'bolus' },
    service: BolusService
  },
  {
    data: { type: 'cbg' },
    service: CbgService
  },
  {
    data: { type: 'food' },
    service: MealService
  },
  {
    data: { type: 'message' },
    service: MessageService
  },
  {
    data: { type: 'pumpSettings' },
    service: PumpSettingsService
  },
  {
    data: { type: 'smbg' },
    service: SmbgService
  },
  {
    data: { type: 'wizard' },
    service: WizardService
  },
  {
    data: { type: 'deviceEvent', subType: 'confidential' },
    service: ConfidentialModeService
  },
  {
    data: { type: 'deviceEvent', subType: 'deviceParameter' },
    service: DeviceParameterChangeService
  },
  {
    data: { type: 'deviceEvent', subType: 'reservoirChange' },
    service: ReservoirChangeService
  },
  {
    data: { type: 'deviceEvent', subType: 'zen' },
    service: ZenModeService
  },
  {
    data: { type: 'deviceEvent', subType: 'warmup' },
    service: WarmUpService
  }
]

const testNormalizeOk = (data: Record<string, unknown>, normalizeService: DatumProcessor<Datum>) => {
  const correctType = {
    ...data
  }
  const serviceMock = jest.fn()
  serviceMock.mockReturnValue({ ...data, mockedData: 'mocked' })
  normalizeService.normalize = serviceMock
  const res = DatumService.normalize(correctType, defaultMedicalDataOptions)
  expect(normalizeService.normalize).toHaveBeenCalledWith(correctType, defaultMedicalDataOptions)
  expect(res).toEqual({ ...data, mockedData: 'mocked' })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const testNormalizeKo = (data: Record<string, unknown>, normalizeService: DatumProcessor<any>) => {
  const correctType = {
    ...data
  }
  const serviceMock = jest.fn()
  serviceMock.mockImplementation(() => {
    throw new Error('Service error')
  })
  normalizeService.normalize = serviceMock
  expect(() => DatumService.normalize(correctType, defaultMedicalDataOptions)).toThrow('Service error')
  expect(normalizeService.normalize).toHaveBeenCalledWith(correctType, defaultMedicalDataOptions)
}

const testNormalizeTypeKo = (data: Record<string, unknown>, errorMessage: string) => {
  const correctType = {
    ...data
  }
  expect(() => DatumService.normalize(correctType, defaultMedicalDataOptions)).toThrow(errorMessage)
}

describe('DatumService', () => {
  it('should normalize with known types/subTypes', () => {
    for (const testCase of knownTypes) {
      testNormalizeOk(testCase.data, testCase.service)
    }
  })
  it('should propagate errors on normalize with known types/subTypes', () => {
    for (const testCase of knownTypes) {
      testNormalizeKo(testCase.data, testCase.service)
    }
  })
  it('should throw an error on normalize with unknown types/subTypes', () => {
    const unknownTypes = [
      {
        data: { type: 'unknown' },
        error: 'Unknown datum type unknown'
      },
      {
        data: { type: 'deviceEvent', subType: 'unknown' },
        error: 'Unknown deviceEvent subType unknown'
      }
    ]
    for (const testCase of unknownTypes) {
      testNormalizeTypeKo(testCase.data, testCase.error)
    }
  })
  it('should deduplicate based on id', () => {
    const reservoirChange1 = { ...createRandomReservoirChange(), id: '1' }
    const reservoirChange2 = { ...createRandomReservoirChange(), id: '2' }
    const testData: Datum[] = [reservoirChange1, reservoirChange1, reservoirChange2]

    const dedup = DatumService.deduplicate(testData, defaultMedicalDataOptions)
    expect(dedup.length).toEqual(2)
    expect(dedup).toEqual([
      reservoirChange1,
      reservoirChange2
    ])
  })

  it('should filter on dates without week days filter', () => {
    const filterDate1 = new Date('2023-03-01T00:00:00.000Z')
    const filterDate2 = new Date('2023-03-02T00:00:00.000Z')
    const date2 = new Date(filterDate2)
    date2.setSeconds(-1)
    const date3 = new Date('2023-03-03T00:00:00.000Z')
    const reservoirChange1 = createRandomReservoirChange(filterDate1)
    const reservoirChange2 = createRandomReservoirChange(date2)
    const reservoirChange3 = createRandomReservoirChange(date3)
    const testData: Datum[] = [reservoirChange1, reservoirChange2, reservoirChange3]

    const filteredData = DatumService.filterOnDate(testData, filterDate1.valueOf(), filterDate2.valueOf(), defaultWeekDaysFilter)
    expect(filteredData.length).toEqual(2)
    expect(filteredData).toEqual([
      reservoirChange1,
      reservoirChange2
    ])
  })
  it('should filter on dates with week days filter for all types where isoWeekDay is provided', () => {
    const filterDate1 = new Date('2023-03-01T00:00:00.000Z') // local wednesday
    const filterDate2 = new Date('2023-03-02T00:00:00.000Z') // local thursday
    const date2 = new Date(filterDate2)
    date2.setSeconds(-1) // still local thursday (due to timezone offset)
    const date3 = new Date('2023-03-03T00:00:00.000Z') // local friday=
    const reservoirChange1 = createRandomReservoirChange(filterDate1)
    const reservoirChange2 = createRandomReservoirChange(date2)
    const reservoirChange3 = createRandomReservoirChange(date3)
    const cbg1 = createRandomCbg(filterDate1)
    const cbg2 = createRandomCbg(date2)
    const cbg3 = createRandomCbg(date3)
    const smbg1 = createRandomSmbg(filterDate1)
    const smbg2 = createRandomSmbg(date2)
    const smbg3 = createRandomSmbg(date3)

    const testData: Datum[] = [
      reservoirChange1, reservoirChange2, reservoirChange3,
      cbg1, cbg2, cbg3, smbg1, smbg2, smbg3
    ]

    const weekDaysFilter = { ...defaultWeekDaysFilter, [WeekDays.Wednesday]: false }
    const filteredData = DatumService.filterOnDate(testData, filterDate1.valueOf(), filterDate2.valueOf(), weekDaysFilter)
    expect(filteredData.length).toEqual(3)
    expect(filteredData).toEqual([reservoirChange2,
      cbg2, smbg2
    ])
  })

  it('should filter on start and end dates for types with duration or basals', () => {
    const filterDate1 = new Date('2023-03-01T00:00:00.000Z')
    const filterDate2 = new Date('2023-03-02T00:00:00.000Z')

    const date1 = new Date(filterDate1)
    date1.setSeconds(-30)
    const date2 = new Date(filterDate2)
    date2.setSeconds(-1)
    const date3 = new Date('2023-03-03T00:00:00.000Z')

    const basal1 = createRandomBasal(date1)
    const basal2 = createRandomBasal(date2)
    const basal3 = createRandomBasal(date3)
    const confidential1 = createRandomConfidentialMode(date1)
    const confidential2 = createRandomConfidentialMode(date2)
    const confidential3 = createRandomConfidentialMode(date3)
    const physical1 = createRandomPhysicalActivity(date1)
    const physical2 = createRandomPhysicalActivity(date2)
    const physical3 = createRandomPhysicalActivity(date3)
    const warmup1 = createRandomWarmUp(date1)
    const warmup2 = createRandomWarmUp(date2)
    const warmup3 = createRandomWarmUp(date3)
    const zen1 = createRandomZenMode(date1)
    const zen2 = createRandomZenMode(date2)
    const zen3 = createRandomZenMode(date3)

    const testData: Datum[] = [
      basal1, basal2, basal3,
      confidential1, confidential2, confidential3,
      physical1, physical2, physical3,
      warmup1, warmup2, warmup3,
      zen1, zen2, zen3
    ]

    const filteredData = DatumService.filterOnDate(testData, filterDate1.valueOf(), filterDate2.valueOf(), defaultWeekDaysFilter)
    expect(filteredData.length).toEqual(10)
    expect(filteredData).toEqual([
      basal1, basal2,
      confidential1, confidential2,
      physical1, physical2,
      warmup1, warmup2,
      zen1, zen2
    ])
  })
  it('should filter on week days as required', () => {
    const ignoreThursdays = { ...defaultWeekDaysFilter, [WeekDays.Thursday]: false }
    const filterDate1 = new Date('2023-03-01T00:00:00.000Z')
    const filterDate2 = new Date('2023-03-02T00:00:00.000Z')

    const date1 = new Date(filterDate1)
    date1.setSeconds(-30)
    const date2 = new Date(filterDate2)
    date2.setSeconds(-1)
    const date3 = new Date('2023-03-03T00:00:00.000Z')

    const basal1 = createRandomBasal(date1)
    const basal2 = createRandomBasal(date2)
    const basal3 = createRandomBasal(date3)
    const confidential1 = createRandomConfidentialMode(date1)
    const confidential2 = createRandomConfidentialMode(date2)
    const confidential3 = createRandomConfidentialMode(date3)
    const physical1 = createRandomPhysicalActivity(date1)
    const physical2 = createRandomPhysicalActivity(date2)
    const physical3 = createRandomPhysicalActivity(date3)
    const warmup1 = createRandomWarmUp(date1)
    const warmup2 = createRandomWarmUp(date2)
    const warmup3 = createRandomWarmUp(date3)
    const zen1 = createRandomZenMode(date1)
    const zen2 = createRandomZenMode(date2)
    const zen3 = createRandomZenMode(date3)

    const testData: Datum[] = [
      basal1, basal2, basal3,
      confidential1, confidential2, confidential3,
      physical1, physical2, physical3,
      warmup1, warmup2, warmup3,
      zen1, zen2, zen3
    ]

    const filteredData = DatumService.filterOnDate(testData, filterDate1.valueOf(), filterDate2.valueOf(), ignoreThursdays)
    expect(filteredData.length).toEqual(5)
    expect(filteredData).toEqual([
      basal1,
      confidential1,
      physical1,
      warmup1,
      zen1
    ])
  })
  it('should not filter objects where isoWeekDay is not provided', () => {
    const ignoreThursdays = { ...defaultWeekDaysFilter, [WeekDays.Thursday]: false }
    const filterDate1 = new Date('2023-03-01T00:00:00.000Z')
    const filterDate2 = new Date('2023-03-02T00:00:00.000Z')

    const date1 = new Date(filterDate1)
    date1.setSeconds(-30)
    const date2 = new Date(filterDate2)
    date2.setSeconds(-1)

    const basal1 = createRandomBasal(date1)
    const basal2 = createRandomBasal(date2)
    basal2.isoWeekday = undefined

    const testData: Datum[] = [
      basal1, basal2
    ]

    const filteredData = DatumService.filterOnDate(testData, filterDate1.valueOf(), filterDate2.valueOf(), ignoreThursdays)
    expect(filteredData.length).toEqual(2)
    expect(filteredData).toEqual([
      basal1, basal2
    ])
  })
})
