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

import type Basal from '../../../src/domains/models/medical/datum/basal.model'
import type Bolus from '../../../src/domains/models/medical/datum/bolus.model'
import type Wizard from '../../../src/domains/models/medical/datum/wizard.model'
import type MedicalData from '../../../src/domains/models/medical/medical-data.model'
import type MedicalDataOptions from '../../../src/domains/models/medical/medical-data-options.model'
import BasalService from '../../../src/domains/repositories/medical/datum/basal.service'
import BolusService from '../../../src/domains/repositories/medical/datum/bolus.service'
import WizardService from '../../../src/domains/repositories/medical/datum/wizard.service'
import DatumService from '../../../src/domains/repositories/medical/datum.service'
import MedicalDataService from '../../../src/domains/repositories/medical/medical-data.service'
import createRandomDatum from '../../data-generator'
import type BasicData from '../../../src/domains/repositories/medical/basics-data.service'
import * as BasiscsDataService from '../../../src/domains/repositories/medical/basics-data.service'
import * as TimeService from '../../../src/domains/repositories/time/time.service'
import * as crypto from "crypto"
import { DatumType, Source } from '../../../src'
import { DeviceEventSubtype } from '../../../src/domains/models/medical/datum/enums/device-event-subtype.enum'
import WeekDays from '../../../src/domains/models/time/enum/weekdays.enum'

// window.crypto is not defined in jest...
Object.defineProperty(global, 'crypto', {
  value: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRandomValues: (arr: any) => crypto.randomBytes(arr.length)
  }
})

