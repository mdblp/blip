/*
 * Copyright (c) 2023-2024, Diabeloop
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

import moment from 'moment-timezone'
import { ChangeType, ParametersChange, Unit } from 'medical-domain'

export const history: ParametersChange[] = [
  {
    changeDate: '2022-11-01T00:00:00Z',
    parameters: [
      {
        name: 'BOLUS_AGGRESSIVENESS_FACTOR',
        value: '143',
        unit: Unit.Percent,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added,
      },
      {
        name: 'LARGE_MEAL_BREAKFAST',
        value: '150',
        unit: Unit.Gram,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added,
      },
      {
        name: 'LARGE_MEAL_DINNER',
        value: '150',
        unit: Unit.Gram,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added,
      },
      {
        name: 'LARGE_MEAL_LUNCH',
        value: '70',
        unit: Unit.Gram,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added,
      },
      {
        name: 'MEAL_RATIO_BREAKFAST_FACTOR',
        value: '100',
        unit: Unit.Percent,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added,
      },
      {
        name: 'MEAL_RATIO_BREAKFAST_FACTOR',
        value: '110',
        unit: Unit.Percent,
        level: 1,
        effectiveDate: '2022-11-02T17:00:40Z',
        changeType: ChangeType.Updated,
        previousValue: '100',
        previousUnit: Unit.Percent,
      },
      {
        name: 'MEAL_RATIO_BREAKFAST_FACTOR',
        value: '100',
        unit: Unit.Percent,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Updated,
        previousValue: '110',
        previousUnit: Unit.Percent,
      },
      {
        name: 'MEAL_RATIO_DINNER_FACTOR',
        value: '100',
        unit: Unit.Percent,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added,
      },
      {
        name: 'MEAL_RATIO_DINNER_FACTOR',
        value: '90',
        unit: Unit.Percent,
        level: 1,
        effectiveDate: '2022-11-02T17:00:40Z',
        changeType: ChangeType.Updated,
        previousValue: '100',
        previousUnit: Unit.Percent,
      },
      {
        name: 'MEAL_RATIO_DINNER_FACTOR',
        value: '100',
        unit: Unit.Percent,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Updated,
        previousValue: '90',
        previousUnit: Unit.Percent,
      },
      {
        name: 'MEAL_RATIO_LUNCH_FACTOR',
        value: '130',
        unit: Unit.Percent,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added,
      },
      {
        name: 'MEAL_RATIO_LUNCH_FACTOR',
        value: '90',
        unit: Unit.Percent,
        level: 1,
        effectiveDate: '2022-11-07T14:01:14Z',
        changeType: ChangeType.Updated,
        previousValue: '130',
        previousUnit: Unit.Percent,
      },
      {
        name: 'MEDIUM_MEAL_BREAKFAST',
        value: '70',
        unit: Unit.Gram,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added,
      },
      {
        name: 'MEDIUM_MEAL_DINNER',
        value: '60',
        unit: Unit.Gram,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added,
      },
      {
        name: 'MEDIUM_MEAL_LUNCH',
        value: '50',
        unit: Unit.Gram,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added,
      },
      {
        name: 'PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA',
        value: '100',
        unit: Unit.Percent,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added,
      },
      {
        name: 'PATIENT_GLYCEMIA_TARGET',
        value: '100.0',
        unit: Unit.MilligramPerDeciliter,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added,
      },
      {
        name: 'PATIENT_GLY_HYPER_LIMIT',
        value: '180.1',
        unit: Unit.MilligramPerDeciliter,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added,
      },
      {
        name: 'PATIENT_GLY_HYPER_LIMIT',
        value: '140',
        unit: Unit.MilligramPerDeciliter,
        level: 1,
        effectiveDate: '2022-11-02T07:00:00Z',
        changeType: ChangeType.Updated,
        previousValue: '180.1',
        previousUnit: Unit.MilligramPerDeciliter,
      },
      {
        name: 'PATIENT_GLY_HYPER_LIMIT',
        value: '180.1',
        unit: Unit.MilligramPerDeciliter,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Updated,
        previousValue: '140',
        previousUnit: Unit.MilligramPerDeciliter,
      },
      {
        name: 'PATIENT_GLY_HYPO_LIMIT',
        value: '70',
        unit: Unit.MilligramPerDeciliter,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added,
      },
      {
        name: 'PATIENT_GLY_HYPO_LIMIT',
        value: '60',
        unit: Unit.MilligramPerDeciliter,
        level: 1,
        effectiveDate: '2022-11-02T07:00:00Z',
        changeType: ChangeType.Updated,
        previousValue: '70',
        previousUnit: Unit.MilligramPerDeciliter,
      },
      {
        name: 'PATIENT_GLY_HYPO_LIMIT',
        value: '70',
        unit: Unit.MilligramPerDeciliter,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Updated,
        previousValue: '60',
        previousUnit: Unit.MilligramPerDeciliter,
      },
      {
        name: 'SMALL_MEAL_BREAKFAST',
        value: '15',
        unit: Unit.Gram,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added,
      },
      {
        name: 'SMALL_MEAL_DINNER',
        value: '20',
        unit: Unit.Gram,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added,
      },
      {
        name: 'SMALL_MEAL_LUNCH',
        value: '30',
        unit: Unit.Gram,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added,
      },
      {
        name: 'TOTAL_INSULIN_FOR_24H',
        value: '53',
        unit: Unit.InsulinUnit,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added,
      },
      {
        name: 'WEIGHT',
        value: '69.0',
        unit: Unit.Kilogram,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added,
      }
    ]
  }
]

export const reservoirChanges = [
  {
    epoch: 1668335091000,
    displayOffset: -60,
    normalTime: '2022-11-13T10:24:51.000Z',
    timezone: 'Europe/Paris',
    guessedTimezone: false,
    id: '293992cd9c76c903ecce35bcb8a69850',
    type: 'deviceEvent',
    source: 'Diabeloop',
    subType: 'reservoirChange',
    uploadId: 'e00d2c6c2bf7eaf141bae9926a635dd0',
    pump: {
      manufacturer: 'ROCHE',
      name: 'Pump0001',
      serialNumber: '123456789',
      swVersion: '0.1.0'
    }
  }
]

export const buildHba1cData = () => {
  const dataGMI = {
    dataRange: ['2020-01-01T00:00:00Z', '2020-01-20T23:00:00Z'],
    data: {
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
  }
  let index = 0
  for (let day = 1; day < 15; day++) {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        index += 1
        const time = `2020-01-${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00.000Z`
        dataGMI.data.cbg.push({
          normalTime: time,
          epoch: moment(time).unix() * 1000,
          type: 'cbg',
          id: `CBG-${index}`,
          source: "Diabeloop",
          timezone: 'Europe/Paris',
          displayOffset: 120,
          units: 'mg/dL',
          value: 182,
          deviceName: "unknown"
        })
      }
    }
  }
  return dataGMI
}
