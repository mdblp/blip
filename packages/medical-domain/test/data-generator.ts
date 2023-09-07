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

import { faker } from '@faker-js/faker'
import type Bolus from '../src/domains/models/medical/datum/bolus.model'
import { BolusSubtype } from '../src/domains/models/medical/datum/enums/bolus-subtype.enum'
import type Basal from '../src/domains/models/medical/datum/basal.model'
import type Cbg from '../src/domains/models/medical/datum/cbg.model'
import { bgUnits } from '../src/domains/models/medical/datum/bg.model'
import type BaseDatum from '../src/domains/models/medical/datum/basics/base-datum.model'
import type ConfidentialMode from '../src/domains/models/medical/datum/confidential-mode.model'
import type Duration from '../src/domains/models/medical/datum/basics/duration.model'
import type DeviceParameterChange from '../src/domains/models/medical/datum/device-parameter-change.model'
import type Meal from '../src/domains/models/medical/datum/meal.model'
import type Message from '../src/domains/models/medical/datum/message.model'
import type PhysicalActivity from '../src/domains/models/medical/datum/physical-activity.model'
import type PumpSettings from '../src/domains/models/medical/datum/pump-settings.model'
import type ReservoirChange from '../src/domains/models/medical/datum/reservoir-change.model'
import type Smbg from '../src/domains/models/medical/datum/smbg.model'
import type Upload from '../src/domains/models/medical/datum/upload.model'
import type WarmUp from '../src/domains/models/medical/datum/warm-up.model'
import type Wizard from '../src/domains/models/medical/datum/wizard.model'
import type ZenMode from '../src/domains/models/medical/datum/zen-mode.model'
import type Datum from '../src/domains/models/medical/datum.model'
import { DatumType } from '../src'
import Source from '../src/domains/models/medical/datum/enums/source.enum'
import DurationUnit from '../src/domains/models/medical/datum/enums/duration-unit.enum'
import Unit from '../src/domains/models/medical/datum/enums/unit.enum'
import Intensity from '../src/domains/models/medical/datum/enums/intensity.enum'
import PumpManufacturer from '../src/domains/models/medical/datum/enums/pump-manufacturer.enum'
import { DeviceEventSubtype } from '../src/domains/models/medical/datum/enums/device-event-subtype.enum'
import { getTrendsTime } from '../src/domains/repositories/time/time.service'
import { AlarmCode, AlarmEvent, AlarmEventType } from '../src'
import { AlarmLevel } from '../src/domains/models/medical/datum/enums/alarm-level.enum'

function createBaseData(date?: Date): BaseDatum {
  const pastDate = date ?? faker.date.recent({ days: 20 })
  return {
    id: faker.string.uuid(),
    type: DatumType.Upload,
    source: Source.Diabeloop,
    timezone: 'Europe/Paris',
    epoch: pastDate.valueOf(),
    displayOffset: -60,
    normalTime: pastDate.toISOString(),
    guessedTimezone: false
  }
}

function createBaseDurationData(date?: Date): BaseDatum & Duration {
  const baseData = createBaseData(date)
  const duration = faker.number.int({ min: 60000, max: 300000 })
  const epochEnd = baseData.epoch + duration
  const normalEnd = new Date(epochEnd).toISOString()
  return {
    ...baseData,
    duration: {
      units: DurationUnit.Milliseconds,
      value: duration
    },
    normalEnd,
    epochEnd
  }
}

function createRandomAlarm(date?: Date): AlarmEvent {
  return {
    ...createBaseData(date),
    alarmEventType: AlarmEventType.Device,
    guid: 'none',
    inputTime: faker.date.past().toISOString(),
    type: DatumType.DeviceEvent,
    subType: DeviceEventSubtype.Alarm,
    alarm: {
      alarmCode: AlarmCode.Occlusion,
      alarmLevel: AlarmLevel.Alarm,
      alarmType: 'handset',
      ackStatus: 'new',
      updateTime: faker.date.past().toISOString()
    }
  }
}

