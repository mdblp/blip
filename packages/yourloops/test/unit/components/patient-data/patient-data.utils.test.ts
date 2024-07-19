/*
 * Copyright (c) 2023-2024, Diabeloop
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

import { isValidDateQueryParam, PatientDataUtils } from '../../../../components/patient-data/patient-data.utils'
import { createPatient } from '../../common/utils'
import MedicalDataService, { TimeService, Unit } from 'medical-domain'
import DataApi from '../../../../lib/data/data.api'
import { dataRangeMock, patientDataMock } from './patient-data.mock'
import PartialDataLoad from 'blip/app/core/lib/partial-data-load'
import { PatientView } from '../../../../enum/patient-view.enum'
import { medicalServiceResult, mockdataFromApi } from './data.mock'

function createNewPatientDataUtils(): PatientDataUtils {
  return new PatientDataUtils({
    patient: createPatient(),
    timePrefs: { timezoneAware: true, timezoneName: 'Europe/Paris' },
    bgUnits: Unit.MilligramPerDeciliter
  })
}

describe('Patient data utils', () => {
  describe('isValidDateQueryParam function', () => {
    it('should return true if queryParam is a valid date and false if not', () => {
      const validDate = '2023-05-08T10:00:00.000Z'
      const wrongDate = 'this-is-not-a-date'
      expect(isValidDateQueryParam(validDate)).toBeTruthy()
      expect(isValidDateQueryParam(wrongDate)).toBeFalsy()
    })
  })

  describe('PatientDataUtils class', () => {
    jest.spyOn(DataApi, 'getPatientDataRange').mockResolvedValue(dataRangeMock)
    jest.spyOn(DataApi, 'getPatientData').mockResolvedValue(patientDataMock)

    describe('Class instance', () => {
      it('should create a new instance of PatientDataUtils', () => {
        const patientDataUtils = createNewPatientDataUtils()
        expect(patientDataUtils instanceof PatientDataUtils).toBeTruthy()
        expect(patientDataUtils.partialDataLoad).toBeUndefined()
      })
    })

    describe('retrievePatientData', () => {
      it('should return null if patient has no data range', async () => {
        jest.spyOn(DataApi, 'getPatientDataRange').mockResolvedValueOnce(null)
        const patientDataUtils = createNewPatientDataUtils()
        const patientData = await patientDataUtils.retrievePatientData()
        expect(patientData).toBeNull()
        expect(patientDataUtils.partialDataLoad instanceof PartialDataLoad).toBeFalsy()
      })
      it('should retrieve patient data', async () => {
        const data = { is: 'this', test: 'really', useful: '?' }
        jest.spyOn(DataApi, 'getPatientData').mockResolvedValueOnce(data)
        const patientDataUtils = createNewPatientDataUtils()
        const patientData = await patientDataUtils.retrievePatientData()
        expect(patientData).toEqual(data)
        expect(patientDataUtils.partialDataLoad instanceof PartialDataLoad).toBeTruthy()
      })
    })

    describe('buildMedicalData', () => {
      it('should build and return medical data service instance', async () => {
        const patientDataUtils = createNewPatientDataUtils()
        await patientDataUtils.retrievePatientData()
        const medicalData = patientDataUtils.buildMedicalData(mockdataFromApi)
        expect(medicalData instanceof MedicalDataService).toBeTruthy()
        expect(medicalData.medicalData).toEqual(medicalServiceResult)
        expect(Object.keys(medicalData.medicalData).length).toEqual(16)
      })
    })

    describe('getDateRange', () => {
      it('should returns start and end date', async () => {
        const patientDataUtils = createNewPatientDataUtils()
        await patientDataUtils.retrievePatientData()
        const trendsDateRange = patientDataUtils.getDateRange({
          currentPatientView: PatientView.Trends,
          epochLocation: new Date('2023-04-01T00:00:00.000Z').getTime(),
          msRange: TimeService.MS_IN_DAY
        })
        const dailyDateRange = patientDataUtils.getDateRange({
          currentPatientView: PatientView.Trends,
          epochLocation: new Date('2023-03-01T00:00:00.000Z').getTime(),
          msRange: TimeService.MS_IN_DAY
        })

        expect(trendsDateRange.start.toISOString()).toEqual('2023-03-31T00:00:00.000Z')
        expect(trendsDateRange.end.toISOString()).toEqual('2023-04-02T00:00:00.000Z')
        expect(dailyDateRange.start.toISOString()).toEqual('2023-02-28T00:00:00.000Z')
        expect(dailyDateRange.end.toISOString()).toEqual('2023-03-02T00:00:00.000Z')
      })
    })

    describe('getInitialDate', () => {
      it('should return the latest data date if it is before today\'s date', () => {
        const patientDataUtils = createNewPatientDataUtils()
        const medicalData = { endpoints: ['2022-01-01', '2022-01-10'] }
        const latestDataTimestamp = 1641729600000
        expect(patientDataUtils.getInitialDate(medicalData as MedicalDataService)).toEqual(latestDataTimestamp)
      })

      it('should return today\'s date if the latest data date is in the future', () => {
        const patientDataUtils = createNewPatientDataUtils()
        const medicalData = { endpoints: ['2072-01-01', '2072-01-10'] }
        const latestDataTimestamp = 3219566400000
        expect(patientDataUtils.getInitialDate(medicalData as MedicalDataService)).not.toEqual(latestDataTimestamp)
      })
    })
  })
})
