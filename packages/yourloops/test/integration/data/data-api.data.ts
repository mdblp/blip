/*
 * Copyright (c) 2023-2026, Diabeloop
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
import { ChangeType, DblParameter, DeviceChangeName, DeviceHistory, ParametersChange, Unit } from 'medical-domain'

export const history: ParametersChange[] = [
  {
    changeDate: '2022-11-01T00:00:00Z',
    parameters: [
      {
        name: DblParameter.AggressivenessHyperglycemia,
        value: '143',
        unit: Unit.Percent,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added
      },
      {
        name: DblParameter.LargeBreakfast,
        value: '150',
        unit: Unit.Gram,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added
      },
      {
        name: DblParameter.LargeDinner,
        value: '150',
        unit: Unit.Gram,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added
      },
      {
        name: DblParameter.LargeLunch,
        value: '70',
        unit: Unit.Gram,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added
      },
      {
        name: DblParameter.AggressivenessBreakfast,
        value: '100',
        unit: Unit.Percent,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added
      },
      {
        name: DblParameter.AggressivenessBreakfast,
        value: '110',
        unit: Unit.Percent,
        level: 1,
        effectiveDate: '2022-11-02T17:00:40Z',
        changeType: ChangeType.Updated,
        previousValue: '100',
        previousUnit: Unit.Percent
      },
      {
        name: DblParameter.AggressivenessBreakfast,
        value: '100',
        unit: Unit.Percent,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Updated,
        previousValue: '110',
        previousUnit: Unit.Percent
      },
      {
        name: DblParameter.AggressivenessDinner,
        value: '100',
        unit: Unit.Percent,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added
      },
      {
        name: DblParameter.AggressivenessDinner,
        value: '90',
        unit: Unit.Percent,
        level: 1,
        effectiveDate: '2022-11-02T17:00:40Z',
        changeType: ChangeType.Updated,
        previousValue: '100',
        previousUnit: Unit.Percent
      },
      {
        name: DblParameter.AggressivenessDinner,
        value: '100',
        unit: Unit.Percent,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Updated,
        previousValue: '90',
        previousUnit: Unit.Percent
      },
      {
        name: DblParameter.AggressivenessLunch,
        value: '130',
        unit: Unit.Percent,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added
      },
      {
        name: DblParameter.AggressivenessLunch,
        value: '90',
        unit: Unit.Percent,
        level: 1,
        effectiveDate: '2022-11-07T14:01:14Z',
        changeType: ChangeType.Updated,
        previousValue: '130',
        previousUnit: Unit.Percent
      },
      {
        name: DblParameter.AverageBreakfast,
        value: '70',
        unit: Unit.Gram,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added
      },
      {
        name: DblParameter.AverageDinner,
        value: '60',
        unit: Unit.Gram,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added
      },
      {
        name: DblParameter.AverageLunch,
        value: '50',
        unit: Unit.Gram,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added
      },
      {
        name: DblParameter.AggressivenessNormoglycemia,
        value: '100',
        unit: Unit.Percent,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added
      },
      {
        name: DblParameter.TargetGlucoseLevel,
        value: '100.0',
        unit: Unit.MilligramPerDeciliter,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added
      },
      {
        name: DblParameter.HyperglycemiaThreshold,
        value: '180.1',
        unit: Unit.MilligramPerDeciliter,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added
      },
      {
        name: DblParameter.HyperglycemiaThreshold,
        value: '140',
        unit: Unit.MilligramPerDeciliter,
        level: 1,
        effectiveDate: '2022-11-02T07:00:00Z',
        changeType: ChangeType.Updated,
        previousValue: '180.1',
        previousUnit: Unit.MilligramPerDeciliter
      },
      {
        name: DblParameter.HyperglycemiaThreshold,
        value: '180.1',
        unit: Unit.MilligramPerDeciliter,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Updated,
        previousValue: '140',
        previousUnit: Unit.MilligramPerDeciliter
      },
      {
        name: DblParameter.HypoglycemiaThreshold,
        value: '70',
        unit: Unit.MilligramPerDeciliter,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added
      },
      {
        name: DblParameter.HypoglycemiaThreshold,
        value: '60',
        unit: Unit.MilligramPerDeciliter,
        level: 1,
        effectiveDate: '2022-11-02T07:00:00Z',
        changeType: ChangeType.Updated,
        previousValue: '70',
        previousUnit: Unit.MilligramPerDeciliter
      },
      {
        name: DblParameter.HypoglycemiaThreshold,
        value: '70',
        unit: Unit.MilligramPerDeciliter,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Updated,
        previousValue: '60',
        previousUnit: Unit.MilligramPerDeciliter
      },
      {
        name: DblParameter.SmallBreakfast,
        value: '15',
        unit: Unit.Gram,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added
      },
      {
        name: DblParameter.SmallDinner,
        value: '20',
        unit: Unit.Gram,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added
      },
      {
        name: DblParameter.SmallLunch,
        value: '30',
        unit: Unit.Gram,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added
      },
      {
        name: DblParameter.TotalDailyInsulin,
        value: '53',
        unit: Unit.InsulinUnit,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added
      },
      {
        name: DblParameter.Weight,
        value: '69.0',
        unit: Unit.Kilogram,
        level: 1,
        effectiveDate: '2022-11-01T00:00:00Z',
        changeType: ChangeType.Added
      }
    ]
  }
]

export const devicesHistory: DeviceHistory[] = [
  {
    changeDate: "2019-04-12T00:02Z",
    devices:
      [
        {
          changeType: ChangeType.Added,
          effectiveDate: "2019-04-12T00:02:00.000Z",
          name: DeviceChangeName.CgmManufacturer,
          value: "Dexcom"
        },
        {
          changeType: ChangeType.Added,
          effectiveDate: "2019-04-12T00:02:00.000Z",
          name: DeviceChangeName.CgmName,
          value: "G5"
        },
        {
          changeType: ChangeType.Added,
          effectiveDate: "2019-04-12T00:02:00.000Z",
          name: DeviceChangeName.HandsetDeviceId,
          value: "MobiGo+"
        },
        {
          changeType: ChangeType.Added,
          effectiveDate: "2019-04-12T00:02:00.000Z",
          name: DeviceChangeName.HandsetImei,
          value: "0123456789"
        },
        {
          changeType: ChangeType.Added,
          effectiveDate: "2019-04-12T00:02:00.000Z",
          name: DeviceChangeName.HandsetSoftwareVersion,
          value: "1.12.12-DBLG1-INS-DEXG6-COMMERCIAL"
        },
        {
          changeType: ChangeType.Added,
          effectiveDate: "2019-04-12T00:02:00.000Z",
          name: DeviceChangeName.MobileAppActivationCode,
          value: "123-456-789"
        },
        {
          changeType: ChangeType.Added,
          effectiveDate: "2019-04-12T00:02:00.000Z",
          name: DeviceChangeName.MobileAppVersion,
          value: "1.0.0"
        },
        {
          changeType: ChangeType.Added,
          effectiveDate: "2019-04-12T00:02:00.000Z",
          name: DeviceChangeName.PumpManufacturer,
          value: "ROCHE"
        },
        {
          changeType: ChangeType.Added,
          effectiveDate: "2019-04-12T00:02:00.000Z",
          name: DeviceChangeName.PumpName,
          value: "Insight"
        },
        {
          changeType: ChangeType.Added,
          effectiveDate: "2019-04-12T00:02:00.000Z",
          name: DeviceChangeName.SmartphoneModel,
          value: "A212F"
        }
      ]
  },
  {
    changeDate: "2019-04-26T00:02Z",
    devices:
      [
        {
          changeType: ChangeType.Added,
          effectiveDate: "2019-04-12T00:02:00.000Z",
          name: DeviceChangeName.CgmManufacturer,
          value: "Abbott",
          previousValue: "Dexcom"
        },
        {
          changeType: ChangeType.Updated,
          effectiveDate: "2019-04-26T00:02:00.000Z",
          name: DeviceChangeName.CgmName,
          value: "G6",
          previousValue: "G5"
        },
        {
          changeType: ChangeType.Added,
          effectiveDate: "2019-04-12T00:02:00.000Z",
          name: DeviceChangeName.HandsetDeviceId,
          value: "DH22",
          previousValue: "MobiGo+"
        },
        {
          changeType: ChangeType.Added,
          effectiveDate: "2019-04-12T00:02:00.000Z",
          name: DeviceChangeName.HandsetImei,
          value: "111111111",
          previousValue: "0123456789"
        },
        {
          changeType: ChangeType.Added,
          effectiveDate: "2019-04-12T00:02:00.000Z",
          name: DeviceChangeName.HandsetSoftwareVersion,
          value: "1.18.0.1300-DBLG1-KAL-G6-COMMERCIAL",
          previousValue: "1.12.12-DBLG1-INS-DEXG6-COMMERCIAL"
        },
        {
          changeType: ChangeType.Added,
          effectiveDate: "2019-04-12T00:02:00.000Z",
          name: DeviceChangeName.MobileAppActivationCode,
          value: "111-111-111",
          previousValue: "123-456-789"
        },
        {
          changeType: ChangeType.Updated,
          effectiveDate: "2019-04-26T00:02:00.000Z",
          name: DeviceChangeName.MobileAppVersion,
          value: "1.1.0",
          previousValue: "1.0.0"
        },
        {
          changeType: ChangeType.Updated,
          effectiveDate: "2019-04-26T00:02:00.000Z",
          name: DeviceChangeName.PumpManufacturer,
          value: "VICENTRA",
          previousValue: "ROCHE"
        },
        {
          changeType: ChangeType.Updated,
          effectiveDate: "2019-04-26T00:02:00.000Z",
          name: DeviceChangeName.PumpName,
          value: "Kaleido",
          previousValue: "Insight"
        },
        {
          changeType: ChangeType.Updated,
          effectiveDate: "2019-04-26T00:02:00.000Z",
          name: DeviceChangeName.SmartphoneModel,
          value: "A26",
          previousValue: "A212F"
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
