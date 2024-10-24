/*
 * Copyright (c) 2024, Diabeloop
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
  BolusSubtype,
  DatumType,
  Prescriptor,
  Source,
  Unit,
  WizardInputMealFat,
  WizardInputMealSource
} from 'medical-domain'
import WeekDays from 'medical-domain/dist/src/domains/models/time/enum/weekdays.enum'
import { Data } from './data.api.mock'

export const getMinimalTrendViewData =() : Data => {
  return {
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
          "type": DatumType.Basal,
          "source": Source.Diabeloop,
          "subType": "automated",
          "deliveryType": "automated",
          "rate": 0.8,
          "duration": 400000000,
          "normalEnd": "2020-01-13T07:36:40.000Z",
          "epochEnd": 1578901000000,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1578504600000,
          "displayOffset": -60,
          "normalTime": "2020-01-08T17:30:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "basal_2020-01-08_2",
          "type": DatumType.Basal,
          "source": Source.Diabeloop,
          "subType": "scheduled",
          "deliveryType": "scheduled",
          "rate": 0.8,
          "duration": 500000000,
          "normalEnd": "2020-01-14T12:23:20.000Z",
          "epochEnd": 1579004600000,
          "isoWeekday": WeekDays.Sunday
        }
      ],
      "bolus": [
        {
          "epoch": 1579314300000,
          "displayOffset": -60,
          "normalTime": "2020-01-18T02:25:00.000Z",
          "timezone": "Europe/Paris",
          "isoWeekday": WeekDays.Saturday,
          "guessedTimezone": false,
          "id": "carbBolusId",
          "type": DatumType.Bolus,
          "source": Source.Diabeloop,
          "subType": BolusSubtype.Normal,
          "normal": 22.3,
          "prescriptor": Prescriptor.Manual,
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
          "type": DatumType.Bolus,
          "source": Source.Diabeloop,
          "subType": BolusSubtype.Normal,
          "normal": 1.3,
          "prescriptor": Prescriptor.Manual,
          "wizard": null,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1579315800000,
          "displayOffset": -60,
          "normalTime": "2020-01-18T02:50:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "carbBolusId2",
          "type": DatumType.Bolus,
          "source": Source.Diabeloop,
          "subType": BolusSubtype.Normal,
          "normal": 1.3,
          "prescriptor": Prescriptor.Manual,
          "wizard": null,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1579229400000,
          "displayOffset": -60,
          "normalTime": "2020-01-17T02:50:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "carbBolusId2",
          "type": DatumType.Bolus,
          "source": Source.Diabeloop,
          "subType": BolusSubtype.Normal,
          "normal": 1.3,
          "prescriptor": Prescriptor.Manual,
          "wizard": null,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1579310400000,
          "displayOffset": -60,
          "normalTime": "2020-01-18T01:20:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "carbBolusId2",
          "type": DatumType.Bolus,
          "source": Source.Diabeloop,
          "subType": BolusSubtype.Normal,
          "normal": 1.3,
          "prescriptor": Prescriptor.Manual,
          "wizard": null,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1579396800000,
          "displayOffset": -60,
          "normalTime": "2020-01-19T01:20:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "carbBolusId2",
          "type": DatumType.Bolus,
          "source": Source.Diabeloop,
          "subType": BolusSubtype.Normal,
          "normal": 1.3,
          "prescriptor": Prescriptor.Manual,
          "wizard": null,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1579449300000,
          "displayOffset": -60,
          "normalTime": "2020-01-19T15:55:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "carbBolusId4",
          "type": DatumType.Bolus,
          "source": Source.Diabeloop,
          "subType": BolusSubtype.Normal,
          "normal": 9.05,
          "prescriptor": Prescriptor.Manual,
          "wizard": null,
          "expectedNormal": 9.05,
          "insulinOnBoard": 3.0588088,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1579535100000,
          "displayOffset": -60,
          "normalTime": "2020-01-20T15:45:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "carbBolusId3",
          "type": DatumType.Bolus,
          "source": Source.Diabeloop,
          "subType": BolusSubtype.Normal,
          "normal": 19.35,
          "prescriptor": Prescriptor.Manual,
          "wizard": null,
          "expectedNormal": 19.35,
          "insulinOnBoard": 3.1218212,
          "isoWeekday": WeekDays.Sunday
        },
        {
          "epoch": 1579535100000,
          "displayOffset": -60,
          "normalTime": "2020-01-20T16:50:00.000Z",
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "penBolusId",
          "type": DatumType.Bolus,
          "source": Source.Diabeloop,
          "subType": BolusSubtype.Pen,
          "normal": 5,
          "prescriptor": Prescriptor.Manual,
          "wizard": null,
          "expectedNormal": 6,
          "isoWeekday": WeekDays.Sunday
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
          "type": DatumType.Cbg,
          "source": Source.Diabeloop,
          "units": Unit.MilligramPerDeciliter,
          "value": 182,
          "localDate": "2020-01-20",
          "isoWeekday": WeekDays.Monday,
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
          "type": DatumType.Cbg,
          "source": Source.Diabeloop,
          "units": Unit.MilligramPerDeciliter,
          "value": 164,
          "localDate": "2020-01-19",
          "isoWeekday": WeekDays.Sunday,
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
          "type": DatumType.Cbg,
          "source": Source.Diabeloop,
          "units": Unit.MilligramPerDeciliter,
          "value": 196,
          "localDate": "2020-01-19",
          "isoWeekday": WeekDays.Sunday,
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
          "type": DatumType.Cbg,
          "source": Source.Diabeloop,
          "units": Unit.MilligramPerDeciliter,
          "value": 196,
          "localDate": "2020-01-19",
          "isoWeekday": WeekDays.Sunday,
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
          "type": DatumType.Cbg,
          "source": Source.Diabeloop,
          "units": Unit.MilligramPerDeciliter,
          "value": 177,
          "localDate": "2020-01-18",
          "isoWeekday": WeekDays.Saturday,
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
          "isoWeekday": WeekDays.Sunday,
          "guessedTimezone": false,
          "id": "food_19-35-00",
          "type": DatumType.Food,
          "source": Source.Diabeloop,
          "meal": "rescuecarbs",
          "nutrition": {
            "carbohydrate": {
              "net": 385,
              "units": Unit.Grams
            }
          },
          "prescribedNutrition": {
            "carbohydrate": {
              "net": 128,
              "units": Unit.Grams
            }
          },
          "prescriptor": Prescriptor.Hybrid
        },
        {
          "epoch": 1579428000000,
          "displayOffset": -60,
          "normalTime": "2020-01-19T12:00:00.000Z",
          "isoWeekday": WeekDays.Sunday,
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "food_19-35-00",
          "type": DatumType.Food,
          "source": Source.Diabeloop,
          "meal": "rescuecarbs",
          "nutrition": {
            "carbohydrate": {
              "net": 385,
              "units": Unit.Grams
            }
          },
          "prescribedNutrition": {
            "carbohydrate": {
              "net": 128,
              "units": Unit.Grams
            }
          },
          "prescriptor": Prescriptor.Hybrid
        },
        {
          "epoch": 1579510800000,
          "displayOffset": -60,
          "normalTime": "2020-01-20T18:00:00.000Z",
          "isoWeekday": WeekDays.Monday,
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "food_19-35-00",
          "type": DatumType.Food,
          "source": Source.Diabeloop,
          "meal": "rescuecarbs",
          "nutrition": {
            "carbohydrate": {
              "net": 128,
              "units": Unit.Grams
            }
          },
          "prescriptor": Prescriptor.Auto
        },
        {
          "epoch": 1579460400000,
          "displayOffset": -60,
          "normalTime": "2020-01-19T19:00:00.000Z",
          "isoWeekday": WeekDays.Sunday,
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "food_19-35-00",
          "type": DatumType.Food,
          "source": Source.Diabeloop,
          "meal": "rescuecarbs",
          "nutrition": {
            "carbohydrate": {
              "net": 150,
              "units": Unit.Grams
            }
          },
          "prescribedNutrition": {
            "carbohydrate": {
              "net": 2,
              "units": Unit.Grams
            }
          },
          "prescriptor": Prescriptor.Manual
        },
        {
          "epoch": 1579559400000,
          "displayOffset": -60,
          "normalTime": "2020-01-20T22:30:00.000Z",
          "isoWeekday": WeekDays.Monday,
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "food_19-35-00",
          "type": DatumType.Food,
          "source": Source.Diabeloop,
          "meal": "rescuecarbs",
          "nutrition": {
            "carbohydrate": {
              "net": 450,
              "units": Unit.Grams
            }
          },
          "prescribedNutrition": {
            "carbohydrate": {
              "net": 400,
              "units": Unit.Grams
            }
          },
          "prescriptor": Prescriptor.Hybrid
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
          "inputTime": "2020-01-19T10:00:00.000Z",
          "isoWeekday": WeekDays.Sunday,
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "wizardId1",
          "type": DatumType.Wizard,
          "source": Source.Diabeloop,
          "bolusId": "carbBolusId",
          "bolusIds": new Set(),
          "carbInput": 385,
          "units": "mmol/L",
          "bolus": null
        },
        {
          "epoch": 1579341600000,
          "displayOffset": -60,
          "normalTime": "2020-01-18T10:00:00.000Z",
          "inputTime": "2020-01-18T10:00:00.000Z",
          "isoWeekday": WeekDays.Saturday,
          "timezone": "Europe/Paris",
          "guessedTimezone": false,
          "id": "wizardId2",
          "type": DatumType.Wizard,
          "source": Source.Diabeloop,
          "bolusId": "carbBolusId",
          "bolusIds": new Set(),
          "carbInput": 285,
          "units": "mmol/L",
          "bolus": null,
          "inputMeal": {
            "source": WizardInputMealSource.Umm,
            "fat": WizardInputMealFat.No
          }
        }
      ],
      "zenModes": [],
      "timezoneChanges": []
    }
  }
}
