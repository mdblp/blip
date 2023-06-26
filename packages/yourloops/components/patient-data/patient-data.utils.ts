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

import DataApi from '../../lib/data/data.api'
import moment, { type Moment } from 'moment-timezone'
import { type Patient } from '../../lib/patient/models/patient.model'
import PartialDataLoad from 'blip/app/core/lib/partial-data-load'
import MedicalDataService, { type BgUnit, type MedicalData, Source, type TimePrefs, TimeService } from 'medical-domain'
import config from '../../lib/config/config'
import { ChartTypes } from '../../enum/chart-type.enum'
import { type GetPatientDataOptions } from '../../lib/data/models/get-patient-data-options.model'
import { type PatientData } from '../../lib/data/models/patient-datum.model'

interface GetDatetimeBoundsArgs {
  currentChart: ChartTypes
  epochLocation: number
  msRange: number
}

interface DateRange {
  start: Moment
  end: Moment
}

export function isValidDateQueryParam(queryParam: string): boolean {
  const date = new Date(queryParam)
  return !isNaN(date.getTime())
}
const FOURTEEN_DAYS = 14
const DEFAULT_MS_RANGE = TimeService.MS_IN_DAY

export class PatientDataUtils {
  private readonly bgUnits: BgUnit
  private patient: Patient
  private readonly timePrefs: TimePrefs
  partialDataLoad: typeof PartialDataLoad

  constructor({ patient, timePrefs, bgUnits }) {
    this.bgUnits = bgUnits
    this.patient = patient
    this.timePrefs = timePrefs
  }

  buildMedicalData(data: PatientData): MedicalDataService {
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
    if (dateRangeSet.size >= FOURTEEN_DAYS) {
      return DEFAULT_MS_RANGE * FOURTEEN_DAYS
    }
    return dateRangeSet.size * DEFAULT_MS_RANGE
  }

  getRangeDaysInMs(data: MedicalData): number {
    if (data.smbg.length !== 0) {
      const dataSmbg = data.smbg.map((dataSmbg) => {
        return dataSmbg.localDate
      })
      return this.calculateDashboardDateRange(dataSmbg)
    }
    const dataCbg = data.cbg.map((dataCbg) => {
      return dataCbg.localDate
    })
    return this.calculateDashboardDateRange(dataCbg)
  }

  getDateRange({ currentChart, epochLocation, msRange }: GetDatetimeBoundsArgs): DateRange {
    const msDiff = currentChart === ChartTypes.Daily ? msRange : Math.round(msRange / 2)
    let start = moment.utc(epochLocation - msDiff).startOf('day')
    let end = moment.utc(epochLocation + msDiff).startOf('day').add(1, 'day')

    if (currentChart === ChartTypes.Daily) {
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
    return moment.utc(medicalData.endpoints[1]).valueOf() - TimeService.MS_IN_DAY / 2
  }

  async loadDataRange({ start, end }: DateRange): Promise<PatientData | null> {
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

  private async fetchPatientDataRanges(dateRange: DateRange): Promise<PatientData> {
    const ranges = this.partialDataLoad.getMissingRanges(dateRange)
    const promises = []
    ranges.forEach(range => {
      promises.push(this.fetchPatientData({
        startDate: range.start.toISOString(),
        endDate: range.end.toISOString()
      }))
    })
    const results = await Promise.all(promises)
    return results.flat()
  }

  private async fetchPatientData(options: GetPatientDataOptions): Promise<PatientData> {
    const [patientData, messagesNotes] = await Promise.all([
      DataApi.getPatientData(this.patient, options),
      DataApi.getMessages(this.patient, options)
    ])
    return [...patientData, ...messagesNotes] as PatientData
  }

  async retrievePatientData(): Promise<PatientData | null> {
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
      withPumpSettings: true
    })

    this.partialDataLoad = new PartialDataLoad(
      { start, end },
      { start: initialLoadingDates[0], end: initialLoadingDates[1] }
    )

    return patientData
  }
}
