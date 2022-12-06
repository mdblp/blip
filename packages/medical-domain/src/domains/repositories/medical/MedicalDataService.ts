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

import { MGDL_UNITS } from '../../models/medical/datum/Cbg'
import ConfidentialMode from '../../models/medical/datum/ConfidentialMode'
import DeviceParameterChange from '../../models/medical/datum/DeviceParameterChange'
import Fill from '../../models/medical/datum/Fill'
import MedicalData from '../../models/medical/MedicalData'
import Message from '../../models/medical/datum/Message'
import ReservoirChange from '../../models/medical/datum/ReservoirChange'
import WarmUp from '../../models/medical/datum/WarmUp'
import Wizard from '../../models/medical/datum/Wizard'

import ZenMode from '../../models/medical/datum/ZenMode'

import BasicData, { generateBasicData } from './BasicsDataService'
import BasalService from './datum/BasalService'
import BolusService from './datum/BolusService'
import DeviceParameterChangeService from './datum/DeviceParameterChangeService'
import FillService from './datum/FillService'
import MessageService from './datum/MessageService'
import PhysicalActivityService from './datum/PhysicalActivityService'
import TimeZoneChangeService from './datum/TimeZoneChangeService'
import DatumService from './DatumService'

import MedicalDataOptions, {
  BG_CLAMP_THRESHOLD,
  DEFAULT_BG_BOUNDS,
  defaultMedicalDataOptions
} from '../../models/medical/MedicalDataOptions'
import Datum from '../../models/medical/Datum'
import { DatumType, datumTypes } from '../../models/medical/datum/basics/BaseDatum'
import TimeZoneItem from '../../models/time/TimeZones'
import {
  addAtTimezone,
  addMilliseconds,
  epochAtTimezone,
  format,
  getEndOfDay,
  getEpoch,
  getHours,
  getOffset,
  getStartOfDay,
  isValidTimeZone,
  MS_IN_DAY,
  substractAtTimezone,
  toISOString,
  twoWeeksAgo
} from '../time/TimeService'
import PumpSettings from '../../models/medical/datum/PumpSettings'

class MedicalDataService {
  medicalData: MedicalData = {
    basal: [],
    bolus: [],
    cbg: [],
    confidentialModes: [],
    deviceParametersChanges: [],
    messages: [],
    meals: [],
    physicalActivities: [],
    pumpSettings: [],
    reservoirChanges: [],
    smbg: [],
    uploads: [],
    warmUps: [],
    wizards: [],
    zenModes: [],
    timezoneChanges: []
  }

  timezoneList: TimeZoneItem[] = []

  endpoints: string[] = []

  fills: Fill[] = []

  // for compatibility with tidelineData interface only... see generateBasicsData
  basicsData: BasicData | null = null
  private _datumOpts: MedicalDataOptions = defaultMedicalDataOptions

  private normalize(rawData: Array<Record<string, unknown>>): void {
    rawData.forEach(raw => {
      try {
        const datum = DatumService.normalize(raw, this._datumOpts)
        switch (datum.type) {
          case 'bolus':
            this.medicalData.bolus.push(datum)
            break
          case 'basal':
            this.medicalData.basal.push(datum)
            break
          case 'cbg':
            this.medicalData.cbg.push(datum)
            break
          case 'deviceEvent':
            switch (datum.subType as string) {
              case 'confidential':
                this.medicalData.confidentialModes.push(datum as ConfidentialMode)
                break
              case 'deviceParameter':
                this.medicalData.deviceParametersChanges.push(datum as DeviceParameterChange)
                break
              case 'reservoirChange':
                this.medicalData.reservoirChanges.push(datum as ReservoirChange)
                break
              case 'warmup':
                this.medicalData.warmUps.push(datum as WarmUp)
                break
              case 'zen':
                this.medicalData.zenModes.push(datum as ZenMode)
                break
              default:
                break
            }
            break
          case 'food':
            this.medicalData.meals.push(datum)
            break
          case 'message':
            this.medicalData.messages.push(datum)
            break
          case 'physicalActivity':
            this.medicalData.physicalActivities.push(datum)
            break
          case 'pumpSettings':
            this.medicalData.pumpSettings.push(datum)
            break
          case 'smbg':
            this.medicalData.smbg.push(datum)
            break
          case 'upload':
            this.medicalData.uploads.push(datum)
            break
          case 'wizard':
            this.medicalData.wizards.push(datum)
            break
          default:
            break
        }
      } catch (error) {
        let message
        if (error instanceof Error) {
          message = error.message
        } else {
          message = String(error)
        }
        console.log({ message, rawData: raw })
      }
    })
  }