function createRandomBasal(date?: Date, hours?: number): Basal {
  const duration = hours ?? faker.number.int({ min: 60000, max: 300000 })
  const baseData = createBaseData(date)
  const epochEnd = baseData.epoch + duration
  const normalEnd = new Date(epochEnd).toISOString()
  return {
    ...baseData,
    type: DatumType.Basal,
    subType: 'automated',
    uploadId: faker.string.uuid(),
    internalId: faker.string.uuid(),
    deliveryType: 'automated',
    duration,
    rate: faker.number.float({ min: 0, max: 1, precision: 0.01 }),
    normalEnd,
    epochEnd
  }
}

function createRandomBolus(date?: Date): Bolus {
  return {
    ...createBaseData(date),
    type: DatumType.Bolus,
    subType: faker.helpers.arrayElement(Object.values(BolusSubtype)),
    uploadId: faker.string.uuid(),
    normal: 0,
    prescriptor: 'test',
    wizard: null
  }
}

function createRandomCbg(date?: Date): Cbg {
  const base = createBaseData(date)
  return {
    ...base,
    type: DatumType.Cbg,
    units: faker.helpers.arrayElement(bgUnits),
    value: faker.number.float(),
    ...getTrendsTime(base.epoch, base.timezone),
    deviceName: 'Unknown'
  }
}

function createModeData(mode: DeviceEventSubtype.Confidential | DeviceEventSubtype.Warmup | DeviceEventSubtype.Zen, date?: Date): ConfidentialMode | WarmUp | ZenMode {
  const inputTime = faker.date.past().toISOString()
  return {
    ...createBaseDurationData(date),
    type: DatumType.DeviceEvent,
    subType: mode,
    uploadId: faker.string.uuid(),
    guid: faker.string.uuid(),
    inputTime
  }
}

function createRandomConfidentialMode(date?: Date): ConfidentialMode {
  return createModeData(DeviceEventSubtype.Confidential, date) as ConfidentialMode
}

function createRandomDeviceParameterChange(date?: Date): DeviceParameterChange {
  return {
    ...createBaseData(date),
    type: DatumType.DeviceEvent,
    subType: DeviceEventSubtype.DeviceParameter,
    params: []
  }
}

function createMealData(date?: Date): Meal {
  return {
    ...createBaseData(date),
    type: DatumType.Food,
    meal: 'rescuecarbs',
    uploadId: faker.string.uuid(),
    nutrition: {
      carbohydrate: {
        net: 5,
        units: Unit.Gram
      }
    }
  }
}

function createRandomMessage(date?: Date): Message {
  return {
    ...createBaseData(date),
    type: DatumType.Message,
    userid: faker.string.uuid(),
    groupid: faker.string.uuid(),
    messageText: faker.lorem.lines(3),
    parentMessage: null,
    user: {
      fullName: faker.person.fullName()
    }
  }
}

function createRandomPhysicalActivity(date?: Date): PhysicalActivity {
  const inputTime = faker.date.past().toISOString()
  return {
    ...createBaseDurationData(date),
    type: DatumType.PhysicalActivity,
    uploadId: faker.string.uuid(),
    guid: faker.string.uuid(),
    reportedIntensity: faker.helpers.arrayElement(Object.values(Intensity)),
    eventId: faker.string.uuid(),
    inputTime
  }
}

function createRandomPumpSetttings(date?: Date): PumpSettings {
  return {
    ...createBaseData(date),
    type: DatumType.PumpSettings,
    uploadId: faker.string.uuid(),
    basalSchedules: [],
    activeSchedule: '',
    deviceId: faker.string.uuid(),
    deviceTime: faker.date.past().toISOString(),
    payload: {
      basalsecurityprofile: {},
      cgm: {
        apiVersion: faker.system.semver(),
        endOfLifeTransmitterDate: faker.date.future().toISOString(),
        expirationDate: faker.date.future().toISOString(),
        manufacturer: '',
        name: '',
        swVersionTransmitter: faker.system.semver(),
        transmitterId: faker.string.uuid()
      },
      device: {
        deviceId: faker.string.uuid(),
        imei: '',
        manufacturer: '',
        name: '',
        swVersion: faker.system.semver()
      },
      parameters: [],
      history: [],
      pump: {
        expirationDate: faker.date.future().toISOString(),
        manufacturer: PumpManufacturer.Default,
        name: '',
        serialNumber: faker.string.uuid(),
        swVersion: faker.system.semver()
      }
    }
  }
}

