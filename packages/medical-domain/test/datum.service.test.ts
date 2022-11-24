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

'use strict'

import DatumService from '../src/domains/repositories/medical/datum.service'
import { defaultMedicalDataOptions } from '../src/domains/models/medical/medical-data-options.model'
import BasalService from '../src/domains/repositories/medical/datum/basal.service'
import BolusService from '../src/domains/repositories/medical/datum/bolus.service'
import CbgService from '../src/domains/repositories/medical/datum/cbg.service'
import ConfidentialModeService from '../src/domains/repositories/medical/datum/confidential-mode.service'
import DeviceParameterChangeService from '../src/domains/repositories/medical/datum/device-parameter-change.service'
import MealService from '../src/domains/repositories/medical/datum/meal.service'
import MessageService from '../src/domains/repositories/medical/datum/message.service'
import PhysicalActivityService from '../src/domains/repositories/medical/datum/physical-activity.service'
import PumpSettingsService from '../src/domains/repositories/medical/datum/pump-settings.service'
import ReservoirChangeService from '../src/domains/repositories/medical/datum/reservoir-change.service'
import SmbgService from '../src/domains/repositories/medical/datum/smbg.service'
import WarmUpService from '../src/domains/repositories/medical/datum/warm-up.service'
import WizardService from '../src/domains/repositories/medical/datum/wizard.service'
import UploadService from '../src/domains/repositories/medical/datum/upload.service'
import ZenModeService from '../src/domains/repositories/medical/datum/zen-mode.service'
import Datum, { DatumProcessor } from '../src/domains/models/medical/datum.model'
import ReservoirChange from '../src/domains/models/medical/datum/reservoir-change.model'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const knownTypes: Array<{data: Record<string, unknown>, service: DatumProcessor<any>}> = [
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
    data: { type: 'physicalActivity' },
    service: PhysicalActivityService
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
    const testData: Datum[] = [
      { id: '1', type: 'deviceEvent', source: '', subType: 'reservoirChange', uploadId: '1' } as ReservoirChange,
      { id: '1', type: 'deviceEvent', source: '', subType: 'reservoirChange', uploadId: '2' } as ReservoirChange,
      { id: '2', type: 'deviceEvent', source: '', subType: 'reservoirChange', uploadId: '1' } as ReservoirChange
    ]
    const dedup = DatumService.deduplicate(testData, defaultMedicalDataOptions)
    expect(dedup.length).toEqual(2)
    expect(dedup).toEqual([
      { id: '1', type: 'deviceEvent', source: '', subType: 'reservoirChange', uploadId: '1' } as ReservoirChange,
      { id: '2', type: 'deviceEvent', source: '', subType: 'reservoirChange', uploadId: '1' } as ReservoirChange
    ])
  })
})
