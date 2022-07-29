'use strict'

import DatumService from '../src/domains/repositories/medical/DatumService'
import { defaultDatumOptions } from '../src/domains/models/medical/DatumOptions'
import BasalService from '../src/domains/repositories/medical/datum/BasalService'
import BolusService from '../src/domains/repositories/medical/datum/BolusService'
import CbgService from '../src/domains/repositories/medical/datum/CbgService'
import ConfidentialModeService from '../src/domains/repositories/medical/datum/ConfidentialModeService'
import DeviceParameterChangeService from '../src/domains/repositories/medical/datum/DeviceParameterChangeService'
import MealService from '../src/domains/repositories/medical/datum/MealService'
import PhysicalActivityService from '../src/domains/repositories/medical/datum/PhysicalActivityService'
import PumpSettingsService from '../src/domains/repositories/medical/datum/PumpSettingsService'
import ReservoirChangeService from '../src/domains/repositories/medical/datum/ReservoirChangeService'
import WizardService from '../src/domains/repositories/medical/datum/WizardService'
import UploadService from '../src/domains/repositories/medical/datum/UploadService'
import ZenModeService from '../src/domains/repositories/medical/datum/ZenModeService'
import Datum from '../src/domains/models/medical/Datum'
import ReservoirChange from '../src/domains/models/medical/datum/ReservoirChange'

const knownTypes = [
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
    data: { type: 'physicalActivity' },
    service: PhysicalActivityService
  },
  {
    data: { type: 'pumpSettings' },
    service: PumpSettingsService
  },
  {
    data: { type: 'upload' },
    service: UploadService
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
  }
]

const testNormalizeOk = (data, normalizeService) => {
  const correctType = {
    ...data
  }
  const serviceMock = jest.fn()
  serviceMock.mockReturnValue({ ...data, mockedData: 'mocked' })
  normalizeService.normalize = serviceMock
  const res = DatumService.normalize(correctType, defaultDatumOptions)
  expect(normalizeService.normalize).toHaveBeenCalledWith(correctType, defaultDatumOptions)
  expect(res).toEqual({ ...data, mockedData: 'mocked' })
}

const testNormalizeKo = (data, normalizeService) => {
  const correctType = {
    ...data
  }
  const serviceMock = jest.fn()
  serviceMock.mockImplementation(() => {
    throw new Error('Service error')
  })
  normalizeService.normalize = serviceMock
  expect(() => DatumService.normalize(correctType, defaultDatumOptions)).toThrow('Service error')
  expect(normalizeService.normalize).toHaveBeenCalledWith(correctType, defaultDatumOptions)
}

const testNormalizeTypeKo = (data, errorMessage) => {
  const correctType = {
    ...data
  }
  expect(() => DatumService.normalize(correctType, defaultDatumOptions)).toThrow(errorMessage)
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
    const testData: Datum[] = [
      { id: '1', type: 'deviceEvent', source: '', subType: 'reservoirChange', uploadId: '1' } as ReservoirChange,
      { id: '1', type: 'deviceEvent', source: '', subType: 'reservoirChange', uploadId: '2' } as ReservoirChange,
      { id: '2', type: 'deviceEvent', source: '', subType: 'reservoirChange', uploadId: '1' } as ReservoirChange
    ]
    const dedup = DatumService.deduplicate(testData, defaultDatumOptions)
    expect(dedup.length).toEqual(2)
    expect(dedup).toEqual([
      { id: '1', type: 'deviceEvent', source: '', subType: 'reservoirChange', uploadId: '1' } as ReservoirChange,
      { id: '2', type: 'deviceEvent', source: '', subType: 'reservoirChange', uploadId: '1' } as ReservoirChange
    ])
  })
})
