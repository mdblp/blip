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
import { history } from '../data/data-api.data'
import type { PatientDataRange } from '../../../lib/data/models/data-range.model'
import { MedicalData } from 'medical-domain'

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
export const YESTERDAY_DATE: Moment = moment('2023-10-22')
export const RESERVOIR_CHANGE_TODAY_DATE: Moment = moment('2023-10-23')
export const TWO_WEEKS_AGO_DATE: Moment = moment('2023-10-09')
export const RESERVOIR_CHANGE_13_DAYS_AGO_DATE: Moment = moment('2023-10-10')
export const SIXTEEN_DAYS_AGO_DATE: Moment = moment('2023-10-07')

export interface Data {
  dataRange: PatientDataRange
  data: MedicalData
}

export const completeDashboardData: Data = {
  dataRange: ['2023-10-22T17:05:00:00Z', '2023-10-23T19:05:00:00Z'],
  data: {
    "alarmEvents": [],
    "basal": [
      {
        "epoch": 1697992200000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-22T16:30:07.200Z",
        "epochEnd": 1697992207200
      },
      {
        "epoch": 1698003300000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-22T19:36:12.000Z",
        "epochEnd": 1698003372000
      },
      {
        "epoch": 1698078600000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-23T16:30:07.200Z",
        "epochEnd": 1698078607200
      },
      {
        "epoch": 1698089700000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-23T19:36:12.000Z",
        "epochEnd": 1698089772000
      }
    ],
    "bolus": [
      {
        "epoch": 1697999100000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1698085500000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      }
    ],
    "cbg": [
      {
        "epoch": 1697994300000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-22",
        "isoWeekday": "sunday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697994600000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-22",
        "isoWeekday": "sunday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697996100000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-22",
        "isoWeekday": "sunday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697996400000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-22",
        "isoWeekday": "sunday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697997900000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-22",
        "isoWeekday": "sunday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1698080700000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-23",
        "isoWeekday": "monday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1698081000000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-23",
        "isoWeekday": "monday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1698082500000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-23",
        "isoWeekday": "monday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1698082800000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-23",
        "isoWeekday": "monday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1698084300000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-23",
        "isoWeekday": "monday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      }
    ],
    "confidentialModes": [],
    "deviceParametersChanges": [
      {
        "epoch": 1697961600000,
        "displayOffset": 0,
        "normalTime": "2023-10-22T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697961600000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1698048000000,
        "displayOffset": 0,
        "normalTime": "2023-10-23T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1698048000000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      }
    ],
    "messages": [],
    "meals": [
      {
        "epoch": 1698003300000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1698089700000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      }
    ],
    "physicalActivities": [
      {
        "epoch": 1697979600000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-22T13:30:00.000Z",
        "epochEnd": 1697981400000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-22T13:00:00.000Z"
      },
      {
        "epoch": 1698066000000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-23T13:30:00.000Z",
        "epochEnd": 1698067800000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-23T13:00:00.000Z"
      }
    ],
    "pumpSettings": [
      {
        "epoch": 1697992500000,
        "displayOffset": 0,
        "normalTime": "2023-10-22T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1698078900000,
        "displayOffset": 0,
        "normalTime": "2023-10-23T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
    "reservoirChanges": [
      {
        "epoch": 1698080400000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T17:00:00.000Z",
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
    "wizards": [
      {
        "epoch": 1697999700000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1698002700000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1698086100000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1698089100000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
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


export const twoWeeksOldDashboardData: Data = {
  dataRange: ['2023-10-09T16:30:00Z', '2023-10-23T18:05:00:00Z'],
  data: {
    "alarmEvents": [],
    "basal": [
      {
        "epoch": 1696869000000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-09T16:30:07.200Z",
        "epochEnd": 1696869007200
      },
      {
        "epoch": 1696880100000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-09T19:36:12.000Z",
        "epochEnd": 1696880172000
      },
      {
        "epoch": 1696955400000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-10T16:30:07.200Z",
        "epochEnd": 1696955407200
      },
      {
        "epoch": 1696966500000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-10T19:36:12.000Z",
        "epochEnd": 1696966572000
      },
      {
        "epoch": 1697041800000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-11T16:30:07.200Z",
        "epochEnd": 1697041807200
      },
      {
        "epoch": 1697052900000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-11T19:36:12.000Z",
        "epochEnd": 1697052972000
      },
      {
        "epoch": 1697128200000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-12T16:30:07.200Z",
        "epochEnd": 1697128207200
      },
      {
        "epoch": 1697139300000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-12T19:36:12.000Z",
        "epochEnd": 1697139372000
      },
      {
        "epoch": 1697214600000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-13T16:30:07.200Z",
        "epochEnd": 1697214607200
      },
      {
        "epoch": 1697225700000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-13T19:36:12.000Z",
        "epochEnd": 1697225772000
      },
      {
        "epoch": 1697301000000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-14T16:30:07.200Z",
        "epochEnd": 1697301007200
      },
      {
        "epoch": 1697312100000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-14T19:36:12.000Z",
        "epochEnd": 1697312172000
      },
      {
        "epoch": 1697387400000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-15T16:30:07.200Z",
        "epochEnd": 1697387407200
      },
      {
        "epoch": 1697398500000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-15T19:36:12.000Z",
        "epochEnd": 1697398572000
      },
      {
        "epoch": 1697473800000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-16T16:30:07.200Z",
        "epochEnd": 1697473807200
      },
      {
        "epoch": 1697484900000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-16T19:36:12.000Z",
        "epochEnd": 1697484972000
      },
      {
        "epoch": 1697560200000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-17T16:30:07.200Z",
        "epochEnd": 1697560207200
      },
      {
        "epoch": 1697571300000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-17T19:36:12.000Z",
        "epochEnd": 1697571372000
      },
      {
        "epoch": 1697646600000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-18T16:30:07.200Z",
        "epochEnd": 1697646607200
      },
      {
        "epoch": 1697657700000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-18T19:36:12.000Z",
        "epochEnd": 1697657772000
      },
      {
        "epoch": 1697733000000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-19T16:30:07.200Z",
        "epochEnd": 1697733007200
      },
      {
        "epoch": 1697744100000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-19T19:36:12.000Z",
        "epochEnd": 1697744172000
      },
      {
        "epoch": 1697819400000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-20T16:30:07.200Z",
        "epochEnd": 1697819407200
      },
      {
        "epoch": 1697830500000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-20T19:36:12.000Z",
        "epochEnd": 1697830572000
      },
      {
        "epoch": 1697905800000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-21T16:30:07.200Z",
        "epochEnd": 1697905807200
      },
      {
        "epoch": 1697916900000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-21T19:36:12.000Z",
        "epochEnd": 1697916972000
      },
      {
        "epoch": 1697992200000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-22T16:30:07.200Z",
        "epochEnd": 1697992207200
      },
      {
        "epoch": 1698003300000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-22T19:36:12.000Z",
        "epochEnd": 1698003372000
      },
      {
        "epoch": 1698078600000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-23T16:30:07.200Z",
        "epochEnd": 1698078607200
      },
      {
        "epoch": 1698089700000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-23T19:36:12.000Z",
        "epochEnd": 1698089772000
      }
    ],
    "bolus": [
      {
        "epoch": 1696875900000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1696962300000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697048700000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697135100000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697221500000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697307900000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697394300000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697480700000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697567100000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697653500000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697739900000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697826300000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697912700000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697999100000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1698085500000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      }
    ],
    "cbg": [
      {
        "epoch": 1696871100000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-09",
        "isoWeekday": "monday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696871400000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-09",
        "isoWeekday": "monday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696872900000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-09",
        "isoWeekday": "monday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696873200000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-09",
        "isoWeekday": "monday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696874700000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-09",
        "isoWeekday": "monday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696957500000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-10",
        "isoWeekday": "tuesday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696957800000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-10",
        "isoWeekday": "tuesday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696959300000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-10",
        "isoWeekday": "tuesday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696959600000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-10",
        "isoWeekday": "tuesday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696961100000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-10",
        "isoWeekday": "tuesday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697043900000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-11",
        "isoWeekday": "wednesday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697044200000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-11",
        "isoWeekday": "wednesday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697045700000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-11",
        "isoWeekday": "wednesday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697046000000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-11",
        "isoWeekday": "wednesday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697047500000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-11",
        "isoWeekday": "wednesday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697130300000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-12",
        "isoWeekday": "thursday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697130600000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-12",
        "isoWeekday": "thursday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697132100000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-12",
        "isoWeekday": "thursday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697132400000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-12",
        "isoWeekday": "thursday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697133900000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-12",
        "isoWeekday": "thursday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697216700000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-13",
        "isoWeekday": "friday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697217000000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-13",
        "isoWeekday": "friday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697218500000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-13",
        "isoWeekday": "friday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697218800000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-13",
        "isoWeekday": "friday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697220300000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-13",
        "isoWeekday": "friday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697303100000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-14",
        "isoWeekday": "saturday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697303400000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-14",
        "isoWeekday": "saturday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697304900000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-14",
        "isoWeekday": "saturday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697305200000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-14",
        "isoWeekday": "saturday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697306700000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-14",
        "isoWeekday": "saturday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697389500000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-15",
        "isoWeekday": "sunday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697389800000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-15",
        "isoWeekday": "sunday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697391300000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-15",
        "isoWeekday": "sunday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697391600000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-15",
        "isoWeekday": "sunday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697393100000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-15",
        "isoWeekday": "sunday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697475900000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-16",
        "isoWeekday": "monday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697476200000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-16",
        "isoWeekday": "monday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697477700000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-16",
        "isoWeekday": "monday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697478000000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-16",
        "isoWeekday": "monday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697479500000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-16",
        "isoWeekday": "monday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697562300000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-17",
        "isoWeekday": "tuesday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697562600000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-17",
        "isoWeekday": "tuesday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697564100000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-17",
        "isoWeekday": "tuesday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697564400000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-17",
        "isoWeekday": "tuesday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697565900000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-17",
        "isoWeekday": "tuesday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697648700000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-18",
        "isoWeekday": "wednesday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697649000000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-18",
        "isoWeekday": "wednesday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697650500000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-18",
        "isoWeekday": "wednesday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697650800000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-18",
        "isoWeekday": "wednesday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697652300000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-18",
        "isoWeekday": "wednesday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697735100000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-19",
        "isoWeekday": "thursday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697735400000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-19",
        "isoWeekday": "thursday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697736900000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-19",
        "isoWeekday": "thursday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697737200000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-19",
        "isoWeekday": "thursday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697738700000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-19",
        "isoWeekday": "thursday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697821500000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-20",
        "isoWeekday": "friday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697821800000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-20",
        "isoWeekday": "friday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697823300000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-20",
        "isoWeekday": "friday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697823600000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-20",
        "isoWeekday": "friday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697825100000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-20",
        "isoWeekday": "friday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697907900000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-21",
        "isoWeekday": "saturday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697908200000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-21",
        "isoWeekday": "saturday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697909700000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-21",
        "isoWeekday": "saturday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697910000000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-21",
        "isoWeekday": "saturday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697911500000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-21",
        "isoWeekday": "saturday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697994300000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-22",
        "isoWeekday": "sunday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697994600000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-22",
        "isoWeekday": "sunday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697996100000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-22",
        "isoWeekday": "sunday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697996400000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-22",
        "isoWeekday": "sunday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697997900000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-22",
        "isoWeekday": "sunday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1698080700000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-23",
        "isoWeekday": "monday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1698081000000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-23",
        "isoWeekday": "monday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1698082500000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-23",
        "isoWeekday": "monday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1698082800000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-23",
        "isoWeekday": "monday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1698084300000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-23",
        "isoWeekday": "monday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      }
    ],
    "confidentialModes": [],
    "deviceParamet@ersChanges": [
      {
        "epoch": 1696838400000,
        "displayOffset": 0,
        "normalTime": "2023-10-09T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1696838400000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1696924800000,
        "displayOffset": 0,
        "normalTime": "2023-10-10T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1696924800000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697011200000,
        "displayOffset": 0,
        "normalTime": "2023-10-11T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697011200000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697097600000,
        "displayOffset": 0,
        "normalTime": "2023-10-12T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697097600000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697184000000,
        "displayOffset": 0,
        "normalTime": "2023-10-13T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697184000000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697270400000,
        "displayOffset": 0,
        "normalTime": "2023-10-14T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697270400000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697356800000,
        "displayOffset": 0,
        "normalTime": "2023-10-15T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697356800000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697443200000,
        "displayOffset": 0,
        "normalTime": "2023-10-16T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697443200000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697529600000,
        "displayOffset": 0,
        "normalTime": "2023-10-17T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697529600000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697616000000,
        "displayOffset": 0,
        "normalTime": "2023-10-18T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697616000000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697702400000,
        "displayOffset": 0,
        "normalTime": "2023-10-19T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697702400000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697788800000,
        "displayOffset": 0,
        "normalTime": "2023-10-20T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697788800000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697875200000,
        "displayOffset": 0,
        "normalTime": "2023-10-21T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697875200000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697961600000,
        "displayOffset": 0,
        "normalTime": "2023-10-22T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697961600000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1698048000000,
        "displayOffset": 0,
        "normalTime": "2023-10-23T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1698048000000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      }
    ],
    "messages": [],
    "meals": [
      {
        "epoch": 1696880100000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1696966500000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697052900000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697139300000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697225700000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697312100000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697398500000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697484900000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697571300000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697657700000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697744100000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697830500000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697916900000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1698003300000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1698089700000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      }
    ],
    "physicalActivities": [
      {
        "epoch": 1696856400000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-09T13:30:00.000Z",
        "epochEnd": 1696858200000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-09T13:00:00.000Z"
      },
      {
        "epoch": 1696942800000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-10T13:30:00.000Z",
        "epochEnd": 1696944600000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-10T13:00:00.000Z"
      },
      {
        "epoch": 1697029200000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-11T13:30:00.000Z",
        "epochEnd": 1697031000000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-11T13:00:00.000Z"
      },
      {
        "epoch": 1697115600000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-12T13:30:00.000Z",
        "epochEnd": 1697117400000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-12T13:00:00.000Z"
      },
      {
        "epoch": 1697202000000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-13T13:30:00.000Z",
        "epochEnd": 1697203800000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-13T13:00:00.000Z"
      },
      {
        "epoch": 1697288400000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-14T13:30:00.000Z",
        "epochEnd": 1697290200000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-14T13:00:00.000Z"
      },
      {
        "epoch": 1697374800000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-15T13:30:00.000Z",
        "epochEnd": 1697376600000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-15T13:00:00.000Z"
      },
      {
        "epoch": 1697461200000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-16T13:30:00.000Z",
        "epochEnd": 1697463000000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-16T13:00:00.000Z"
      },
      {
        "epoch": 1697547600000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-17T13:30:00.000Z",
        "epochEnd": 1697549400000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-17T13:00:00.000Z"
      },
      {
        "epoch": 1697634000000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-18T13:30:00.000Z",
        "epochEnd": 1697635800000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-18T13:00:00.000Z"
      },
      {
        "epoch": 1697720400000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-19T13:30:00.000Z",
        "epochEnd": 1697722200000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-19T13:00:00.000Z"
      },
      {
        "epoch": 1697806800000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-20T13:30:00.000Z",
        "epochEnd": 1697808600000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-20T13:00:00.000Z"
      },
      {
        "epoch": 1697893200000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-21T13:30:00.000Z",
        "epochEnd": 1697895000000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-21T13:00:00.000Z"
      },
      {
        "epoch": 1697979600000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-22T13:30:00.000Z",
        "epochEnd": 1697981400000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-22T13:00:00.000Z"
      },
      {
        "epoch": 1698066000000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-23T13:30:00.000Z",
        "epochEnd": 1698067800000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-23T13:00:00.000Z"
      }
    ],
    "pumpSettings": [
      {
        "epoch": 1696869300000,
        "displayOffset": 0,
        "normalTime": "2023-10-09T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1696955700000,
        "displayOffset": 0,
        "normalTime": "2023-10-10T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697042100000,
        "displayOffset": 0,
        "normalTime": "2023-10-11T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697128500000,
        "displayOffset": 0,
        "normalTime": "2023-10-12T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697214900000,
        "displayOffset": 0,
        "normalTime": "2023-10-13T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697301300000,
        "displayOffset": 0,
        "normalTime": "2023-10-14T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697387700000,
        "displayOffset": 0,
        "normalTime": "2023-10-15T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697474100000,
        "displayOffset": 0,
        "normalTime": "2023-10-16T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697560500000,
        "displayOffset": 0,
        "normalTime": "2023-10-17T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697646900000,
        "displayOffset": 0,
        "normalTime": "2023-10-18T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697733300000,
        "displayOffset": 0,
        "normalTime": "2023-10-19T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697819700000,
        "displayOffset": 0,
        "normalTime": "2023-10-20T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697906100000,
        "displayOffset": 0,
        "normalTime": "2023-10-21T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697992500000,
        "displayOffset": 0,
        "normalTime": "2023-10-22T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1698078900000,
        "displayOffset": 0,
        "normalTime": "2023-10-23T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
    "reservoirChanges": [
      {
        "epoch": 1696957200000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T17:00:00.000Z",
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
    "wizards": [
      {
        "epoch": 1696876500000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1696879500000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1696962900000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1696965900000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697049300000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697052300000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697135700000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697138700000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697222100000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697225100000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697308500000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697311500000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697394900000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697397900000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697481300000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697484300000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697567700000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697570700000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697654100000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697657100000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697740500000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697743500000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697826900000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697829900000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697913300000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697916300000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697999700000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1698002700000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1698086100000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1698089100000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
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
export const sixteenDaysOldDashboardData: Data = {
  dataRange: ['2023-10-07T00:00:00:00Z', '2023-10-23T00:00:00'],
  data: {
    "alarmEvents": [],
    "basal": [
      {
        "epoch": 1696696200000,
        "displayOffset": -120,
        "normalTime": "2023-10-07T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-07T16:30:07.200Z",
        "epochEnd": 1696696207200
      },
      {
        "epoch": 1696707300000,
        "displayOffset": -120,
        "normalTime": "2023-10-07T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-07T19:36:12.000Z",
        "epochEnd": 1696707372000
      },
      {
        "epoch": 1696782600000,
        "displayOffset": -120,
        "normalTime": "2023-10-08T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-08T16:30:07.200Z",
        "epochEnd": 1696782607200
      },
      {
        "epoch": 1696793700000,
        "displayOffset": -120,
        "normalTime": "2023-10-08T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-08T19:36:12.000Z",
        "epochEnd": 1696793772000
      },
      {
        "epoch": 1696869000000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-09T16:30:07.200Z",
        "epochEnd": 1696869007200
      },
      {
        "epoch": 1696880100000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-09T19:36:12.000Z",
        "epochEnd": 1696880172000
      },
      {
        "epoch": 1696955400000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-10T16:30:07.200Z",
        "epochEnd": 1696955407200
      },
      {
        "epoch": 1696966500000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-10T19:36:12.000Z",
        "epochEnd": 1696966572000
      },
      {
        "epoch": 1697041800000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-11T16:30:07.200Z",
        "epochEnd": 1697041807200
      },
      {
        "epoch": 1697052900000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-11T19:36:12.000Z",
        "epochEnd": 1697052972000
      },
      {
        "epoch": 1697128200000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-12T16:30:07.200Z",
        "epochEnd": 1697128207200
      },
      {
        "epoch": 1697139300000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-12T19:36:12.000Z",
        "epochEnd": 1697139372000
      },
      {
        "epoch": 1697214600000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-13T16:30:07.200Z",
        "epochEnd": 1697214607200
      },
      {
        "epoch": 1697225700000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-13T19:36:12.000Z",
        "epochEnd": 1697225772000
      },
      {
        "epoch": 1697301000000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-14T16:30:07.200Z",
        "epochEnd": 1697301007200
      },
      {
        "epoch": 1697312100000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-14T19:36:12.000Z",
        "epochEnd": 1697312172000
      },
      {
        "epoch": 1697387400000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-15T16:30:07.200Z",
        "epochEnd": 1697387407200
      },
      {
        "epoch": 1697398500000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-15T19:36:12.000Z",
        "epochEnd": 1697398572000
      },
      {
        "epoch": 1697473800000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-16T16:30:07.200Z",
        "epochEnd": 1697473807200
      },
      {
        "epoch": 1697484900000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-16T19:36:12.000Z",
        "epochEnd": 1697484972000
      },
      {
        "epoch": 1697560200000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-17T16:30:07.200Z",
        "epochEnd": 1697560207200
      },
      {
        "epoch": 1697571300000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-17T19:36:12.000Z",
        "epochEnd": 1697571372000
      },
      {
        "epoch": 1697646600000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-18T16:30:07.200Z",
        "epochEnd": 1697646607200
      },
      {
        "epoch": 1697657700000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-18T19:36:12.000Z",
        "epochEnd": 1697657772000
      },
      {
        "epoch": 1697733000000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-19T16:30:07.200Z",
        "epochEnd": 1697733007200
      },
      {
        "epoch": 1697744100000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-19T19:36:12.000Z",
        "epochEnd": 1697744172000
      },
      {
        "epoch": 1697819400000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-20T16:30:07.200Z",
        "epochEnd": 1697819407200
      },
      {
        "epoch": 1697830500000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-20T19:36:12.000Z",
        "epochEnd": 1697830572000
      },
      {
        "epoch": 1697905800000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-21T16:30:07.200Z",
        "epochEnd": 1697905807200
      },
      {
        "epoch": 1697916900000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-21T19:36:12.000Z",
        "epochEnd": 1697916972000
      },
      {
        "epoch": 1697992200000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-22T16:30:07.200Z",
        "epochEnd": 1697992207200
      },
      {
        "epoch": 1698003300000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-22T19:36:12.000Z",
        "epochEnd": 1698003372000
      },
      {
        "epoch": 1698078600000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T16:30:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_0",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "scheduled",
        "deliveryType": "scheduled",
        "rate": 100,
        "duration": 7200,
        "normalEnd": "2023-10-23T16:30:07.200Z",
        "epochEnd": 1698078607200
      },
      {
        "epoch": 1698089700000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "basal_166cc04053fac_2022-12-13_1",
        "type": "basal",
        "source": "Diabeloop",
        "subType": "automated",
        "deliveryType": "automated",
        "rate": 100,
        "duration": 72000,
        "normalEnd": "2023-10-23T19:36:12.000Z",
        "epochEnd": 1698089772000
      }
    ],
    "bolus": [
      {
        "epoch": 1696703100000,
        "displayOffset": -120,
        "normalTime": "2023-10-07T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1696789500000,
        "displayOffset": -120,
        "normalTime": "2023-10-08T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1696875900000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1696962300000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697048700000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697135100000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697221500000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697307900000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697394300000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697480700000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697567100000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697653500000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697739900000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697826300000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697912700000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1697999100000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      },
      {
        "epoch": 1698085500000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
        "type": "bolus",
        "source": "Diabeloop",
        "subType": "normal",
        "normal": 2,
        "prescriptor": "auto",
        "wizard": null
      }
    ],
    "cbg": [
      {
        "epoch": 1696698300000,
        "displayOffset": -120,
        "normalTime": "2023-10-07T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-07",
        "isoWeekday": "saturday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696698600000,
        "displayOffset": -120,
        "normalTime": "2023-10-07T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-07",
        "isoWeekday": "saturday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696700100000,
        "displayOffset": -120,
        "normalTime": "2023-10-07T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-07",
        "isoWeekday": "saturday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696700400000,
        "displayOffset": -120,
        "normalTime": "2023-10-07T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-07",
        "isoWeekday": "saturday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696701900000,
        "displayOffset": -120,
        "normalTime": "2023-10-07T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-07",
        "isoWeekday": "saturday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696784700000,
        "displayOffset": -120,
        "normalTime": "2023-10-08T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-08",
        "isoWeekday": "sunday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696785000000,
        "displayOffset": -120,
        "normalTime": "2023-10-08T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-08",
        "isoWeekday": "sunday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696786500000,
        "displayOffset": -120,
        "normalTime": "2023-10-08T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-08",
        "isoWeekday": "sunday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696786800000,
        "displayOffset": -120,
        "normalTime": "2023-10-08T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-08",
        "isoWeekday": "sunday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696788300000,
        "displayOffset": -120,
        "normalTime": "2023-10-08T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-08",
        "isoWeekday": "sunday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696871100000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-09",
        "isoWeekday": "monday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696871400000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-09",
        "isoWeekday": "monday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696872900000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-09",
        "isoWeekday": "monday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696873200000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-09",
        "isoWeekday": "monday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696874700000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-09",
        "isoWeekday": "monday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696957500000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-10",
        "isoWeekday": "tuesday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696957800000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-10",
        "isoWeekday": "tuesday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696959300000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-10",
        "isoWeekday": "tuesday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696959600000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-10",
        "isoWeekday": "tuesday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1696961100000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-10",
        "isoWeekday": "tuesday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697043900000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-11",
        "isoWeekday": "wednesday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697044200000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-11",
        "isoWeekday": "wednesday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697045700000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-11",
        "isoWeekday": "wednesday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697046000000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-11",
        "isoWeekday": "wednesday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697047500000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-11",
        "isoWeekday": "wednesday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697130300000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-12",
        "isoWeekday": "thursday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697130600000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-12",
        "isoWeekday": "thursday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697132100000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-12",
        "isoWeekday": "thursday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697132400000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-12",
        "isoWeekday": "thursday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697133900000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-12",
        "isoWeekday": "thursday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697216700000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-13",
        "isoWeekday": "friday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697217000000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-13",
        "isoWeekday": "friday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697218500000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-13",
        "isoWeekday": "friday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697218800000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-13",
        "isoWeekday": "friday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697220300000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-13",
        "isoWeekday": "friday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697303100000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-14",
        "isoWeekday": "saturday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697303400000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-14",
        "isoWeekday": "saturday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697304900000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-14",
        "isoWeekday": "saturday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697305200000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-14",
        "isoWeekday": "saturday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697306700000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-14",
        "isoWeekday": "saturday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697389500000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-15",
        "isoWeekday": "sunday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697389800000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-15",
        "isoWeekday": "sunday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697391300000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-15",
        "isoWeekday": "sunday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697391600000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-15",
        "isoWeekday": "sunday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697393100000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-15",
        "isoWeekday": "sunday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697475900000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-16",
        "isoWeekday": "monday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697476200000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-16",
        "isoWeekday": "monday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697477700000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-16",
        "isoWeekday": "monday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697478000000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-16",
        "isoWeekday": "monday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697479500000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-16",
        "isoWeekday": "monday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697562300000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-17",
        "isoWeekday": "tuesday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697562600000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-17",
        "isoWeekday": "tuesday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697564100000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-17",
        "isoWeekday": "tuesday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697564400000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-17",
        "isoWeekday": "tuesday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697565900000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-17",
        "isoWeekday": "tuesday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697648700000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-18",
        "isoWeekday": "wednesday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697649000000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-18",
        "isoWeekday": "wednesday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697650500000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-18",
        "isoWeekday": "wednesday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697650800000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-18",
        "isoWeekday": "wednesday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697652300000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-18",
        "isoWeekday": "wednesday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697735100000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-19",
        "isoWeekday": "thursday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697735400000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-19",
        "isoWeekday": "thursday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697736900000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-19",
        "isoWeekday": "thursday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697737200000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-19",
        "isoWeekday": "thursday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697738700000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-19",
        "isoWeekday": "thursday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697821500000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-20",
        "isoWeekday": "friday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697821800000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-20",
        "isoWeekday": "friday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697823300000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-20",
        "isoWeekday": "friday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697823600000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-20",
        "isoWeekday": "friday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697825100000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-20",
        "isoWeekday": "friday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697907900000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-21",
        "isoWeekday": "saturday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697908200000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-21",
        "isoWeekday": "saturday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697909700000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-21",
        "isoWeekday": "saturday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697910000000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-21",
        "isoWeekday": "saturday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697911500000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-21",
        "isoWeekday": "saturday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697994300000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-22",
        "isoWeekday": "sunday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697994600000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-22",
        "isoWeekday": "sunday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697996100000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-22",
        "isoWeekday": "sunday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697996400000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-22",
        "isoWeekday": "sunday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1697997900000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-22",
        "isoWeekday": "sunday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1698080700000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T17:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 15,
        "localDate": "2023-10-23",
        "isoWeekday": "monday",
        "msPer24": 68700000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1698081000000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T17:10:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:10:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 55,
        "localDate": "2023-10-23",
        "isoWeekday": "monday",
        "msPer24": 69000000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1698082500000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T17:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:35:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 100,
        "localDate": "2023-10-23",
        "isoWeekday": "monday",
        "msPer24": 70500000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1698082800000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T17:40:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_17:40:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 188,
        "localDate": "2023-10-23",
        "isoWeekday": "monday",
        "msPer24": 70800000,
        "deviceName": "Unknown"
      },
      {
        "epoch": 1698084300000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T18:05:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "cbg_18:05:00",
        "type": "cbg",
        "source": "Diabeloop",
        "units": "mg/dL",
        "value": 260,
        "localDate": "2023-10-23",
        "isoWeekday": "monday",
        "msPer24": 72300000,
        "deviceName": "Unknown"
      }
    ],
    "confidentialModes": [],
    "deviceParametersChanges": [
      {
        "epoch": 1696665600000,
        "displayOffset": 0,
        "normalTime": "2023-10-07T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1696665600000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1696752000000,
        "displayOffset": 0,
        "normalTime": "2023-10-08T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1696752000000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1696838400000,
        "displayOffset": 0,
        "normalTime": "2023-10-09T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1696838400000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1696924800000,
        "displayOffset": 0,
        "normalTime": "2023-10-10T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1696924800000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697011200000,
        "displayOffset": 0,
        "normalTime": "2023-10-11T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697011200000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697097600000,
        "displayOffset": 0,
        "normalTime": "2023-10-12T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697097600000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697184000000,
        "displayOffset": 0,
        "normalTime": "2023-10-13T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697184000000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697270400000,
        "displayOffset": 0,
        "normalTime": "2023-10-14T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697270400000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697356800000,
        "displayOffset": 0,
        "normalTime": "2023-10-15T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697356800000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697443200000,
        "displayOffset": 0,
        "normalTime": "2023-10-16T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697443200000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697529600000,
        "displayOffset": 0,
        "normalTime": "2023-10-17T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697529600000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697616000000,
        "displayOffset": 0,
        "normalTime": "2023-10-18T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697616000000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697702400000,
        "displayOffset": 0,
        "normalTime": "2023-10-19T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697702400000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697788800000,
        "displayOffset": 0,
        "normalTime": "2023-10-20T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697788800000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697875200000,
        "displayOffset": 0,
        "normalTime": "2023-10-21T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697875200000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1697961600000,
        "displayOffset": 0,
        "normalTime": "2023-10-22T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1697961600000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      },
      {
        "epoch": 1698048000000,
        "displayOffset": 0,
        "normalTime": "2023-10-23T08:00:00.000Z",
        "timezone": "UTC",
        "guessedTimezone": false,
        "id": "parameterId",
        "type": "deviceEvent",
        "source": "Diabeloop",
        "subType": "deviceParameter",
        "params": [
          {
            "id": "parameterId",
            "epoch": 1698048000000,
            "timezone": "UTC",
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "level": "1",
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      }
    ],
    "messages": [],
    "meals": [
      {
        "epoch": 1696707300000,
        "displayOffset": -120,
        "normalTime": "2023-10-07T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1696793700000,
        "displayOffset": -120,
        "normalTime": "2023-10-08T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1696880100000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1696966500000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697052900000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697139300000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697225700000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697312100000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697398500000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697484900000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697571300000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697657700000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697744100000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697830500000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1697916900000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1698003300000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      },
      {
        "epoch": 1698089700000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T19:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "food_19-35-00",
        "type": "food",
        "source": "Diabeloop",
        "meal": "rescuecarbs",
        "nutrition": {
          "carbohydrate": {
            "net": 25,
            "units": "grams"
          }
        },
        "prescribedNutrition": {
          "carbohydrate": {}
        },
        "prescriptor": ""
      }
    ],
    "physicalActivities": [
      {
        "epoch": 1696683600000,
        "displayOffset": -120,
        "normalTime": "2023-10-07T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-07T13:30:00.000Z",
        "epochEnd": 1696685400000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-07T13:00:00.000Z"
      },
      {
        "epoch": 1696770000000,
        "displayOffset": -120,
        "normalTime": "2023-10-08T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-08T13:30:00.000Z",
        "epochEnd": 1696771800000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-08T13:00:00.000Z"
      },
      {
        "epoch": 1696856400000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-09T13:30:00.000Z",
        "epochEnd": 1696858200000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-09T13:00:00.000Z"
      },
      {
        "epoch": 1696942800000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-10T13:30:00.000Z",
        "epochEnd": 1696944600000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-10T13:00:00.000Z"
      },
      {
        "epoch": 1697029200000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-11T13:30:00.000Z",
        "epochEnd": 1697031000000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-11T13:00:00.000Z"
      },
      {
        "epoch": 1697115600000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-12T13:30:00.000Z",
        "epochEnd": 1697117400000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-12T13:00:00.000Z"
      },
      {
        "epoch": 1697202000000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-13T13:30:00.000Z",
        "epochEnd": 1697203800000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-13T13:00:00.000Z"
      },
      {
        "epoch": 1697288400000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-14T13:30:00.000Z",
        "epochEnd": 1697290200000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-14T13:00:00.000Z"
      },
      {
        "epoch": 1697374800000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-15T13:30:00.000Z",
        "epochEnd": 1697376600000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-15T13:00:00.000Z"
      },
      {
        "epoch": 1697461200000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-16T13:30:00.000Z",
        "epochEnd": 1697463000000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-16T13:00:00.000Z"
      },
      {
        "epoch": 1697547600000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-17T13:30:00.000Z",
        "epochEnd": 1697549400000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-17T13:00:00.000Z"
      },
      {
        "epoch": 1697634000000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-18T13:30:00.000Z",
        "epochEnd": 1697635800000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-18T13:00:00.000Z"
      },
      {
        "epoch": 1697720400000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-19T13:30:00.000Z",
        "epochEnd": 1697722200000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-19T13:00:00.000Z"
      },
      {
        "epoch": 1697806800000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-20T13:30:00.000Z",
        "epochEnd": 1697808600000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-20T13:00:00.000Z"
      },
      {
        "epoch": 1697893200000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-21T13:30:00.000Z",
        "epochEnd": 1697895000000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-21T13:00:00.000Z"
      },
      {
        "epoch": 1697979600000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-22T13:30:00.000Z",
        "epochEnd": 1697981400000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-22T13:00:00.000Z"
      },
      {
        "epoch": 1698066000000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T13:00:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "physicalActivityId",
        "type": "physicalActivity",
        "source": "Diabeloop",
        "duration": {
          "units": "seconds",
          "value": 1800
        },
        "normalEnd": "2023-10-23T13:30:00.000Z",
        "epochEnd": 1698067800000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
        "inputTime": "2023-10-23T13:00:00.000Z"
      }
    ],
    "pumpSettings": [
      {
        "epoch": 1696696500000,
        "displayOffset": 0,
        "normalTime": "2023-10-07T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1696782900000,
        "displayOffset": 0,
        "normalTime": "2023-10-08T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1696869300000,
        "displayOffset": 0,
        "normalTime": "2023-10-09T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1696955700000,
        "displayOffset": 0,
        "normalTime": "2023-10-10T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697042100000,
        "displayOffset": 0,
        "normalTime": "2023-10-11T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697128500000,
        "displayOffset": 0,
        "normalTime": "2023-10-12T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697214900000,
        "displayOffset": 0,
        "normalTime": "2023-10-13T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697301300000,
        "displayOffset": 0,
        "normalTime": "2023-10-14T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697387700000,
        "displayOffset": 0,
        "normalTime": "2023-10-15T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697474100000,
        "displayOffset": 0,
        "normalTime": "2023-10-16T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697560500000,
        "displayOffset": 0,
        "normalTime": "2023-10-17T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697646900000,
        "displayOffset": 0,
        "normalTime": "2023-10-18T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697733300000,
        "displayOffset": 0,
        "normalTime": "2023-10-19T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697819700000,
        "displayOffset": 0,
        "normalTime": "2023-10-20T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697906100000,
        "displayOffset": 0,
        "normalTime": "2023-10-21T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1697992500000,
        "displayOffset": 0,
        "normalTime": "2023-10-22T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
      },
      {
        "epoch": 1698078900000,
        "displayOffset": 0,
        "normalTime": "2023-10-23T16:35:00.000Z",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
    "reservoirChanges": [
      {
        "epoch": 1696784400000,
        "displayOffset": -120,
        "normalTime": "2023-10-08T17:00:00.000Z",
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
    "wizards": [
      {
        "epoch": 1696703700000,
        "displayOffset": -120,
        "normalTime": "2023-10-07T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1696706700000,
        "displayOffset": -120,
        "normalTime": "2023-10-07T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1696790100000,
        "displayOffset": -120,
        "normalTime": "2023-10-08T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1696793100000,
        "displayOffset": -120,
        "normalTime": "2023-10-08T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1696876500000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1696879500000,
        "displayOffset": -120,
        "normalTime": "2023-10-09T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1696962900000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1696965900000,
        "displayOffset": -120,
        "normalTime": "2023-10-10T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697049300000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697052300000,
        "displayOffset": -120,
        "normalTime": "2023-10-11T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697135700000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697138700000,
        "displayOffset": -120,
        "normalTime": "2023-10-12T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697222100000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697225100000,
        "displayOffset": -120,
        "normalTime": "2023-10-13T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697308500000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697311500000,
        "displayOffset": -120,
        "normalTime": "2023-10-14T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697394900000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697397900000,
        "displayOffset": -120,
        "normalTime": "2023-10-15T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697481300000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697484300000,
        "displayOffset": -120,
        "normalTime": "2023-10-16T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697567700000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697570700000,
        "displayOffset": -120,
        "normalTime": "2023-10-17T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697654100000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697657100000,
        "displayOffset": -120,
        "normalTime": "2023-10-18T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697740500000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697743500000,
        "displayOffset": -120,
        "normalTime": "2023-10-19T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697826900000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697829900000,
        "displayOffset": -120,
        "normalTime": "2023-10-20T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697913300000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1697916300000,
        "displayOffset": -120,
        "normalTime": "2023-10-21T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1697999700000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1698002700000,
        "displayOffset": -120,
        "normalTime": "2023-10-22T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
        "units": "mmol/L",
        "bolus": null,
        "inputMeal": {
          "source": "umm"
        }
      },
      {
        "epoch": 1698086100000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T18:35:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 30,
        "units": "mmol/L",
        "bolus": null
      },
      {
        "epoch": 1698089100000,
        "displayOffset": -120,
        "normalTime": "2023-10-23T19:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
        "carbInput": 20,
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

export const completeDailyViewData: Data = {
  dataRange: ['2022-08-08T15:00:00Z', '2022-08-08T18:40:00Z'],
  data: {
    "alarmEvents": [
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
        "guid": "alarmEventHyperglycemiaId",
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
        "guid": "alarmEventHyperglycemiaId",
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
    "basal": [
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
    "bolus": [
      {
        "epoch": 1659983100000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T18:25:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "carbBolusId",
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
        "id": "carbBolusId2",
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
        "id": "carbBolusId3",
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
        "id": "carbBolusId4",
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
    "confidentialModes": [
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
            "units": "%",
            "value": "100",
            "previousValue": "110",
            "lastUpdateDate": "2022-08-08T08:00:00Z"
          }
        ]
      }
    ],
    "messages": [],
    "meals": [
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
          "value": 1800
        },
        "normalEnd": "2022-08-08T13:30:00.000Z",
        "epochEnd": 1659965400000,
        "guid": "pa_18",
        "reportedIntensity": "medium",
        "eventId": "physicalActivityId",
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
          "history": [
            {
              "changeDate": "2022-11-01T00:00:00Z",
              "parameters": [
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                  "unit": "%",
                  "value": "143"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_DINNER",
                  "unit": "g",
                  "value": "150"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "LARGE_MEAL_LUNCH",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "110"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "110",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T17:00:40Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "100",
                  "value": "90"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_DINNER_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "90",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "value": "130"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-07T14:01:14Z",
                  "level": 1,
                  "name": "MEAL_RATIO_LUNCH_FACTOR",
                  "unit": "%",
                  "previousUnit": "%",
                  "previousValue": "130",
                  "value": "90"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_DINNER",
                  "unit": "g",
                  "value": "60"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "MEDIUM_MEAL_LUNCH",
                  "unit": "g",
                  "value": "50"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                  "unit": "%",
                  "value": "100"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLYCEMIA_TARGET",
                  "unit": "mg/dL",
                  "value": "100.0"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "value": "180.1"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "180.1",
                  "value": "140"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPER_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "140",
                  "value": "180.1"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "value": "70"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-02T07:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "70",
                  "value": "60"
                },
                {
                  "changeType": "updated",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "PATIENT_GLY_HYPO_LIMIT",
                  "unit": "mg/dL",
                  "previousUnit": "mg/dL",
                  "previousValue": "60",
                  "value": "70"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_BREAKFAST",
                  "unit": "g",
                  "value": "15"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_DINNER",
                  "unit": "g",
                  "value": "20"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "SMALL_MEAL_LUNCH",
                  "unit": "g",
                  "value": "30"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "TOTAL_INSULIN_FOR_24H",
                  "unit": "U",
                  "value": "53"
                },
                {
                  "changeType": "added",
                  "effectiveDate": "2022-11-01T00:00:00Z",
                  "level": 1,
                  "name": "WEIGHT",
                  "unit": "kg",
                  "value": "69.0"
                }
              ]
            }
          ],
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
    "smbg": [
      {
        "epoch": 1659971700000,
        "displayOffset": -120,
        "normalTime": "2022-08-08T15:15:00.000Z",
        "timezone": "Europe/Paris",
        "guessedTimezone": false,
        "id": "smbgId",
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
        "id": "wizardId1",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId",
        "bolusIds": {},
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
        "id": "wizardId2",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId2",
        "bolusIds": {},
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
        "id": "wizardId3",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId3",
        "bolusIds": {},
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
        "id": "wizardId4",
        "type": "wizard",
        "source": "Diabeloop",
        "bolusId": "carbBolusId4",
        "bolusIds": {},
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
            "units": "%",
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
        "eventId": "physicalActivityId",
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

export const pumpSettingsData: Data = {
  dataRange: ['2022-08-08T16:35:00.000Z', '2022-08-08T16:40:00.000Z'],
  data: {
    pumpSettings: [
      {
        normalTime: '2020-01-01T10:00:00.000Z',
        type: 'pumpSettings',
        id: 'pump_settings',
        timezone: 'UTC',
        source: "Diabeloop",
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

export const mockDataAPI = (patientData: Data = completeDailyViewData) => {
  jest.spyOn(DataAPI, 'getPatientDataRange').mockResolvedValue(patientData.dataRange)
  jest.spyOn(DataAPI, 'getPatientData').mockImplementation(() => Promise.resolve(patientData.data))
}
