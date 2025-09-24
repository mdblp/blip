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

import DataApi from '../../lib/data/data.api'
import moment, { type Moment } from 'moment-timezone'
import { type Patient } from '../../lib/patient/models/patient.model'
import PartialDataLoad from 'blip/app/core/lib/partial-data-load'
import MedicalDataService, {
  type BgUnit, convertBG,
  type MedicalData,
  Source,
  type TimePrefs,
  TimeService, Unit
} from 'medical-domain'
import config from '../../lib/config/config'
import { PatientView } from '../../enum/patient-view.enum'
import { type GetPatientDataOptions } from '../../lib/data/models/get-patient-data-options.model'
import i18next from 'i18next'
import { BgPrefs, formatBgValue } from 'dumb'

interface GetDatetimeBoundsArgs {
  currentPatientView: PatientView
  epochLocation: number
  msRange: number
}

export interface DateRange {
  start: Moment
  end: Moment
}

const t = i18next.t.bind(i18next)

export function isValidDateQueryParam(queryParam: string): boolean {
  const date = new Date(queryParam)
  return !isNaN(date.getTime())
}

const convertAndFormatBgValue = (value: number, currentUnit: BgUnit): number => {
  const newUnit = currentUnit === Unit.MilligramPerDeciliter ? Unit.MmolPerLiter : Unit.MilligramPerDeciliter
  const formattedValueString = formatBgValue(convertBG(value, currentUnit), newUnit)

  return newUnit === Unit.MilligramPerDeciliter ? parseInt(formattedValueString) : parseFloat(formattedValueString)
}

export const convertIfNeeded = (bloodGlucosePreference: BgPrefs | null, requiredUnit: BgUnit): BgPrefs => {
  if (bloodGlucosePreference != null &&  bloodGlucosePreference?.bgUnits != requiredUnit) {
    const currentUnit = bloodGlucosePreference?.bgUnits
    return {
        bgUnits: requiredUnit,
        bgClasses: {
          veryLow: convertAndFormatBgValue(bloodGlucosePreference.bgClasses.veryLow, currentUnit),
          low: convertAndFormatBgValue(bloodGlucosePreference.bgClasses.low, currentUnit),
          target: convertAndFormatBgValue(bloodGlucosePreference.bgClasses.target, currentUnit),
          high: convertAndFormatBgValue(bloodGlucosePreference.bgClasses.high, currentUnit),
          veryHigh: convertAndFormatBgValue(bloodGlucosePreference.bgClasses.veryHigh, currentUnit)
        },
        bgBounds: {
          veryHighThreshold: convertAndFormatBgValue(bloodGlucosePreference.bgBounds.veryHighThreshold, currentUnit),
          targetUpperBound: convertAndFormatBgValue(bloodGlucosePreference.bgBounds.targetUpperBound, currentUnit),
          targetLowerBound: convertAndFormatBgValue(bloodGlucosePreference.bgBounds.targetLowerBound, currentUnit),
          veryLowThreshold: convertAndFormatBgValue(bloodGlucosePreference.bgBounds.veryLowThreshold, currentUnit)
        }
      }
  }
  return bloodGlucosePreference
}

export const getPageTitleByPatientView = (view: PatientView): string => {
  switch (view) {
    case PatientView.Daily:
      return t('daily')
    case PatientView.Dashboard:
      return t('dashboard')
    case PatientView.Devices:
      return t('devices')
    case PatientView.PatientProfile:
      return t('patient-profile')
    case PatientView.Trends:
      return t('trends')
  }
}

export const DEFAULT_DASHBOARD_TIME_RANGE_DAYS = 14
const DEFAULT_MS_RANGE = TimeService.MS_IN_DAY

export class PatientDataUtils {
  partialDataLoad: typeof PartialDataLoad
  private readonly bgUnits: BgUnit
  private patient: Patient
  private readonly timePrefs: TimePrefs

  constructor({ patient, timePrefs, bgUnits }) {
    this.bgUnits = bgUnits
    this.patient = patient
    this.timePrefs = timePrefs
  }

  buildMedicalData(data: MedicalData): MedicalDataService {
    const medicalData = new MedicalDataService()
    medicalData.opts = {
      defaultSource: Source.Diabeloop,
      YLP820_BASAL_TIME: config.YLP820_BASAL_TIME,
      timezoneName: this.timePrefs.timezoneName,
      dateRange: {
        start: this.partialDataLoad.range.start.valueOf(),
        end: this.partialDataLoad.range.end.valueOf()
      },
      bgUnits: this.bgUnits,
      bgClasses: this.patient.diabeticProfile.bloodGlucosePreference.bgClasses,
      defaultPumpManufacturer: 'default'
    }
    medicalData.add(data)
    return medicalData
  }