  private deduplicate(): void {
    this.medicalData.basal = BasalService.deduplicate(this.medicalData.basal, this._datumOpts)
    this.medicalData.bolus = BolusService.deduplicate(this.medicalData.bolus, this._datumOpts)
    this.medicalData.physicalActivities = PhysicalActivityService.deduplicate(this.medicalData.physicalActivities, this._datumOpts)
  }

  private join(): void {
    this.joinBolus()
    this.joinReservoirChanges()
  }

  private joinBolus(): void {
    const bolusMap = new Map(
      this.medicalData.bolus.map((bolus, idx) => {
        return [bolus.id, { bolus: { ...bolus }, idx }]
      })
    )
    this.medicalData.wizards = this.medicalData.wizards.map(wizard => {
      if (wizard.bolusId !== '') {
        const sourceBolus = bolusMap.get(wizard.bolusId)
        if (sourceBolus) {
          const bolusWizard = { ...wizard, ...{ bolus: null } } as Wizard
          this.medicalData.bolus[sourceBolus.idx].wizard = bolusWizard
          wizard.bolus = sourceBolus.bolus
          return wizard
        }
      }
      return wizard
    })
  }

  private joinReservoirChanges(): void {
    const sortedDescPumpSettings = this.medicalData.pumpSettings.sort((pumpSettings1: PumpSettings, pumpSettings2: PumpSettings) => this.sortDatum(pumpSettings2, pumpSettings1))
    const lastPumpSettings: PumpSettings = sortedDescPumpSettings[0]

    this.medicalData.reservoirChanges = this.medicalData.reservoirChanges.map((reservoirChange: ReservoirChange) => {
      reservoirChange.pump = lastPumpSettings.payload.pump
      return reservoirChange
    })
  }

  private group(): void {
    this.medicalData.deviceParametersChanges = DeviceParameterChangeService.groupData(this.medicalData.deviceParametersChanges)
  }

  private getAllData(excludeKeys: string[] = []): Datum[] {
    let fullList: Datum[] = []
    const medicalDataKeys = Object.keys(this.medicalData)
    const medicalDataValues = Object.values(this.medicalData)
    medicalDataKeys.forEach((key, idx) => {
      if (!excludeKeys.includes(key)) {
        fullList = fullList.concat(medicalDataValues[idx] as Datum[])
      }
    })
    if (!excludeKeys.includes('fill')) {
      fullList = fullList.concat(this.fills)
    }
    return fullList.sort((a, b) => a.epoch - b.epoch)
  }

  // Fixing timezone names + display offsets in the dataset
  // i.e. datasets with time zone with unknown or generic names (like UTC,GMT...) are fixed with the previous known timezone
  private normalizeTimeZones(allData: Datum[]): Datum[] {
    const firstDatumWithTz = allData.find(d => !d.guessedTimezone && isValidTimeZone(d.timezone))
    let currentTimezone = firstDatumWithTz ? firstDatumWithTz.timezone : this._datumOpts.timePrefs.timezoneName
    return allData.map(d => {
      if (d.guessedTimezone || !isValidTimeZone(d.timezone)) {
        d.timezone = currentTimezone
        d.guessedTimezone = true
        d.displayOffset = getOffset(d.epoch, d.timezone)
      } else {
        currentTimezone = d.timezone
      }
      return d
    })
  }