const testData = {
  alarmEvents: [{
    "timezone": "Europe/Paris",
    "normalTime": "2023-10-15T00:00:00.000Z",
    "epoch": 1697328000000,
    "displayOffset": 120,
    "guessedTimezone": false,
    "id": "alarm-01",
    "type": "deviceEvent",
    "source": "Diabeloop",
    "duration": {
      "units": "hours",
      "value": 0
      },
    "normalEnd": "2023-10-15T00:00:00.000Z",
    "epochEnd": 1697328000000,
    "subType": "alarm",
    "guid": "guid",
    "inputTime": "2023-10-15T00:00:00Z",
    "alarm": {
      "alarmCode": "10113",
      "alarmLevel": "alert",
      "alarmType": "handset",
      "ackStatus": "acknowledged",
      "updateTime": "2023-10-15T00:00:00"
    },
    "alarmEventType": "Hyperglycemia"
    }
  ],
  basal: [
    {
      "id": "basal_fc25685018a9c_2023-10-15_0",
      "type": "basal",
      "source": "Diabeloop",
      "timezone": "Europe/Paris",
      "normalTime": "2023-10-15T00:00:00.000Z",
      "epoch": 1697328000000,
      "displayOffset": 120,
      "subType": "automated",
      "deliveryType": "automated",
      "duration": 300000,
      "rate": 2.258466613234464,
      "normalEnd": "2023-10-15T00:05:00.000Z",
      "epochEnd": 1697328300000
    },
    {
      "id": "basal_fc25685018a9c_2023-10-15_1",
      "type": "basal",
      "source": "Diabeloop",
      "timezone": "Europe/Paris",
      "normalTime": "2023-10-15T00:05:00.000Z",
      "epoch": 1697328300000,
      "displayOffset": 120,
      "subType": "automated",
      "deliveryType": "automated",
      "duration": 300000,
      "rate": 2.258466613234464,
      "normalEnd": "2023-10-15T00:10:00.000Z",
      "epochEnd": 1697328600000
    },
    {
      "id": "basal_fc25685018a9c_2023-10-15_2",
      "type": "basal",
      "source": "Diabeloop",
      "timezone": "Europe/Paris",
      "normalTime": "2023-10-15T00:10:00.000Z",
      "epoch": 1697328600000,
      "displayOffset": 120,
      "subType": "automated",
      "deliveryType": "automated",
      "duration": 300000,
      "rate": 2.411805655891653,
      "normalEnd": "2023-10-15T00:15:00.000Z",
      "epochEnd": 1697328900000
    },
    {
      "id": "basal_fc25685018a9c_2023-10-15_3",
      "type": "basal",
      "source": "Diabeloop",
      "timezone": "Europe/Paris",
      "normalTime": "2023-10-15T00:15:00.000Z",
      "epoch": 1697328900000,
      "displayOffset": 120,
      "subType": "automated",
      "deliveryType": "automated",
      "duration": 300000,
      "rate": 2.411805655891653,
      "normalEnd": "2023-10-15T00:20:00.000Z",
      "epochEnd": 1697329200000
    }
  ],
  bolus: [
    {
      "id": "c6a18be618d01c22d3533514106657b2",
      "type": "bolus",
      "source": "Diabeloop",
      "timezone": "Europe/Paris",
      "normalTime": "2023-10-30T23:45:00.000Z",
      "epoch": 1698709500000,
      "displayOffset": 60,
      "subType": "normal",
      "normal": 0.2629838185645338,
      "prescriptor": "",
      "expectedNormal": 0.2629838185645338,
      "insulinOnBoard": 3.721381496329213
    },
    {
      "id": "ca5100d44ea4be9a7b459e1b4a1af30f",
      "type": "bolus",
      "source": "Diabeloop",
      "timezone": "Europe/Paris",
      "normalTime": "2023-10-30T23:40:00.000Z",
      "epoch": 1698709200000,
      "displayOffset": 60,
      "subType": "normal",
      "normal": 0.6510296433417474,
      "prescriptor": "",
      "expectedNormal": 0.6510296433417474,
      "insulinOnBoard": 3.5118998239628065
    },
    {
      "id": "cebc8ae1f92b4a85fde0d5fb7809e7f2",
      "type": "bolus",
      "source": "Diabeloop",
      "timezone": "Europe/Paris",
      "normalTime": "2023-10-30T20:30:00.000Z",
      "epoch": 1698697800000,
      "displayOffset": 60,
      "subType": "normal",
      "normal": 5.4538319984378285,
      "prescriptor": "",
      "expectedNormal": 5.4538319984378285,
      "insulinOnBoard": 8.415562216980202
    },
    {
      "id": "cff2c8007cb03ff02025152ea094c32b",
      "type": "bolus",
      "source": "Diabeloop",
      "timezone": "Europe/Paris",
      "normalTime": "2023-10-30T18:00:00.000Z",
      "epoch": 1698688800000,
      "displayOffset": 60,
      "subType": "normal",
      "normal": 5.889081040897143,
      "prescriptor": "",
      "expectedNormal": 5.889081040897143,
      "insulinOnBoard": 7.750188640673724
    },
    {
      "id": "d84d3e38295bb4dd234d7c43520d89bf",
      "type": "bolus",
      "source": "Diabeloop",
      "timezone": "Europe/Paris",
      "normalTime": "2023-10-30T14:20:00.000Z",
      "epoch": 1698675600000,
      "displayOffset": 60,
      "subType": "normal",
      "normal": 7.14641078026624,
      "prescriptor": "",
      "expectedNormal": 7.14641078026624,
      "insulinOnBoard": 8.643264350182363
    },
    {
      "id": "0459fadd4a9b4e529dae833a0b952469",
      "type": "bolus",
      "source": "Diabeloop",
      "timezone": "Europe/Paris",
      "normalTime": "2023-10-30T06:20:00.000Z",
      "epoch": 1698646800000,
      "displayOffset": 60,
      "subType": "normal",
      "normal": 17.9794741303513,
      "prescriptor": "",
      "expectedNormal": 17.9794741303513,
      "insulinOnBoard": 20.95622124136239
    },
    {
      "id": "93576e20d5f6901a1bd8617cfaa3ec90",
      "type": "bolus",
      "source": "Diabeloop",
      "timezone": "Europe/Paris",
      "normalTime": "2023-10-30T04:10:00.000Z",
      "epoch": 1698639000000,
      "displayOffset": 60,
      "subType": "normal",
      "normal": 0.0011170833361628162,
      "prescriptor": "",
      "expectedNormal": 0.0011170833361628162,
      "insulinOnBoard": 3.4509836199469404
    }
  ],
  cbg: [
    {
      epoch: 1579514400000,
      displayOffset: -60,
      normalTime: '2020-01-20T10:00:00.000Z',
      timezone: 'Europe/Paris',
      guessedTimezone: false,
      id: '2020-01-20_0',
      type: 'cbg',
      source: 'Diabeloop',
      units: 'mg/dL',
      value: 182,
      localDate: '2020-01-20',
      isoWeekday: 'monday',
      msPer24: 39600000,
      deviceName: 'Unknown'
    },
    {
      epoch: 1579428000000,
      displayOffset: -60,
      normalTime: '2020-01-19T10:00:00.000Z',
      timezone: 'Europe/Paris',
      guessedTimezone: false,
      id: '2020-01-19_0',
      type: 'cbg',
      source: 'Diabeloop',
      units: 'mg/dL',
      value: 164,
      localDate: '2020-01-19',
      isoWeekday: 'sunday',
      msPer24: 39600000,
      deviceName: 'Unknown'
    },
    {
      epoch: 1579428000000,
      displayOffset: -60,
      normalTime: '2020-01-19T10:00:00.000Z',
      timezone: 'Europe/Paris',
      guessedTimezone: false,
      id: '2020-01-19_1',
      type: 'cbg',
      source: 'Diabeloop',
      units: 'mg/dL',
      value: 196,
      localDate: '2020-01-19',
      isoWeekday: 'sunday',
      msPer24: 39600000,
      deviceName: 'Unknown'
    },
    {
      epoch: 1579428000000,
      displayOffset: -60,
      normalTime: '2020-01-19T10:00:00.000Z',
      timezone: 'Europe/Paris',
      guessedTimezone: false,
      id: '2020-01-19_2',
      type: 'cbg',
      source: 'Diabeloop',
      units: 'mg/dL',
      value: 196,
      localDate: '2020-01-19',
      isoWeekday: 'sunday',
      msPer24: 39600000,
      deviceName: 'Unknown'
    },
    {
      epoch: 1579341600000,
      displayOffset: -60,
      normalTime: '2020-01-18T10:00:00.000Z',
      timezone: 'Europe/Paris',
      guessedTimezone: false,
      id: '2020-01-18_0',
      type: 'cbg',
      source: 'Diabeloop',
      units: 'mg/dL',
      value: 177,
      localDate: '2020-01-18',
      isoWeekday: 'saturday',
      msPer24: 39600000,
      deviceName: 'Unknown'
    }
  ],
  confidentialModes: [
    {
      "id": "65a5ae80852d619816405bcc4dfc0b5e",
      "type": "deviceEvent",
      "source": "Diabeloop",
      "timezone": "Europe/Paris",
      "normalTime": "2023-10-15T23:50:00.000Z",
      "epoch": 1697413800000,
      "displayOffset": 120,
      "duration": {
        "units": "hours",
        "value": 0
      },
      "normalEnd": "2023-10-15T23:50:00.000Z",
      "epochEnd": 1697413800000,
      "subType": "confidential",
      "guid": "confidential-16961184000000001",
      "inputTime": "2021-01-16T23:37:21Z"
    }
  ],
  deviceParametersChanges: [
    {
      "id": "deviceParameter_0",
      "type": "deviceEvent",
      "source": "Diabeloop",
      "timezone": "UTC",
      "normalTime": "2023-09-01T00:00:00.000Z",
      "epoch": 1693526400000,
      "displayOffset": 0,
      "subType": "deviceParameter",
      "params": [
        {
          "id": "deviceParameter_0",
          "epoch": 1693526400000,
          "timezone": "UTC",
          "name": "BOLUS_AGGRESSIVENESS_FACTOR",
          "level": "1",
          "unit": "%",
          "value": "143",
          "previousValue": ""
        }
      ]
    },
    {
      "id": "deviceParameter_1",
      "type": "deviceEvent",
      "source": "Diabeloop",
      "timezone": "UTC",
      "normalTime": "2023-09-01T00:00:00.000Z",
      "epoch": 1693526400000,
      "displayOffset": 0,
      "subType": "deviceParameter",
      "params": [
        {
          "id": "deviceParameter_1",
          "epoch": 1693526400000,
          "timezone": "UTC",
          "name": "LARGE_MEAL_BREAKFAST",
          "level": "1",
          "unit": "g",
          "value": "150",
          "previousValue": ""
        }
      ]
    },
    {
      "id": "deviceParameter_2",
      "type": "deviceEvent",
      "source": "Diabeloop",
      "timezone": "UTC",
      "normalTime": "2023-09-01T00:00:00.000Z",
      "epoch": 1693526400000,
      "displayOffset": 0,
      "subType": "deviceParameter",
      "params": [
        {
          "id": "deviceParameter_2",
          "epoch": 1693526400000,
          "timezone": "UTC",
          "name": "LARGE_MEAL_DINNER",
          "level": "1",
          "unit": "g",
          "value": "150",
          "previousValue": ""
        }
      ]
    }
  ],
  eatingShortlyEvents: [
    {
      id: 'eating_shortly_event_id',
      guid: 'eating_shortly_event_id',
      type: DatumType.EatingShortlyEvent,
      epoch: 1659945600000,
      normalTime: '2022-08-08T15:30:00.000Z',
      timezone: 'Europe/Paris',
      guessedTimezone: false,
      displayOffset: -120,
      isoWeekday: WeekDays.Friday,
      source: Source.Diabeloop,
    }
  ],
  iob: [
    {
      "id":"iob_cef62a2ed0794_2020-01-04_0",
      "isoWeekday":"friday",
      "type":"iob",
      "source": "Diabeloop",
      "timezone":"Europe/Paris",
      "guessedTimezone":false,
      "normalTime":"2023-10-30T10:00:00.000Z",
      "epoch":1698688800000,
      "displayOffset":-300,
      "units":"U",
      "value":49
    }
  ],
  messages: [],
  meals: [
    {
      epoch: 1579428000000,
      displayOffset: -60,
      normalTime: '2020-01-19T10:00:00.000Z',
      timezone: 'Europe/Paris',
      guessedTimezone: false,
      id: 'food_19-35-00',
      type: 'food',
      source: 'Diabeloop',
      meal: 'rescuecarbs',
      uploadId: 'osef',
      nutrition: [],
      prescribedNutrition: [],
      prescriptor: ''
    }
  ],
  nightModes: [{
    "id": "f6509511da396bd945f129240b0f4539",
    "type": "deviceEvent",
    "source": "Diabeloop",
    "timezone": "Europe/Paris",
    "normalTime": "2023-10-29T08:22:00.000Z",
    "epoch": 1698567720000,
    "displayOffset": 60,
    "duration": {
      "units": "milliseconds",
      "value": 32400000
    },
    "normalEnd": "2023-10-29T08:22:00.000Z",
    "epochEnd": 1698567720000,
    "guid": "df8e18ec-ff2f-40ff-9d14-8cd55db5aa0c_night_1742425200000",
    "subType": "night",
    "inputTime": "2021-01-15T08:21:47Z"
  }],
  physicalActivities: [
    {
      "id": "f6509511da396bd945f129240b0f4538",
      "type": "physicalActivity",
      "source": "Diabeloop",
      "timezone": "Europe/Paris",
      "normalTime": "2023-10-29T08:22:00.000Z",
      "epoch": 1698567720000,
      "displayOffset": 60,
      "duration": {
        "units": "minutes",
        "value": 0
      },
      "normalEnd": "2023-10-29T08:22:00.000Z",
      "epochEnd": 1698567720000,
      "guid": "physicalActivity-16974144000000003",
      "reportedIntensity": "low",
      "inputTime": "2021-01-15T08:21:47Z",
      "name": ""
    },
    {
      "id": "318b802601eed0eeb8076a4ed4aa9c5b",
      "type": "physicalActivity",
      "source": "Diabeloop",
      "timezone": "Europe/Paris",
      "normalTime": "2023-10-27T08:24:10.000Z",
      "epoch": 1698395050000,
      "displayOffset": 120,
      "duration": {
        "units": "minutes",
        "value": 0
      },
      "normalEnd": "2023-10-27T08:24:10.000Z",
      "epochEnd": 1698395050000,
      "guid": "physicalActivity-16974144000000002",
      "reportedIntensity": "low",
      "inputTime": "2021-01-13T08:02:18Z",
      "name": ""
    }
  ],
  pumpSettings: [
    {
      "id": "pumpSettings0",
      "type": "pumpSettings",
      "source": "Diabeloop",
      "timezone": "UTC",
      "normalTime": "2023-10-16T00:00:00.000Z",
      "epoch": 1697414400000,
      "displayOffset": 0,
      "deviceId": "123456789-ID",
      "payload": {
        "cgm": {
          "apiVersion": "0.1.0",
          "endOfLifeTransmitterDate": "2020-12-31T04:13:00.000Z",
          "expirationDate": "2021-01-31T04:13:00.000Z",
          "manufacturer": "Dexcom",
          "name": "G6",
          "swVersionTransmitter": "0.0.1",
          "transmitterId": "123456789"
        },
        "device": {
          "deviceId": "123456789-ID",
          "imei": "123456789-IMEI",
          "manufacturer": "Diabeloop",
          "name": "DBLG1",
          "swVersion": "1.0.0"
        },
        "parameters": [
          {
            "effectiveDate": "2023-10-16T00:00:00.000Z",
            "level": 1,
            "name": "MEDIUM_MEAL_BREAKFAST",
            "unit": "g",
            "value": "70"
          },
          {
            "effectiveDate": "2023-10-16T00:00:00.000Z",
            "level": 1,
            "name": "MEDIUM_MEAL_LUNCH",
            "unit": "g",
            "value": "50"
          },
          {
            "effectiveDate": "2023-10-16T00:00:00.000Z",
            "level": 1,
            "name": "MEDIUM_MEAL_DINNER",
            "unit": "g",
            "value": "60"
          },
          {
            "effectiveDate": "2023-10-16T00:00:00.000Z",
            "level": 1,
            "name": "TOTAL_INSULIN_FOR_24H",
            "unit": "U",
            "value": "53"
          },
          {
            "effectiveDate": "2023-10-16T00:00:00.000Z",
            "level": 1,
            "name": "WEIGHT",
            "unit": "kg",
            "value": "69.0"
          },
          {
            "effectiveDate": "2023-10-16T00:00:00.000Z",
            "level": 1,
            "name": "PATIENT_GLY_HYPER_LIMIT",
            "unit": "mg/dL",
            "value": "180.1"
          },
          {
            "effectiveDate": "2023-10-16T00:00:00.000Z",
            "level": 1,
            "name": "PATIENT_GLY_HYPO_LIMIT",
            "unit": "mg/dL",
            "value": "70"
          },
          {
            "effectiveDate": "2023-10-16T00:00:00.000Z",
            "level": 1,
            "name": "PATIENT_GLYCEMIA_TARGET",
            "unit": "mg/dL",
            "value": "100.0"
          },
          {
            "effectiveDate": "2023-10-16T00:00:00.000Z",
            "level": 1,
            "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
            "unit": "%",
            "value": "100"
          },
          {
            "effectiveDate": "2023-10-16T00:00:00.000Z",
            "level": 1,
            "name": "BOLUS_AGGRESSIVENESS_FACTOR",
            "unit": "%",
            "value": "143"
          },
          {
            "effectiveDate": "2023-10-16T00:00:00.000Z",
            "level": 1,
            "name": "MEAL_RATIO_BREAKFAST_FACTOR",
            "unit": "%",
            "value": "100"
          },
          {
            "effectiveDate": "2023-10-22T14:01:14.000Z",
            "level": 1,
            "name": "MEAL_RATIO_LUNCH_FACTOR",
            "unit": "%",
            "value": "90"
          },
          {
            "effectiveDate": "2023-10-16T00:00:00.000Z",
            "level": 1,
            "name": "MEAL_RATIO_DINNER_FACTOR",
            "unit": "%",
            "value": "100"
          },
          {
            "effectiveDate": "2023-10-16T00:00:00.000Z",
            "level": 1,
            "name": "SMALL_MEAL_BREAKFAST",
            "unit": "g",
            "value": "15"
          },
          {
            "effectiveDate": "2023-10-16T00:00:00.000Z",
            "level": 1,
            "name": "LARGE_MEAL_BREAKFAST",
            "unit": "g",
            "value": "150"
          },
          {
            "effectiveDate": "2023-10-16T00:00:00.000Z",
            "level": 1,
            "name": "SMALL_MEAL_LUNCH",
            "unit": "g",
            "value": "30"
          },
          {
            "effectiveDate": "2023-10-16T00:00:00.000Z",
            "level": 1,
            "name": "LARGE_MEAL_LUNCH",
            "unit": "g",
            "value": "70"
          },
          {
            "effectiveDate": "2023-10-16T00:00:00.000Z",
            "level": 1,
            "name": "SMALL_MEAL_DINNER",
            "unit": "g",
            "value": "20"
          },
          {
            "effectiveDate": "2023-10-16T00:00:00.000Z",
            "level": 1,
            "name": "LARGE_MEAL_DINNER",
            "unit": "g",
            "value": "150"
          }
        ],
        "history": [
          {
            "changeDate": "2023-09-16T00:00",
            "parameters": [
              {
                "changeType": "updated",
                "effectiveDate": "2023-09-17T17:00:40.000Z",
                "level": 1,
                "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                "unit": "%",
                "value": "110",
                "previousValue": "100",
                "previousUnit": "%"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-09-16T00:00:00.000Z",
                "level": 1,
                "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                "unit": "%",
                "value": "100",
                "previousValue": "110",
                "previousUnit": "%"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-09-17T17:00:40.000Z",
                "level": 1,
                "name": "MEAL_RATIO_DINNER_FACTOR",
                "unit": "%",
                "value": "90",
                "previousValue": "100",
                "previousUnit": "%"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-09-16T00:00:00.000Z",
                "level": 1,
                "name": "MEAL_RATIO_DINNER_FACTOR",
                "unit": "%",
                "value": "100",
                "previousValue": "90",
                "previousUnit": "%"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-09-16T00:00:00.000Z",
                "level": 1,
                "name": "MEAL_RATIO_LUNCH_FACTOR",
                "unit": "%",
                "value": "130",
                "previousValue": "90",
                "previousUnit": "%"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-09-22T14:01:14.000Z",
                "level": 1,
                "name": "MEAL_RATIO_LUNCH_FACTOR",
                "unit": "%",
                "value": "90",
                "previousValue": "130",
                "previousUnit": "%"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-09-17T07:00:00.000Z",
                "level": 1,
                "name": "PATIENT_GLY_HYPER_LIMIT",
                "unit": "mg/dL",
                "value": "140",
                "previousValue": "180.1",
                "previousUnit": "mg/dL"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-09-16T00:00:00.000Z",
                "level": 1,
                "name": "PATIENT_GLY_HYPER_LIMIT",
                "unit": "mg/dL",
                "value": "180.1",
                "previousValue": "140",
                "previousUnit": "mg/dL"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-09-17T07:00:00.000Z",
                "level": 1,
                "name": "PATIENT_GLY_HYPO_LIMIT",
                "unit": "mg/dL",
                "value": "60",
                "previousValue": "70",
                "previousUnit": "mg/dL"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-09-16T00:00:00.000Z",
                "level": 1,
                "name": "PATIENT_GLY_HYPO_LIMIT",
                "unit": "mg/dL",
                "value": "70",
                "previousValue": "60",
                "previousUnit": "mg/dL"
              }
            ]
          },
          {
            "changeDate": "2023-10-01T00:00",
            "parameters": [
              {
                "changeType": "updated",
                "effectiveDate": "2023-10-02T17:00:40.000Z",
                "level": 1,
                "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                "unit": "%",
                "value": "110",
                "previousValue": "100",
                "previousUnit": "%"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-10-01T00:00:00.000Z",
                "level": 1,
                "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                "unit": "%",
                "value": "100",
                "previousValue": "110",
                "previousUnit": "%"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-10-02T17:00:40.000Z",
                "level": 1,
                "name": "MEAL_RATIO_DINNER_FACTOR",
                "unit": "%",
                "value": "90",
                "previousValue": "100",
                "previousUnit": "%"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-10-01T00:00:00.000Z",
                "level": 1,
                "name": "MEAL_RATIO_DINNER_FACTOR",
                "unit": "%",
                "value": "100",
                "previousValue": "90",
                "previousUnit": "%"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-10-01T00:00:00.000Z",
                "level": 1,
                "name": "MEAL_RATIO_LUNCH_FACTOR",
                "unit": "%",
                "value": "130",
                "previousValue": "90",
                "previousUnit": "%"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-10-07T14:01:14.000Z",
                "level": 1,
                "name": "MEAL_RATIO_LUNCH_FACTOR",
                "unit": "%",
                "value": "90",
                "previousValue": "130",
                "previousUnit": "%"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-10-02T07:00:00.000Z",
                "level": 1,
                "name": "PATIENT_GLY_HYPER_LIMIT",
                "unit": "mg/dL",
                "value": "140",
                "previousValue": "180.1",
                "previousUnit": "mg/dL"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-10-01T00:00:00.000Z",
                "level": 1,
                "name": "PATIENT_GLY_HYPER_LIMIT",
                "unit": "mg/dL",
                "value": "180.1",
                "previousValue": "140",
                "previousUnit": "mg/dL"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-10-02T07:00:00.000Z",
                "level": 1,
                "name": "PATIENT_GLY_HYPO_LIMIT",
                "unit": "mg/dL",
                "value": "60",
                "previousValue": "70",
                "previousUnit": "mg/dL"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-10-01T00:00:00.000Z",
                "level": 1,
                "name": "PATIENT_GLY_HYPO_LIMIT",
                "unit": "mg/dL",
                "value": "70",
                "previousValue": "60",
                "previousUnit": "mg/dL"
              }
            ]
          },
          {
            "changeDate": "2023-10-16T00:00",
            "parameters": [
              {
                "changeType": "updated",
                "effectiveDate": "2023-10-17T17:00:40.000Z",
                "level": 1,
                "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                "unit": "%",
                "value": "110",
                "previousValue": "100",
                "previousUnit": "%"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-10-16T00:00:00.000Z",
                "level": 1,
                "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                "unit": "%",
                "value": "100",
                "previousValue": "110",
                "previousUnit": "%"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-10-17T17:00:40.000Z",
                "level": 1,
                "name": "MEAL_RATIO_DINNER_FACTOR",
                "unit": "%",
                "value": "90",
                "previousValue": "100",
                "previousUnit": "%"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-10-16T00:00:00.000Z",
                "level": 1,
                "name": "MEAL_RATIO_DINNER_FACTOR",
                "unit": "%",
                "value": "100",
                "previousValue": "90",
                "previousUnit": "%"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-10-16T00:00:00.000Z",
                "level": 1,
                "name": "MEAL_RATIO_LUNCH_FACTOR",
                "unit": "%",
                "value": "130",
                "previousValue": "90",
                "previousUnit": "%"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-10-22T14:01:14.000Z",
                "level": 1,
                "name": "MEAL_RATIO_LUNCH_FACTOR",
                "unit": "%",
                "value": "90",
                "previousValue": "130",
                "previousUnit": "%"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-10-17T07:00:00.000Z",
                "level": 1,
                "name": "PATIENT_GLY_HYPER_LIMIT",
                "unit": "mg/dL",
                "value": "140",
                "previousValue": "180.1",
                "previousUnit": "mg/dL"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-10-16T00:00:00.000Z",
                "level": 1,
                "name": "PATIENT_GLY_HYPER_LIMIT",
                "unit": "mg/dL",
                "value": "180.1",
                "previousValue": "140",
                "previousUnit": "mg/dL"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-10-17T07:00:00.000Z",
                "level": 1,
                "name": "PATIENT_GLY_HYPO_LIMIT",
                "unit": "mg/dL",
                "value": "60",
                "previousValue": "70",
                "previousUnit": "mg/dL"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-10-16T00:00:00.000Z",
                "level": 1,
                "name": "PATIENT_GLY_HYPO_LIMIT",
                "unit": "mg/dL",
                "value": "70",
                "previousValue": "60",
                "previousUnit": "mg/dL"
              }
            ]
          },
          {
            "changeDate": "2023-09-01T00:00",
            "parameters": [
              {
                "changeType": "added",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "BOLUS_AGGRESSIVENESS_FACTOR",
                "unit": "%",
                "value": "143",
                "previousValue": "",
                "previousUnit": ""
              },
              {
                "changeType": "added",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "LARGE_MEAL_BREAKFAST",
                "unit": "g",
                "value": "150",
                "previousValue": "",
                "previousUnit": ""
              },
              {
                "changeType": "added",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "LARGE_MEAL_DINNER",
                "unit": "g",
                "value": "150",
                "previousValue": "",
                "previousUnit": ""
              },
              {
                "changeType": "added",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "LARGE_MEAL_LUNCH",
                "unit": "g",
                "value": "70",
                "previousValue": "",
                "previousUnit": ""
              },
              {
                "changeType": "added",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                "unit": "%",
                "value": "100",
                "previousValue": "",
                "previousUnit": ""
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-09-02T17:00:40.000Z",
                "level": 1,
                "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                "unit": "%",
                "value": "110",
                "previousValue": "100",
                "previousUnit": "%"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "MEAL_RATIO_BREAKFAST_FACTOR",
                "unit": "%",
                "value": "100",
                "previousValue": "110",
                "previousUnit": "%"
              },
              {
                "changeType": "added",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "MEAL_RATIO_DINNER_FACTOR",
                "unit": "%",
                "value": "100",
                "previousValue": "",
                "previousUnit": ""
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-09-02T17:00:40.000Z",
                "level": 1,
                "name": "MEAL_RATIO_DINNER_FACTOR",
                "unit": "%",
                "value": "90",
                "previousValue": "100",
                "previousUnit": "%"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "MEAL_RATIO_DINNER_FACTOR",
                "unit": "%",
                "value": "100",
                "previousValue": "90",
                "previousUnit": "%"
              },
              {
                "changeType": "added",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "MEAL_RATIO_LUNCH_FACTOR",
                "unit": "%",
                "value": "130",
                "previousValue": "",
                "previousUnit": ""
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-09-07T14:01:14.000Z",
                "level": 1,
                "name": "MEAL_RATIO_LUNCH_FACTOR",
                "unit": "%",
                "value": "90",
                "previousValue": "130",
                "previousUnit": "%"
              },
              {
                "changeType": "added",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "MEDIUM_MEAL_BREAKFAST",
                "unit": "g",
                "value": "70",
                "previousValue": "",
                "previousUnit": ""
              },
              {
                "changeType": "added",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "MEDIUM_MEAL_DINNER",
                "unit": "g",
                "value": "60",
                "previousValue": "",
                "previousUnit": ""
              },
              {
                "changeType": "added",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "MEDIUM_MEAL_LUNCH",
                "unit": "g",
                "value": "50",
                "previousValue": "",
                "previousUnit": ""
              },
              {
                "changeType": "added",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA",
                "unit": "%",
                "value": "100",
                "previousValue": "",
                "previousUnit": ""
              },
              {
                "changeType": "added",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "PATIENT_GLYCEMIA_TARGET",
                "unit": "mg/dL",
                "value": "100.0",
                "previousValue": "",
                "previousUnit": ""
              },
              {
                "changeType": "added",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "PATIENT_GLY_HYPER_LIMIT",
                "unit": "mg/dL",
                "value": "180.1",
                "previousValue": "",
                "previousUnit": ""
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-09-02T07:00:00.000Z",
                "level": 1,
                "name": "PATIENT_GLY_HYPER_LIMIT",
                "unit": "mg/dL",
                "value": "140",
                "previousValue": "180.1",
                "previousUnit": "mg/dL"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "PATIENT_GLY_HYPER_LIMIT",
                "unit": "mg/dL",
                "value": "180.1",
                "previousValue": "140",
                "previousUnit": "mg/dL"
              },
              {
                "changeType": "added",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "PATIENT_GLY_HYPO_LIMIT",
                "unit": "mg/dL",
                "value": "70",
                "previousValue": "",
                "previousUnit": ""
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-09-02T07:00:00.000Z",
                "level": 1,
                "name": "PATIENT_GLY_HYPO_LIMIT",
                "unit": "mg/dL",
                "value": "60",
                "previousValue": "70",
                "previousUnit": "mg/dL"
              },
              {
                "changeType": "updated",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "PATIENT_GLY_HYPO_LIMIT",
                "unit": "mg/dL",
                "value": "70",
                "previousValue": "60",
                "previousUnit": "mg/dL"
              },
              {
                "changeType": "added",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "SMALL_MEAL_BREAKFAST",
                "unit": "g",
                "value": "15",
                "previousValue": "",
                "previousUnit": ""
              },
              {
                "changeType": "added",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "SMALL_MEAL_DINNER",
                "unit": "g",
                "value": "20",
                "previousValue": "",
                "previousUnit": ""
              },
              {
                "changeType": "added",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "SMALL_MEAL_LUNCH",
                "unit": "g",
                "value": "30",
                "previousValue": "",
                "previousUnit": ""
              },
              {
                "changeType": "added",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "TOTAL_INSULIN_FOR_24H",
                "unit": "U",
                "value": "53",
                "previousValue": "",
                "previousUnit": ""
              },
              {
                "changeType": "added",
                "effectiveDate": "2023-09-01T00:00:00.000Z",
                "level": 1,
                "name": "WEIGHT",
                "unit": "kg",
                "value": "69.0",
                "previousValue": "",
                "previousUnit": ""
              }
            ]
          }
        ],
        "pump": {
          "expirationDate": "2021-01-31T04:13:00.000Z",
          "manufacturer": "Roche",
          "name": "Pump0001",
          "serialNumber": "123456789",
          "swVersion": "0.1.0"
        }
      }
    }
  ],
  reservoirChanges: [
    {
      "id": "e03f1b1f26f93429a8554fdea81a3a79",
      "type": "deviceEvent",
      "source": "Diabeloop",
      "timezone": "Europe/Paris",
      "normalTime": "2023-10-28T10:24:51.000Z",
      "epoch": 1698488691000,
      "displayOffset": 120,
      "subType": "reservoirChange"
    },
    {
      "id": "75f4c2811bb9b7ab7fb1d655cda4fda9",
      "type": "deviceEvent",
      "source": "Diabeloop",
      "timezone": "Europe/Paris",
      "normalTime": "2023-10-25T10:45:07.000Z",
      "epoch": 1698230707000,
      "displayOffset": 120,
      "subType": "reservoirChange"
    },
    {
      "id": "4ceb860fae97193c7c7480110a13f1e8",
      "type": "deviceEvent",
      "source": "Diabeloop",
      "timezone": "Europe/Paris",
      "normalTime": "2023-10-22T19:59:49.000Z",
      "epoch": 1698004789000,
      "displayOffset": 120,
      "subType": "reservoirChange"
    },
    {
      "id": "1d77c55c4bd6e283cae2cd0e9e9043a3",
      "type": "deviceEvent",
      "source": "Diabeloop",
      "timezone": "Europe/Paris",
      "normalTime": "2023-10-19T06:02:04.000Z",
      "epoch": 1697695324000,
      "displayOffset": 120,
      "subType": "reservoirChange"
    }
  ],
  smbg: [],
  warmUps: [
    {
      "id": "ad840137a64d96dde2e69777fbbb1c0f",
      "type": "deviceEvent",
      "source": "Diabeloop",
      "timezone": "Europe/Paris",
      "normalTime": "2023-10-29T04:00:00.000Z",
      "epoch": 1698552000000,
      "displayOffset": 60,
      "duration": {
        "units": "hours",
        "value": 0
      },
      "normalEnd": "2023-10-29T04:00:00.000Z",
      "epochEnd": 1698552000000,
      "subType": "warmup",
      "guid": "warmup-16974144000002",
      "inputTime": "2021-01-15T03:58:54Z"
    },
    {
      "id": "f116429f89b2a00eadc8f552605ac2ae",
      "type": "deviceEvent",
      "source": "Diabeloop",
      "timezone": "Europe/Paris",
      "normalTime": "2023-10-20T05:00:00.000Z",
      "epoch": 1697778000000,
      "displayOffset": 120,
      "duration": {
        "units": "hours",
        "value": 0
      },
      "normalEnd": "2023-10-20T05:00:00.000Z",
      "epochEnd": 1697778000000,
      "subType": "warmup",
      "guid": "warmup-16974144000001",
      "inputTime": "2021-01-06T04:51:11Z"
    }
  ],
  wizards: [
    {
      epoch: 1579428000000,
      displayOffset: -60,
      normalTime: '2020-01-19T10:00:00.000Z',
      timezone: 'Europe/Paris',
      guessedTimezone: false,
      id: 'wizardId1',
      type: 'wizard',
      source: 'Diabeloop',
      uploadId: 'osef',
      bolusId: 'carbBolusId',
      carbInput: 385,
      units: 'mmol/L',
      bolus: null,
      inputTime: undefined
    }
  ],
  zenModes: [
    {
      "id": "b5a1e1007c733ee4648dd2b45372ee98",
      "type": "deviceEvent",
      "source": "Diabeloop",
      "timezone": "Europe/Paris",
      "normalTime": "2023-10-26T21:00:00.000Z",
      "epoch": 1698354000000,
      "displayOffset": 120,
      "duration": {
        "units": "hours",
        "value": 0
      },
      "normalEnd": "2023-10-26T21:00:00.000Z",
      "epochEnd": 1698354000000,
      "subType": "zen",
      "guid": "zen-16974144000000001",
      "inputTime": "2021-01-12T20:56:23Z"
    }
  ]
}

