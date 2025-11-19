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

import WeekDays from 'medical-domain/dist/src/domains/models/time/enum/weekdays.enum'
import { DatumType, Source } from 'medical-domain'

export const mockdataFromApi = {
  alarmEvents: [],
  basal: [],
  bolus: [],
  cbg: [
    {
      epoch: 1579514400000,
      displayOffset: -60,
      normalTime: '2020-01-20T10:00:00.000Z',
      timezone: 'Europe/Paris',
      guessedTimezone: false,
      id: '2020-01-20_0',
      type: DatumType.Cbg,
      source: Source.Diabeloop,
      units: 'mg/dL',
      value: 182,
      localDate: '2020-01-20',
      isoWeekday: WeekDays.Monday,
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
      type: DatumType.Cbg,
      source: Source.Diabeloop,
      units: 'mg/dL',
      value: 164,
      localDate: '2020-01-19',
      isoWeekday: WeekDays.Sunday,
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
      type: DatumType.Cbg,
      source: Source.Diabeloop,
      units: 'mg/dL',
      value: 196,
      localDate: '2020-01-19',
      isoWeekday: WeekDays.Sunday,
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
      type: DatumType.Cbg,
      source: Source.Diabeloop,
      units: 'mg/dL',
      value: 196,
      localDate: '2020-01-19',
      isoWeekday: WeekDays.Sunday,
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
      type: DatumType.Cbg,
      source: Source.Diabeloop,
      units: 'mg/dL',
      value: 177,
      localDate: '2020-01-18',
      isoWeekday: WeekDays.Saturday,
      msPer24: 39600000,
      deviceName: 'Unknown'
    }
  ],
  confidentialModes: [],
  deviceParametersChanges: [],
  eatingShortlyEvents: [],
  iob: [],
  messages: [],
  meals: [
    {
      epoch: 1579428000000,
      displayOffset: -60,
      normalTime: '2020-01-19T10:00:00.000Z',
      timezone: 'Europe/Paris',
      guessedTimezone: false,
      id: 'food_19-35-00',
      type: DatumType.Food,
      source: Source.Diabeloop,
      meal: 'rescuecarbs',
      uploadId: 'osef',
      nutrition: [],
      prescribedNutrition: [],
      prescriptor: ''
    }
  ],
  nightModes: [],
  physicalActivities: [],
  pumpSettings: [],
  reservoirChanges: [],
  smbg: [],
  timezoneChanges: [],
  warmUps: [],
  wizards: [
    {
      id: "1ad669607b31b2d87d92cdfda35845f8",
      type: DatumType.Wizard,
      source: Source.Diabeloop,
      timezone: "Europe/Paris",
      normalTime: "2023-10-30T20:35:00.000Z",
      epoch: 1698698100000,
      displayOffset: -60,
      bolusId: "cebc8ae1f92b4a85fde0d5fb7809e7f2",
      bolusIds: [
        "cebc8ae1f92b4a85fde0d5fb7809e7f2"
      ],
      carbInput: 50,
      units: "mmol/L",
      bolus: null,
      inputTime: "2023-10-30T20:35:00.000Z"
    }
  ],
  zenModes: [],
}

export const medicalServiceResult = {
  alarmEvents: [],
  basal: [],
  bolus: [],
  cbg: [
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
  confidentialModes: [],
  deviceParametersChanges: [],
  eatingShortlyEvents: [],
  iob: [],
  messages: [],
  meals: [
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
      "uploadId": "osef",
      "nutrition": [],
      "prescribedNutrition": [],
      "prescriptor": ""
    }
  ],
  nightModes: [],
  physicalActivities: [],
  pumpSettings: [],
  reservoirChanges: [],
  smbg: [],
  warmUps: [],
  wizards: [
    {
      id: "1ad669607b31b2d87d92cdfda35845f8",
      type: "wizard",
      source: "Diabeloop",
      timezone: "Europe/Paris",
      normalTime: "2023-10-30T20:35:00.000Z",
      epoch: 1698698100000,
      displayOffset: -60,
      bolusId: "cebc8ae1f92b4a85fde0d5fb7809e7f2",
      bolusIds: new Set([
        "cebc8ae1f92b4a85fde0d5fb7809e7f2"
      ]),
      carbInput: 50,
      units: "mmol/L",
      bolus: null,
      inputTime: "2023-10-30T20:35:00.000Z"
    }
  ],
  "zenModes": [],
  "timezoneChanges": []
}
