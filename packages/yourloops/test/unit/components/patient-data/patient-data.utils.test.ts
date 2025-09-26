/*
 * Copyright (c) 2023-2025, Diabeloop
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

import { isValidDateQueryParam, PatientDataUtils, convertIfNeeded } from '../../../../components/patient-data/patient-data.utils'
import { createPatient } from '../../common/utils'
import MedicalDataService, { TimeService, Unit } from 'medical-domain'
import DataApi from '../../../../lib/data/data.api'
import { dataRangeMock, patientDataMock } from './patient-data.mock'
import PartialDataLoad from 'blip/app/core/lib/partial-data-load'
import { PatientView } from '../../../../enum/patient-view.enum'
import { medicalServiceResult, mockdataFromApi } from './data.mock'
import { BgPrefs } from 'dumb'

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
        expect(Object.keys(medicalData.medicalData).length).toEqual(17)
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


    describe('convertIfNeeded', () => {
      const mockBgPrefsInMgdl: BgPrefs = {
        bgUnits: Unit.MilligramPerDeciliter,
        bgClasses: {
          veryLow: 54,
          low: 70,
          target: 180,
          high: 250,
          veryHigh: 400
        },
        bgBounds: {
          veryHighThreshold: 400,
          targetUpperBound: 180,
          targetLowerBound: 70,
          veryLowThreshold: 54
        }
      }

      const mockBgPrefsInMmol: BgPrefs = {
        bgUnits: Unit.MmolPerLiter,
        bgClasses: {
          veryLow: 3.0,
          low: 3.9,
          target: 10.0,
          high: 13.9,
          veryHigh: 22.2
        },
        bgBounds: {
          veryHighThreshold: 22.2,
          targetUpperBound: 10.0,
          targetLowerBound: 3.9,
          veryLowThreshold: 3.0
        }
      }

      it('should return the same preferences when no conversion is needed', () => {
        const result = convertIfNeeded(mockBgPrefsInMgdl, Unit.MilligramPerDeciliter)
        expect(result).toBe(mockBgPrefsInMgdl)
      })

      it('should convert from mg/dL to mmol/L', () => {
        const result = convertIfNeeded(mockBgPrefsInMgdl, Unit.MmolPerLiter)

        expect(result.bgUnits).toBe(Unit.MmolPerLiter)
        expect(result.bgClasses.veryLow).toBeCloseTo(3.0, 1)
        expect(result.bgClasses.low).toBeCloseTo(3.9, 1)
        expect(result.bgClasses.target).toBeCloseTo(10.0, 1)
        expect(result.bgClasses.high).toBeCloseTo(13.9, 1)
        expect(result.bgClasses.veryHigh).toBeCloseTo(22.2, 1)

        expect(result.bgBounds.veryLowThreshold).toBeCloseTo(3.0, 1)
        expect(result.bgBounds.targetLowerBound).toBeCloseTo(3.9, 1)
        expect(result.bgBounds.targetUpperBound).toBeCloseTo(10.0, 1)
        expect(result.bgBounds.veryHighThreshold).toBeCloseTo(22.2, 1)
      })

      it('should convert from mmol/L to mg/dL', () => {
        const result = convertIfNeeded(mockBgPrefsInMmol, Unit.MilligramPerDeciliter)

        expect(result.bgUnits).toBe(Unit.MilligramPerDeciliter)
        expect(result.bgClasses.veryLow).toBe(54)
        expect(result.bgClasses.low).toBe(70)
        expect(result.bgClasses.target).toBe(180)
        expect(result.bgClasses.high).toBe(250)
        expect(result.bgClasses.veryHigh).toBe(400)

        expect(result.bgBounds.veryLowThreshold).toBe(54)
        expect(result.bgBounds.targetLowerBound).toBe(70)
        expect(result.bgBounds.targetUpperBound).toBe(180)
        expect(result.bgBounds.veryHighThreshold).toBe(400)
      })

      it('should handle null bloodGlucosePreference', () => {
        const result = convertIfNeeded(null, Unit.MilligramPerDeciliter)
        expect(result).toBeNull()
      })

      it('should handle edge case values for mg/dL to mmol/L conversion', () => {
        const edgeCasePrefs: BgPrefs = {
          bgUnits: Unit.MilligramPerDeciliter,
          bgClasses: {
            veryLow: 1, //Lower bounds: Test values like 1 mg/dL and 0.1 mmol/L ensure the conversion doesn't produce negative numbers or zero values
            low: 18,
            target: 100,
            high: 500,
            veryHigh: 600
          },
          bgBounds: {
            veryHighThreshold: 600,
            targetUpperBound: 100,
            targetLowerBound: 18,
            veryLowThreshold: 1
          }
        }

        const result = convertIfNeeded(edgeCasePrefs, Unit.MmolPerLiter)
        console.log(result)
        expect(result.bgUnits).toBe(Unit.MmolPerLiter)
        expect(result.bgClasses.veryLow).toBe(0.1)
        expect(result.bgClasses.low).toBe(1)
        expect(result.bgBounds.veryLowThreshold).toBe(0.1)
        expect(result.bgBounds.targetLowerBound).toBe(1)
      })

      it('should handle edge case values for mmol/L to mg/dL conversion', () => {
        const edgeCasePrefs: BgPrefs = {
          bgUnits: Unit.MmolPerLiter,
          bgClasses: {
            veryLow: 0.1,
            low: 1.0,
            target: 5.5,
            high: 25.0,
            veryHigh: 30.0
          },
          bgBounds: {
            veryHighThreshold: 30.0,
            targetUpperBound: 5.5,
            targetLowerBound: 1.0,
            veryLowThreshold: 0.1
          }
        }

        const result = convertIfNeeded(edgeCasePrefs, Unit.MilligramPerDeciliter)
        expect(result.bgUnits).toBe(Unit.MilligramPerDeciliter)
        expect(result.bgClasses.veryLow).toBe(2)
        expect(result.bgClasses.low).toBe(18)
        expect(result.bgBounds.veryLowThreshold).toBe(2)
        expect(result.bgBounds.targetLowerBound).toBe(18)
      })
    })
  })
})