  private getTimezoneAt(epoch: number): string {
    if (this.timezoneList.length === 0) {
      return this._datumOpts.timePrefs.timezoneName
    }

    let c = 0
    while (c < this.timezoneList.length && epoch >= this.timezoneList[c].time) c++
    c = Math.max(c, 1)
    return this.timezoneList[c - 1].timezone
  }

  private setTimeZones(): void {
    const allData = this.getAllData(['timezoneChanges', 'fill'])
    if (allData.length === 0) {
      this.timezoneList = []
      this.medicalData.timezoneChanges = []
      return
    }
    const fixedTzData = this.normalizeTimeZones(allData)
    const tzChanges = TimeZoneChangeService.getTimeZoneEvents(fixedTzData)
    this.timezoneList = tzChanges.map((d, idx) => ({
      time: idx === 0 ? 0 : d.epoch,
      timezone: d.timezone
    }))
    this.medicalData.timezoneChanges = TimeZoneChangeService.getTimeZoneChanges(tzChanges, this._datumOpts)
  }

  private getDatumEpoch(dat: Datum): number {
    if ('epochEnd' in dat) {
      return dat.epochEnd
    }
    return dat.epoch
  }

  private sortDatum(datA: Datum, datB: Datum): number {
    const epochA = this.getDatumEpoch(datA)
    const epochB = this.getDatumEpoch(datB)
    return epochA - epochB
  }

  private setEndPoints(): void {
    const chartData: Datum[] = (this.medicalData.basal as Datum[]).concat(
      this.medicalData.bolus, this.medicalData.cbg, this.medicalData.meals,
      this.medicalData.smbg, this.medicalData.messages,
      this.medicalData.physicalActivities, this.medicalData.wizards,
      this.medicalData.confidentialModes, this.medicalData.zenModes,
      this.medicalData.deviceParametersChanges, this.medicalData.reservoirChanges,
      this.medicalData.warmUps
    )

    chartData.sort((a, b) => this.sortDatum(a, b))
    // Be sure to have something, we do not want to crash
    // in some other code, and do not want to check this
    // every times too.
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const epochStart = today.valueOf() - MS_IN_DAY
    const epochEnd = today.valueOf() + MS_IN_DAY
    let start = getStartOfDay(epochStart, this._datumOpts.timePrefs.timezoneName)
    let end = getEndOfDay(epochEnd, this._datumOpts.timePrefs.timezoneName)
    if (chartData.length > 0) {
      const first = chartData[0]
      const last = chartData[chartData.length - 1]
      const lastTime = this.getDatumEpoch(last)
      start = getStartOfDay(first.epoch, first.timezone)
      end = getEndOfDay(lastTime, last.timezone)
      this._datumOpts.timePrefs.timezoneName = last.timezone
      this._datumOpts.timePrefs.timezoneOffset = -last.displayOffset
    }

    if (this._datumOpts.dateRange) {
      // Take the longest range if possible
      if (this._datumOpts.dateRange.start < start) {
        start = getStartOfDay(this._datumOpts.dateRange.start, this.getTimezoneAt(this._datumOpts.dateRange.start))
      }
    }

    this.endpoints = [toISOString(start), toISOString(end)]
  }