const datumNormalizeMock = jest.fn(
  (rawData: Record<string, unknown>, _opts: MedicalDataOptions) => {
    return createRandomDatum(rawData.type as DatumType, rawData.subType as DeviceEventSubtype | undefined)
  }
)

const basalDeduplicateMock = jest.fn(
  (data: Basal[], _opts: MedicalDataOptions) => {
    return data
  }
)

const bolusDeduplicateMock = jest.fn(
  (data: Bolus[], _opts: MedicalDataOptions) => {
    return data
  }
)

const wizardDeduplicateMock = jest.fn(
  (data: Wizard[], _opts: MedicalDataOptions) => {
    return data
  }
)

const testMedicalData = (medicalData: MedicalDataService, typeCounts: Record<keyof MedicalData, number>) => {
  Object.keys(typeCounts).forEach((dataType) => {
    const key = dataType as keyof MedicalData
    expect(medicalData.medicalData[key].length).toBe(typeCounts[key])
  })
}

const testEndPoints = (medicalData: MedicalDataService) => {
  expect(medicalData.endpoints.length).toBe(2)
  const rangeStart = new Date(medicalData.endpoints[0])
  const rangeEnd = new Date(medicalData.endpoints[1])
  expect(rangeEnd.valueOf()).toBeGreaterThan(rangeStart.valueOf())
  const allData = medicalData.data.filter(d => !['fill', 'pumpSettings', 'upload'].includes(d.type))
  const outOfRangeData = allData.filter(
    (dat) => {
      const epoch = 'epochEnd' in dat ? dat.epochEnd : dat.epoch
      return epoch < rangeStart.valueOf() || epoch > rangeEnd.valueOf()
    }
  )
  expect(outOfRangeData.length).toBe(0)
}

