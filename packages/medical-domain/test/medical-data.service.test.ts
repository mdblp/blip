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

import { faker } from '@faker-js/faker'
import Basal from '../src/domains/models/medical/datum/basal.model'
import Bolus from '../src/domains/models/medical/datum/bolus.model'
import PhysicalActivity from '../src/domains/models/medical/datum/physical-activity.model'
import MedicalData from '../src/domains/models/medical/medical-data.model'
import MedicalDataOptions from '../src/domains/models/medical/medical-data-options.model'
import BasalService from '../src/domains/repositories/medical/datum/basal.service'
import BolusService from '../src/domains/repositories/medical/datum/bolus.service'
import PhysicalActivityService from '../src/domains/repositories/medical/datum/physical-activity.service'
import DatumService from '../src/domains/repositories/medical/datum.service'
import MedicalDataService from '../src/domains/repositories/medical/medical-data.service'
import createRandomDatum from './models/data-generator'
import crypto from 'crypto'

// window.crypto is not defined in jest...
Object.defineProperty(global, 'crypto', {
  value: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRandomValues: (arr: any) => crypto.randomBytes(arr.length)
  }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const knownTypes: Array<Record<string, unknown>> = [
  {
    type: 'basal'
  },
  {
    type: 'bolus'
  },
  {
    type: 'cbg'
  },
  {
    type: 'food'
  },
  {
    type: 'message'
  },
  {
    type: 'physicalActivity'
  },
  {
    type: 'pumpSettings'
  },
  {
    type: 'smbg'
  },
  {
    type: 'upload'
  },
  {
    type: 'wizard'
  },
  {
    type: 'deviceEvent',
    subType: 'confidential'
  },
  {
    type: 'deviceEvent',
    subType: 'deviceParameter'
  },
  {
    type: 'deviceEvent',
    subType: 'reservoirChange'
  },
  {
    type: 'deviceEvent',
    subType: 'zen'
  },
  {
    type: 'deviceEvent',
    subType: 'warmup'
  }
]

const datumNormalizeMock = jest.fn(
  (rawData: Record<string, unknown>, _opts: MedicalDataOptions) => {
    return createRandomDatum(rawData.type as string, rawData.subType as string | undefined)
  }
)

const datumNormalizeTzMock = jest.fn(
  (rawData: Record<string, unknown>, _opts: MedicalDataOptions) => {
    const datum = createRandomDatum(rawData.type as string, rawData.subType as string | undefined)
    if (rawData.type === 'bolus') {
      const pastDate = faker.date.between('2022-08-01T00:00:00.000Z', '2022-08-31T00:00:00.000Z')
      datum.epoch = pastDate.valueOf()
      datum.normalTime = pastDate.toISOString()
      datum.timezone = 'Atlantic/Reykjavik'
      datum.displayOffset = 0
    }
    if (rawData.type === 'basal') {
      const pastDate = faker.date.between('2022-07-01T00:00:00.000Z', '2022-07-31T00:00:00.000Z')
      datum.epoch = pastDate.valueOf()
      datum.normalTime = pastDate.toISOString()
      // DST offset (Summer time)
      datum.displayOffset = -120
    }
    // DST in Europe/Parus is on Sunday, March 27, 2022 at 01:00 GMT
    if (rawData.type === 'cbg') {
      const pastDate = faker.date.between('2022-03-27T00:00:00.001Z', '2022-03-27T00:59:59.999Z')
      datum.epoch = pastDate.valueOf()
      datum.normalTime = pastDate.toISOString()
      // DST offset (Winter time)
      datum.displayOffset = -60
    }

    return datum
  }
)

const basalDeduplicateMock = jest.fn(
  (data: Basal[], _opts: MedicalDataOptions) => {
    return data
  }
)

const bolusDeduplicateMock = jest.fn(
  (data: Bolus[], _opts: MedicalDataOptions) => {
    return data
  }
)

const physicalActivityDeduplicateMock = jest.fn(
  (data: PhysicalActivity[], _opts: MedicalDataOptions) => {
    return data
  }
)

const testMedicalData = (medicalData: MedicalDataService, typeCounts: Record<keyof MedicalData, number>) => {
  Object.keys(typeCounts).forEach((dataType) => {
    const key = dataType as keyof MedicalData
    expect(medicalData.medicalData[key].length).toBe(typeCounts[key])
  })
}

const testEndPoints = (medicalData: MedicalDataService) => {
  expect(medicalData.endpoints.length).toBe(2)
  const rangeStart = new Date(medicalData.endpoints[0])
  const rangeEnd = new Date(medicalData.endpoints[1])
  expect(rangeEnd.valueOf()).toBeGreaterThan(rangeStart.valueOf())
  const allData = medicalData.data.filter(d => !['fill', 'pumpSettings', 'upload'].includes(d.type))
  const outOfRangeData = allData.filter(
    (dat) => {
      const epoch = 'epochEnd' in dat ? dat.epochEnd : dat.epoch
      return epoch < rangeStart.valueOf() || epoch > rangeEnd.valueOf()
    }
  )
  expect(outOfRangeData.length).toBe(0)
}

const testFillData = (medicalData: MedicalDataService) => {
  const rangeStart = new Date(medicalData.endpoints[0])
  const rangeEnd = new Date(medicalData.endpoints[1])
  // By default, we generate one fill object every 3 hours
  const hoursDiff = (rangeEnd.valueOf() - rangeStart.valueOf()) / 1000 / 60 / 60
  expect(medicalData.fills.length).toBeLessThanOrEqual(Math.ceil(hoursDiff / 3) + 2)
  expect(medicalData.fills.length).toBeGreaterThanOrEqual(Math.floor(hoursDiff / 3) - 2)
}

describe('MedicalDataService', () => {
  describe('Add data', () => {
    const medicalData = new MedicalDataService()
    medicalData.opts.dateRange = {
      start: new Date().valueOf(),
      end: new Date().valueOf()
    }
    beforeAll(() => {
      DatumService.normalize = datumNormalizeMock
      BasalService.deduplicate = basalDeduplicateMock
      BolusService.deduplicate = bolusDeduplicateMock
      PhysicalActivityService.deduplicate = physicalActivityDeduplicateMock
    })
    afterEach(() => {
      jest.clearAllMocks()
    })
    it('should add data', () => {
      medicalData.add(knownTypes)

      // normalize is called on each piece of data
      expect(datumNormalizeMock).toHaveBeenCalledTimes(knownTypes.length)
      // basal + bolus + physicalActivity deduplication is called
      expect(basalDeduplicateMock).toHaveBeenCalledTimes(1)
      expect(bolusDeduplicateMock).toHaveBeenCalledTimes(1)
      expect(physicalActivityDeduplicateMock).toHaveBeenCalledTimes(1)

      // Main medicalData Checks (we have on objects of each exept timezones)
      const expectedCount: Partial<Record<keyof MedicalData, number>> = {}
      Object.keys(medicalData.medicalData).forEach(
        (type) => {
          if (type === 'timezoneChanges') {
            expectedCount.timezoneChanges = 0
          } else {
            expectedCount[type as keyof MedicalData] = 1
          }
        }
      )
      testMedicalData(medicalData, expectedCount as Record<keyof MedicalData, number>)
      // All datum have the same timezone -> no timezoneChanges,
      // Only one timezone Europe/Paris (from createRandomDatum)
      expect(medicalData.timezoneList.length).toBe(1)
      expect(medicalData.timezoneList[0]).toStrictEqual({ time: 0, timezone: 'Europe/Paris' })
      // Endpoints checks
      testEndPoints(medicalData)
      // Fill Data checks
      testFillData(medicalData)
    })
    it('should handle mulitple data add', () => {
      medicalData.add(knownTypes)
      // normalize is called on each piece of data
      expect(datumNormalizeMock).toHaveBeenCalledTimes(knownTypes.length)
      // // basal + bolus + physicalActivity deduplication is called
      expect(basalDeduplicateMock).toHaveBeenCalledTimes(1)
      expect(bolusDeduplicateMock).toHaveBeenCalledTimes(1)
      expect(physicalActivityDeduplicateMock).toHaveBeenCalledTimes(1)

      // Main medicalData Checks (we have two objects of each except timezones )
      const expectedCount: Partial<Record<keyof MedicalData, number>> = {}
      Object.keys(medicalData.medicalData).forEach(
        (type) => {
          if (type === 'timezoneChanges') {
            expectedCount.timezoneChanges = 0
          } else {
            expectedCount[type as keyof MedicalData] = 2
          }
        }
      )
      testMedicalData(medicalData, expectedCount as Record<keyof MedicalData, number>)
      // All datum have the same timezone -> no timezoneChanges,
      // Only one timezone Europe/Paris (from createRandomDatum)
      expect(medicalData.timezoneList.length).toBe(1)
      expect(medicalData.timezoneList[0]).toStrictEqual({ time: 0, timezone: 'Europe/Paris' })
      // Endpoints checks
      testEndPoints(medicalData)
      // Fill Data checks
      testFillData(medicalData)
    })
  })
  describe('Timezone detection', () => {
    const medicalData = new MedicalDataService()
    medicalData.opts.dateRange = {
      start: new Date().valueOf(),
      end: new Date().valueOf()
    }
    beforeAll(() => {
      BasalService.deduplicate = basalDeduplicateMock
      BolusService.deduplicate = bolusDeduplicateMock
      PhysicalActivityService.deduplicate = physicalActivityDeduplicateMock
    })

    afterEach(() => {
      jest.clearAllMocks()
    })
    it('should detect timezone changes events', () => {
      DatumService.normalize = datumNormalizeTzMock
      medicalData.add([{ type: 'bolus' }, { type: 'basal' }])
      // normalize is called on each piece of data
      expect(datumNormalizeTzMock).toHaveBeenCalledTimes(2)
      // basal + bolus + physicalActivity deduplication is called
      expect(basalDeduplicateMock).toHaveBeenCalledTimes(1)
      expect(bolusDeduplicateMock).toHaveBeenCalledTimes(1)
      expect(physicalActivityDeduplicateMock).toHaveBeenCalledTimes(1)

      // Main medicalData Checks (we have one objects for timezones, bolus & basal)
      const expectedCount: Partial<Record<keyof MedicalData, number>> = {}
      Object.keys(medicalData.medicalData).forEach(
        (type) => {
          if (['timezoneChanges', 'bolus', 'basal'].includes(type)) {
            expectedCount[type as keyof MedicalData] = 1
          } else {
            expectedCount[type as keyof MedicalData] = 0
          }
        }
      )
      testMedicalData(medicalData, expectedCount as Record<keyof MedicalData, number>)
      // One timezonechange Europe/Paris -> Atlantic/Reykjavik
      expect(medicalData.timezoneList.length).toBe(2)
      expect(medicalData.timezoneList[0]).toStrictEqual({ time: 0, timezone: 'Europe/Paris' })
      const tzChange = medicalData.timezoneList[1]
      expect(tzChange.timezone).toStrictEqual('Atlantic/Reykjavik')
      expect(tzChange.time).toStrictEqual(medicalData.medicalData.bolus[0].epoch)
      // Endpoints checks
      testEndPoints(medicalData)
      // Fill Data checks
      testFillData(medicalData)
    })
    it('should detect DST changes events', () => {
      DatumService.normalize = datumNormalizeTzMock
      medicalData.add([{ type: 'cbg' }, { type: 'cbg' }])
      // normalize is called on each piece of data
      expect(datumNormalizeTzMock).toHaveBeenCalledTimes(2)
      // basal + bolus + physicalActivity deduplication is called
      expect(basalDeduplicateMock).toHaveBeenCalledTimes(1)
      expect(bolusDeduplicateMock).toHaveBeenCalledTimes(1)
      expect(physicalActivityDeduplicateMock).toHaveBeenCalledTimes(1)

      // Main medicalData Checks (we have 2 objects for cbg & timezones, 1 for bolus & basal)
      const expectedCount: Partial<Record<keyof MedicalData, number>> = {}
      Object.keys(medicalData.medicalData).forEach(
        (type) => {
          if (['bolus', 'basal'].includes(type)) {
            expectedCount[type as keyof MedicalData] = 1
          } else if (['timezoneChanges', 'cbg'].includes(type)) {
            expectedCount[type as keyof MedicalData] = 2
          } else {
            expectedCount[type as keyof MedicalData] = 0
          }
        }
      )
      testMedicalData(medicalData, expectedCount as Record<keyof MedicalData, number>)
      // One DST timezonechange + one Europe/Paris -> Atlantic/Reykjavik
      expect(medicalData.timezoneList.length).toBe(3)
      expect(medicalData.timezoneList[0]).toStrictEqual({ time: 0, timezone: 'Europe/Paris' })
      const dstChange = medicalData.timezoneList[1]
      expect(dstChange.time).toStrictEqual(medicalData.medicalData.basal[0].epoch)
      expect(dstChange.timezone).toStrictEqual('Europe/Paris')
      const tzChange = medicalData.timezoneList[2]
      expect(tzChange.timezone).toStrictEqual('Atlantic/Reykjavik')
      expect(tzChange.time).toStrictEqual(medicalData.medicalData.bolus[0].epoch)
      // Endpoints checks
      testEndPoints(medicalData)
      // Fill Data checks
      testFillData(medicalData)
    })
  })
})