  changePatient(patient: Patient): void {
    this.patient = patient
  }

  calculateDashboardDateRange(dateBg: string[]): number {
    const dateRangeSet = new Set(dateBg)
    if (dateRangeSet.size >= DEFAULT_DASHBOARD_TIME_RANGE_DAYS) {
      return DEFAULT_MS_RANGE * DEFAULT_DASHBOARD_TIME_RANGE_DAYS
    }
    return dateRangeSet.size * DEFAULT_MS_RANGE
  }

  getRangeDaysInMs(data: MedicalData): number {
    const dateRangeData = [...data.smbg, ...data.cbg]
    const localDates = dateRangeData.map((bgData) => bgData.localDate)
    return this.calculateDashboardDateRange(localDates)
  }

  getDateRange({ currentPatientView, epochLocation, msRange }: GetDatetimeBoundsArgs): DateRange {
    const msDiff = currentPatientView === PatientView.Daily ? msRange : Math.round(msRange / 2)
    let start = moment.utc(epochLocation - msDiff).startOf('day')
    let end = moment.utc(epochLocation + msDiff).startOf('day').add(1, 'day')

    if (currentPatientView === PatientView.Daily) {
      const rangesToLoad = this.partialDataLoad.getMissingRanges({ start, end }, true)
      if (rangesToLoad.length > 0) {
        // For daily, we will load 4 days to avoid too many loading
        start = moment.utc(epochLocation - TimeService.MS_IN_DAY * 4).startOf('day')
        end = moment.utc(epochLocation + TimeService.MS_IN_DAY * 4).startOf('day').add(1, 'day')
      }
    }
    return { start, end }
  }

  getInitialDate(medicalData: MedicalDataService): number {
    const latestDataDate = moment.utc(medicalData.endpoints[1])
    // To mimic the behavior of the medical data endpoints, today's date is tomorrow at 12AM
    const todayDate = moment(new Date()).add(1, 'day').startOf('day')

    const dateToDisplay = todayDate.isBefore(latestDataDate) ? todayDate : latestDataDate
    return dateToDisplay.valueOf() - TimeService.MS_IN_DAY / 2
  }

  async loadDataRange({ start, end }: DateRange): Promise<MedicalData | null> {
    const rangeDisplay = {
      start: moment.utc(start.valueOf()).startOf('day'),
      end: moment.utc(end.valueOf()).startOf('day').add(1, 'day')
    }
    const ranges = this.partialDataLoad.getMissingRanges(rangeDisplay, true)
    if (ranges.length > 0) {
      return await this.fetchPatientDataRanges(rangeDisplay)
    }
    return null
  }

  async retrievePatientData(): Promise<MedicalData | null> {
    const dataRange = await DataApi.getPatientDataRange(this.patient.userid)

    if (!dataRange) {
      return null
    }

    const start = moment.utc(dataRange[0]).startOf('day')
    const end = moment.utc(dataRange[1]).startOf('day')

    const initialLoadingDates = [
      end.clone().startOf('week').subtract(2, 'weeks').subtract(1, 'day'),
      end
    ]

    const patientData = await this.fetchPatientData({
      startDate: initialLoadingDates[0].toISOString(),
      withPumpSettings: true,
      bgUnits: this.bgUnits
    })

    this.partialDataLoad = new PartialDataLoad(
      { start, end },
      { start: initialLoadingDates[0], end: initialLoadingDates[1] }
    )

    return patientData
  }

  private async fetchPatientDataRanges(dateRange: DateRange): Promise<MedicalData> {
    const ranges = this.partialDataLoad.getMissingRanges(dateRange)
    const aggregatedData: MedicalData = {
      alarmEvents: [],
      basal: [],
      bolus: [],
      cbg: [],
      confidentialModes: [],
      deviceParametersChanges: [],
      messages: [],
      meals: [],
      nightModes: [],
      physicalActivities: [],
      pumpSettings: [],
      reservoirChanges: [],
      smbg: [],
      warmUps: [],
      wizards: [],
      zenModes: [],
      timezoneChanges: []
    }
    const promises = []
    const medicalDataKeys = Object.keys(aggregatedData)
    ranges.forEach(range => {
      promises.push(this.fetchPatientData({
        startDate: range.start.toISOString(),
        endDate: range.end.toISOString(),
        bgUnits: this.bgUnits
      }))
    })
    const results = await Promise.all(promises)
    results.forEach(dataRange => {
      medicalDataKeys.forEach((key) => {
        if (dataRange[key]) {
          aggregatedData[key] = aggregatedData[key].concat(dataRange[key])
        }
      })
    })
    return aggregatedData
  }

  private async fetchPatientData(options: GetPatientDataOptions): Promise<MedicalData> {
    return await DataApi.getPatientData(this.patient, options)
  }
}

