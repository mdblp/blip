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
import { type PatientData } from '../../../lib/data/models/patient-datum.model'
import { history } from '../data/data-api.data'
import type { PatientDataRange } from '../../../lib/data/models/data-range.model'

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
  data: PatientData
}

export const generateCompleteDashboardFromDate = (date: string): Data => {
  const endDate = new Date(moment().format('YYYY-MM-DD'))
  const startDate = new Date(date)
  const reservoirChangeDate = new Date(date)
  reservoirChangeDate.setDate(reservoirChangeDate.getDate() + 1)
  const reservoirChangeDateAsString = reservoirChangeDate.toISOString().split('T')[0]
  const data = []
  // eslint-disable-next-line no-unmodified-loop-condition
  while (startDate <= endDate) {
    const date = startDate.toISOString().split('T')[0]
    data.push(
      { time: `${date}T17:05:00Z`, type: 'cbg', id: 'cbg_17:05:00', timezone: 'Europe/Paris', units: 'mg/dL', value: 15, uploadId: 'osef', _userId: 'osef' },
      { time: `${date}T17:10:00Z`, type: 'cbg', id: 'cbg_17:10:00', timezone: 'Europe/Paris', units: 'mg/dL', value: 55, uploadId: 'osef', _userId: 'osef' },
      { time: `${date}T17:35:00Z`, type: 'cbg', id: 'cbg_17:35:00', timezone: 'Europe/Paris', units: 'mg/dL', value: 100, uploadId: 'osef', _userId: 'osef' },
      { time: `${date}T17:40:00Z`, type: 'cbg', id: 'cbg_17:40:00', timezone: 'Europe/Paris', units: 'mg/dL', value: 188, uploadId: 'osef', _userId: 'osef' },
      { time: `${date}T18:05:00Z`, type: 'cbg', id: 'cbg_18:05:00', timezone: 'Europe/Paris', units: 'mg/dL', value: 260, uploadId: 'osef', _userId: 'osef' },
      { time: `${date}T18:25:00Z`, type: 'bolus', id: WIZARD_BOLUS_UNDELIVERED_ID, timezone: 'Europe/Paris', prescriptor: 'auto', normal: 2, subType: 'normal', uploadId: 'osef', _userId: 'osef' },
      { time: `${date}T18:35:00Z`, type: 'wizard', id: WIZARD_UNDELIVERED_ID, timezone: 'Europe/Paris', units: 'mmol/L', carbInput: 30, bolus: WIZARD_BOLUS_UNDELIVERED_ID, uploadId: 'osef', _userId: 'osef' },
      { time: `${date}T19:25:00Z`, type: 'wizard', id: WIZARD_UMM_ID, timezone: 'Europe/Paris', units: 'mmol/L', carbInput: 20, inputMeal: { source: 'umm' }, bolus: WIZARD_BOLUS_UNDELIVERED_ID, uploadId: 'osef', _userId: 'osef' },
      { time: `${date}T16:35:00Z`, type: 'pumpSettings', id: 'pump_2022-08-08_6', timezone: 'UTC', uploadId: 'osef', payload: { basalsecurityprofile: null, cgm: { apiVersion: 'v1', endOfLifeTransmitterDate: '2050-04-12T17:53:54+02:00', expirationDate: '2050-04-12T17:53:54+02:00', manufacturer: 'Dexcom', name: 'G6', swVersionTransmitter: 'v1', transmitterId: 'a1234' }, device: { deviceId: '1234', imei: '1234567890', manufacturer: 'Diabeloop', name: 'DBLG1', swVersion: 'beta' }, history, parameters: [{ name: 'WEIGHT', value: '72', unit: 'kg', level: 1, effectiveDate: '2020-01-17T08:00:00Z' }], pump: { expirationDate: '2050-04-12T17:53:54+02:00', manufacturer: 'Vicentra', name: 'Kaleido', serialNumber: '123456', swVersion: 'beta' } }, _userId: 'osef' },
      { time: `${date}T16:30:00Z`, type: 'basal', deliveryType: 'scheduled', duration: 7200, id: 'basal_166cc04053fac_2022-12-13_0', rate: 100, timezone: 'Europe/Paris' },
      { time: `${date}T19:35:00Z`, type: 'basal', deliveryType: 'automated', duration: 72000, id: 'basal_166cc04053fac_2022-12-13_1', rate: 100, timezone: 'Europe/Paris' },
      { time: `${date}T19:35:00Z`, type: 'food', id: 'food_19-35-00', meal: 'rescuecarbs', nutrition: { carbohydrate: { net: 25, units: 'grams' } }, timezone: 'Europe/Paris', uploadId: 'osef' },
      { time: `${date}T13:00:00Z`, type: 'physicalActivity', id: PHYSICAL_ACTIVITY_ID, timezone: 'Europe/Paris', duration: { units: 'seconds', value: 1800 }, guid: 'pa_18', reportedIntensity: 'medium', uploadId: 'osef', _userId: 'osef' },
      { time: `${date}T08:00:00Z`, type: 'deviceEvent', id: PARAMETER_ID, lastUpdateDate: '2022-08-08T08:00:00Z', level: '1', name: 'MEAL_RATIO_LUNCH_FACTOR', previousValue: '110', subType: 'deviceParameter', timezone: 'UTC', units: '%', uploadId: 'osef', value: '100', _userId: 'osef' }
    )
    startDate.setDate(startDate.getDate() + 1)
  }
  data.push(
    { time: `${reservoirChangeDateAsString}T17:00:00Z`, type: 'deviceEvent', id: RESERVOIR_CHANGE_ID, subType: 'reservoirChange', timezone: 'Europe/Paris', uploadId: 'osef', _userId: 'osef' }
  )
  return {
    dataRange: [`${date}T00:00:00Z`, `${moment().format('YYYY-MM-DD')}T00:00:00Z`],
    data
  }
}