const testFillData = (medicalData: MedicalDataService) => {
  const rangeStart = new Date(medicalData.endpoints[0])
  const rangeEnd = new Date(medicalData.endpoints[1])
  // By default, we generate one fill object every 3 hours
  const hoursDiff = (rangeEnd.valueOf() - rangeStart.valueOf()) / 1000 / 60 / 60
  expect(medicalData.fills.length).toBeLessThanOrEqual(Math.ceil(hoursDiff / 3) + 2)
  expect(medicalData.fills.length).toBeGreaterThanOrEqual(Math.floor(hoursDiff / 3) - 2)
}

describe('MedicalDataService', () => {
  describe('Add data', () => {
    const medicalData = new MedicalDataService()
    medicalData.opts.dateRange = {
      start: new Date().valueOf(),
      end: new Date().valueOf()
    }
    medicalData.opts.isEatingShortlyEnabled = true

    beforeAll(() => {
      DatumService.normalize = datumNormalizeMock
      BasalService.deduplicate = basalDeduplicateMock
      BolusService.deduplicate = bolusDeduplicateMock
      WizardService.deduplicate = wizardDeduplicateMock
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should add data', () => {
      medicalData.add(testData)

      // basal + bolus + physicalActivity deduplication is called
      expect(basalDeduplicateMock).toHaveBeenCalledTimes(1)
      expect(bolusDeduplicateMock).toHaveBeenCalledTimes(1)
      expect(wizardDeduplicateMock).toHaveBeenCalledTimes(1)

      // Main medicalData Checks (we have on objects of each except timezones)
      const expectedCount: Partial<Record<keyof MedicalData, number>> = {}
      Object.keys(medicalData.medicalData).forEach(
        (type) => {
          if (type === 'timezoneChanges') {
            expectedCount.timezoneChanges = 3
          } else if (type === 'deviceParametersChanges') {
            // Parameters are grouped
            expectedCount.deviceParametersChanges = 1
          } else {
            expectedCount[type as keyof MedicalData] = testData[type].length
          }
        }
      )
      testMedicalData(medicalData, expectedCount as Record<keyof MedicalData, number>)
      expect(medicalData.timezoneList.length).toBe(8)
      expect(medicalData.timezoneList[0]).toStrictEqual({ time: 0, timezone: 'Europe/Paris' })
      // Endpoints checks
      testEndPoints(medicalData)
      // Fill Data checks
      testFillData(medicalData)
    })
  })

  describe('Timezone detection', () => {
    const testData = {
      alarmEvents: [],
      basal: [
        {
          "id": "basal_fc25685018a9c_2023-10-15_1",
          "type": "basal",
          "source": "Diabeloop",
          "timezone": "Europe/Paris",
          "normalTime": "2023-10-15T00:05:00.000Z",
          "epoch": 1697328300000,
          "displayOffset": 120,
          "subType": "automated",
          "deliveryType": "automated",
          "duration": 300000,
          "rate": 2.258466613234464,
          "normalEnd": "2023-10-15T00:10:00.000Z",
          "epochEnd": 1697328600000
        },
        {
          "id": "basal_fc25685018a9c_2023-10-15_2",
          "type": "basal",
          "source": "Diabeloop",
          "timezone": "Europe/Paris",
          "normalTime": "2023-10-15T00:10:00.000Z",
          "epoch": 1697328600000,
          "displayOffset": 60,
          "subType": "automated",
          "deliveryType": "automated",
          "duration": 300000,
          "rate": 2.411805655891653,
          "normalEnd": "2023-10-15T00:15:00.000Z",
          "epochEnd": 1697328900000
        }
      ],
      bolus: [
        {
          "id": "f47c5dd36b86ccf58c3deff1b04a4226",
          "type": "bolus",
          "source": "Diabeloop",
          "timezone": "Atlantic/Reykjavik",
          "normalTime": "2023-10-15T02:20:00.000Z",
          "epoch": 1697336400000,
          "displayOffset": 0,
          "subType": "normal",
          "normal": 0.007144142937471365,
          "prescriptor": "",
          "expectedNormal": 0.007144142937471365,
          "insulinOnBoard": 5.045560083213916
        },
        {
          "id": "8eafba8fa12aeaa1da6021cc772f05af",
          "type": "bolus",
          "source": "Diabeloop",
          "timezone": "Europe/Paris",
          "normalTime": "2023-10-15T02:15:00.000Z",
          "epoch": 1697336100000,
          "displayOffset": 60,
          "subType": "normal",
          "normal": 0.026917591197415592,
          "prescriptor": "",
          "expectedNormal": 0.026917591197415592,
          "insulinOnBoard": 5.183376845066703
        }
      ],
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
      zenModes: []
    }
    const medicalData = new MedicalDataService()
    medicalData.opts.dateRange = {
      start: new Date().valueOf(),
      end: new Date().valueOf()
    }

    beforeAll(() => {
      BasalService.deduplicate = basalDeduplicateMock
      BolusService.deduplicate = bolusDeduplicateMock
      WizardService.deduplicate = wizardDeduplicateMock
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should detect Timezone and DST changes events', () => {
      medicalData.add(testData)
      expect(basalDeduplicateMock).toHaveBeenCalledTimes(1)
      expect(bolusDeduplicateMock).toHaveBeenCalledTimes(1)
      expect(wizardDeduplicateMock).toHaveBeenCalledTimes(1)

      // Main medicalData Checks (we have 2 objects for cbg & timezones, 1 for bolus & basal)
      const expectedCount: Partial<Record<keyof MedicalData, number>> = {}
      Object.keys(medicalData.medicalData).forEach(
        (type) => {
          if (['bolus', 'basal'].includes(type)) {
            expectedCount[type as keyof MedicalData] = 2
          } else if (['timezoneChanges'].includes(type)) {
            expectedCount[type as keyof MedicalData] = 1
          } else {
            expectedCount[type as keyof MedicalData] = 0
          }
        }
      )
      testMedicalData(medicalData, expectedCount as Record<keyof MedicalData, number>)
      // One DST timezonechange + one Europe/Paris -> Atlantic/Reykjavik
      expect(medicalData.timezoneList.length).toBe(3)
      expect(medicalData.timezoneList[0]).toStrictEqual({ time: 0, timezone: 'Europe/Paris' })
      const dstChange = medicalData.timezoneList[1]
      expect(dstChange.time).toStrictEqual(medicalData.medicalData.basal[1].epoch)
      expect(dstChange.timezone).toStrictEqual('Europe/Paris')
      const tzChange = medicalData.timezoneList[2]
      expect(tzChange.timezone).toStrictEqual('Atlantic/Reykjavik')
      expect(tzChange.time).toStrictEqual(medicalData.medicalData.bolus[0].epoch)
      // Endpoints checks
      testEndPoints(medicalData)
      // Fill Data checks
      testFillData(medicalData)
    })
  })

  describe('Basics Data', () => {
    const medicalDataService = new MedicalDataService()
    const medicalDataOpts = {
      dateRange: {
        start: new Date().valueOf(),
        end: new Date().valueOf() + 1
      },
      timePrefs: {
        timezoneAware: true,
        timezoneName: 'Europe/Paris',
      }
    }

    medicalDataService.opts = medicalDataOpts
    const mockedData = (endTimezone: string): BasicData => ({
      timezone: endTimezone,
      dateRange: [],
      days: [],
      nData: 0,
      data: {
        reservoirChange: {
          data: []
        },
        deviceParameter: {
          data: []
        },
        cbg: {
          data: []
        },
        smbg: {
          data: []
        },
        basal: {
          data: []
        },
        bolus: {
          data: []
        },
        wizard: {
          data: []
        }
      }
    })

    const generateBasicDataMock = jest.fn(
      (_medicalData: MedicalData, _startEpoch: number, _startTimezone: string, _endEpoch: number, endTimezone: string): BasicData | null => {
        return mockedData(endTimezone)
      })

    beforeAll(() => {
      BasalService.deduplicate = basalDeduplicateMock
      BolusService.deduplicate = bolusDeduplicateMock
      WizardService.deduplicate = wizardDeduplicateMock
      // eslint-disable-next-line no-import-assign
      BasiscsDataService.generateBasicData = generateBasicDataMock
      medicalDataService.add({})
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should not generate basicsData when startDate is after endDate', () => {
      const basicsData = medicalDataService.generateBasicsData(
        '2022-12-01T08:00:00Z', '2022-12-01T07:00:00Z'
      )
      expect(basicsData).toBe(null)
      expect(medicalDataService.basicsData).toBe(null)
      expect(generateBasicDataMock).toHaveBeenCalledTimes(0)
    })

    it('should generate basicsData when startDate is before endDate', () => {
      const start = '2022-12-01T07:00:00Z'
      const end = '2022-12-01T08:00:00Z'
      const tz = medicalDataOpts.timePrefs.timezoneName
      const basicsData = medicalDataService.generateBasicsData(start, end)

      expect(basicsData).toStrictEqual(mockedData(tz))
      expect(medicalDataService.basicsData).toStrictEqual(mockedData(tz))
      expect(generateBasicDataMock).toHaveBeenCalledWith(
        medicalDataService.medicalData, new Date(start).valueOf() + 1, tz,
        new Date(end).valueOf() - 1, tz
      )
    })

    it('should generate basicsData with medicalData endpoints when startDate and endDate are undefined', () => {
      const tz = medicalDataOpts.timePrefs.timezoneName
      const mockedStartEpoch = 150
      const twoWeeksAgoMock = jest.fn(
        (_time: string | number, _timezone: string): number => mockedStartEpoch
      )
      // eslint-disable-next-line no-import-assign
      TimeService.twoWeeksAgo = twoWeeksAgoMock
      const basicsData = medicalDataService.generateBasicsData()
      expect(basicsData).toStrictEqual(mockedData(tz))
      expect(medicalDataService.basicsData).toStrictEqual(mockedData(tz))
      expect(generateBasicDataMock).toHaveBeenCalledTimes(1)

      const end = new Date(medicalDataService.endpoints[1]).valueOf()
      expect(generateBasicDataMock).toHaveBeenCalledWith(
        medicalDataService.medicalData, mockedStartEpoch + 1, tz,
        end - 2, tz
      )
      expect(twoWeeksAgoMock).toHaveBeenCalledWith(end - 1, tz)
    })
  })
})