  // Fill data is mainly (only ?) used for daily view to set axes and vertical strips in background of all plots
  // We may only need to generate these for the current day displayed in daily view...
  private generateFillData(): void {
    const { classes } = this._datumOpts.fillOpts
    const firstTimezone = this.getTimezoneAt(Date.parse(this.endpoints[0]).valueOf())
    const lastTimezone = this.getTimezoneAt(Date.parse(this.endpoints[1]).valueOf())
    let fillDateTime = substractAtTimezone(this.endpoints[0], firstTimezone, 3, 'hour')
    const lastDateTime = epochAtTimezone(this.endpoints[1], lastTimezone)

    const fillData: Fill[] = []
    let timezone = firstTimezone
    let prevFill: null | Fill = null
    while (fillDateTime < lastDateTime) {
      const timezoneAt = this.getTimezoneAt(fillDateTime)
      if (timezone !== timezoneAt) {
        timezone = timezoneAt
        fillDateTime = epochAtTimezone(fillDateTime, timezone)
      }

      const hour = getHours(fillDateTime, timezone)
      if (classes[hour] !== undefined) {
        const isoStr = toISOString(fillDateTime)
        // Update the previous entry normalEnd value
        if (prevFill !== null) {
          prevFill.normalEnd = isoStr
          prevFill.epochEnd = fillDateTime
        }

        const currentFill = FillService.normalize(
          {
            id: `fill-${isoStr.replace(/[^\w\s]|_/g, '')}`,
            time: isoStr,
            timezone,
            fillColor: classes[hour],
            startsAtMidnight: hour === 0
          },
          this._datumOpts
        )
        fillData.push(currentFill)
        prevFill = currentFill
      }
      fillDateTime = addAtTimezone(fillDateTime, timezone, 1, 'hour')
    }

    // Last data
    if (prevFill !== null) {
      prevFill.normalEnd = toISOString(lastDateTime)
      prevFill.epochEnd = lastDateTime
    }

    this.fills = fillData
  }

  getLocaleTimeEndpoints(endInclusive = true, dateFormat = 'YYYY-MM-DD'): { startDate: string, endDate: string } {
    const startEpoch = getEpoch(this.endpoints[0])
    const startTimezone = this.getTimezoneAt(startEpoch)

    let endEpoch = getEpoch(this.endpoints[1])
    if (endInclusive) {
      // endpoints end date is exclusive, but the DatePicker is inclusive
      // remove 1ms to the endDate
      endEpoch = getEpoch(addMilliseconds(this.endpoints[1], -1))
    }
    const endTimezone = this.getTimezoneAt(endEpoch)

    return {
      startDate: format(startEpoch, startTimezone, dateFormat),
      endDate: format(endEpoch, endTimezone, dateFormat)
    }
  }

  getLastTimezone(defaultTimezone = null): string {
    if (this.timezoneList.length > 0) {
      return this.timezoneList[this.timezoneList.length - 1].timezone
    } else if (defaultTimezone !== null) {
      return defaultTimezone
    }
    return this._datumOpts.timezoneName
  }

  add(rawData: Array<Record<string, unknown>>): void {
    this.normalize(rawData)
    this.deduplicate()
    this.join()
    this.setTimeZones()
    this.group()
    this.setEndPoints()
    this.generateFillData()
    this.generateBasicsData()
  }

  hasDiabetesData(): boolean {
    return (
      this.medicalData.basal.length > 0 ||
      this.medicalData.bolus.length > 0 ||
      this.medicalData.cbg.length > 0 ||
      this.medicalData.smbg.length > 0 ||
      this.medicalData.wizards.length > 0
    )
  }

  filterByDate(epochStart: number, epochEnd: number): Datum[] {
    return this.data.filter((d) => {
      const datumEpoch = this.getDatumEpoch(d)
      return datumEpoch > epochStart && datumEpoch < epochEnd
    })
  }

  // Basics data are needed to display the cartridge changes in dashboard and in print actions
  // We may only need to generate these for the current day displayed in dashboard view and on print...
  generateBasicsData(startDate: string | null = null, endDate: string | null = null): void {
    const start = startDate ?? this.endpoints[0]
    const end = endDate ?? this.endpoints[1]
    let startEpoch = new Date(start).valueOf()
    let endEpoch = new Date(end).valueOf()
    if (!endDate) {
      endEpoch = endEpoch - 1
    }
    const endTimezone = this.getTimezoneAt(endEpoch)
    if (!startDate) {
      startEpoch = twoWeeksAgo(endEpoch, endTimezone)
    }
    const startTimezone = this.getTimezoneAt(startEpoch)

    if (startEpoch > endEpoch) {
      console.warn('Invalid date range', { start: toISOString(startEpoch), mEnd: toISOString(endEpoch) })
      this.basicsData = null
      return
    }
    startEpoch += 1
    endEpoch -= 1

    this.basicsData = generateBasicData(this.medicalData, startEpoch, startTimezone, endEpoch, endTimezone)
  }

