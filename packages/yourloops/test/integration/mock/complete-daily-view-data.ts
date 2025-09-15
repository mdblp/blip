/*
 * Copyright (c) 2024-2025, Diabeloop
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

import {
  AlarmCode,
  AlarmEventType,
  AlarmLevel,
  BasalDeliveryType,
  BolusSubtype,
  DatumType,
  DeviceSystem,
  DurationUnit,
  Prescriptor,
  PumpManufacturer,
  Source,
  Unit,
  WizardInputMealFat,
  WizardInputMealSource
} from 'medical-domain'
import {
  DeviceEventSubtype
} from 'medical-domain/dist/src/domains/models/medical/datum/enums/device-event-subtype.enum'
import WeekDays from 'medical-domain/dist/src/domains/models/time/enum/weekdays.enum'
import Intensity from 'medical-domain/dist/src/domains/models/medical/datum/enums/intensity.enum'
import { history } from '../data/data-api.data'
import {
  ALARM_EVENT_DANA_EMPTY_PUMP_BATTERY_ID,
  ALARM_EVENT_DANA_EMPTY_RESERVOIR_ID,
  ALARM_EVENT_DANA_INCOMPATIBLE_ACTIONS_ON_PUMP_ID,
  ALARM_EVENT_DANA_OCCLUSION_ID,
  ALARM_EVENT_HYPERGLYCEMIA_ID,
  ALARM_EVENT_HYPERGLYCEMIA_OTHER_OCCURRENCE_ID,
  ALARM_EVENT_HYPOGLYCEMIA_ID,
  ALARM_EVENT_INSIGHT_EMPTY_INSULIN_CARTRIDGE_ID,
  ALARM_EVENT_INSIGHT_EMPTY_PUMP_BATTERY_ID,
  ALARM_EVENT_INSIGHT_HYPOGLYCEMIA_ID,
  ALARM_EVENT_INSIGHT_INCOMPATIBLE_ACTIONS_ON_PUMP_ID,
  ALARM_EVENT_INSIGHT_INSULIN_CARTRIDGE_EXPIRED_ID,
  ALARM_EVENT_INSIGHT_OCCLUSION_ID,
  ALARM_EVENT_KALEIDO_EMPTY_INSULIN_CARTRIDGE_ID,
  ALARM_EVENT_KALEIDO_EMPTY_PUMP_BATTERY_ID,
  ALARM_EVENT_KALEIDO_INSULIN_CARTRIDGE_EXPIRED_ID,
  ALARM_EVENT_KALEIDO_OCCLUSION_ID,
  ALARM_EVENT_LONG_HYPERGLYCEMIA_ID,
  ALARM_EVENT_LONG_HYPOGLYCEMIA_ID,
  ALARM_EVENT_MEDISAFE_EMPTY_PUMP_BATTERY_ID,
  ALARM_EVENT_MEDISAFE_EMPTY_RESERVOIR_ID,
  ALARM_EVENT_MEDISAFE_OCCLUSION_ID,
  ALARM_EVENT_NO_READINGS_HYPOGLYCEMIA_RISK_ID,
  ALARM_EVENT_SENSOR_SESSION_EXPIRED_ID,
  ALARM_EVENT_SUDDEN_RISE_IN_GLYCEMIA_ID,
  ALARM_EVENT_URGENT_LOW_SOON_ID,
  BASAL_LOOP_MODE_OFF_ID,
  BASAL_LOOP_MODE_ON_ID,
  BASAL_MANUAL_ID,
  BASAL_TEMP_ID,
  CBG_ID,
  CONFIDENTIAL_MODE_ID,
  Data,
  EVENT_SUPERPOSITION_ALARM_EVENT_MEDISAFE_OCCLUSION_ID,
  EVENT_SUPERPOSITION_ALARM_EVENT_MEDISAFE_OCCLUSION_ID_2,
  EVENT_SUPERPOSITION_ALARM_EVENT_SUDDEN_RISE_IN_GLYCEMIA_ID,
  EVENT_SUPERPOSITION_ALARM_EVENT_URGENT_LOW_SOON_ID,
  EVENT_SUPERPOSITION_PARAMETER_CHANGE_ID,
  EVENT_SUPERPOSITION_RESERVOIR_CHANGE_ID,
  EVENT_SUPERPOSITION_WARMUP_ID,
  MANUAL_BOLUS_ID,
  NIGHT_MODE_ID,
  PEN_BOLUS_ID,
  SMBG_ID,
  WARMUP_01_ID,
  WIZARD_BOLUS_LOW_OVERRIDE_ID,
  WIZARD_BOLUS_NEGATIVE_OVERRIDE_ID,
  WIZARD_BOLUS_POSITIVE_OVERRIDE_ID,
  WIZARD_BOLUS_UMM_ID,
  WIZARD_BOLUS_UNDELIVERED_ID,
  WIZARD_LOW_OVERRIDE_ID,
  WIZARD_NEGATIVE_OVERRIDE_ID,
  WIZARD_POSITIVE_OVERRIDE_ID,
  WIZARD_UMM_ID,
  WIZARD_UNDELIVERED_ID,
  ZEN_MODE_ID
} from './data.api.mock'

export const getCompleteDailyViewDataDblg2 = (deviceName: DeviceSystem = DeviceSystem.Dblg2, softwareVersion: string = "1.15.0"): Data => {
  const completeData = getCompleteDailyViewData(deviceName, softwareVersion)
  const data = completeData.data

  data.nightModes[0] = {
    "epoch": 1659945600000,
    "displayOffset": -120,
    "normalTime": "2022-08-08T21:00:00.000Z",
    "timezone": "Europe/Paris",
    "guessedTimezone": false,
    "id": NIGHT_MODE_ID,
    "type": DatumType.DeviceEvent,
    "source": Source.Diabeloop,
    "subType": DeviceEventSubtype.Night,
    "duration": {
      "units": DurationUnit.Seconds,
      "value": 36000
    },
    "normalEnd": "2022-08-07T08:00:00.000Z",
    "epochEnd": 1659949200000,
    "guid": NIGHT_MODE_ID,
    "inputTime": "2022-08-08T08:00:00Z",
    "isoWeekday": WeekDays.Sunday
  }

  data.pumpSettings[0].payload.mobileApplication = {
    manufacturer: "Diabeloop",
    identifier: "xxx",
    swVersion: "1.2.3",
    activationCode: "123456789"
  }

  return completeData
}

export const getCompleteDailyViewData = (deviceName: DeviceSystem = DeviceSystem.Dblg1, softwareVersion: string = "1.15.0"): Data => {
  return {
    dataRange: ['2022-08-08T15:00:00Z', '2022-08-09T18:40:00Z'],
    data: {
      alarmEvents: [
        {
          "epoch": 1659949200000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T00:00:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-01",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_HYPERGLYCEMIA_ID,
          "inputTime": "2022-08-08T09:00:00Z",
          "alarm": {
            "alarmCode": AlarmCode.Hyperglycemia,
            "alarmLevel": AlarmLevel.Alert,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Hyperglycemia,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659949500000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T00:10:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-011",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_HYPERGLYCEMIA_OTHER_OCCURRENCE_ID,
          "inputTime": "2022-08-08T09:05:00Z",
          "alarm": {
            "alarmCode": AlarmCode.Hyperglycemia,
            "alarmLevel": AlarmLevel.Alert,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Hyperglycemia,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659949500000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T01:00:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-02",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_HYPOGLYCEMIA_ID,
          "inputTime": "2022-08-08T09:05:00Z",
          "alarm": {
            "alarmCode": AlarmCode.Hypoglycemia,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Hypoglycemia,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659949800000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T01:30:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-03",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_INSIGHT_EMPTY_INSULIN_CARTRIDGE_ID,
          "inputTime": "2022-08-08T09:10:00Z",
          "alarm": {
            "alarmCode": AlarmCode.InsightEmptyInsulinCartridge,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Device,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659950100000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T02:00:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-04",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_INSIGHT_EMPTY_PUMP_BATTERY_ID,
          "inputTime": "2022-08-08T09:15:00Z",
          "alarm": {
            "alarmCode": AlarmCode.InsightEmptyPumpBattery,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Device,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659950400000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T02:30:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-05",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_INSIGHT_HYPOGLYCEMIA_ID,
          "inputTime": "2022-08-08T09:20:00Z",
          "alarm": {
            "alarmCode": AlarmCode.InsightHypoglycemia,
            "alarmLevel": AlarmLevel.Alert,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Hypoglycemia,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659950700000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T03:00:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-06",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_INSIGHT_INCOMPATIBLE_ACTIONS_ON_PUMP_ID,
          "inputTime": "2022-08-08T09:25:00Z",
          "alarm": {
            "alarmCode": AlarmCode.InsightIncompatibleActionsOnPump,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Device,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659951000000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T03:30:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-07",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_INSIGHT_INSULIN_CARTRIDGE_EXPIRED_ID,
          "inputTime": "2022-08-08T09:30:00Z",
          "alarm": {
            "alarmCode": AlarmCode.InsightInsulinCartridgeExpired,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Device,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659951300000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T04:00:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-08",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_INSIGHT_OCCLUSION_ID,
          "inputTime": "2022-08-08T09:35:00Z",
          "alarm": {
            "alarmCode": AlarmCode.InsightOcclusion,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Device,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659951600000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T04:30:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-09",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_KALEIDO_EMPTY_INSULIN_CARTRIDGE_ID,
          "inputTime": "2022-08-08T09:40:00Z",
          "alarm": {
            "alarmCode": AlarmCode.KaleidoEmptyInsulinCartridge,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Device,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659951900000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T05:00:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-10",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_KALEIDO_EMPTY_PUMP_BATTERY_ID,
          "inputTime": "2022-08-08T09:45:00Z",
          "alarm": {
            "alarmCode": AlarmCode.KaleidoEmptyPumpBattery,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Device,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659952200000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T05:30:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-11",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_KALEIDO_INSULIN_CARTRIDGE_EXPIRED_ID,
          "inputTime": "2022-08-08T09:50:00Z",
          "alarm": {
            "alarmCode": AlarmCode.KaleidoInsulinCartridgeExpired,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Device,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659952500000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T06:00:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-12",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_KALEIDO_OCCLUSION_ID,
          "inputTime": "2022-08-08T09:55:00Z",
          "alarm": {
            "alarmCode": AlarmCode.KaleidoOcclusion,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Device,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659952800000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T06:30:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-13",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_LONG_HYPERGLYCEMIA_ID,
          "inputTime": "2022-08-08T10:00:00Z",
          "alarm": {
            "alarmCode": AlarmCode.LongHyperglycemia,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Hyperglycemia,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659953100000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T07:00:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-14",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_LONG_HYPOGLYCEMIA_ID,
          "inputTime": "2022-08-08T10:05:00Z",
          "alarm": {
            "alarmCode": AlarmCode.LongHypoglycemia,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Hypoglycemia,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659953400000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T07:30:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-15",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_NO_READINGS_HYPOGLYCEMIA_RISK_ID,
          "inputTime": "2022-08-08T10:10:00Z",
          "alarm": {
            "alarmCode": AlarmCode.NoReadingsHypoglycemiaRisk,
            "alarmLevel": AlarmLevel.Alert,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Hypoglycemia,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659953700000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T08:00:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-16",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_SENSOR_SESSION_EXPIRED_ID,
          "inputTime": "2022-08-08T10:15:00Z",
          "alarm": {
            "alarmCode": AlarmCode.SensorSessionExpired,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Device,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659954000000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T08:30:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-17",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_SUDDEN_RISE_IN_GLYCEMIA_ID,
          "inputTime": "2022-08-08T10:20:00Z",
          "alarm": {
            "alarmCode": AlarmCode.SuddenRiseInGlycemia,
            "alarmLevel": AlarmLevel.Alert,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Hyperglycemia,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659954300000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T09:00:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-18",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_URGENT_LOW_SOON_ID,
          "inputTime": "2022-08-08T10:25:00Z",
          "alarm": {
            "alarmCode": AlarmCode.UrgentLowSoon,
            "alarmLevel": AlarmLevel.Alert,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Hypoglycemia,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659954300000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T09:30:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-19",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_DANA_EMPTY_PUMP_BATTERY_ID,
          "inputTime": "2022-08-08T10:30:00Z",
          "alarm": {
            "alarmCode": AlarmCode.DanaEmptyPumpBattery,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Device,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659954300000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T10:00:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-20",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_DANA_EMPTY_RESERVOIR_ID,
          "inputTime": "2022-08-08T10:35:00Z",
          "alarm": {
            "alarmCode": AlarmCode.DanaEmptyReservoir,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Device,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659954300000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T10:30:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-21",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_DANA_INCOMPATIBLE_ACTIONS_ON_PUMP_ID,
          "inputTime": "2022-08-08T10:40:00Z",
          "alarm": {
            "alarmCode": AlarmCode.DanaIncompatibleActionsOnPump,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Device,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659954300000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T11:00:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-22",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_DANA_OCCLUSION_ID,
          "inputTime": "2022-08-08T10:45:00Z",
          "alarm": {
            "alarmCode": AlarmCode.DanaOcclusion,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Device,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659954300000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T11:30:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-23",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_MEDISAFE_EMPTY_PUMP_BATTERY_ID,
          "inputTime": "2022-08-08T10:45:00Z",
          "alarm": {
            "alarmCode": AlarmCode.MedisafeEmptyPumpBattery,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Device,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659954300000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T12:00:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-24",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_MEDISAFE_EMPTY_RESERVOIR_ID,
          "inputTime": "2022-08-08T10:45:00Z",
          "alarm": {
            "alarmCode": AlarmCode.MedisafeEmptyPumpReservoir,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Device,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659954300000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T12:30:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "alarm-25",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": ALARM_EVENT_MEDISAFE_OCCLUSION_ID,
          "inputTime": "2022-08-08T10:45:00Z",
          "alarm": {
            "alarmCode": AlarmCode.MedisafeOcclusion,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Device,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659954300000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T13:00:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": EVENT_SUPERPOSITION_ALARM_EVENT_MEDISAFE_OCCLUSION_ID,
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": EVENT_SUPERPOSITION_ALARM_EVENT_MEDISAFE_OCCLUSION_ID,
          "inputTime": "2022-08-08T10:45:00Z",
          "alarm": {
            "alarmCode": AlarmCode.MedisafeOcclusion,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Device,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659954300000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T13:02:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": EVENT_SUPERPOSITION_ALARM_EVENT_MEDISAFE_OCCLUSION_ID_2,
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": EVENT_SUPERPOSITION_ALARM_EVENT_MEDISAFE_OCCLUSION_ID_2,
          "inputTime": "2022-08-08T10:45:00Z",
          "alarm": {
            "alarmCode": AlarmCode.MedisafeOcclusion,
            "alarmLevel": AlarmLevel.Alarm,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Device,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659954300000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T13:10:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": EVENT_SUPERPOSITION_ALARM_EVENT_URGENT_LOW_SOON_ID,
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": EVENT_SUPERPOSITION_ALARM_EVENT_URGENT_LOW_SOON_ID,
          "inputTime": "2022-08-08T10:25:00Z",
          "alarm": {
            "alarmCode": AlarmCode.UrgentLowSoon,
            "alarmLevel": AlarmLevel.Alert,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Hypoglycemia,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659954000000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T13:20:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": EVENT_SUPERPOSITION_ALARM_EVENT_SUDDEN_RISE_IN_GLYCEMIA_ID,
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Alarm,
          "guid": EVENT_SUPERPOSITION_ALARM_EVENT_SUDDEN_RISE_IN_GLYCEMIA_ID,
          "inputTime": "2022-08-08T10:20:00Z",
          "alarm": {
            "alarmCode": AlarmCode.SuddenRiseInGlycemia,
            "alarmLevel": AlarmLevel.Alert,
            "alarmType": "handset",
            "ackStatus": "acknowledged",
            "updateTime": "2023-07-14T17:48:18.602Z"
          },
          "alarmEventType": AlarmEventType.Hyperglycemia,
          "isoWeekday": WeekDays.Sunday
        },
      ],
      basal: [
        {
          "epoch": 1659976200000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T16:30:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": BASAL_LOOP_MODE_ON_ID,
          "type": DatumType.Basal,
          "source": Source.Diabeloop,
          "subType": BasalDeliveryType.Automated,
          "deliveryType": BasalDeliveryType.Automated,
          "rate": 0.8,
          "duration": 1000,
          "normalEnd": "2022-08-08T16:30:01.000Z",
          "epochEnd": 1659976201000,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659976200000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T16:31:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": BASAL_LOOP_MODE_OFF_ID,
          "type": DatumType.Basal,
          "source": Source.Diabeloop,
          "subType": BasalDeliveryType.Scheduled,
          "deliveryType": BasalDeliveryType.Scheduled,
          "rate": 0.2,
          "duration": 1000,
          "normalEnd": "2022-08-08T16:31:01.000Z",
          "epochEnd": 1659976260000,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659976200000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T16:32:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": BASAL_TEMP_ID,
          "type": DatumType.Basal,
          "source": Source.Diabeloop,
          "subType": BasalDeliveryType.Temporary,
          "deliveryType": BasalDeliveryType.Temporary,
          "rate": 0.3,
          "duration": 1000,
          "normalEnd": "2022-08-08T16:32:01.000Z",
          "epochEnd": 1659976320000,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659976200000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T16:33:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": BASAL_MANUAL_ID,
          "type": DatumType.Basal,
          "source": Source.Diabeloop,
          "subType": BasalDeliveryType.Manual,
          "deliveryType": BasalDeliveryType.Manual,
          "rate": 0.1,
          "duration": 1000,
          "normalEnd": "2022-08-08T16:33:01.000Z",
          "epochEnd": 1659976380000,
          "isoWeekday": WeekDays.Sunday
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
          "type": DatumType.Bolus,
          "source": Source.Diabeloop,
          "subType": BolusSubtype.Normal,
          "normal": 22.3,
          "prescriptor": Prescriptor.Auto,
          "wizard": null,
          "expectedNormal": 25,
          "insulinOnBoard": 3.1843607,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659983700000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T18:35:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": WIZARD_BOLUS_UMM_ID,
          "type": DatumType.Bolus,
          "source": Source.Diabeloop,
          "subType": BolusSubtype.Normal,
          "normal": 1.3,
          "prescriptor": Prescriptor.Auto,
          "wizard": null,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659984300000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T18:45:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": WIZARD_BOLUS_POSITIVE_OVERRIDE_ID,
          "type": DatumType.Bolus,
          "source": Source.Diabeloop,
          "subType": BolusSubtype.Normal,
          "normal": 19.35,
          "prescriptor": Prescriptor.Hybrid,
          "wizard": null,
          "expectedNormal": 19.35,
          "insulinOnBoard": 3.1218212,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659984900000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T18:55:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": WIZARD_BOLUS_NEGATIVE_OVERRIDE_ID,
          "type": DatumType.Bolus,
          "source": Source.Diabeloop,
          "subType": BolusSubtype.Normal,
          "normal": 9.05,
          "prescriptor": Prescriptor.Hybrid,
          "wizard": null,
          "expectedNormal": 9.05,
          "insulinOnBoard": 3.0588088,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659984900000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T19:05:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": WIZARD_BOLUS_LOW_OVERRIDE_ID,
          "type": DatumType.Bolus,
          "source": Source.Diabeloop,
          "subType": BolusSubtype.Normal,
          "normal": 10.05,
          "prescriptor": Prescriptor.Hybrid,
          "wizard": null,
          "expectedNormal": 10.05,
          "insulinOnBoard": 3.0588088,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659984900000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T19:55:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": PEN_BOLUS_ID,
          "type": DatumType.Bolus,
          "source": Source.Diabeloop,
          "subType": BolusSubtype.Pen,
          "normal": 4.05,
          "prescriptor": Prescriptor.Manual,
          "wizard": null,
          "expectedNormal": 4.05,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659984900000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T20:55:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": MANUAL_BOLUS_ID,
          "type": DatumType.Bolus,
          "source": Source.Diabeloop,
          "subType": BolusSubtype.Normal,
          "normal": 5.05,
          "prescriptor": Prescriptor.Manual,
          "wizard": null,
          "expectedNormal": 5.05,
          "isoWeekday": WeekDays.Sunday
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
          "type": DatumType.Cbg,
          "source": Source.Diabeloop,
          "units": Unit.MilligramPerDeciliter,
          "value": 189,
          "localDate": "2022-08-08",
          "isoWeekday": WeekDays.Monday,
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
          "type": DatumType.Cbg,
          "source": Source.Diabeloop,
          "units": Unit.MilligramPerDeciliter,
          "value": 265,
          "localDate": "2022-08-08",
          "isoWeekday": WeekDays.Monday,
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
          "type": DatumType.Cbg,
          "source": Source.Diabeloop,
          "units": Unit.MilligramPerDeciliter,
          "value": 265,
          "localDate": "2022-08-08",
          "isoWeekday": WeekDays.Monday,
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
          "type": DatumType.Cbg,
          "source": Source.Diabeloop,
          "units": Unit.MilligramPerDeciliter,
          "value": 117,
          "localDate": "2022-08-08",
          "isoWeekday": WeekDays.Monday,
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
          "type": DatumType.Cbg,
          "source": Source.Diabeloop,
          "units": Unit.MilligramPerDeciliter,
          "value": 117,
          "localDate": "2022-08-08",
          "isoWeekday": WeekDays.Monday,
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
          "type": DatumType.Cbg,
          "source": Source.Diabeloop,
          "units": Unit.MilligramPerDeciliter,
          "value": 117,
          "localDate": "2022-08-08",
          "isoWeekday": WeekDays.Monday,
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
          "type": DatumType.Cbg,
          "source": Source.Diabeloop,
          "units": Unit.MilligramPerDeciliter,
          "value": 61,
          "localDate": "2022-08-08",
          "isoWeekday": WeekDays.Monday,
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
          "type": DatumType.Cbg,
          "source": Source.Diabeloop,
          "units": Unit.MilligramPerDeciliter,
          "value": 61,
          "localDate": "2022-08-08",
          "isoWeekday": WeekDays.Monday,
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
          "type": DatumType.Cbg,
          "source": Source.Diabeloop,
          "units": Unit.MilligramPerDeciliter,
          "value": 61,
          "localDate": "2022-08-08",
          "isoWeekday": WeekDays.Monday,
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
          "type": DatumType.Cbg,
          "source": Source.Diabeloop,
          "units": Unit.MilligramPerDeciliter,
          "value": 61,
          "localDate": "2022-08-08",
          "isoWeekday": WeekDays.Monday,
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
          "type": DatumType.Cbg,
          "source": Source.Diabeloop,
          "units": Unit.MilligramPerDeciliter,
          "value": 40,
          "localDate": "2022-08-08",
          "isoWeekday": WeekDays.Monday,
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
          "type": DatumType.Cbg,
          "source": Source.Diabeloop,
          "units": Unit.MilligramPerDeciliter,
          "value": 40,
          "localDate": "2022-08-08",
          "isoWeekday": WeekDays.Monday,
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
          "type": DatumType.Cbg,
          "source": Source.Diabeloop,
          "units": Unit.MilligramPerDeciliter,
          "value": 40,
          "localDate": "2022-08-08",
          "isoWeekday": WeekDays.Monday,
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
          "type": DatumType.Cbg,
          "source": Source.Diabeloop,
          "units": Unit.MilligramPerDeciliter,
          "value": 40,
          "localDate": "2022-08-08",
          "isoWeekday": WeekDays.Monday,
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
          "type": DatumType.Cbg,
          "source": Source.Diabeloop,
          "units": Unit.MilligramPerDeciliter,
          "value": 40,
          "localDate": "2022-08-08",
          "isoWeekday": WeekDays.Monday,
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
          "id": CONFIDENTIAL_MODE_ID,
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "duration": {
            "units": DurationUnit.Hours,
            "value": 2
          },
          "normalEnd": "2022-08-08T04:00:00.000Z",
          "epochEnd": 1659931200000,
          "subType": DeviceEventSubtype.Confidential,
          "guid": "confidential_0",
          "inputTime": "2022-08-08T02:00:00Z",
          "isoWeekday": WeekDays.Sunday
        }
      ],
      deviceParametersChanges: [
        {
          "epoch": 1659945600000,
          "displayOffset": 0,
          "normalTime": "2022-08-08T16:00:00.000Z",
          "timezone": "UTC",
          "guessedTimezone": false,
          "id": "parameterId",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.DeviceParameter,
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
          ],
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659965100000,
          "displayOffset": 0,
          "normalTime": "2022-08-08T13:25:00.000Z",
          "timezone": "UTC",
          "guessedTimezone": false,
          "id": EVENT_SUPERPOSITION_PARAMETER_CHANGE_ID,
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.DeviceParameter,
          "params": [
            {
              "id": "parameterId",
              "epoch": 1659965100000,
              "timezone": "UTC",
              "name": "MEAL_RATIO_LUNCH_FACTOR",
              "level": "1",
              "unit": Unit.Percent,
              "value": "100",
              "previousValue": "110",
              "lastUpdateDate": "2022-08-08T08:00:00Z"
            }
          ],
          "isoWeekday": WeekDays.Sunday
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
          "type": DatumType.Food,
          "source": Source.Diabeloop,
          "meal": "rescuecarbs",
          "nutrition": {
            "carbohydrate": {
              "net": 15,
              "units": Unit.Grams
            }
          },
          "prescribedNutrition": {
            "carbohydrate": {
              "net": 16,
              "units": Unit.Grams
            }
          },
          "prescriptor": Prescriptor.Hybrid,
          "isoWeekday": WeekDays.Friday
        }
      ],
      nightModes: [],
      physicalActivities: [
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
            "value": 1800
          },
          "normalEnd": "2022-08-08T13:30:00.000Z",
          "epochEnd": 1659965400000,
          "guid": "pa_18",
          "reportedIntensity": Intensity.Medium,
          "inputTime": "2022-08-08T13:00:00.000Z",
          "isoWeekday": WeekDays.Sunday,
          "name": "RUNNING"
        },
        {
          "epoch": 1659967200000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T14:00:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "physicalActivityId2",
          "type": DatumType.PhysicalActivity,
          "source": Source.Diabeloop,
          "duration": {
            "units": DurationUnit.Seconds,
            "value": 1800
          },
          "normalEnd": "2022-08-08T14:30:00.000Z",
          "epochEnd": 1659969000000,
          "guid": "pa_19",
          "reportedIntensity": Intensity.Medium,
          "inputTime": "2022-08-08T14:00:00.000Z",
          "isoWeekday": WeekDays.Sunday,
          "name": ""
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
          "type": DatumType.PumpSettings,
          "source": Source.Diabeloop,
          "isoWeekday": WeekDays.Sunday,
          "deviceId": "1234",
          "deviceTime": "2022-08-08T16:35:00.000Z",
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
              "name": deviceName,
              "swVersion": softwareVersion,
              "operatingSystem": "Android",
              "osVersion": "12",
              "smartphoneModel": "X",
            },
            "pump": {
              "manufacturer": PumpManufacturer.Vicentra,
              "name": "Kaleido",
              "serialNumber": "123456",
              "swVersion": "beta",
              "product": "zzz",
            },
            history,
            "securityBasals": { "rates": null },
            "mobileApplication": {
              "manufacturer": "",
              "identifier": "",
              "swVersion": "",
              "activationCode": ""
            },
            "parameters": [
              {
                "effectiveDate": "2020-01-17T08:00:00.000Z",
                "level": 1,
                "name": "WEIGHT",
                "unit": Unit.Kilogram,
                "value": "72"
              }
            ],
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
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.ReservoirChange,
          "pump": {
            "manufacturer": PumpManufacturer.Default,
            "product": "xxx",
            "swVersion": "xxx",
            "serialNumber": "123456",
            "name": "Kaleido"
          },
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659978000000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T13:15:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": EVENT_SUPERPOSITION_RESERVOIR_CHANGE_ID,
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.ReservoirChange,
          "pump": {
            "manufacturer": PumpManufacturer.Default,
            "product": "xxx",
            "swVersion": "xxx",
            "serialNumber": "123456",
            "name": "Kaleido"
          },
          "isoWeekday": WeekDays.Sunday
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
          "type": DatumType.Smbg,
          "source": Source.Diabeloop,
          "units": Unit.MilligramPerDeciliter,
          "value": 189,
          "localDate": "2022-08-08",
          "isoWeekday": WeekDays.Monday,
          "msPer24": 62100000
        }
      ],
      warmUps: [
        {
          "epoch": 1659974400000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T16:30:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "warmup-01",
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "duration": {
            "units": DurationUnit.Hours,
            "value": 0
          },
          "normalEnd": "2022-08-08T16:30:00.000Z",
          "epochEnd": 1659985200000,
          "subType": DeviceEventSubtype.Warmup,
          "guid": WARMUP_01_ID,
          "inputTime": "2022-08-08T09:00:00Z",
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1659974400000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T13:05:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": EVENT_SUPERPOSITION_WARMUP_ID,
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "duration": {
            "units": DurationUnit.Hours,
            "value": 0
          },
          "normalEnd": "2022-08-08T16:30:00.000Z",
          "epochEnd": 1659985200000,
          "subType": DeviceEventSubtype.Warmup,
          "guid": EVENT_SUPERPOSITION_WARMUP_ID,
          "inputTime": "2022-08-08T09:00:00Z",
          "isoWeekday": WeekDays.Sunday
        }
      ],
      wizards: [
        {
          "epoch": 1659983100000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T18:25:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": WIZARD_UNDELIVERED_ID,
          "type": DatumType.Wizard,
          "source": Source.Diabeloop,
          "bolusId": WIZARD_BOLUS_UNDELIVERED_ID,
          "bolusIds": new Set([WIZARD_BOLUS_UNDELIVERED_ID]),
          "carbInput": 45,
          "units": "mmol/L",
          "bolus": null,
          "bolusPart2": null,
          "inputTime": "2022-08-08T02:00:00Z",
          "recommended": {
            "carb": 0,
            "correction": 0,
            "net": 25
          },
          "inputMeal": {
            "fat": WizardInputMealFat.Yes,
            "source": WizardInputMealSource.Manual
          },
          "isoWeekday": WeekDays.Thursday
        },
        {
          "epoch": 1659983700000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T18:35:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": WIZARD_UMM_ID,
          "type": DatumType.Wizard,
          "source": Source.Diabeloop,
          "bolusId": WIZARD_BOLUS_UMM_ID,
          "bolusIds": new Set([WIZARD_BOLUS_UMM_ID]),
          "carbInput": 50,
          "units": "mmol/L",
          "bolus": null,
          "bolusPart2": null,
          "inputTime": "2022-08-08T18:34:00Z",
          "inputMeal": {
            "source": WizardInputMealSource.Umm,
            "fat": WizardInputMealFat.No
          },
          "isoWeekday": WeekDays.Thursday
        },
        {
          "epoch": 1659984300000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T18:45:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": WIZARD_POSITIVE_OVERRIDE_ID,
          "type": DatumType.Wizard,
          "source": Source.Diabeloop,
          "bolusId": WIZARD_BOLUS_POSITIVE_OVERRIDE_ID,
          "bolusIds": new Set([WIZARD_BOLUS_POSITIVE_OVERRIDE_ID]),
          "carbInput": 100,
          "units": "mmol/L",
          "bolus": null,
          "bolusPart2": null,
          "inputTime": "2022-08-08T22:45:00Z",
          "recommended": {
            "carb": 0,
            "correction": 0,
            "net": 14.35
          },
          "isoWeekday": WeekDays.Thursday
        },
        {
          "epoch": 1659984900000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T18:55:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": WIZARD_NEGATIVE_OVERRIDE_ID,
          "type": DatumType.Wizard,
          "source": Source.Diabeloop,
          "bolusId": WIZARD_BOLUS_NEGATIVE_OVERRIDE_ID,
          "bolusIds": new Set([WIZARD_BOLUS_NEGATIVE_OVERRIDE_ID]),
          "carbInput": 100,
          "units": "mmol/L",
          "bolus": null,
          "bolusPart2": null,
          "inputTime": "2022-08-08T23:15:00Z",
          "recommended": {
            "carb": 0,
            "correction": 0,
            "net": 10.05
          },
          "isoWeekday": WeekDays.Thursday
        },
        {
          "epoch": 1659984300000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T19:05:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": WIZARD_LOW_OVERRIDE_ID,
          "type": DatumType.Wizard,
          "source": Source.Diabeloop,
          "bolusId": WIZARD_BOLUS_LOW_OVERRIDE_ID,
          "bolusIds": new Set([WIZARD_BOLUS_LOW_OVERRIDE_ID]),
          "carbInput": 100,
          "units": "mmol/L",
          "bolus": null,
          "bolusPart2": null,
          "inputTime": "2022-08-08T22:45:00Z",
          "recommended": {
            "carb": 0,
            "correction": 0,
            "net": 10.07
          },
          "isoWeekday": WeekDays.Thursday
        },
      ],
      "zenModes": [
        {
          "epoch": 1659945600000,
          "displayOffset": -120,
          "normalTime": "2022-08-08T21:00:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": ZEN_MODE_ID,
          "type": DatumType.DeviceEvent,
          "source": Source.Diabeloop,
          "subType": DeviceEventSubtype.Zen,
          "duration": {
            "units": DurationUnit.Seconds,
            "value": 7200
          },
          "normalEnd": "2022-08-07T08:00:00.000Z",
          "epochEnd": 1659949200000,
          "guid": ZEN_MODE_ID,
          "inputTime": "2022-08-08T08:00:00Z",
          "isoWeekday": WeekDays.Sunday
        }
      ],
      "timezoneChanges": []
    }
  }
}
