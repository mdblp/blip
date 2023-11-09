/*
 * Copyright (c) 2022-2023, Diabeloop
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
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS AS IS
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
import { MedicalData, Smbg, Unit } from 'medical-domain'
import Cbg from 'medical-domain/dist/src/domains/models/medical/datum/cbg.model'
import Bg from 'medical-domain/dist/src/domains/models/medical/datum/bg.model'

const WIZARD_BOLUS_UNDELIVERED_ID = 'carbBolusId'
const WIZARD_BOLUS_UMM_ID = 'carbBolusId2'
const WIZARD_BOLUS_POSITIVE_OVERRIDE_ID = 'carbBolusId3'
const WIZARD_BOLUS_NEGATIVE_OVERRIDE_ID = 'carbBolusId4'

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
export const WIZARD_UNDELIVERED_INPUT_TIME = '2022-08-08T02:00:00Z'
export const WIZARD_UMM_INPUT_TIME = '2022-08-08T18:34:00Z'
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
  const wizard = {
    epoch: normalTime.getTime(),
    displayOffset: -120,
    normalTime: `${date}T${time}.000Z`,
    timezone: 'Europe/Paris',
    guessedTimezone: false,
    id: id,
    type: 'wizard',
    source: 'Diabeloop',
    bolusId: WIZARD_BOLUS_UNDELIVERED_ID,
    bolusIds: { WIZARD_BOLUS_UNDELIVERED_ID },
    carbInput: carbinput,
    units: 'mmol/L',
    bolus: null
  }
  if (umm) {
    wizard.inputMeal = {
      source: 'umm'
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
    basalSchedules: [],
    payload: {
      basalsecurityprofile: {},
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
        expirationDate: '2050-04-12T17:53:54+02:00',
        manufacturer: 'VICENTRA',
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
        units: '%',
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
        type: 'pumpSettings',
        id: 'pump_settings',
        timezone: 'UTC',
        source: 'Diabeloop',
        payload: {
          basalsecurityprofile: null,
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
            swVersion: '1.0.5.25'
          },
          history,
          parameters: [
            { name: 'WEIGHT', value: '72', unit: 'kg', level: 1, effectiveDate: '2020-01-17T08:00:00.000Z' },
            {
              name: 'MEDIUM_MEAL_BREAKFAST',
              value: '36',
              unit: 'g',
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            { name: 'MEDIUM_MEAL_DINNER', value: '96', unit: 'g', level: 1, effectiveDate: '2020-01-17T08:00:00.000Z' },
            {
              name: 'PATIENT_GLYCEMIA_TARGET',
              value: '110',
              unit: 'mg/dL',
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA',
              value: '100',
              unit: '%',
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'PATIENT_GLY_HYPER_LIMIT',
              value: '180',
              unit: 'mg/dL',
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            { name: 'MEDIUM_MEAL_LUNCH', value: '96', unit: 'g', level: 1, effectiveDate: '2020-01-17T08:00:00.000Z' },
            {
              name: 'PATIENT_GLY_HYPO_LIMIT',
              value: '75',
              unit: 'mg/dL',
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'BOLUS_AGGRESSIVENESS_FACTOR',
              value: '100',
              unit: '%',
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            { name: 'SMALL_MEAL_LUNCH', value: '48', unit: 'g', level: 1, effectiveDate: '2020-01-17T08:00:00.000Z' },
            {
              name: 'SMALL_MEAL_BREAKFAST',
              value: '18',
              unit: 'g',
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEAL_RATIO_LUNCH_FACTOR',
              value: '100',
              unit: '%',
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            { name: 'LARGE_MEAL_DINNER', value: '144', unit: 'g', level: 1, effectiveDate: '2020-01-17T08:00:00.000Z' },
            {
              name: 'MEAL_RATIO_DINNER_FACTOR',
              value: '80',
              unit: '%',
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'LARGE_MEAL_BREAKFAST',
              value: '54',
              unit: 'g',
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            {
              name: 'MEAL_RATIO_BREAKFAST_FACTOR',
              value: '100',
              unit: '%',
              level: 1,
              effectiveDate: '2020-01-17T08:00:00.000Z'
            },
            { name: 'LARGE_MEAL_LUNCH', value: '144', unit: 'g', level: 1, effectiveDate: '2020-01-17T08:00:00.000Z' },
            { name: 'SMALL_MEAL_DINNER', value: '48', unit: 'g', level: 1, effectiveDate: '2020-01-17T08:00:00.000Z' }
          ],
          pump: {
            expirationDate: '2050-04-12T17:53:54+02:00',
            manufacturer: 'VICENTRA',
            name: 'Kaleido',
            serialNumber: '123456',
            swVersion: 'beta'
          }
        }
      }
    ],
    cbg: [{
      normalTime: '2020-01-01T10:00:00.000Z',
      type: 'cbg',
      id: '2020-01-01_0',
      timezone: 'Europe/Paris',
      units: 'mmol/L',
      value: 10.5,
      uploadId: 'osef'
    }]
  }
}

export const completeDailyViewData: Data = {
  dataRange: ['2022-08-08T15:00:00Z', '2022-08-08T18:40:00Z'],
  data: {
    alarmEvents: [
      {
        "epoch": 1659949200000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T09:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "alarm-01",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "duration": {
          "units": "hours",
          "value": 0
        },
        "normalEnd": "2022-08-08T09:00:00.000Z",
        "epochEnd": 1659949200000,
        "subType": "alarm",
        "guid": ALARM_EVENT_HYPERGLYCEMIA_ID,
        "inputTime": "2022-08-08T09:00:00Z",
        "alarm": {
          "alarmCode": "10113",
          "alarmLevel": "alert",
          "alarmType": "handset",
          "ackStatus": "acknowledged",
          "updateTime": "2023-07-14T17:48:18.602Z"
        },
        "alarmEventType": "Hyperglycemia"
      },
      {
        "epoch": 1659949500000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T09:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "alarm-011",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "duration": {
          "units": "hours",
          "value": 0
        },
        "normalEnd": "2022-08-08T09:05:00.000Z",
        "epochEnd": 1659949500000,
        "subType": "alarm",
        "guid": ALARM_EVENT_HYPERGLYCEMIA_OTHER_OCCURRENCE_ID,
        "inputTime": "2022-08-08T09:05:00Z",
        "alarm": {
          "alarmCode": "10113",
          "alarmLevel": "alert",
          "alarmType": "handset",
          "ackStatus": "acknowledged",
          "updateTime": "2023-07-14T17:48:18.602Z"
        },
        "alarmEventType": "Hyperglycemia"
      },
      {
        "epoch": 1659949500000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T09:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "alarm-02",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "duration": {
          "units": "hours",
          "value": 0
        },
        "normalEnd": "2022-08-08T09:05:00.000Z",
        "epochEnd": 1659949500000,
        "subType": "alarm",
        "guid": "alarmEventHypoglycemiaId",
        "inputTime": "2022-08-08T09:05:00Z",
        "alarm": {
          "alarmCode": "12000",
          "alarmLevel": "alarm",
          "alarmType": "handset",
          "ackStatus": "acknowledged",
          "updateTime": "2023-07-14T17:48:18.602Z"
        },
        "alarmEventType": "Hypoglycemia"
      },
      {
        "epoch": 1659949800000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T09:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "alarm-03",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "duration": {
          "units": "hours",
          "value": 0
        },
        "normalEnd": "2022-08-08T09:10:00.000Z",
        "epochEnd": 1659949800000,
        "subType": "alarm",
        "guid": "alarmEventInsightEmptyInsulinCartridgeId",
        "inputTime": "2022-08-08T09:10:00Z",
        "alarm": {
          "alarmCode": "71002",
          "alarmLevel": "alarm",
          "alarmType": "handset",
          "ackStatus": "acknowledged",
          "updateTime": "2023-07-14T17:48:18.602Z"
        },
        "alarmEventType": "Device"
      },
      {
        "epoch": 1659950100000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T09:15:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "alarm-04",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "duration": {
          "units": "hours",
          "value": 0
        },
        "normalEnd": "2022-08-08T09:15:00.000Z",
        "epochEnd": 1659950100000,
        "subType": "alarm",
        "guid": "alarmEventInsightEmptyPumpBatteryId",
        "inputTime": "2022-08-08T09:15:00Z",
        "alarm": {
          "alarmCode": "71001",
          "alarmLevel": "alarm",
          "alarmType": "handset",
          "ackStatus": "acknowledged",
          "updateTime": "2023-07-14T17:48:18.602Z"
        },
        "alarmEventType": "Device"
      },
      {
        "epoch": 1659950400000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T09:20:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "alarm-05",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "duration": {
          "units": "hours",
          "value": 0
        },
        "normalEnd": "2022-08-08T09:20:00.000Z",
        "epochEnd": 1659950400000,
        "subType": "alarm",
        "guid": "alarmEventInsightHypoglycemiaId",
        "inputTime": "2022-08-08T09:20:00Z",
        "alarm": {
          "alarmCode": "10117",
          "alarmLevel": "alert",
          "alarmType": "handset",
          "ackStatus": "acknowledged",
          "updateTime": "2023-07-14T17:48:18.602Z"
        },
        "alarmEventType": "Hypoglycemia"
      },
      {
        "epoch": 1659950700000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T09:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "alarm-06",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "duration": {
          "units": "hours",
          "value": 0
        },
        "normalEnd": "2022-08-08T09:25:00.000Z",
        "epochEnd": 1659950700000,
        "subType": "alarm",
        "guid": "alarmEventInsightIncompatibleActionsOnPumpId",
        "inputTime": "2022-08-08T09:25:00Z",
        "alarm": {
          "alarmCode": "71003",
          "alarmLevel": "alarm",
          "alarmType": "handset",
          "ackStatus": "acknowledged",
          "updateTime": "2023-07-14T17:48:18.602Z"
        },
        "alarmEventType": "Device"
      },
      {
        "epoch": 1659951000000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T09:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "alarm-07",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "duration": {
          "units": "hours",
          "value": 0
        },
        "normalEnd": "2022-08-08T09:30:00.000Z",
        "epochEnd": 1659951000000,
        "subType": "alarm",
        "guid": "alarmEventInsightInsulinCartridgeExpiredId",
        "inputTime": "2022-08-08T09:30:00Z",
        "alarm": {
          "alarmCode": "71020",
          "alarmLevel": "alarm",
          "alarmType": "handset",
          "ackStatus": "acknowledged",
          "updateTime": "2023-07-14T17:48:18.602Z"
        },
        "alarmEventType": "Device"
      },
      {
        "epoch": 1659951300000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T09:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "alarm-08",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "duration": {
          "units": "hours",
          "value": 0
        },
        "normalEnd": "2022-08-08T09:35:00.000Z",
        "epochEnd": 1659951300000,
        "subType": "alarm",
        "guid": "alarmEventInsightOcclusionId",
        "inputTime": "2022-08-08T09:35:00Z",
        "alarm": {
          "alarmCode": "71004",
          "alarmLevel": "alarm",
          "alarmType": "handset",
          "ackStatus": "acknowledged",
          "updateTime": "2023-07-14T17:48:18.602Z"
        },
        "alarmEventType": "Device"
      },
      {
        "epoch": 1659951600000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T09:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "alarm-09",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "duration": {
          "units": "hours",
          "value": 0
        },
        "normalEnd": "2022-08-08T09:40:00.000Z",
        "epochEnd": 1659951600000,
        "subType": "alarm",
        "guid": "alarmEventKaleidoEmptyInsulinCartridgeId",
        "inputTime": "2022-08-08T09:40:00Z",
        "alarm": {
          "alarmCode": "41002",
          "alarmLevel": "alarm",
          "alarmType": "handset",
          "ackStatus": "acknowledged",
          "updateTime": "2023-07-14T17:48:18.602Z"
        },
        "alarmEventType": "Device"
      },
      {
        "epoch": 1659951900000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T09:45:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "alarm-10",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "duration": {
          "units": "hours",
          "value": 0
        },
        "normalEnd": "2022-08-08T09:45:00.000Z",
        "epochEnd": 1659951900000,
        "subType": "alarm",
        "guid": "alarmKaleidoEventEmptyPumpBatteryId",
        "inputTime": "2022-08-08T09:45:00Z",
        "alarm": {
          "alarmCode": "41001",
          "alarmLevel": "alarm",
          "alarmType": "handset",
          "ackStatus": "acknowledged",
          "updateTime": "2023-07-14T17:48:18.602Z"
        },
        "alarmEventType": "Device"
      },
      {
        "epoch": 1659952200000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T09:50:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "alarm-11",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "duration": {
          "units": "hours",
          "value": 0
        },
        "normalEnd": "2022-08-08T09:50:00.000Z",
        "epochEnd": 1659952200000,
        "subType": "alarm",
        "guid": "alarmEventKaleidoInsulinCartridgeExpiredId",
        "inputTime": "2022-08-08T09:50:00Z",
        "alarm": {
          "alarmCode": "41003",
          "alarmLevel": "alarm",
          "alarmType": "handset",
          "ackStatus": "acknowledged",
          "updateTime": "2023-07-14T17:48:18.602Z"
        },
        "alarmEventType": "Device"
      },
      {
        "epoch": 1659952500000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T09:55:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "alarm-12",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "duration": {
          "units": "hours",
          "value": 0
        },
        "normalEnd": "2022-08-08T09:55:00.000Z",
        "epochEnd": 1659952500000,
        "subType": "alarm",
        "guid": "alarmEventKaleidoOcclusionId",
        "inputTime": "2022-08-08T09:55:00Z",
        "alarm": {
          "alarmCode": "41004",
          "alarmLevel": "alarm",
          "alarmType": "handset",
          "ackStatus": "acknowledged",
          "updateTime": "2023-07-14T17:48:18.602Z"
        },
        "alarmEventType": "Device"
      },
      {
        "epoch": 1659952800000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "alarm-13",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "duration": {
          "units": "hours",
          "value": 0
        },
        "normalEnd": "2022-08-08T10:00:00.000Z",
        "epochEnd": 1659952800000,
        "subType": "alarm",
        "guid": "alarmEventLongHyperglycemiaId",
        "inputTime": "2022-08-08T10:00:00Z",
        "alarm": {
          "alarmCode": "15000",
          "alarmLevel": "alarm",
          "alarmType": "handset",
          "ackStatus": "acknowledged",
          "updateTime": "2023-07-14T17:48:18.602Z"
        },
        "alarmEventType": "Hyperglycemia"
      },
      {
        "epoch": 1659953100000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T10:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "alarm-14",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "duration": {
          "units": "hours",
          "value": 0
        },
        "normalEnd": "2022-08-08T10:05:00.000Z",
        "epochEnd": 1659953100000,
        "subType": "alarm",
        "guid": "alarmEventLongHypoglycemiaId",
        "inputTime": "2022-08-08T10:05:00Z",
        "alarm": {
          "alarmCode": "24000",
          "alarmLevel": "alarm",
          "alarmType": "handset",
          "ackStatus": "acknowledged",
          "updateTime": "2023-07-14T17:48:18.602Z"
        },
        "alarmEventType": "Hypoglycemia"
      },
      {
        "epoch": 1659953400000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T10:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "alarm-15",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "duration": {
          "units": "hours",
          "value": 0
        },
        "normalEnd": "2022-08-08T10:10:00.000Z",
        "epochEnd": 1659953400000,
        "subType": "alarm",
        "guid": "alarmEventNoReadingsHypoglycemiaRiskId",
        "inputTime": "2022-08-08T10:10:00Z",
        "alarm": {
          "alarmCode": "20100",
          "alarmLevel": "alert",
          "alarmType": "handset",
          "ackStatus": "acknowledged",
          "updateTime": "2023-07-14T17:48:18.602Z"
        },
        "alarmEventType": "Hypoglycemia"
      },
      {
        "epoch": 1659953700000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T10:15:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "alarm-16",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "duration": {
          "units": "hours",
          "value": 0
        },
        "normalEnd": "2022-08-08T10:15:00.000Z",
        "epochEnd": 1659953700000,
        "subType": "alarm",
        "guid": "alarmEventSensorSessionExpiredId",
        "inputTime": "2022-08-08T10:15:00Z",
        "alarm": {
          "alarmCode": "11000",
          "alarmLevel": "alarm",
          "alarmType": "handset",
          "ackStatus": "acknowledged",
          "updateTime": "2023-07-14T17:48:18.602Z"
        },
        "alarmEventType": "Device"
      },
      {
        "epoch": 1659954000000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T10:20:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "alarm-17",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "duration": {
          "units": "hours",
          "value": 0
        },
        "normalEnd": "2022-08-08T10:20:00.000Z",
        "epochEnd": 1659954000000,
        "subType": "alarm",
        "guid": "alarmEventSuddenRiseInGlycemiaId",
        "inputTime": "2022-08-08T10:20:00Z",
        "alarm": {
          "alarmCode": "20102",
          "alarmLevel": "alert",
          "alarmType": "handset",
          "ackStatus": "acknowledged",
          "updateTime": "2023-07-14T17:48:18.602Z"
        },
        "alarmEventType": "Hyperglycemia"
      },
      {
        "epoch": 1659954300000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T10:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "alarm-18",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "duration": {
          "units": "hours",
          "value": 0
        },
        "normalEnd": "2022-08-08T10:25:00.000Z",
        "epochEnd": 1659954300000,
        "subType": "alarm",
        "guid": "alarmEventUrgentLowSoonId",
        "inputTime": "2022-08-08T10:25:00Z",
        "alarm": {
          "alarmCode": "10112",
          "alarmLevel": "alert",
          "alarmType": "handset",
          "ackStatus": "acknowledged",
          "updateTime": "2023-07-14T17:48:18.602Z"
        },
        "alarmEventType": "Hypoglycemia"
      }
    ],
    basal: [
      {
        "epoch": 1659976200000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_2022-08-08_5",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "internalId": "3deeb71f-9b5b-496e-b0af-ef9512c2787f",
        "deliveryType": "automated",
        "rate": 0.8,
        "duration": 1000,
        "normalEnd": "2022-08-08T16:30:01.000Z",
        "epochEnd": 1659976201000
      }
    ],
    bolus: [
      {
        "epoch": 1659983100000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": WIZARD_BOLUS_UNDELIVERED_ID,
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 22.3,
        "prescriptor": "auto",
        "wizard": null,
        "expectedNormal": 25,
        "insulinOnBoard": 3.1843607
      },
      {
        "epoch": 1659983700000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": WIZARD_BOLUS_UMM_ID,
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 1.3,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1659984300000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T18:45:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": WIZARD_BOLUS_POSITIVE_OVERRIDE_ID,
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 19.35,
        "prescriptor": "hybrid",
        "wizard": null,
        "expectedNormal": 19.35,
        "insulinOnBoard": 3.1218212
      },
      {
        "epoch": 1659984900000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T18:55:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": WIZARD_BOLUS_NEGATIVE_OVERRIDE_ID,
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 9.05,
        "prescriptor": "hybrid",
        "wizard": null,
        "expectedNormal": 9.05,
        "insulinOnBoard": 3.0588088
      }
    ],
    cbg: [
      {
        "epoch": 1659972600000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": CBG_ID,
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 63000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1659972900000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_2022-08-08T15:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 265,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 63300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1659973200000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_2022-08-08T15:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 265,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 63600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1659974400000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_2022-08-08T16:00:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 117,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 64800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1659974700000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_2022-08-08T16:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 117,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 65100000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1659975000000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_2022-08-08T16:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 117,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 65400000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1659975600000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:20:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_2022-08-08T16:20:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 61,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 66000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1659975900000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_2022-08-08T16:25:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 61,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 66300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1659976200000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_2022-08-08T16:30:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 61,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 66600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1659976500000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_2022-08-08T16:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 61,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 66900000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1659977100000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:45:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_2022-08-08T16:45:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 40,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 67500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1659977400000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:50:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_2022-08-08T16:50:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 40,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 67800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1659977700000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:55:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_2022-08-08T16:55:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 40,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 68100000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1659978000000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T17:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_2022-08-08T17:00:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 40,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 68400000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1659978300000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_2022-08-08T17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 40,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      }
    ],
    confidentialModes: [
      {
        "epoch": 1659924000000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T02:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "deviceEvent_2022-08-08_8",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "duration": {
          "units": "hours",
          "value": 2
        },
        "normalEnd": "2022-08-08T04:00:00.000Z",
        "epochEnd": 1659931200000,
        "subType": "confidential",
        "guid": "confidential_0",
        "inputTime": "2022-08-08T02:00:00Z"
      }
    ],
    deviceParametersChanges: [
      {
        "epoch": 1659945600000,
        "displayOffset": 0,
        "normalTime": "2022-08-08T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1659945600000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "unit": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      }
    ],
    messages: [],
    meals: [
      {
        "epoch": 1659960000000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T12:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbId",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 15,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {
            "net": 16,
            "units": "grams"
          }
        },
        "prescriptor": "hybrid"
      }
    ],
    physicalActivities: [
      {
        "epoch": 1659963600000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2022-08-08T13:30:00.000Z",
        "epochEnd": 1659965400000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "inputTime": "2022-08-08T13:00:00.000Z"
      }
    ],
    pumpSettings: [
      {
        "epoch": 1659976500000,
        "displayOffset": 0,
        "normalTime": "2022-08-08T16:35:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "pump_2022-08-08_6",
        "type": "pumpSettings",
        "source": "Diabeloop",
        "basalSchedules": [],
        "payload": {
          "basalsecurityprofile": {},
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
            "manufacturer": "Diabeloop",
            "name": "DBLG1",
            "swVersion": "beta"
          },
          "pump": {
            "expirationDate": "2050-04-12T17:53:54+02:00",
            "manufacturer": "VICENTRA",
            "name": "Kaleido",
            "serialNumber": "123456",
            "swVersion": "beta"
          },
          history,
          "parameters": [
            {
              "effectiveDate": "2020-01-17T08:00:00.000Z",
              "level": 1,
              "name": "WEIGHT",
              "unit": "kg",
              "value": "72"
            }
          ]
        }
      }
    ],
    reservoirChanges: [
      {
        "epoch": 1659978000000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T17:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "reservoirChangeId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "reservoirChange",
        "pump": {
          "manufacturer": "DEFAULT"
        }
      }
    ],
    smbg: [
      {
        "epoch": 1659971700000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:15:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": SMBG_ID,
        "type": "smbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 62100000
      }
    ],
    "warmUps": [],
    "wizards": [
      {
        "epoch": 1659983100000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": WIZARD_UNDELIVERED_ID,
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": WIZARD_BOLUS_UNDELIVERED_ID,
        "bolusIds": { WIZARD_BOLUS_UNDELIVERED_ID },
        "carbInput": 45,
        "units": "mmol/L",
        "bolus": null,
        "inputTime": "2022-08-08T02:00:00Z",
        "recommended": {
          "carb": 0,
          "correction": 0,
          "net": 25
        },
        "inputMeal": {
          "fat": "yes",
          "source": "manual"
        }
      },
      {
        "epoch": 1659983700000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": WIZARD_UMM_ID,
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": WIZARD_BOLUS_UMM_ID,
        "bolusIds": { WIZARD_BOLUS_UMM_ID },
        "carbInput": 50,
        "units": "mmol/L",
        "bolus": null,
        "inputTime": "2022-08-08T18:34:00Z",
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1659984300000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T18:45:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": WIZARD_POSITIVE_OVERRIDE_ID,
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": WIZARD_BOLUS_POSITIVE_OVERRIDE_ID,
        "bolusIds": { WIZARD_BOLUS_POSITIVE_OVERRIDE_ID },
        "carbInput": 100,
        "units": "mmol/L",
        "bolus": null,
        "inputTime": "2022-08-08T22:45:00Z",
        "recommended": {
          "carb": 0,
          "correction": 0,
          "net": 14.35
        }
      },
      {
        "epoch": 1659984900000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T18:55:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": WIZARD_NEGATIVE_OVERRIDE_ID,
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": WIZARD_BOLUS_NEGATIVE_OVERRIDE_ID,
        "bolusIds": { WIZARD_BOLUS_NEGATIVE_OVERRIDE_ID },
        "carbInput": 100,
        "units": "mmol/L",
        "bolus": null,
        "inputTime": "2022-08-08T23:15:00Z",
        "recommended": {
          "carb": 0,
          "correction": 0,
          "net": 10.05
        }
      }
    ],
    "zenModes": [],
    "timezoneChanges": []
  }
}

export const completeDailyViewDataMmol: Data = {
  dataRange: ['2022-08-08T15:00:00Z', '2022-08-08T18:40:00Z'],
  data: JSON.parse(JSON.stringify(completeDailyViewData.data))
}

completeDailyViewDataMmol.data.cbg = convertCbgMg2Mmol(completeDailyViewData.data.cbg)
completeDailyViewDataMmol.data.smbg = convertSmbgMg2Mmol(completeDailyViewData.data.smbg)

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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 0,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
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
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1659945600000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "unit": "%",
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
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 0
        },
        "normalEnd": "2022-08-08T13:00:00.000Z",
        "epochEnd": 1659963600000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "inputTime": "2022-08-08T13:00:00.000Z"
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
        "type": "pumpSettings",
        "source": "Diabeloop",
        "basalSchedules": [],
        "payload": {
          "basalsecurityprofile": {},
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
            "manufacturer": "Diabeloop",
            "name": "DBLG1",
            "swVersion": "beta"
          },
          "pump": {
            "expirationDate": "2050-04-12T17:53:54+02:00",
            "manufacturer": "VICENTRA",
            "name": "Kaleido",
            "serialNumber": "123456",
            "swVersion": "beta"
          },
          "history": [],
          "parameters": [
            {
              "effectiveDate": "2020-01-17T08:00:00.000Z",
              "level": 1,
              "name": ""
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
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "reservoirChange",
        "pump": {
          "manufacturer": "DEFAULT"
        }
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
        "type": "smbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 62100000
      },
      {
        "epoch": 1659972000000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:20:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_1",
        "type": "smbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 265,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 62400000
      },
      {
        "epoch": 1659972300000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_2",
        "type": "smbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 265,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 62700000
      },
      {
        "epoch": 1659972600000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_3",
        "type": "smbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 117,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 63000000
      },
      {
        "epoch": 1659972900000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_4",
        "type": "smbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 117,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 63300000
      },
      {
        "epoch": 1659973200000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_5",
        "type": "smbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 117,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 63600000
      },
      {
        "epoch": 1659973500000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:45:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_6",
        "type": "smbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 61,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 63900000
      },
      {
        "epoch": 1659973800000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:50:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_7",
        "type": "smbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 61,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 64200000
      },
      {
        "epoch": 1659974100000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:55:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_8",
        "type": "smbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 61,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 64500000
      },
      {
        "epoch": 1659974400000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_9",
        "type": "smbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 61,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 64800000
      },
      {
        "epoch": 1659974700000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_10",
        "type": "smbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 40,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 65100000
      },
      {
        "epoch": 1659975000000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_11",
        "type": "smbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 40,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 65400000
      },
      {
        "epoch": 1659975300000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:15:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_12",
        "type": "smbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 40,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 65700000
      },
      {
        "epoch": 1659975600000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:20:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_13",
        "type": "smbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 40,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 66000000
      },
      {
        "epoch": 1659975900000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T16:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smb_2022-08-08_14",
        "type": "smbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 40,
        "localDate": "2022-08-08",
        "isoWeekday": "monday",
        "msPer24": 66300000
      }
    ],
    "warmUps": [],
    "wizards": [],
    "zenModes": [],
    "timezoneChanges": []
  }
}

export const minimalTrendViewData: Data = {
  dataRange: ['2020-01-01T00:00:00Z', '2020-01-20T00:00:00Z'],
  data: {
    "alarmEvents": [],
    "basal": [
      {
        "epoch": 1578501000000,
        "displayOffset": -60,
        "normalTime": "2020-01-08T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_2020_01_08_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "internalId": "3deeb71f-9b5b-496e-b0af-ef9512c2787f",
        "deliveryType": "automated",
        "rate": 0.8,
        "duration": 400000000,
        "normalEnd": "2020-01-13T07:36:40.000Z",
        "epochEnd": 1578901000000
      },
      {
        "epoch": 1578504600000,
        "displayOffset": -60,
        "normalTime": "2020-01-08T17:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_2020-01-08_2",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "internalId": "3deeb71f-9b5b-496e-b0af-ef9512c2787f",
        "deliveryType": "scheduled",
        "rate": 0.8,
        "duration": 500000000,
        "normalEnd": "2020-01-14T12:23:20.000Z",
        "epochEnd": 1579004600000
      }
    ],
    "bolus": [
      {
        "epoch": 1579314300000,
        "displayOffset": -60,
        "normalTime": "2020-01-18T02:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 22.3,
        "prescriptor": "manual",
        "wizard": null,
        "expectedNormal": 25,
        "insulinOnBoard": 3.1843607
      },
      {
        "epoch": 1579228500000,
        "displayOffset": -60,
        "normalTime": "2020-01-17T02:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId2",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 1.3,
        "prescriptor": "manual",
        "wizard": null
      },
      {
        "epoch": 1579315800000,
        "displayOffset": -60,
        "normalTime": "2020-01-18T02:50:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId2",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 1.3,
        "prescriptor": "manual",
        "wizard": null
      },
      {
        "epoch": 1579229400000,
        "displayOffset": -60,
        "normalTime": "2020-01-17T02:50:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId2",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 1.3,
        "prescriptor": "manual",
        "wizard": null
      },
      {
        "epoch": 1579310400000,
        "displayOffset": -60,
        "normalTime": "2020-01-18T01:20:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId2",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 1.3,
        "prescriptor": "manual",
        "wizard": null
      },
      {
        "epoch": 1579396800000,
        "displayOffset": -60,
        "normalTime": "2020-01-19T01:20:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId2",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 1.3,
        "prescriptor": "manual",
        "wizard": null
      },
      {
        "epoch": 1579449300000,
        "displayOffset": -60,
        "normalTime": "2020-01-19T15:55:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId4",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 9.05,
        "prescriptor": "manual",
        "wizard": null,
        "expectedNormal": 9.05,
        "insulinOnBoard": 3.0588088
      },
      {
        "epoch": 1579535100000,
        "displayOffset": -60,
        "normalTime": "2020-01-20T15:45:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId3",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 19.35,
        "prescriptor": "manual",
        "wizard": null,
        "expectedNormal": 19.35,
        "insulinOnBoard": 3.1218212
      }
    ],
    "cbg": [
      {
        "epoch": 1579514400000,
        "displayOffset": -60,
        "normalTime": "2020-01-20T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-20_0",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 182,
        "localDate": "2020-01-20",
        "isoWeekday": "monday",
        "msPer24": 39600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1579428000000,
        "displayOffset": -60,
        "normalTime": "2020-01-19T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-19_0",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 164,
        "localDate": "2020-01-19",
        "isoWeekday": "sunday",
        "msPer24": 39600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1579428000000,
        "displayOffset": -60,
        "normalTime": "2020-01-19T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-19_1",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 196,
        "localDate": "2020-01-19",
        "isoWeekday": "sunday",
        "msPer24": 39600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1579428000000,
        "displayOffset": -60,
        "normalTime": "2020-01-19T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-19_2",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 196,
        "localDate": "2020-01-19",
        "isoWeekday": "sunday",
        "msPer24": 39600000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1579341600000,
        "displayOffset": -60,
        "normalTime": "2020-01-18T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "2020-01-18_0",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 177,
        "localDate": "2020-01-18",
        "isoWeekday": "saturday",
        "msPer24": 39600000,
        "deviceName": "Unknown"
      }
    ],
    "confidentialModes": [],
    "deviceParametersChanges": [],
    "messages": [],
    "meals": [
      {
        "epoch": 1579428000000,
        "displayOffset": -60,
        "normalTime": "2020-01-19T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 385,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1579428000000,
        "displayOffset": -60,
        "normalTime": "2020-01-19T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 385,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1579510800000,
        "displayOffset": -60,
        "normalTime": "2020-01-20T09:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 128,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1579460400000,
        "displayOffset": -60,
        "normalTime": "2020-01-19T19:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 150,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1579559400000,
        "displayOffset": -60,
        "normalTime": "2020-01-20T22:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 450,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      }
    ],
    "physicalActivities": [],
    "pumpSettings": [],
    "reservoirChanges": [],
    "smbg": [],
    "warmUps": [],
    "wizards": [
      {
        "epoch": 1579428000000,
        "displayOffset": -60,
        "normalTime": "2020-01-19T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 385,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1579341600000,
        "displayOffset": -60,
        "normalTime": "2020-01-18T10:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 285,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      }
    ],
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2020-01-20",
        "isoWeekday": "monday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 265,
        "localDate": "2020-01-20",
        "isoWeekday": "monday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 117,
        "localDate": "2020-01-20",
        "isoWeekday": "monday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 117,
        "localDate": "2020-01-20",
        "isoWeekday": "monday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 61,
        "localDate": "2020-01-20",
        "isoWeekday": "monday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 61,
        "localDate": "2020-01-20",
        "isoWeekday": "monday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 61,
        "localDate": "2020-01-20",
        "isoWeekday": "monday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 40,
        "localDate": "2020-01-20",
        "isoWeekday": "monday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 40,
        "localDate": "2020-01-20",
        "isoWeekday": "monday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 40,
        "localDate": "2020-01-20",
        "isoWeekday": "monday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 40,
        "localDate": "2020-01-20",
        "isoWeekday": "monday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 40,
        "localDate": "2020-01-20",
        "isoWeekday": "monday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2020-01-20",
        "isoWeekday": "monday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2020-01-20",
        "isoWeekday": "monday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2020-01-20",
        "isoWeekday": "monday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2020-01-20",
        "isoWeekday": "monday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2020-01-01",
        "isoWeekday": "wednesday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2020-01-02",
        "isoWeekday": "thursday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2020-01-03",
        "isoWeekday": "friday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2020-01-04",
        "isoWeekday": "saturday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2020-01-05",
        "isoWeekday": "sunday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2020-01-06",
        "isoWeekday": "monday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2020-01-07",
        "isoWeekday": "tuesday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2020-01-08",
        "isoWeekday": "wednesday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2020-01-09",
        "isoWeekday": "thursday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2020-01-10",
        "isoWeekday": "friday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2020-01-11",
        "isoWeekday": "saturday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2020-01-12",
        "isoWeekday": "sunday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2020-01-13",
        "isoWeekday": "monday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2020-01-14",
        "isoWeekday": "tuesday",
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
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 189,
        "localDate": "2020-01-15",
        "isoWeekday": "wednesday",
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

export const mockDataAPI = (patientData: Data = completeDailyViewData) => {
  jest.spyOn(DataAPI, 'getPatientDataRange').mockResolvedValue(patientData.dataRange)
  jest.spyOn(DataAPI, 'getPatientData').mockImplementation(() => Promise.resolve(patientData.data))
}