export const completeDashboardData = generateCompleteDashboardFromDate(yesterdayDateAsString)
export const twoWeeksOldDashboardData = generateCompleteDashboardFromDate(twoWeeksAgoDateAsString)
export const sixteenDaysOldDashboardData = generateCompleteDashboardFromDate(sixteenDaysAgoDateAsString)

export const completeDailyViewData: Data = {
  dataRange: ['2022-08-08T15:00:00Z', '2022-08-08T18:40:00Z'],
  data: [
    { time: '2022-08-08T15:15:00Z', type: 'smbg', id: SMBG_ID, timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T15:30:00Z', type: 'cbg', id: CBG_ID, timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T15:35:00Z', type: 'cbg', id: 'cbg_2022-08-08T15:35:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 14.7, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T15:40:00Z', type: 'cbg', id: 'cbg_2022-08-08T15:40:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 14.7, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:00:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:00:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 6.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:05:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:05:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 6.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:10:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:10:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 6.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:20:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:20:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:25:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:25:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:30:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:30:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:35:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:35:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:45:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:45:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:50:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:50:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:55:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:55:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T17:00:00Z', type: 'cbg', id: 'cbg_2022-08-08T17:00:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T17:05:00Z', type: 'cbg', id: 'cbg_2022-08-08T17:05:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T18:25:00Z', type: 'bolus', id: WIZARD_BOLUS_UNDELIVERED_ID, timezone: 'Europe/Paris', prescriptor: 'auto', normal: 22.3, expectedNormal: 25, insulinOnBoard: 3.1843607, subType: 'normal', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T18:25:00Z', type: 'wizard', id: WIZARD_UNDELIVERED_ID, timezone: 'Europe/Paris', units: 'mmol/L', carbInput: 45, bolus: WIZARD_BOLUS_UNDELIVERED_ID, uploadId: 'osef', _userId: 'osef', inputMeal: { fat: 'yes' }, inputTime: WIZARD_UNDELIVERED_INPUT_TIME, recommended: { carb: 0, correction: 0, net: 25 } },
    { time: '2022-08-08T18:35:00Z', type: 'bolus', id: WIZARD_BOLUS_UMM_ID, timezone: 'Europe/Paris', prescriptor: 'auto', normal: 1.3, subType: 'normal', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T18:35:00Z', type: 'wizard', id: WIZARD_UMM_ID, timezone: 'Europe/Paris', units: 'mmol/L', carbInput: 50, bolus: WIZARD_BOLUS_UMM_ID, uploadId: 'osef', _userId: 'osef', inputMeal: { source: 'umm' }, inputTime: WIZARD_UMM_INPUT_TIME },
    { time: '2022-08-08T18:45:00Z', type: 'bolus', id: WIZARD_BOLUS_POSITIVE_OVERRIDE_ID, timezone: 'Europe/Paris', prescriptor: 'hybrid', normal: 19.35, expectedNormal: 19.35, insulinOnBoard: 3.1218212, subType: 'normal', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T18:45:00Z', type: 'wizard', id: WIZARD_POSITIVE_OVERRIDE_ID, timezone: 'Europe/Paris', units: 'mmol/L', carbInput: 100, bolus: WIZARD_BOLUS_POSITIVE_OVERRIDE_ID, uploadId: 'osef', _userId: 'osef', inputTime: WIZARD_POSITIVE_OVERRIDE_INPUT_TIME, recommended: { carb: 0, correction: 0, net: 14.35 } },
    { time: '2022-08-08T18:55:00Z', type: 'bolus', id: WIZARD_BOLUS_NEGATIVE_OVERRIDE_ID, timezone: 'Europe/Paris', prescriptor: 'hybrid', normal: 9.05, expectedNormal: 9.05, insulinOnBoard: 3.0588088, subType: 'normal', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T18:55:00Z', type: 'wizard', id: WIZARD_NEGATIVE_OVERRIDE_ID, timezone: 'Europe/Paris', units: 'mmol/L', carbInput: 100, bolus: WIZARD_BOLUS_NEGATIVE_OVERRIDE_ID, uploadId: 'osef', _userId: 'osef', inputTime: WIZARD_NEGATIVE_OVERRIDE_INPUT_TIME, recommended: { carb: 0, correction: 0, net: 10.05 } },
    { time: '2022-08-08T16:30:00Z', type: 'basal', id: 'basal_2022-08-08_5', timezone: 'Europe/Paris', deliveryType: 'automated', duration: 1000, internalId: '3deeb71f-9b5b-496e-b0af-ef9512c2787f', rate: 0.8, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:35:00Z', type: 'pumpSettings', id: 'pump_2022-08-08_6', timezone: 'UTC', uploadId: 'osef', payload: { basalsecurityprofile: null, cgm: { apiVersion: 'v1', endOfLifeTransmitterDate: '2050-04-12T17:53:54+02:00', expirationDate: '2050-04-12T17:53:54+02:00', manufacturer: 'Dexcom', name: 'G6', swVersionTransmitter: 'v1', transmitterId: 'a1234' }, device: { deviceId: '1234', imei: '1234567890', manufacturer: 'Diabeloop', name: 'DBLG1', swVersion: 'beta' }, history, parameters: [{ name: 'WEIGHT', value: '72', unit: 'kg', level: 1, effectiveDate: '2020-01-17T08:00:00Z' }], pump: { expirationDate: '2050-04-12T17:53:54+02:00', manufacturer: 'Vicentra', name: 'Kaleido', serialNumber: '123456', swVersion: 'beta' } }, _userId: 'osef' },
    { time: '2022-08-08T02:00:00Z', type: 'deviceEvent', id: 'deviceEvent_2022-08-08_8', timezone: 'Europe/Paris', duration: { units: 'hours', value: 2 }, guid: 'confidential_0', inputTime: '2022-08-08T02:00:00Z', subType: 'confidential', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T12:00:00Z', type: 'food', id: CARB_ID, timezone: 'Europe/Paris', meal: 'rescuecarbs', nutrition: { carbohydrate: { net: 15, units: 'grams' } }, prescribedNutrition: { carbohydrate: { net: 16, units: 'grams' } }, prescriptor: 'hybrid', uploadId: 'osef', _userId: 'osef' },
    { time: PHYSICAL_ACTIVITY_TIME, type: 'physicalActivity', id: PHYSICAL_ACTIVITY_ID, timezone: 'Europe/Paris', duration: { units: 'seconds', value: 1800 }, guid: 'pa_18', reportedIntensity: 'medium', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T17:00:00Z', type: 'deviceEvent', id: RESERVOIR_CHANGE_ID, subType: 'reservoirChange', timezone: 'Europe/Paris', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T08:00:00Z', type: 'deviceEvent', id: PARAMETER_ID, lastUpdateDate: '2022-08-08T08:00:00Z', level: '1', name: 'MEAL_RATIO_LUNCH_FACTOR', previousValue: '110', subType: 'deviceParameter', timezone: 'UTC', units: '%', uploadId: 'osef', value: '100', _userId: 'osef' },
    { time: '2022-08-08T09:00:00Z', type: 'deviceEvent', id: 'alarm-01', guid: ALARM_EVENT_HYPERGLYCEMIA_ID, subType: 'alarm', ackStatus: 'acknowledged', alarmCode: '10113', alarmLabel: 'NA', alarmLevel: 'alert', alarmType: 'handset', eventId: 'Alarm7001', timezone: 'Europe/Paris', updateTime: '2023-07-14T17:48:18.602Z', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T09:05:00Z', type: 'deviceEvent', id: 'alarm-011', guid: ALARM_EVENT_HYPERGLYCEMIA_OTHER_OCCURRENCE_ID, subType: 'alarm', ackStatus: 'acknowledged', alarmCode: '10113', alarmLabel: 'NA', alarmLevel: 'alert', alarmType: 'handset', eventId: 'Alarm7001', timezone: 'Europe/Paris', updateTime: '2023-07-14T17:48:18.602Z', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T09:05:00Z', type: 'deviceEvent', id: 'alarm-02', guid: ALARM_EVENT_HYPOGLYCEMIA_ID, subType: 'alarm', ackStatus: 'acknowledged', alarmCode: '12000', alarmLabel: 'NA', alarmLevel: 'alarm', alarmType: 'handset', eventId: 'Alarm7002', timezone: 'Europe/Paris', updateTime: '2023-07-14T17:48:18.602Z', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T09:10:00Z', type: 'deviceEvent', id: 'alarm-03', guid: ALARM_EVENT_INSIGHT_EMPTY_INSULIN_CARTRIDGE_ID, subType: 'alarm', ackStatus: 'acknowledged', alarmCode: '71002', alarmLabel: 'NA', alarmLevel: 'alarm', alarmType: 'handset', eventId: 'Alarm7003', timezone: 'Europe/Paris', updateTime: '2023-07-14T17:48:18.602Z', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T09:15:00Z', type: 'deviceEvent', id: 'alarm-04', guid: ALARM_EVENT_INSIGHT_EMPTY_PUMP_BATTERY_ID, subType: 'alarm', ackStatus: 'acknowledged', alarmCode: '71001', alarmLabel: 'NA', alarmLevel: 'alarm', alarmType: 'handset', eventId: 'Alarm7004', timezone: 'Europe/Paris', updateTime: '2023-07-14T17:48:18.602Z', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T09:20:00Z', type: 'deviceEvent', id: 'alarm-05', guid: ALARM_EVENT_INSIGHT_HYPOGLYCEMIA_ID, subType: 'alarm', ackStatus: 'acknowledged', alarmCode: '10117', alarmLabel: 'NA', alarmLevel: 'alert', alarmType: 'handset', eventId: 'Alarm7005', timezone: 'Europe/Paris', updateTime: '2023-07-14T17:48:18.602Z', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T09:25:00Z', type: 'deviceEvent', id: 'alarm-06', guid: ALARM_EVENT_INSIGHT_INCOMPATIBLE_ACTIONS_ON_PUMP_ID, subType: 'alarm', ackStatus: 'acknowledged', alarmCode: '71003', alarmLabel: 'NA', alarmLevel: 'alarm', alarmType: 'handset', eventId: 'Alarm7006', timezone: 'Europe/Paris', updateTime: '2023-07-14T17:48:18.602Z', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T09:30:00Z', type: 'deviceEvent', id: 'alarm-07', guid: ALARM_EVENT_INSIGHT_INSULIN_CARTRIDGE_EXPIRED_ID, subType: 'alarm', ackStatus: 'acknowledged', alarmCode: '71020', alarmLabel: 'NA', alarmLevel: 'alarm', alarmType: 'handset', eventId: 'Alarm7007', timezone: 'Europe/Paris', updateTime: '2023-07-14T17:48:18.602Z', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T09:35:00Z', type: 'deviceEvent', id: 'alarm-08', guid: ALARM_EVENT_INSIGHT_OCCLUSION_ID, subType: 'alarm', ackStatus: 'acknowledged', alarmCode: '71004', alarmLabel: 'NA', alarmLevel: 'alarm', alarmType: 'handset', eventId: 'Alarm7008', timezone: 'Europe/Paris', updateTime: '2023-07-14T17:48:18.602Z', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T09:40:00Z', type: 'deviceEvent', id: 'alarm-09', guid: ALARM_EVENT_KALEIDO_EMPTY_INSULIN_CARTRIDGE_ID, subType: 'alarm', ackStatus: 'acknowledged', alarmCode: '41002', alarmLabel: 'NA', alarmLevel: 'alarm', alarmType: 'handset', eventId: 'Alarm7009', timezone: 'Europe/Paris', updateTime: '2023-07-14T17:48:18.602Z', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T09:45:00Z', type: 'deviceEvent', id: 'alarm-10', guid: ALARM_EVENT_KALEIDO_EMPTY_PUMP_BATTERY_ID, subType: 'alarm', ackStatus: 'acknowledged', alarmCode: '41001', alarmLabel: 'NA', alarmLevel: 'alarm', alarmType: 'handset', eventId: 'Alarm7010', timezone: 'Europe/Paris', updateTime: '2023-07-14T17:48:18.602Z', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T09:50:00Z', type: 'deviceEvent', id: 'alarm-11', guid: ALARM_EVENT_KALEIDO_INSULIN_CARTRIDGE_EXPIRED_ID, subType: 'alarm', ackStatus: 'acknowledged', alarmCode: '41003', alarmLabel: 'NA', alarmLevel: 'alarm', alarmType: 'handset', eventId: 'Alarm7011', timezone: 'Europe/Paris', updateTime: '2023-07-14T17:48:18.602Z', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T09:55:00Z', type: 'deviceEvent', id: 'alarm-12', guid: ALARM_EVENT_KALEIDO_OCCLUSION_ID, subType: 'alarm', ackStatus: 'acknowledged', alarmCode: '41004', alarmLabel: 'NA', alarmLevel: 'alarm', alarmType: 'handset', eventId: 'Alarm7012', timezone: 'Europe/Paris', updateTime: '2023-07-14T17:48:18.602Z', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T10:00:00Z', type: 'deviceEvent', id: 'alarm-13', guid: ALARM_EVENT_LONG_HYPERGLYCEMIA_ID, subType: 'alarm', ackStatus: 'acknowledged', alarmCode: '15000', alarmLabel: 'NA', alarmLevel: 'alarm', alarmType: 'handset', eventId: 'Alarm7013', timezone: 'Europe/Paris', updateTime: '2023-07-14T17:48:18.602Z', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T10:05:00Z', type: 'deviceEvent', id: 'alarm-14', guid: ALARM_EVENT_LONG_HYPOGLYCEMIA_ID, subType: 'alarm', ackStatus: 'acknowledged', alarmCode: '24000', alarmLabel: 'NA', alarmLevel: 'alarm', alarmType: 'handset', eventId: 'Alarm7014', timezone: 'Europe/Paris', updateTime: '2023-07-14T17:48:18.602Z', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T10:10:00Z', type: 'deviceEvent', id: 'alarm-15', guid: ALARM_EVENT_NO_READINGS_HYPOGLYCEMIA_RISK_ID, subType: 'alarm', ackStatus: 'acknowledged', alarmCode: '20100', alarmLabel: 'NA', alarmLevel: 'alert', alarmType: 'handset', eventId: 'Alarm7015', timezone: 'Europe/Paris', updateTime: '2023-07-14T17:48:18.602Z', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T10:15:00Z', type: 'deviceEvent', id: 'alarm-16', guid: ALARM_EVENT_SENSOR_SESSION_EXPIRED_ID, subType: 'alarm', ackStatus: 'acknowledged', alarmCode: '11000', alarmLabel: 'NA', alarmLevel: 'alarm', alarmType: 'handset', eventId: 'Alarm7016', timezone: 'Europe/Paris', updateTime: '2023-07-14T17:48:18.602Z', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T10:20:00Z', type: 'deviceEvent', id: 'alarm-17', guid: ALARM_EVENT_SUDDEN_RISE_IN_GLYCEMIA_ID, subType: 'alarm', ackStatus: 'acknowledged', alarmCode: '20102', alarmLabel: 'NA', alarmLevel: 'alert', alarmType: 'handset', eventId: 'Alarm7017', timezone: 'Europe/Paris', updateTime: '2023-07-14T17:48:18.602Z', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T10:25:00Z', type: 'deviceEvent', id: 'alarm-18', guid: ALARM_EVENT_URGENT_LOW_SOON_ID, subType: 'alarm', ackStatus: 'acknowledged', alarmCode: '10112', alarmLabel: 'NA', alarmLevel: 'alert', alarmType: 'handset', eventId: 'Alarm7018', timezone: 'Europe/Paris', updateTime: '2023-07-14T17:48:18.602Z', uploadId: 'osef', _userId: 'osef' }
  ]
}
export const dataSetsWithZeroValues: Data = {
  dataRange: ['2022-08-08T15:00:00Z', '2022-08-08T18:40:00Z'],
  data: [
    { time: '2022-08-08T15:30:00Z', type: 'cbg', id: CBG_ID, timezone: 'Europe/Paris', units: 'mmol/L', value: 0, uploadId: 'osef', _userId: 'osef' },
    { time: PHYSICAL_ACTIVITY_TIME, type: 'physicalActivity', id: PHYSICAL_ACTIVITY_ID, timezone: 'Europe/Paris', duration: { units: 'seconds', value: 0 }, guid: 'pa_18', reportedIntensity: 'medium', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T17:00:00Z', type: 'deviceEvent', id: RESERVOIR_CHANGE_ID, subType: 'reservoirChange', timezone: 'Europe/Paris', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T08:00:00Z', type: 'deviceEvent', id: PARAMETER_ID, lastUpdateDate: '2022-08-08T08:00:00Z', level: '1', name: 'MEAL_RATIO_LUNCH_FACTOR', previousValue: '110', subType: 'deviceParameter', timezone: 'UTC', units: '%', uploadId: 'osef', value: '100', _userId: 'osef' },
    { time: '2022-08-08T16:35:00Z', type: 'pumpSettings', id: 'pump_2022-08-08_6', timezone: 'UTC', uploadId: 'osef', payload: { basalsecurityprofile: null, cgm: { apiVersion: 'v1', endOfLifeTransmitterDate: '2050-04-12T17:53:54+02:00', expirationDate: '2050-04-12T17:53:54+02:00', manufacturer: 'Dexcom', name: 'G6', swVersionTransmitter: 'v1', transmitterId: 'a1234' }, device: { deviceId: '1234', imei: '1234567890', manufacturer: 'Diabeloop', name: 'DBLG1', swVersion: 'beta' }, history: [], parameters: [{ level: 1, effectiveDate: '2020-01-17T08:00:00Z' }], pump: { expirationDate: '2050-04-12T17:53:54+02:00', manufacturer: 'Vicentra', name: 'Kaleido', serialNumber: '123456', swVersion: 'beta' } }, _userId: 'osef' },
  ]
}

export const smbgData: Data = {
  dataRange: ['2022-08-08T11:30:00Z', '2022-08-08T18:30:00Z'],
  data: [
    { time: '2022-08-08T15:15:00Z', type: 'smbg', id: 'smb_2022-08-08_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T15:20:00Z', type: 'smbg', id: 'smb_2022-08-08_1', timezone: 'Europe/Paris', units: 'mmol/L', value: 14.7, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T15:25:00Z', type: 'smbg', id: 'smb_2022-08-08_2', timezone: 'Europe/Paris', units: 'mmol/L', value: 14.7, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T15:30:00Z', type: 'smbg', id: 'smb_2022-08-08_3', timezone: 'Europe/Paris', units: 'mmol/L', value: 6.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T15:35:00Z', type: 'smbg', id: 'smb_2022-08-08_4', timezone: 'Europe/Paris', units: 'mmol/L', value: 6.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T15:40:00Z', type: 'smbg', id: 'smb_2022-08-08_5', timezone: 'Europe/Paris', units: 'mmol/L', value: 6.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T15:45:00Z', type: 'smbg', id: 'smb_2022-08-08_6', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T15:50:00Z', type: 'smbg', id: 'smb_2022-08-08_7', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T15:55:00Z', type: 'smbg', id: 'smb_2022-08-08_8', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:00:00Z', type: 'smbg', id: 'smb_2022-08-08_9', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:05:00Z', type: 'smbg', id: 'smb_2022-08-08_10', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:10:00Z', type: 'smbg', id: 'smb_2022-08-08_11', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:15:00Z', type: 'smbg', id: 'smb_2022-08-08_12', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:20:00Z', type: 'smbg', id: 'smb_2022-08-08_13', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:25:00Z', type: 'smbg', id: 'smb_2022-08-08_14', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' }
  ]
}

export const minimalTrendViewData: Data = {
  dataRange: ['2020-01-01T00:00:00Z', '2020-01-20T00:00:00Z'],
  data: [
    { time: '2020-01-20T10:00:00Z', type: 'cbg', id: '2020-01-20_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.1, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-19T10:00:00Z', type: 'cbg', id: '2020-01-19_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 9.1, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-19T10:00:00Z', type: 'cbg', id: '2020-01-19_1', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.9, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-19T10:00:00Z', type: 'cbg', id: '2020-01-19_2', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.9, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-18T10:00:00Z', type: 'cbg', id: '2020-01-18_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 9.8, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-19T10:00:00Z', type: 'wizard', id: WIZARD_UNDELIVERED_ID, timezone: 'Europe/Paris', units: 'mmol/L', carbInput: 385, bolus: WIZARD_BOLUS_UNDELIVERED_ID, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-18T10:00:00Z', type: 'wizard', id: WIZARD_UMM_ID, timezone: 'Europe/Paris', units: 'mmol/L',inputMeal: { source: 'umm' }, carbInput: 285, bolus: WIZARD_BOLUS_UNDELIVERED_ID, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-19T10:00:00Z', type: 'food', id: 'food_19-35-00', meal: 'rescuecarbs', nutrition: { carbohydrate: { net: 385, units: 'grams' } }, timezone: 'Europe/Paris', _userId: 'osef', uploadId: 'osef' },
    { time: '2020-01-08T16:30:00Z', type: 'basal', id: 'basal_2020_01_08_1', timezone: 'Europe/Paris', deliveryType: 'automated', duration: 400000000, internalId: '3deeb71f-9b5b-496e-b0af-ef9512c2787f', rate: 0.8, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-08T17:30:00Z', type: 'basal', id: 'basal_2020-01-08_2', timezone: 'Europe/Paris', deliveryType: 'scheduled', duration: 500000000, internalId: '3deeb71f-9b5b-496e-b0af-ef9512c2787f', rate: 0.8, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-18T02:25:00Z', type: 'bolus', id: WIZARD_BOLUS_UNDELIVERED_ID, timezone: 'Europe/Paris', prescriptor: 'manual', normal: 22.3, expectedNormal: 25, insulinOnBoard: 3.1843607, subType: 'normal', uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-17T02:35:00Z', type: 'bolus', id: WIZARD_BOLUS_UMM_ID, timezone: 'Europe/Paris', prescriptor: 'manual', normal: 1.3, subType: 'normal', uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-18T02:50:00Z', type: 'bolus', id: WIZARD_BOLUS_UMM_ID, timezone: 'Europe/Paris', prescriptor: 'manual', normal: 1.3, subType: 'normal', uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-17T02:50:00Z', type: 'bolus', id: WIZARD_BOLUS_UMM_ID, timezone: 'Europe/Paris', prescriptor: 'manual', normal: 1.3, subType: 'normal', uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-18T01:20:00Z', type: 'bolus', id: WIZARD_BOLUS_UMM_ID, timezone: 'Europe/Paris', prescriptor: 'manual', normal: 1.3, subType: 'normal', uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-19T01:20:00Z', type: 'bolus', id: WIZARD_BOLUS_UMM_ID, timezone: 'Europe/Paris', prescriptor: 'manual', normal: 1.3, subType: 'normal', uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-19T15:55:00Z', type: 'bolus', id: WIZARD_BOLUS_NEGATIVE_OVERRIDE_ID, timezone: 'Europe/Paris', prescriptor: 'manual', normal: 9.05, expectedNormal: 9.05, insulinOnBoard: 3.0588088, subType: 'normal', uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-20T15:45:00Z', type: 'bolus', id: WIZARD_BOLUS_POSITIVE_OVERRIDE_ID, timezone: 'Europe/Paris', prescriptor: 'manual', normal: 19.35, expectedNormal: 19.35, insulinOnBoard: 3.1218212, subType: 'normal', uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-19T10:00:00Z', type: 'food', id: 'food_19-35-00', meal: 'rescuecarbs', nutrition: { carbohydrate: { net: 385, units: 'grams' } }, timezone: 'Europe/Paris', _userId: 'osef', uploadId: 'osef' },
    { time: '2020-01-20T09:00:00Z', type: 'food', id: 'food_19-35-00', meal: 'rescuecarbs', nutrition: { carbohydrate: { net: 128, units: 'grams' } }, timezone: 'Europe/Paris', _userId: 'osef', uploadId: 'osef' },
    { time: '2020-01-19T19:00:00Z', type: 'food', id: 'food_19-35-00', meal: 'rescuecarbs', nutrition: { carbohydrate: { net: 150, units: 'grams' } }, timezone: 'Europe/Paris', _userId: 'osef', uploadId: 'osef' },
    { time: '2020-01-20T22:30:00Z', type: 'food', id: 'food_19-35-00', meal: 'rescuecarbs', nutrition: { carbohydrate: { net: 450, units: 'grams' } }, timezone: 'Europe/Paris', _userId: 'osef', uploadId: 'osef' },
  ]
}

export const timeInRangeStatsTrendViewData: Data = {
  dataRange: ['2020-01-19T00:00:00Z', '2020-01-20T00:00:00Z'],
  data: [
    { time: '2020-01-20T10:00:00Z', type: 'cbg', id: '2020-01-20_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-20T11:00:00Z', type: 'cbg', id: '2020-01-20_1', timezone: 'Europe/Paris', units: 'mmol/L', value: 14.7, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-20T11:05:00Z', type: 'cbg', id: '2020-01-20_3', timezone: 'Europe/Paris', units: 'mmol/L', value: 6.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-20T11:10:00Z', type: 'cbg', id: '2020-01-20_4', timezone: 'Europe/Paris', units: 'mmol/L', value: 6.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-20T11:15:00Z', type: 'cbg', id: '2020-01-20_5', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-20T11:20:00Z', type: 'cbg', id: '2020-01-20_6', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-20T11:25:00Z', type: 'cbg', id: '2020-01-20_7', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-20T11:30:00Z', type: 'cbg', id: '2020-01-20_8', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-20T11:35:00Z', type: 'cbg', id: '2020-01-20_9', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-20T11:40:00Z', type: 'cbg', id: '2020-01-20_10', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-20T11:45:00Z', type: 'cbg', id: '2020-01-20_11', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-20T11:50:00Z', type: 'cbg', id: '2020-01-20_12', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-20T11:55:00Z', type: 'cbg', id: '2020-01-20_13', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-20T12:00:00Z', type: 'cbg', id: '2020-01-20_14', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-20T12:05:00Z', type: 'cbg', id: '2020-01-20_15', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-20T12:10:00Z', type: 'cbg', id: '2020-01-20_16', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' }
  ]
}

export const twoWeeksOfCbg: Data = {
  dataRange: ['2020-01-01T00:00:00Z', '2020-01-15T23:00:00Z'],
  data: [
    { time: '2020-01-01T10:00:00Z', type: 'cbg', id: '2020-01-01_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-02T10:00:00Z', type: 'cbg', id: '2020-01-02_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-03T10:00:00Z', type: 'cbg', id: '2020-01-03_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-04T10:00:00Z', type: 'cbg', id: '2020-01-04_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-05T10:00:00Z', type: 'cbg', id: '2020-01-05_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-06T10:00:00Z', type: 'cbg', id: '2020-01-06_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-07T10:00:00Z', type: 'cbg', id: '2020-01-07_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-08T10:00:00Z', type: 'cbg', id: '2020-01-08_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-09T10:00:00Z', type: 'cbg', id: '2020-01-09_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-10T10:00:00Z', type: 'cbg', id: '2020-01-10_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-11T10:00:00Z', type: 'cbg', id: '2020-01-11_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-12T10:00:00Z', type: 'cbg', id: '2020-01-12_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-13T10:00:00Z', type: 'cbg', id: '2020-01-13_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-14T10:00:00Z', type: 'cbg', id: '2020-01-14_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-15T10:00:00Z', type: 'cbg', id: '2020-01-15_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' }
  ]
}

export const pumpSettingsData: Data = {
  dataRange: ['2022-08-08T16:35:00Z', '2022-08-08T16:40:00Z'],
  data: [
    {
      time: '2020-01-01T10:00:00Z',
      type: 'pumpSettings',
      id: 'pump_settings',
      timezone: 'UTC',
      uploadId: 'osef',
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
          { name: 'WEIGHT', value: '72', unit: 'kg', level: 1, effectiveDate: '2020-01-17T08:00:00Z' },
          { name: 'MEDIUM_MEAL_BREAKFAST', value: '36', unit: 'g', level: 1, effectiveDate: '2020-01-17T08:00:00Z' },
          { name: 'MEDIUM_MEAL_DINNER', value: '96', unit: 'g', level: 1, effectiveDate: '2020-01-17T08:00:00Z' },
          { name: 'PATIENT_GLYCEMIA_TARGET', value: '110', unit: 'mg/dL', level: 1, effectiveDate: '2020-01-17T08:00:00Z' },
          { name: 'PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA', value: '100', unit: '%', level: 1, effectiveDate: '2020-01-17T08:00:00Z' },
          { name: 'PATIENT_GLY_HYPER_LIMIT', value: '180', unit: 'mg/dL', level: 1, effectiveDate: '2020-01-17T08:00:00Z' },
          { name: 'MEDIUM_MEAL_LUNCH', value: '96', unit: 'g', level: 1, effectiveDate: '2020-01-17T08:00:00Z' },
          { name: 'PATIENT_GLY_HYPO_LIMIT', value: '75', unit: 'mg/dL', level: 1, effectiveDate: '2020-01-17T08:00:00Z' },
          { name: 'BOLUS_AGGRESSIVENESS_FACTOR', value: '100', unit: '%', level: 1, effectiveDate: '2020-01-17T08:00:00Z' },
          { name: 'SMALL_MEAL_LUNCH', value: '48', unit: 'g', level: 1, effectiveDate: '2020-01-17T08:00:00Z' },
          { name: 'SMALL_MEAL_BREAKFAST', value: '18', unit: 'g', level: 1, effectiveDate: '2020-01-17T08:00:00Z' },
          { name: 'MEAL_RATIO_LUNCH_FACTOR', value: '100', unit: '%', level: 1, effectiveDate: '2020-01-17T08:00:00Z' },
          { name: 'LARGE_MEAL_DINNER', value: '144', unit: 'g', level: 1, effectiveDate: '2020-01-17T08:00:00Z' },
          { name: 'MEAL_RATIO_DINNER_FACTOR', value: '80', unit: '%', level: 1, effectiveDate: '2020-01-17T08:00:00Z' },
          { name: 'LARGE_MEAL_BREAKFAST', value: '54', unit: 'g', level: 1, effectiveDate: '2020-01-17T08:00:00Z' },
          { name: 'MEAL_RATIO_BREAKFAST_FACTOR', value: '100', unit: '%', level: 1, effectiveDate: '2020-01-17T08:00:00Z' },
          { name: 'LARGE_MEAL_LUNCH', value: '144', unit: 'g', level: 1, effectiveDate: '2020-01-17T08:00:00Z' },
          { name: 'SMALL_MEAL_DINNER', value: '48', unit: 'g', level: 1, effectiveDate: '2020-01-17T08:00:00Z' }
        ],
        pump: {
          expirationDate: '2050-04-12T17:53:54+02:00',
          manufacturer: 'Vicentra',
          name: 'Kaleido',
          serialNumber: '123456',
          swVersion: 'beta'
        }
      },
      _userId: 'osef'
    },
    {
      time: '2020-01-01T10:00:00Z',
      type: 'cbg',
      id: '2020-01-01_0',
      timezone: 'Europe/Paris',
      units: 'mmol/L',
      value: 10.5,
      uploadId: 'osef',
      _userId: 'osef'
    }
  ]
}

export const mockDataAPI = (patientData: Data = completeDailyViewData) => {
  jest.spyOn(DataAPI, 'getPatientDataRange').mockResolvedValue(patientData.dataRange)
  jest.spyOn(DataAPI, 'getMessages').mockResolvedValue([])
  jest.spyOn(DataAPI, 'getPatientData').mockImplementation(() => Promise.resolve(patientData.data))
}