function createRandomReservoirChange(date?: Date): ReservoirChange {
  return {
    ...createBaseData(date),
    type: DatumType.DeviceEvent,
    subType: DeviceEventSubtype.ReservoirChange,
    uploadId: faker.string.uuid(),
    pump: {
      expirationDate: faker.date.future().toISOString(),
      manufacturer: PumpManufacturer.Default,
      name: '',
      serialNumber: faker.string.uuid(),
      swVersion: faker.system.semver()
    }
  }
}

function createRandomSmbg(date?: Date): Smbg {
  return {
    ...createRandomCbg(date),
    type: DatumType.Smbg
  }
}

function createRandomUpload(date?: Date): Upload {
  return {
    ...createBaseData(date),
    type: DatumType.Upload,
    uploadId: faker.string.uuid(),

    _dataState: '',
    _deduplicator: {
      name: '',
      version: faker.system.semver()
    },
    _state: '',
    client: {
      name: '',
      version: faker.system.semver()
    },
    dataSetType: '',
    deviceManufacturers: [],
    deviceModel: '',
    deviceTags: [],
    revision: faker.system.semver(),
    version: faker.system.semver()
  }
}

function createRandomWarmUp(date?: Date): WarmUp {
  return createModeData(DeviceEventSubtype.Warmup, date) as WarmUp
}

function createWizardData(date?: Date): Wizard {
  const bolusId = faker.string.uuid()
  return {
    ...createBaseData(date),
    type: DatumType.Wizard,
    uploadId: faker.string.uuid(),
    bolusId,
    bolusIds: new Set<string>([bolusId]),
    carbInput: 5,
    units: 'g',
    bolus: null,
    recommended: undefined,
    inputTime: faker.date.past().toISOString()
  }
}

function createRandomZenMode(date?: Date): ZenMode {
  return createModeData(DeviceEventSubtype.Zen, date) as ZenMode
}

function createRandomDatum(type: DatumType, subtype?: DeviceEventSubtype, date?: Date): Datum {
  switch (type) {
    case DatumType.Basal:
      return createRandomBasal(date)
    case DatumType.Bolus:
      return createRandomBolus(date)
    case DatumType.Cbg:
      return createRandomCbg(date)
    case DatumType.DeviceEvent:
      switch (subtype) {
        case DeviceEventSubtype.Alarm:
          return createRandomAlarm(date)
        case DeviceEventSubtype.Confidential:
          return createRandomConfidentialMode(date)
        case DeviceEventSubtype.DeviceParameter:
          return createRandomDeviceParameterChange(date)
        case DeviceEventSubtype.ReservoirChange:
          return createRandomReservoirChange(date)
        case DeviceEventSubtype.Warmup:
          return createRandomWarmUp(date)
        case DeviceEventSubtype.Zen:
          return createRandomZenMode(date)
        default:
          throw new Error('unknown type')
      }
    case DatumType.Food:
      return createMealData(date)
    case DatumType.Message:
      return createRandomMessage(date)
    case DatumType.PhysicalActivity:
      return createRandomPhysicalActivity(date)
    case DatumType.PumpSettings:
      return createRandomPumpSetttings(date)
    case DatumType.Smbg:
      return createRandomSmbg(date)
    case DatumType.Upload:
      return createRandomUpload(date)
    case DatumType.Wizard:
      return createWizardData(date)
    default:
      throw new Error('unknown type')
  }
}

export default createRandomDatum
export {
  createRandomBasal, createRandomBolus, createRandomCbg, createRandomConfidentialMode,
  createRandomDeviceParameterChange, createMealData, createRandomMessage,
  createRandomPhysicalActivity, createRandomPumpSetttings, createRandomReservoirChange,
  createRandomSmbg, createRandomUpload, createRandomWarmUp, createWizardData, createRandomZenMode
}
