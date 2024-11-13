/*
 * Copyright (c) 2022-2024, Diabeloop
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

import DataAPI from '../../../lib/data/data.api'
import moment, { type Moment } from 'moment-timezone'
import { history } from '../data/data-api.data'
import type { PatientDataRange } from '../../../lib/data/models/data-range.model'
import {
  DatumType,
  DeviceSystem,
  DurationUnit,
  MedicalData,
  PumpManufacturer,
  Smbg,
  Source,
  Unit,
  Wizard,
  WizardInputMealFat,
  WizardInputMealSource
} from 'medical-domain'
import Cbg from 'medical-domain/dist/src/domains/models/medical/datum/cbg.model'
import Bg from 'medical-domain/dist/src/domains/models/medical/datum/bg.model'
import {
  DeviceEventSubtype
} from 'medical-domain/dist/src/domains/models/medical/datum/enums/device-event-subtype.enum'
import WeekDays from 'medical-domain/dist/src/domains/models/time/enum/weekdays.enum'
import Intensity from 'medical-domain/dist/src/domains/models/medical/datum/enums/intensity.enum'
import { getCompleteDailyViewData } from './complete-daily-view-data'

export const WIZARD_BOLUS_UNDELIVERED_ID = 'carbBolusId'
export const WIZARD_BOLUS_UMM_ID = 'carbBolusId2'
export const WIZARD_BOLUS_POSITIVE_OVERRIDE_ID = 'carbBolusId3'
export const WIZARD_BOLUS_NEGATIVE_OVERRIDE_ID = 'carbBolusId4'
export const PEN_BOLUS_ID = 'penBolusId'
export const MANUAL_BOLUS_ID = 'manualBolusId'

export const CBG_ID = 'cbgId'
export const SMBG_ID = 'smbgId'
export const WIZARD_UNDELIVERED_ID = 'wizardId1'
export const WIZARD_UMM_ID = 'wizardId2'
export const WIZARD_POSITIVE_OVERRIDE_ID = 'wizardId3'
export const WIZARD_NEGATIVE_OVERRIDE_ID = 'wizardId4'
export const CARB_ID = 'carbId'
export const PHYSICAL_ACTIVITY_ID = 'physicalActivityId'
export const PHYSICAL_ACTIVITY_TIME = '2022-08-08T13:00:00Z'
export const RESERVOIR_CHANGE_ID = 'reservoirChangeId'
export const PARAMETER_ID = 'parameterId'
export const CONFIDENTIAL_MODE_ID = 'deviceEvent_2022-08-08_8'
export const ALARM_EVENT_HYPERGLYCEMIA_ID = 'alarmEventHyperglycemiaId'
export const ALARM_EVENT_HYPERGLYCEMIA_OTHER_OCCURRENCE_ID = 'alarmEventHyperglycemiaOtherOccurrenceId'
export const ALARM_EVENT_HYPOGLYCEMIA_ID = 'alarmEventHypoglycemiaId'
export const ALARM_EVENT_INSIGHT_EMPTY_INSULIN_CARTRIDGE_ID = 'alarmEventInsightEmptyInsulinCartridgeId'
export const ALARM_EVENT_INSIGHT_EMPTY_PUMP_BATTERY_ID = 'alarmEventInsightEmptyPumpBatteryId'
export const ALARM_EVENT_INSIGHT_HYPOGLYCEMIA_ID = 'alarmEventInsightHypoglycemiaId'
export const ALARM_EVENT_INSIGHT_INCOMPATIBLE_ACTIONS_ON_PUMP_ID = 'alarmEventInsightIncompatibleActionsOnPumpId'
export const ALARM_EVENT_INSIGHT_INSULIN_CARTRIDGE_EXPIRED_ID = 'alarmEventInsightInsulinCartridgeExpiredId'
export const ALARM_EVENT_INSIGHT_OCCLUSION_ID = 'alarmEventInsightOcclusionId'
export const ALARM_EVENT_KALEIDO_EMPTY_INSULIN_CARTRIDGE_ID = 'alarmEventKaleidoEmptyInsulinCartridgeId'
export const ALARM_EVENT_KALEIDO_EMPTY_PUMP_BATTERY_ID = 'alarmKaleidoEventEmptyPumpBatteryId'
export const ALARM_EVENT_KALEIDO_INSULIN_CARTRIDGE_EXPIRED_ID = 'alarmEventKaleidoInsulinCartridgeExpiredId'
export const ALARM_EVENT_LONG_HYPERGLYCEMIA_ID = 'alarmEventLongHyperglycemiaId'
export const ALARM_EVENT_LONG_HYPOGLYCEMIA_ID = 'alarmEventLongHypoglycemiaId'
export const ALARM_EVENT_NO_READINGS_HYPOGLYCEMIA_RISK_ID = 'alarmEventNoReadingsHypoglycemiaRiskId'
export const ALARM_EVENT_KALEIDO_OCCLUSION_ID = 'alarmEventKaleidoOcclusionId'
export const ALARM_EVENT_SENSOR_SESSION_EXPIRED_ID = 'alarmEventSensorSessionExpiredId'
export const ALARM_EVENT_SUDDEN_RISE_IN_GLYCEMIA_ID = 'alarmEventSuddenRiseInGlycemiaId'
export const ALARM_EVENT_URGENT_LOW_SOON_ID = 'alarmEventUrgentLowSoonId'
export const ALARM_EVENT_DANA_EMPTY_PUMP_BATTERY_ID = 'alarmEventDanaEmptyPumpBatteryId'
export const ALARM_EVENT_DANA_EMPTY_RESERVOIR_ID = 'alarmEventDanaEmptyReservoirId'
export const ALARM_EVENT_DANA_INCOMPATIBLE_ACTIONS_ON_PUMP_ID = 'alarmEventDanaIncompatibleActionsOnPumpId'
export const ALARM_EVENT_DANA_OCCLUSION_ID = 'alarmEventDanaOcclusionId'
export const ALARM_EVENT_MEDISAFE_EMPTY_PUMP_BATTERY_ID = 'alarmEventMedisafeEmptyPumpBatteryId'
export const ALARM_EVENT_MEDISAFE_EMPTY_RESERVOIR_ID = 'alarmEventMedisafeEmptyReservoirId'
export const ALARM_EVENT_MEDISAFE_OCCLUSION_ID = 'alarmEventMedisafeOcclusionId'
export const WARMUP_01_ID = 'warmup01Id'
export const WIZARD_UNDELIVERED_INPUT_TIME = '2022-08-08T02:00:00Z'
export const WIZARD_POSITIVE_OVERRIDE_INPUT_TIME = '2022-08-08T22:45:00Z'
export const WIZARD_NEGATIVE_OVERRIDE_INPUT_TIME = '2022-08-08T23:15:00Z'
export const YESTERDAY_DATE: Moment = moment().subtract(1, 'days')
export const RESERVOIR_CHANGE_TODAY_DATE: Moment = moment()
export const TWO_WEEKS_AGO_DATE: Moment = moment().subtract(14, 'days')
export const RESERVOIR_CHANGE_13_DAYS_AGO_DATE: Moment = moment().subtract(13, 'days')
export const SIXTEEN_DAYS_AGO_DATE: Moment = moment().subtract(16, 'days')
const twoWeeksAgoDateAsString = TWO_WEEKS_AGO_DATE.format('YYYY-MM-DD')
const sixteenDaysAgoDateAsString = SIXTEEN_DAYS_AGO_DATE.format('YYYY-MM-DD')
const yesterdayDateAsString = YESTERDAY_DATE.format('YYYY-MM-DD')

export interface Data {
  dataRange: PatientDataRange
  data: MedicalData
}

const addMilliseconds = (time: string, milliseconds: number) => {
  const mTime = moment.parseZone(time)
  return moment.utc(mTime).add(milliseconds, 'milliseconds').toISOString()
}

const getWeekDay = (date) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', "saturday"]
  return days[date.getDay()]
}

const convertBgMg2Mmol = (value: Bg) => {
  const mmolVal = JSON.parse(JSON.stringify(value))
  mmolVal.value = Math.round(10.0 * value.value / 18.01577) / 10
  mmolVal.units = Unit.MmolPerLiter
  return mmolVal
}
const convertCbgMg2Mmol = (mgValues: Cbg[]) => {
  const mmolValues: Cbg[] = []
  mgValues.forEach((mg) => {
    const mMolVal = convertBgMg2Mmol(mg as Bg)
    mMolVal.deviceName = mg.deviceName
    mmolValues.push(mMolVal)
  })
  return mmolValues
}

const convertSmbgMg2Mmol = (mgValues: Smbg[]) => {
  const mmolValues: Smbg[] = []
  mgValues.forEach((mg: Smbg) => {
    const mMolVal = convertBgMg2Mmol(mg as Bg)
    mmolValues.push(mMolVal as Smbg)
  })
  return mmolValues
}

const cbgMockMgdL = (date, time, value) => {
  const normalTime = new Date(`${date}T${time}.000Z`)
  return {
    epoch: normalTime.getTime(),
    displayOffset: -120,
    normalTime: `${date}T${time}.000Z`,
    timezone: "Europe/Paris",
    guessedTimezone: false,
    id: `cbg_${time}`,
    type: 'cbg',
    source: 'Diabeloop',
    units: 'mg/dL',
    value: value,
    localDate: date,
    isoWeekday: getWeekDay(normalTime),
    msPer24: 68700000,
    deviceName: 'Unknown'
  }
}

const bolusMock = (date, time) => {
  const normalTime = new Date(`${date}T${time}.000Z`)
  return {
    epoch: normalTime.getTime(),
    displayOffset: -120,
    normalTime: `${date}T${time}.000Z`,
    timezone: 'Europe/Paris',
    guessedTimezone: false,
    id: WIZARD_BOLUS_UNDELIVERED_ID,
    type: 'bolus',
    source: 'Diabeloop',
    subType: 'normal',
    normal: 2,
    prescriptor: 'auto',
    wizard: null
  }
}

const wizardMock = (date, time, id, carbinput, umm) => {
  const normalTime = new Date(`${date}T${time}.000Z`)
  const wizard: Wizard = {
    epoch: normalTime.getTime(),
    displayOffset: -120,
    normalTime: `${date}T${time}.000Z`,
    inputTime: `${date}T${time}.000Z`,
    timezone: 'Europe/Paris',
    guessedTimezone: false,
    id: id,
    type: DatumType.Wizard,
    source: Source.Diabeloop,
    bolusId: WIZARD_BOLUS_UNDELIVERED_ID,
    bolusIds: new Set(WIZARD_BOLUS_UNDELIVERED_ID),
    carbInput: carbinput,
    units: 'mmol/L',
    bolus: null,
    isoWeekday: WeekDays.Wednesday
  }
  if (umm) {
    wizard.inputMeal = {
      source: WizardInputMealSource.Umm,
      fat: WizardInputMealFat.No
    }
  }
  return wizard

}

const PumpSettingsMock = (date, time) => {
  const normalTime = new Date(`${date}T${time}.000Z`)
  return {
    epoch: normalTime.getTime(),
    displayOffset: 0,
    normalTime: `${date}T${time}.000Z`,
    timezone: 'UTC',
    guessedTimezone: false,
    id: 'pump_2022-08-08_6',
    type: 'pumpSettings',
    source: 'Diabeloop',
    payload: {
      cgm: {
        apiVersion: 'v1',
        endOfLifeTransmitterDate: '2050-04-12T17:53:54+02:00',
        expirationDate: '2050-04-12T17:53:54+02:00',
        manufacturer: 'Dexcom',
        name: 'G6',
        swVersionTransmitter: 'v1',
        transmitterId: 'a1234'
      },
      device: {
        deviceId: '1234',
        imei: '1234567890',
        manufacturer: 'Diabeloop',
        name: 'DBLG1',
        swVersion: 'beta'
      },
      pump: {
        manufacturer: 'VICENTRA',
        product: "testPump",
        name: 'Kaleido',
        serialNumber: '123456',
        swVersion: 'beta'
      },
      parameters: [
        {
          effectiveDate: '2020-01-17T08:00:00.000Z',
          level: 1,
          name: 'WEIGHT',
          unit: 'kg',
          value: 72
        }
      ],
      history
    }
  }
}

const basalMock = (date, time, deliveryType, duration) => {
  const startTime = new Date(`${date}T${time}.000Z`).getTime()
  const normalEnd = addMilliseconds(`${date}T${time}.000Z`, duration)
  const epochEnd = startTime + duration
  return {
    epoch: startTime,
    displayOffset: -120,
    normalTime: `${date}T${time}.000Z`,
    timezone: 'Europe/Paris',
    guessedTimezone: false,
    id: `basal_${time}`,
    type: 'basal',
    source: 'Diabeloop',
    subType: deliveryType,
    deliveryType: deliveryType,
    rate: 100,
    duration: duration,
    normalEnd: normalEnd,
    epochEnd: epochEnd
  }
}
const mealMock = (date, time) => {
  const normalTime = new Date(`${date}T${time}.000Z`).getTime()
  return {
    epoch: normalTime,
    displayOffset: -120,
    normalTime: `${date}T${time}.000Z`,
    timezone: 'Europe/Paris',
    guessedTimezone: false,
    id: 'food_19-35-00',
    type: 'food',
    source: 'Diabeloop',
    meal: 'rescuecarbs',
    nutrition: {
      carbohydrate: {
        net: 25,
        units: 'grams'
      }
    }
  }
}

const physActivityMock = (date, time, duration) => {
  const startTime = new Date(`${date}T${time}.000Z`).getTime()
  const normalEnd = addMilliseconds(`${date}T${time}.000Z`, duration * 1000)
  const epochEnd = startTime + duration
  return {
    epoch: startTime,
    displayOffset: -120,
    normalTime: `${date}T${time}.000Z`,
    timezone: 'Europe/Paris',
    guessedTimezone: false,
    id: PHYSICAL_ACTIVITY_ID,
    type: 'physicalActivity',
    source: 'Diabeloop',
    duration: {
      units: 'seconds',
      value: duration
    },
    normalEnd: normalEnd,
    epochEnd: epochEnd,
    guid: 'pa_18',
    reportedIntensity: 'medium',
    inputTime: `${date}T${time}.000Z`
  }
}

const deviceEventMock = (date, time) => {
  const startTime = new Date(`${date}T${time}.000Z`).getTime()
  return {
    epoch: startTime,
    displayOffset: 0,
    normalTime: `${date}T${time}.000Z`,
    timezone: 'UTC',
    guessedTimezone: false,
    id: PARAMETER_ID,
    type: 'deviceEvent',
    source: 'Diabeloop',
    subType: 'deviceParameter',
    params: [
      {
        id: PARAMETER_ID,
        epoch: 1697961600000,
        timezone: 'UTC',
        name: 'MEAL_RATIO_LUNCH_FACTOR',
        level: 1,
        units: Unit.Percent,
        value: 100,
        previousValue: 110,
        lastUpdateDate: '2022-08-08T08:00:00Z'
      }
    ]
  }
}

export const generateCompleteDashboardFromDate = (date: string): Data => {
  const endDate = new Date(moment().format('YYYY-MM-DD'))
  endDate.setUTCHours(1)
  const startDate = new Date(date)
  startDate.setUTCHours(1)
  const reservoirChangeDate = new Date(date)
  reservoirChangeDate.setDate(reservoirChangeDate.getDate() + 1)
  const reservoirChangeDateAsString = reservoirChangeDate.toISOString().split('T')[0]
  const data = {
    alarmEvents: [],
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
    warmUps: [],
    wizards: [],
    zenModes: [],
    timezoneChanges: []
  }
  // Insert data for each days
  // eslint-disable-next-line no-unmodified-loop-condition
  while (startDate <= endDate) {
    const date = startDate.toISOString().split('T')[0]
    data.cbg.push(
      cbgMockMgdL(date, '17:05:00', 15),
      cbgMockMgdL(date, '17:10:00', 55),
      cbgMockMgdL(date, '17:35:00', 100),
      cbgMockMgdL(date, '17:40:00', 188),
      cbgMockMgdL(date, '18:05:00', 260)
    )
    data.bolus.push(bolusMock(date, '18:25:00'))
    data.basal.push(
      basalMock(date, '16:30:00', 'scheduled', 7200),
      basalMock(date, '19:35:00', 'automated', 72000)
    )
    data.meals.push(mealMock(date, '19:35:00'))
    data.pumpSettings.push(PumpSettingsMock(date, '16:35:00'))
    data.wizards.push(
      wizardMock(date, '18:35:00', WIZARD_UNDELIVERED_ID, 30, false),
      wizardMock(date, '19:25:00', WIZARD_UMM_ID, 20, true)
    )
    data.physicalActivities.push(physActivityMock(date, '13:00:00', 1800))
    data.deviceParametersChanges.push(deviceEventMock(date, '08:00:00'))
    startDate.setDate(startDate.getDate() + 1)
  }
  // And finaly add one reservoir change event
  data.reservoirChanges.push(
    {
      epoch: new Date(`${reservoirChangeDateAsString}T17:00:00Z`).getTime(),
      displayOffset: -120,
      normalTime: `${reservoirChangeDateAsString}T17:00:00Z`,
      timezone: 'Europe/Paris',
      guessedTimezone: false,
      id: RESERVOIR_CHANGE_ID,
      type: 'deviceEvent',
      source: 'Diabeloop',
      subType: 'reservoirChange',
      pump: {
        manufacturer: 'DEFAULT'
      }
    }
  )
  return {
    dataRange: [`${date}T00:00:00Z`, `${moment().format('YYYY-MM-DD')}T00:00:00Z`],
    data
  }
}

export const completeDashboardData = generateCompleteDashboardFromDate(yesterdayDateAsString)
export const twoWeeksOldDashboardData = generateCompleteDashboardFromDate(twoWeeksAgoDateAsString)
export const sixteenDaysOldDashboardData = generateCompleteDashboardFromDate(sixteenDaysAgoDateAsString)

export const pumpSettingsData: Data = {
  dataRange: ['2022-08-08T16:35:00.000Z', '2022-08-08T16:40:00.000Z'],
  data: {
    pumpSettings: [
      {
        normalTime: '2020-01-01T10:00:00.000Z',
        type: DatumType.PumpSettings,
        id: 'pump_settings',
        timezone: 'UTC',
        source: Source.Diabeloop,
        isoWeekday: WeekDays.Sunday,
        epoch: 0,
        displayOffset: 0,
        guessedTimezone: false,
        payload: {
          cgm: {
            apiVersion: 'v1',
            endOfLifeTransmitterDate: '2050-04-12T17:53:54+02:00',
            expirationDate: '2050-04-12T17:53:54+02:00',
            manufacturer: 'Dexcom',
            name: 'G6',
            swVersionTransmitter: 'v1',
            transmitterId: 'a1234'
          },
          device: {
            deviceId: '1234',
            imei: '1234567890',
            manufacturer: 'Diabeloop',
            name: DeviceSystem.Dblg1,
            swVersion: '1.0.5.25'
          },
          history,
          parameters: [
            { name: 'WEIGHT', value: '72', unit: Unit.Kilogram, level: 1, effectiveDate: '2020-01-17T08:00:00.000Z' },
            {
              name: 'MEDIUM_MEAL_BREAKFAST',
              value: '36',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEDIUM_MEAL_DINNER',
              value: '96',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'PATIENT_GLYCEMIA_TARGET',
              value: '110',
              unit: Unit.MilligramPerDeciliter,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA',
              value: '100',
              unit: Unit.Percent,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'PATIENT_GLY_HYPER_LIMIT',
              value: '180',
              unit: Unit.MilligramPerDeciliter,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEDIUM_MEAL_LUNCH',
              value: '96',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'PATIENT_GLY_HYPO_LIMIT',
              value: '75',
              unit: Unit.MilligramPerDeciliter,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'BOLUS_AGGRESSIVENESS_FACTOR',
              value: '100',
              unit: Unit.Percent,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'SMALL_MEAL_LUNCH',
              value: '48',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'SMALL_MEAL_BREAKFAST',
              value: '18',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEAL_RATIO_LUNCH_FACTOR',
              value: '100',
              unit: Unit.Percent,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'LARGE_MEAL_DINNER',
              value: '144',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEAL_RATIO_DINNER_FACTOR',
              value: '80',
              unit: Unit.Percent,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'LARGE_MEAL_BREAKFAST',
              value: '54',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEAL_RATIO_BREAKFAST_FACTOR',
              value: '100',
              unit: Unit.Percent,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'LARGE_MEAL_LUNCH',
              value: '144',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'SMALL_MEAL_DINNER',
              value: '48',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            }
          ],
          pump: {
            manufacturer: PumpManufacturer.Vicentra,
            product: "testPump",
            name: 'Kaleido',
            serialNumber: '123456',
            swVersion: 'beta'
          },
          securityBasals: {
            rates: [
              { rate: 1, start: 0 },
              { rate: 2, start: 510 },
              { rate: 0.4, start: 840 }
            ]
          }
        }
      }
    ],
    cbg: [{
      normalTime: '2020-01-01T10:00:00.000Z',
      type: DatumType.Cbg,
      id: '2020-01-01_0',
      timezone: 'Europe/Paris',
      units: Unit.MmolPerLiter,
      value: 10.5,
      isoWeekday: WeekDays.Wednesday,
      epoch: 0,
      displayOffset: 0,
      guessedTimezone: false,
      source: Source.Diabeloop,
      localDate: '',
      msPer24: 0,
      deviceName: ''
    }]
  }
}

export const pumpSettingsDblg2: Data = {
  dataRange: ['2022-08-08T16:35:00.000Z', '2022-08-08T16:40:00.000Z'],
  data: {
    pumpSettings: [
      {
        normalTime: '2020-01-01T10:00:00.000Z',
        type: DatumType.PumpSettings,
        id: 'pump_settings',
        timezone: 'UTC',
        source: Source.Diabeloop,
        isoWeekday: WeekDays.Sunday,
        epoch: 0,
        displayOffset: 0,
        guessedTimezone: false,
        payload: {
          cgm: {
            apiVersion: 'v1',
            endOfLifeTransmitterDate: '2050-04-12T17:53:54+02:00',
            expirationDate: '2050-04-12T17:53:54+02:00',
            manufacturer: 'Dexcom',
            name: 'G6',
            swVersionTransmitter: 'v1',
            transmitterId: 'a1234'
          },
          device: {
            deviceId: '1234',
            manufacturer: 'Samsung',
            name: DeviceSystem.Dblg2,
            operatingSystem: 'Android',
            osVersion: '14',
            smartphoneModel: 'A25'
          },
          history,
          parameters: [
            { name: 'WEIGHT', value: '72', unit: Unit.Kilogram, level: 1, effectiveDate: '2020-01-17T08:00:00.000Z' },
            {
              name: 'MEDIUM_MEAL_BREAKFAST',
              value: '36',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEDIUM_MEAL_DINNER',
              value: '96',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'PATIENT_GLYCEMIA_TARGET',
              value: '110',
              unit: Unit.MilligramPerDeciliter,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA',
              value: '100',
              unit: Unit.Percent,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'PATIENT_GLY_HYPER_LIMIT',
              value: '180',
              unit: Unit.MilligramPerDeciliter,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEDIUM_MEAL_LUNCH',
              value: '96',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'PATIENT_GLY_HYPO_LIMIT',
              value: '75',
              unit: Unit.MilligramPerDeciliter,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'BOLUS_AGGRESSIVENESS_FACTOR',
              value: '100',
              unit: Unit.Percent,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'SMALL_MEAL_LUNCH',
              value: '48',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'SMALL_MEAL_BREAKFAST',
              value: '18',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEAL_RATIO_LUNCH_FACTOR',
              value: '100',
              unit: Unit.Percent,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'LARGE_MEAL_DINNER',
              value: '144',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEAL_RATIO_DINNER_FACTOR',
              value: '80',
              unit: Unit.Percent,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'LARGE_MEAL_BREAKFAST',
              value: '54',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEAL_RATIO_BREAKFAST_FACTOR',
              value: '100',
              unit: Unit.Percent,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'LARGE_MEAL_LUNCH',
              value: '144',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'SMALL_MEAL_DINNER',
              value: '48',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            }
          ],
          pump: {
            manufacturer: PumpManufacturer.Vicentra,
            product: "testPump",
            name: 'Kaleido',
            serialNumber: '123456',
            swVersion: 'beta'
          },
          mobileApplication: {
            manufacturer: Source.Diabeloop,
            name: DeviceSystem.Dblg2,
            swVersion: '1.0.0'
          },
          securityBasals: {
            rates: [
              { rate: 1, start: 0 },
              { rate: 2, start: 510 },
              { rate: 0.4, start: 840 }
            ]
          }
        }
      }
    ],
    cbg: [{
      normalTime: '2020-01-01T10:00:00.000Z',
      type: DatumType.Cbg,
      id: '2020-01-01_0',
      timezone: 'Europe/Paris',
      units: Unit.MmolPerLiter,
      value: 10.5,
      isoWeekday: WeekDays.Wednesday,
      epoch: 0,
      displayOffset: 0,
      guessedTimezone: false,
      source: Source.Diabeloop,
      localDate: '',
      msPer24: 0,
      deviceName: ''
    }]
  }
}

export const pumpSettingsDblg1WithoutSecurityBasalData: Data = {
  dataRange: ['2022-08-08T16:35:00.000Z', '2022-08-08T16:40:00.000Z'],
  data: {
    pumpSettings: [
      {
        normalTime: '2020-01-01T10:00:00.000Z',
        type: DatumType.PumpSettings,
        id: 'pump_settings',
        timezone: 'UTC',
        source: Source.Diabeloop,
        isoWeekday: WeekDays.Sunday,
        epoch: 0,
        displayOffset: 0,
        guessedTimezone: false,
        payload: {
          cgm: {
            apiVersion: 'v1',
            endOfLifeTransmitterDate: '2050-04-12T17:53:54+02:00',
            expirationDate: '2050-04-12T17:53:54+02:00',
            manufacturer: 'Dexcom',
            name: 'G6',
            swVersionTransmitter: 'v1',
            transmitterId: 'a1234'
          },
          device: {
            deviceId: '1234',
            imei: '1234567890',
            manufacturer: 'Diabeloop',
            name: DeviceSystem.Dblg1,
            swVersion: '1.2.3'
          },
          history,
          parameters: [
            { name: 'WEIGHT', value: '72', unit: Unit.Kilogram, level: 1, effectiveDate: '2020-01-17T08:00:00.000Z' },
            {
              name: 'MEDIUM_MEAL_BREAKFAST',
              value: '36',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEDIUM_MEAL_DINNER',
              value: '96',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'PATIENT_GLYCEMIA_TARGET',
              value: '110',
              unit: Unit.MilligramPerDeciliter,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA',
              value: '100',
              unit: Unit.Percent,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'PATIENT_GLY_HYPER_LIMIT',
              value: '180',
              unit: Unit.MilligramPerDeciliter,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEDIUM_MEAL_LUNCH',
              value: '96',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'PATIENT_GLY_HYPO_LIMIT',
              value: '75',
              unit: Unit.MilligramPerDeciliter,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'BOLUS_AGGRESSIVENESS_FACTOR',
              value: '100',
              unit: Unit.Percent,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'SMALL_MEAL_LUNCH',
              value: '48',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'SMALL_MEAL_BREAKFAST',
              value: '18',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEAL_RATIO_LUNCH_FACTOR',
              value: '100',
              unit: Unit.Percent,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'LARGE_MEAL_DINNER',
              value: '144',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEAL_RATIO_DINNER_FACTOR',
              value: '80',
              unit: Unit.Percent,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'LARGE_MEAL_BREAKFAST',
              value: '54',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEAL_RATIO_BREAKFAST_FACTOR',
              value: '100',
              unit: Unit.Percent,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'LARGE_MEAL_LUNCH',
              value: '144',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'SMALL_MEAL_DINNER',
              value: '48',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            }
          ],
          pump: {
            manufacturer: PumpManufacturer.Vicentra,
            product: "testPump",
            name: 'Kaleido',
            serialNumber: '123456',
            swVersion: 'beta'
          },
          securityBasals: { rates: null }
        }
      }
    ],
    cbg: [{
      normalTime: '2020-01-01T10:00:00.000Z',
      type: DatumType.Cbg,
      id: '2020-01-01_0',
      timezone: 'Europe/Paris',
      units: Unit.MmolPerLiter,
      value: 10.5,
      isoWeekday: WeekDays.Wednesday,
      epoch: 0,
      displayOffset: 0,
      guessedTimezone: false,
      source: Source.Diabeloop,
      localDate: '',
      msPer24: 0,
      deviceName: ''
    }]
  }
}

export const pumpSettingsDblg2WithoutSecurityBasalData: Data = {
  dataRange: ['2022-08-08T16:35:00.000Z', '2022-08-08T16:40:00.000Z'],
  data: {
    pumpSettings: [
      {
        normalTime: '2020-01-01T10:00:00.000Z',
        type: DatumType.PumpSettings,
        id: 'pump_settings',
        timezone: 'UTC',
        source: Source.Diabeloop,
        isoWeekday: WeekDays.Sunday,
        epoch: 0,
        displayOffset: 0,
        guessedTimezone: false,
        payload: {
          cgm: {
            apiVersion: 'v1',
            endOfLifeTransmitterDate: '2050-04-12T17:53:54+02:00',
            expirationDate: '2050-04-12T17:53:54+02:00',
            manufacturer: 'Dexcom',
            name: 'G6',
            swVersionTransmitter: 'v1',
            transmitterId: 'a1234'
          },
          device: {
            deviceId: '1234',
            manufacturer: 'Samsung',
            name: DeviceSystem.Dblg2,
            operatingSystem: 'Android',
            osVersion: '14',
            smartphoneModel: 'A25'
          },
          history,
          parameters: [
            { name: 'WEIGHT', value: '72', unit: Unit.Kilogram, level: 1, effectiveDate: '2020-01-17T08:00:00.000Z' },
            {
              name: 'MEDIUM_MEAL_BREAKFAST',
              value: '36',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEDIUM_MEAL_DINNER',
              value: '96',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'PATIENT_GLYCEMIA_TARGET',
              value: '110',
              unit: Unit.MilligramPerDeciliter,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA',
              value: '100',
              unit: Unit.Percent,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'PATIENT_GLY_HYPER_LIMIT',
              value: '180',
              unit: Unit.MilligramPerDeciliter,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEDIUM_MEAL_LUNCH',
              value: '96',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'PATIENT_GLY_HYPO_LIMIT',
              value: '75',
              unit: Unit.MilligramPerDeciliter,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'BOLUS_AGGRESSIVENESS_FACTOR',
              value: '100',
              unit: Unit.Percent,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'SMALL_MEAL_LUNCH',
              value: '48',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'SMALL_MEAL_BREAKFAST',
              value: '18',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEAL_RATIO_LUNCH_FACTOR',
              value: '100',
              unit: Unit.Percent,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'LARGE_MEAL_DINNER',
              value: '144',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEAL_RATIO_DINNER_FACTOR',
              value: '80',
              unit: Unit.Percent,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'LARGE_MEAL_BREAKFAST',
              value: '54',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEAL_RATIO_BREAKFAST_FACTOR',
              value: '100',
              unit: Unit.Percent,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'LARGE_MEAL_LUNCH',
              value: '144',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'SMALL_MEAL_DINNER',
              value: '48',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            }
          ],
          pump: {
            manufacturer: PumpManufacturer.Vicentra,
            product: "testPump",
            name: 'Kaleido',
            serialNumber: '123456',
            swVersion: 'beta'
          },
          mobileApplication: {
            manufacturer: Source.Diabeloop,
            name: DeviceSystem.Dblg2,
            swVersion: '1.0.0'
          },
          securityBasals: { rates: null }
        }
      }
    ],
    cbg: [{
      normalTime: '2020-01-01T10:00:00.000Z',
      type: DatumType.Cbg,
      id: '2020-01-01_0',
      timezone: 'Europe/Paris',
      units: Unit.MmolPerLiter,
      value: 10.5,
      isoWeekday: WeekDays.Wednesday,
      epoch: 0,
      displayOffset: 0,
      guessedTimezone: false,
      source: Source.Diabeloop,
      localDate: '',
      msPer24: 0,
      deviceName: ''
    }]
  }
}

export const completeDailyViewDataMmol: Data = {
  dataRange: ['2022-08-08T15:00:00Z', '2022-08-08T18:40:00Z'],
  data: JSON.parse(JSON.stringify(getCompleteDailyViewData().data))
}

completeDailyViewDataMmol.data.cbg = convertCbgMg2Mmol(getCompleteDailyViewData().data.cbg)
completeDailyViewDataMmol.data.smbg = convertSmbgMg2Mmol(getCompleteDailyViewData().data.smbg)

export const dataSetsWithZeroValues: Data = {
  dataRange: ['2022-08-08T15:00:00Z', '2022-08-08T18:40:00Z'],
  data: {
    "alarmEvents": [],
    "basal": [],
    "bolus": [],
    "cbg": [
      {
        "epoch": 1659972600000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbgId",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 0,
        "localDate": "2022-08-08",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 63000000,
        "deviceName": "Unknown"
      }
    ],
    "confidentialModes": [],
    "deviceParametersChanges": [
      {
        "epoch": 1659945600000,
        "displayOffset": 0,
        "normalTime": "2022-08-08T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": DatumType.DeviceEvent,
        "source": Source.Diabeloop,
        "subType": DeviceEventSubtype.DeviceParameter,
        "isoWeekday": WeekDays.Monday,
        "params": [
          {
            "id": "parameterId",
            "epoch": 1659945600000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "unit": Unit.Percent,
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      }
    ],
    "messages": [],
    "meals": [],
    "physicalActivities": [
      {
        "epoch": 1659963600000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": DatumType.PhysicalActivity,
        "source": Source.Diabeloop,
        "duration": {
          "units": DurationUnit.Seconds,
          "value": 0
        },
        "normalEnd": "2022-08-08T13:00:00.000Z",
        "epochEnd": 1659963600000,
        "guid": "pa_18",
        "reportedIntensity": Intensity.Medium,
        "inputTime": "2022-08-08T13:00:00.000Z",
        "isoWeekday": WeekDays.Sunday
      }
    ],
    "pumpSettings": [
      {
        "epoch": 1659976500000,
        "displayOffset": 0,
        "normalTime": "2022-08-08T16:35:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "pump_2022-08-08_6",
        "type": DatumType.PumpSettings,
        "source": Source.Diabeloop,
        "isoWeekday": WeekDays.Sunday,
        "payload": {
          "cgm": {
            "apiVersion": "v1",
            "endOfLifeTransmitterDate": "2050-04-12T17:53:54+02:00",
            "expirationDate": "2050-04-12T17:53:54+02:00",
            "manufacturer": "Dexcom",
            "name": "G6",
            "swVersionTransmitter": "v1",
            "transmitterId": "a1234"
          },
          "device": {
            "deviceId": "1234",
            "imei": "1234567890",
            "manufacturer": Source.Diabeloop,
            "name": DeviceSystem.Dblg1,
            "swVersion": "beta"
          },
          "pump": {
            "manufacturer": PumpManufacturer.Vicentra,
            "name": "Kaleido",
            "serialNumber": "123456",
            "swVersion": "beta"
          },
          "history": [],
          "parameters": [
            {
              "effectiveDate": "2020-01-17T08:00:00.000Z",
              "level": 1,
              "name": "",
              "unit": Unit.Kilogram,
              "value": "2"
            }
          ]
        }
      }
    ],
    "reservoirChanges": [
      {
        "epoch": 1659978000000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T17:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "reservoirChangeId",
        "type": DatumType.DeviceEvent,
        "source": Source.Diabeloop,
        "subType": DeviceEventSubtype.ReservoirChange,
        "pump": {
          "manufacturer": PumpManufacturer.Default,
          "name": "",
          "serialNumber": "",
          "swVersion": ""
        },
        "isoWeekday": WeekDays.Thursday
      }
    ],
    "smbg": [],
    "warmUps": [],
    "wizards": [],
    "zenModes": [],
    "timezoneChanges": []
  }
}

export const noData: Data = {
  dataRange: ['', ''],
  data: []
}

export const smbgData: Data = {
  dataRange: ['2022-08-08T11:30:00Z', '2022-08-08T18:30:00Z'],
  data: {
    "alarmEvents": [],
    "basal": [],
    "bolus": [],
    "cbg": [],
    "confidentialModes": [],
    "deviceParametersChanges": [],
    "messages": [],
    "meals": [],
    "physicalActivities": [],
    "pumpSettings": [],
    "reservoirChanges": [],
    "smbg": [
      {
        "epoch": 1659971700000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:15:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_0",
        "type": DatumType.Smbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 189,
        "localDate": "2022-08-08",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 62100000
      },
      {
        "epoch": 1659972000000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:20:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_1",
        "type": DatumType.Smbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 265,
        "localDate": "2022-08-08",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 62400000
      },
      {
        "epoch": 1659972300000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_2",
        "type": DatumType.Smbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 265,
        "localDate": "2022-08-08",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 62700000
      },
      {
        "epoch": 1659972600000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_3",
        "type": DatumType.Smbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 117,
        "localDate": "2022-08-08",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 63000000
      },
      {
        "epoch": 1659972900000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_4",
        "type": DatumType.Smbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 117,
        "localDate": "2022-08-08",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 63300000
      },
      {
        "epoch": 1659973200000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_5",
        "type": DatumType.Smbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 117,
        "localDate": "2022-08-08",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 63600000
      },
      {
        "epoch": 1659973500000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:45:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_6",
        "type": DatumType.Smbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 61,
        "localDate": "2022-08-08",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 63900000
      },
      {
        "epoch": 1659973800000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:50:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_7",
        "type": DatumType.Smbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 61,
        "localDate": "2022-08-08",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 64200000
      },
      {
        "epoch": 1659974100000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:55:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_8",
        "type": DatumType.Smbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 61,
        "localDate": "2022-08-08",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 64500000
      },
      {
        "epoch": 1659974400000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_9",
        "type": DatumType.Smbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 61,
        "localDate": "2022-08-08",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 64800000
      },
      {
        "epoch": 1659974700000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_10",
        "type": DatumType.Smbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 40,
        "localDate": "2022-08-08",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 65100000
      },
      {
        "epoch": 1659975000000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_11",
        "type": DatumType.Smbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 40,
        "localDate": "2022-08-08",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 65400000
      },
      {
        "epoch": 1659975300000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:15:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_12",
        "type": DatumType.Smbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 40,
        "localDate": "2022-08-08",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 65700000
      },
      {
        "epoch": 1659975600000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:20:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_13",
        "type": DatumType.Smbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 40,
        "localDate": "2022-08-08",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 66000000
      },
      {
        "epoch": 1659975900000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_14",
        "type": DatumType.Smbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 40,
        "localDate": "2022-08-08",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 66300000
      }
    ],
    "warmUps": [],
    "wizards": [],
    "zenModes": [],
    "timezoneChanges": []
  }
}

export const timeInRangeStatsTrendViewData: Data = {
  dataRange: ['2020-01-19T00:00:00Z', '2020-01-20T00:00:00Z'],
  data: {
    "alarmEvents": [],
    "basal": [],
    "bolus": [],
    "cbg": [
      {
        "epoch": 1579514400000,
        "displayOffset": -60,
        "normalTime": "2020-01-20T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-20_0",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 189,
        "localDate": "2020-01-20",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 39600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1579518000000,
        "displayOffset": -60,
        "normalTime": "2020-01-20T11:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-20_1",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 265,
        "localDate": "2020-01-20",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 43200000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1579518300000,
        "displayOffset": -60,
        "normalTime": "2020-01-20T11:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-20_3",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 117,
        "localDate": "2020-01-20",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 43500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1579518600000,
        "displayOffset": -60,
        "normalTime": "2020-01-20T11:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-20_4",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 117,
        "localDate": "2020-01-20",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 43800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1579518900000,
        "displayOffset": -60,
        "normalTime": "2020-01-20T11:15:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-20_5",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 61,
        "localDate": "2020-01-20",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 44100000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1579519200000,
        "displayOffset": -60,
        "normalTime": "2020-01-20T11:20:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-20_6",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 61,
        "localDate": "2020-01-20",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 44400000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1579519500000,
        "displayOffset": -60,
        "normalTime": "2020-01-20T11:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-20_7",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 61,
        "localDate": "2020-01-20",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 44700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1579519800000,
        "displayOffset": -60,
        "normalTime": "2020-01-20T11:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-20_8",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 40,
        "localDate": "2020-01-20",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 45000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1579520100000,
        "displayOffset": -60,
        "normalTime": "2020-01-20T11:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-20_9",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 40,
        "localDate": "2020-01-20",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 45300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1579520400000,
        "displayOffset": -60,
        "normalTime": "2020-01-20T11:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-20_10",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 40,
        "localDate": "2020-01-20",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 45600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1579520700000,
        "displayOffset": -60,
        "normalTime": "2020-01-20T11:45:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-20_11",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 40,
        "localDate": "2020-01-20",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 45900000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1579521000000,
        "displayOffset": -60,
        "normalTime": "2020-01-20T11:50:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-20_12",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 40,
        "localDate": "2020-01-20",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 46200000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1579521300000,
        "displayOffset": -60,
        "normalTime": "2020-01-20T11:55:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-20_13",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 189,
        "localDate": "2020-01-20",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 46500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1579521600000,
        "displayOffset": -60,
        "normalTime": "2020-01-20T12:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-20_14",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 189,
        "localDate": "2020-01-20",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 46800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1579521900000,
        "displayOffset": -60,
        "normalTime": "2020-01-20T12:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-20_15",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 189,
        "localDate": "2020-01-20",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 47100000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1579522200000,
        "displayOffset": -60,
        "normalTime": "2020-01-20T12:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-20_16",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 189,
        "localDate": "2020-01-20",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 47400000,
        "deviceName": "Unknown"
      }
    ],
    "confidentialModes": [],
    "deviceParametersChanges": [],
    "messages": [],
    "meals": [],
    "physicalActivities": [],
    "pumpSettings": [],
    "reservoirChanges": [],
    "smbg": [],
    "warmUps": [],
    "wizards": [],
    "zenModes": [],
    "timezoneChanges": []
  }
}

export const twoWeeksOfCbg: Data = {
  dataRange: ['2020-01-01T00:00:00Z', '2020-01-15T23:00:00Z'],
  data: {
    "alarmEvents": [],
    "basal": [],
    "bolus": [],
    "cbg": [
      {
        "epoch": 1577872800000,
        "displayOffset": -60,
        "normalTime": "2020-01-01T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-01_0",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 189,
        "localDate": "2020-01-01",
        "isoWeekday": WeekDays.Wednesday,
        "msPer24": 39600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1577959200000,
        "displayOffset": -60,
        "normalTime": "2020-01-02T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-02_0",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 189,
        "localDate": "2020-01-02",
        "isoWeekday": WeekDays.Thursday,
        "msPer24": 39600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1578045600000,
        "displayOffset": -60,
        "normalTime": "2020-01-03T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-03_0",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 189,
        "localDate": "2020-01-03",
        "isoWeekday": WeekDays.Friday,
        "msPer24": 39600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1578132000000,
        "displayOffset": -60,
        "normalTime": "2020-01-04T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-04_0",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 189,
        "localDate": "2020-01-04",
        "isoWeekday": WeekDays.Saturday,
        "msPer24": 39600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1578218400000,
        "displayOffset": -60,
        "normalTime": "2020-01-05T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-05_0",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 189,
        "localDate": "2020-01-05",
        "isoWeekday": WeekDays.Sunday,
        "msPer24": 39600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1578304800000,
        "displayOffset": -60,
        "normalTime": "2020-01-06T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-06_0",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 189,
        "localDate": "2020-01-06",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 39600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1578391200000,
        "displayOffset": -60,
        "normalTime": "2020-01-07T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-07_0",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 189,
        "localDate": "2020-01-07",
        "isoWeekday": WeekDays.Tuesday,
        "msPer24": 39600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1578477600000,
        "displayOffset": -60,
        "normalTime": "2020-01-08T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-08_0",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 189,
        "localDate": "2020-01-08",
        "isoWeekday": WeekDays.Wednesday,
        "msPer24": 39600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1578564000000,
        "displayOffset": -60,
        "normalTime": "2020-01-09T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-09_0",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 189,
        "localDate": "2020-01-09",
        "isoWeekday": WeekDays.Thursday,
        "msPer24": 39600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1578650400000,
        "displayOffset": -60,
        "normalTime": "2020-01-10T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-10_0",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 189,
        "localDate": "2020-01-10",
        "isoWeekday": WeekDays.Friday,
        "msPer24": 39600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1578736800000,
        "displayOffset": -60,
        "normalTime": "2020-01-11T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-11_0",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 189,
        "localDate": "2020-01-11",
        "isoWeekday": WeekDays.Saturday,
        "msPer24": 39600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1578823200000,
        "displayOffset": -60,
        "normalTime": "2020-01-12T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-12_0",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 189,
        "localDate": "2020-01-12",
        "isoWeekday": WeekDays.Sunday,
        "msPer24": 39600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1578909600000,
        "displayOffset": -60,
        "normalTime": "2020-01-13T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-13_0",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 189,
        "localDate": "2020-01-13",
        "isoWeekday": WeekDays.Monday,
        "msPer24": 39600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1578996000000,
        "displayOffset": -60,
        "normalTime": "2020-01-14T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-14_0",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 189,
        "localDate": "2020-01-14",
        "isoWeekday": WeekDays.Tuesday,
        "msPer24": 39600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1579082400000,
        "displayOffset": -60,
        "normalTime": "2020-01-15T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-15_0",
        "type": DatumType.Cbg,
        "source": Source.Diabeloop,
        "units": Unit.MilligramPerDeciliter,
        "value": 189,
        "localDate": "2020-01-15",
        "isoWeekday": WeekDays.Wednesday,
        "msPer24": 39600000,
        "deviceName": "Unknown"
      }
    ],
    "confidentialModes": [],
    "deviceParametersChanges": [],
    "messages": [],
    "meals": [],
    "physicalActivities": [],
    "pumpSettings": [],
    "reservoirChanges": [],
    "smbg": [],
    "warmUps": [],
    "wizards": [],
    "zenModes": [],
    "timezoneChanges": []
  }
}

export const mockDataAPI = (patientData: Data = getCompleteDailyViewData()) => {
  jest.spyOn(DataAPI, 'getPatientDataRange').mockResolvedValue(patientData.dataRange)
  jest.spyOn(DataAPI, 'getPatientData').mockImplementation(() => Promise.resolve(patientData.data))
}