  editMessage(message: Record<string, unknown>): Message | null {
    const normalizedMessage = MessageService.normalize(message, this._datumOpts)
    normalizedMessage.timezone = this.getTimezoneAt(normalizedMessage.epoch)
    normalizedMessage.displayOffset = getOffset(normalizedMessage.epoch, normalizedMessage.timezone)
    const currentMessageIdx = this.medicalData.messages.findIndex(msg => msg.id === normalizedMessage.id)
    if (currentMessageIdx === -1) {
      return null
    }
    this.medicalData.messages[currentMessageIdx] = normalizedMessage
    this.medicalData.messages.sort((a, b) => this.sortDatum(a, b))
    return normalizedMessage
  }

  // for compatibility with tidelineData interface only...
  public get data(): Datum[] {
    return this.getAllData()
  }

  public get latestPumpManufacturer(): string {
    const capitalize = (s: string): string => {
      const lower = s.toLowerCase()
      return lower[0].toUpperCase() + lower.slice(1)
    }
    const pumpSettings = this.medicalData.pumpSettings
    if (pumpSettings.length > 0) {
      pumpSettings.sort((a, b) => this.sortDatum(a, b))
      const latestPumpSettings = pumpSettings[pumpSettings.length - 1]
      const manufacturer = latestPumpSettings.payload.pump.manufacturer.toLowerCase()
      return capitalize(manufacturer)
    } else {
      return capitalize(this._datumOpts.defaultPumpManufacturer)
    }
  }

  // for compatibility with tidelineData interface only...
  public get grouped(): Record<DatumType, Datum[]> {
    const initalValue: Record<string, Datum[]> = {}
    for (const type of datumTypes) {
      initalValue[type] = []
    }

    return this.data.reduce<Record<DatumType, Datum[]>>(
      (accum, d) => {
        if (accum[d.type] === undefined) {
          accum[d.type] = []
        }
        accum[d.type].push(d)
        return accum
      },
      initalValue
    )
  }

  public get opts(): MedicalDataOptions {
    return this._datumOpts
  }

  public set opts(options: Partial<MedicalDataOptions>) {
    const opts = { ...defaultMedicalDataOptions, ...options }
    const { bgUnits } = opts
    if (bgUnits !== defaultMedicalDataOptions.bgUnits) {
      opts.bgClasses = {
        'very-low': { boundary: DEFAULT_BG_BOUNDS[bgUnits].veryLow },
        low: { boundary: DEFAULT_BG_BOUNDS[bgUnits].targetLower },
        target: { boundary: DEFAULT_BG_BOUNDS[bgUnits].targetUpper },
        high: { boundary: DEFAULT_BG_BOUNDS[bgUnits].veryHigh },
        'very-high': { boundary: BG_CLAMP_THRESHOLD[bgUnits] }
      }
    }

    // mg/dL values are converted to mmol/L and rounded to 5 decimal places on platform.
    // This can cause some discrepancies when converting back to mg/dL, and throw off the
    // categorization.
    // i.e. A 'target' value 180 gets stored as 9.99135, which gets converted back to 180.0000651465
    // which causes it to be classified as 'high'
    // Thus, we need to allow for our thresholds accordingly.
    if (bgUnits === MGDL_UNITS) {
      const roundingAllowance = 0.0001
      opts.bgClasses['very-low'].boundary -= roundingAllowance
      opts.bgClasses.low.boundary -= roundingAllowance
      opts.bgClasses.target.boundary += roundingAllowance
      opts.bgClasses.high.boundary += roundingAllowance
    }

    this._datumOpts = opts
  }
}

export default MedicalDataService
