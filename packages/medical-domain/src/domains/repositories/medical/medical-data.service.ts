/*
 * Copyright (c) 2022-2025, Diabeloop
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

import { MGDL_UNITS } from '../../models/medical/datum/bg.model'
import type Fill from '../../models/medical/datum/fill.model'
import type MedicalData from '../../models/medical/medical-data.model'
import type Message from '../../models/medical/datum/message.model'
import type ReservoirChange from '../../models/medical/datum/reservoir-change.model'
import type Wizard from '../../models/medical/datum/wizard.model'
import type BasicData from './basics-data.service'
import { generateBasicData } from './basics-data.service'
import BasalService from './datum/basal.service'
import BolusService from './datum/bolus.service'
import DeviceParameterChangeService from './datum/device-parameter-change.service'
import FillService from './datum/fill.service'
import MessageService from './datum/message.service'
import PhysicalActivityService from './datum/physical-activity.service'
import TimeZoneChangeService from './datum/time-zone-change.service'
import type MedicalDataOptions from '../../models/medical/medical-data-options.model'
import {
  BG_CLAMP_THRESHOLD,
  DEFAULT_BG_BOUNDS,
  defaultMedicalDataOptions
} from '../../models/medical/medical-data-options.model'
import type Datum from '../../models/medical/datum.model'
import type TimeZoneItem from '../../models/time/time-zone-item.model'
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
} from '../time/time.service'
import type PumpManufacturer from '../../models/medical/datum/enums/pump-manufacturer.enum'
import WizardService from './datum/wizard.service'
import AlarmEventService from './datum/alarm-event.service';
import { WizardInputMealSource } from '../../models/medical/datum/enums/wizard-input-meal-source.enum'
import {
  ParameterConfig,
  ParametersChange,
  PumpSettings,
  PumpSettingsParameter
} from '../../models/medical/datum/pump-settings.model'

const EXCLUDED_PARAMETERS = ['INSULIN_TYPE_USED']

class MedicalDataService {
  medicalData: MedicalData = {
    alarmEvents: [],
    basal: [],
    bolus: [],
    cbg: [],
    confidentialModes: [],
    deviceParametersChanges: [],
    iobs: [],
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

  timezoneList: TimeZoneItem[] = []

  endpoints: [string, string] = ['', '']

  fills: Fill[] = []

  // for compatibility with tidelineData interface only... see generateBasicsData
  basicsData: BasicData | null = null
  private _datumOpts: MedicalDataOptions = defaultMedicalDataOptions

  // for compatibility with tidelineData interface only...
  public get data(): Datum[] {
    return this.getAllData()
  }

  public get latestPumpManufacturer(): string {
    const pumpSettings = this.medicalData.pumpSettings
    if (pumpSettings.length > 0) {
      const latestPumpSettings = this.getLatestPumpSettings(pumpSettings)
      return latestPumpSettings.payload.pump.manufacturer
    } else {
      return this._datumOpts.defaultPumpManufacturer
    }
  }

  public get opts(): MedicalDataOptions {
    return this._datumOpts
  }

  public set opts(options: Partial<MedicalDataOptions>) {
    const opts = { ...defaultMedicalDataOptions, ...options }
    const { bgUnits } = opts
    if (bgUnits !== defaultMedicalDataOptions.bgUnits) {
      opts.bgClasses = {
        veryLow: DEFAULT_BG_BOUNDS[bgUnits].veryLow,
        low: DEFAULT_BG_BOUNDS[bgUnits].targetLower,
        target: DEFAULT_BG_BOUNDS[bgUnits].targetUpper,
        high: DEFAULT_BG_BOUNDS[bgUnits].veryHigh,
        veryHigh: BG_CLAMP_THRESHOLD[bgUnits]
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
      opts.bgClasses.veryLow -= roundingAllowance
      opts.bgClasses.low -= roundingAllowance
      opts.bgClasses.target += roundingAllowance
      opts.bgClasses.high += roundingAllowance
    }

    this._datumOpts = opts
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

  getTimezoneAt(epoch: number): string {
    if (this.timezoneList.length === 0) {
      return this._datumOpts.timePrefs.timezoneName
    }

    let c = 0
    while (c < this.timezoneList.length && epoch >= this.timezoneList[c].time) c++
    c = Math.max(c, 1)
    return this.timezoneList[c - 1].timezone
  }

  getLastTimezone(defaultTimezone = null): string {
    if (this.timezoneList.length > 0) {
      return this.timezoneList[this.timezoneList.length - 1].timezone
    } else if (defaultTimezone !== null) {
      return defaultTimezone
    }
    return this._datumOpts.timezoneName
  }

  add(data: MedicalData): void {
    if (data.alarmEvents) {
      this.medicalData.alarmEvents = this.medicalData.alarmEvents.concat(data.alarmEvents)
    }
    if (data.bolus) {
      this.medicalData.bolus = this.medicalData.bolus.concat(data.bolus)
    }
    if (data.basal) {
      this.medicalData.basal = this.medicalData.basal.concat(data.basal)
    }
    if (data.cbg) {
      this.medicalData.cbg = this.medicalData.cbg.concat(data.cbg)
    }
    if (data.confidentialModes) {
      this.medicalData.confidentialModes = this.medicalData.confidentialModes.concat(data.confidentialModes)
    }
    if (data.deviceParametersChanges) {
      this.medicalData.deviceParametersChanges = data.deviceParametersChanges
    }
    if (data.messages) {
      this.medicalData.messages = this.medicalData.messages.concat(data.messages)
    }
    if (data.meals) {
      this.medicalData.meals = this.medicalData.meals.concat(data.meals)
    }
    if (data.nightModes) {
      this.medicalData.nightModes = this.medicalData.nightModes.concat(data.nightModes)
    }
    if (data.physicalActivities) {
      this.medicalData.physicalActivities = this.medicalData.physicalActivities.concat(data.physicalActivities)
    }
    if (data.pumpSettings) {
      this.medicalData.pumpSettings = data.pumpSettings
    }
    if (data.reservoirChanges) {
      this.medicalData.reservoirChanges = this.medicalData.reservoirChanges.concat(data.reservoirChanges)
    }
    if (data.smbg) {
      this.medicalData.smbg = this.medicalData.smbg.concat(data.smbg)
    }
    if (data.warmUps) {
      this.medicalData.warmUps = this.medicalData.warmUps.concat(data.warmUps)
    }
    if (data.wizards) {
      this.medicalData.wizards = this.medicalData.wizards.concat(data.wizards)
    }
    if (data.zenModes) {
      this.medicalData.zenModes = this.medicalData.zenModes.concat(data.zenModes)
    }

    this.removeUmmBolus()
    this.filterParameters()
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
  generateBasicsData(startDate: string | null = null, endDate: string | null = null): BasicData | null {
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
      return null
    }
    startEpoch += 1
    endEpoch -= 1

    this.basicsData = generateBasicData(this.medicalData, startEpoch, startTimezone, endEpoch, endTimezone)

    return this.basicsData
  }

  addMessage(message: Record<string, unknown>): void {
    const normalizedMsg: Message = MessageService.normalize(message, this._datumOpts)
    this.medicalData.messages.push(normalizedMsg)
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

  private deduplicate(): void {
    this.medicalData.basal = BasalService.deduplicate(this.medicalData.basal, this._datumOpts)
    this.medicalData.bolus = BolusService.deduplicate(this.medicalData.bolus, this._datumOpts)
    this.medicalData.wizards = WizardService.deduplicate(this.medicalData.wizards, this.medicalData.bolus, this._datumOpts)
    this.medicalData.physicalActivities = PhysicalActivityService.deduplicate(this.medicalData.physicalActivities, this._datumOpts)
  }

  private getLatestPumpSettings(pumpSettings: PumpSettings[]): PumpSettings {
    pumpSettings.sort((a, b) => this.sortDatum(a, b))
    return pumpSettings[pumpSettings.length - 1]
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
      wizard.bolusIds = new Set<string>([wizard.bolusId])
      const sourceBolus = bolusMap.get(wizard.bolusId)
      if (sourceBolus) {
        const bolusWizard = { ...wizard, ...{ bolus: null } } as Wizard
        this.medicalData.bolus[sourceBolus.idx].wizard = bolusWizard
        wizard.bolus = sourceBolus.bolus

        /*if the bolus is biphasic, let's link the second bolus to the wizard*/
        const bolus = wizard.bolus
        if (bolus.biphasicId) {
          wizard.bolusPart2 = this.medicalData.bolus.find(
            item => item.biphasicId === bolus.biphasicId && item.id !== bolus.id
          ) ?? null;
        }
      }
      return wizard
    })
  }

  private joinReservoirChanges(): void {
    const latestPumpSettings = this.getLatestPumpSettings(this.medicalData.pumpSettings)

    if (!latestPumpSettings) {
      return
    }

    const pump = latestPumpSettings.payload.pump
    this.medicalData.reservoirChanges = this.medicalData.reservoirChanges.map((reservoirChange: ReservoirChange) => {
      reservoirChange.pump = {
        name: pump.name,
        product: pump.product,
        serialNumber: pump.serialNumber,
        swVersion: pump.swVersion,
        manufacturer: this.latestPumpManufacturer as PumpManufacturer
      }
      return reservoirChange
    })
  }

  private group(): void {
    this.medicalData.deviceParametersChanges = DeviceParameterChangeService.groupData(this.medicalData.deviceParametersChanges)
    this.medicalData.alarmEvents = AlarmEventService.groupData(this.medicalData.alarmEvents)
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

  private removeUmmBolus() {
    this.medicalData.wizards = this.medicalData.wizards.filter((wizard: Wizard) => wizard.inputMeal?.source !== WizardInputMealSource.Umm)
  }

  private removeExcludedParameters(parametersList: ParameterConfig[]) {
    return parametersList.filter((parameter) => {
      return !EXCLUDED_PARAMETERS.includes(parameter.name)
    })
  }

  private filterParameters() {
    this.medicalData.pumpSettings = this.medicalData.pumpSettings.map((pumpSettings: PumpSettings) => {
      pumpSettings.payload.parameters = this.removeExcludedParameters(pumpSettings.payload.parameters)

      pumpSettings.payload.history = pumpSettings.payload.history.map((historyItem: ParametersChange) => {
        historyItem.parameters = this.removeExcludedParameters(historyItem.parameters) as PumpSettingsParameter[]
        return historyItem
      })

      return pumpSettings
    })
  }
}

export default MedicalDataService
