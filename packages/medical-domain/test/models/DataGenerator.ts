import { faker } from '@faker-js/faker'
import Bolus, { bolusSubTypes } from '../../src/domains/models/medical/datum/Bolus'
import Basal from '../../src/domains/models/medical/datum/Basal'
import Cbg, { bgUnits } from '../../src/domains/models/medical/datum/Cbg'
import BaseDatum from '../../src/domains/models/medical/datum/basics/BaseDatum'
import ConfidentialMode from '../../src/domains/models/medical/datum/ConfidentialMode'
import Duration from '../../src/domains/models/medical/datum/basics/Duration'
import DeviceParameterChange from '../../src/domains/models/medical/datum/DeviceParameterChange'
import Meal from '../../src/domains/models/medical/datum/Meal'
import Message from '../../src/domains/models/medical/datum/Message'
import PhysicalActivity from '../../src/domains/models/medical/datum/PhysicalActivity'
import PumpSettings from '../../src/domains/models/medical/datum/PumpSettings'
import ReservoirChange from '../../src/domains/models/medical/datum/ReservoirChange'
import Smbg from '../../src/domains/models/medical/datum/Smbg'
import Upload from '../../src/domains/models/medical/datum/Upload'
import WarmUp from '../../src/domains/models/medical/datum/WarmUp'
import Wizard from '../../src/domains/models/medical/datum/Wizard'
import ZenMode from '../../src/domains/models/medical/datum/ZenMode'
import Datum from '../../src/domains/models/medical/Datum'

function createBaseData(): BaseDatum {
  const pastDate = faker.date.recent(20)
  return {
    id: faker.datatype.uuid(),
    type: 'upload',
    source: 'Diabeloop',
    timezone: 'Europe/Paris',
    epoch: pastDate.valueOf(),
    displayOffset: -60,
    normalTime: pastDate.toISOString(),
    guessedTimezone: false
  }
}

function createBaseDurationData(): BaseDatum & Duration {
  const baseData = createBaseData()
  const duration = faker.datatype.number({ min: 60000, max: 300000 })
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  const epochEnd = baseData.epoch + duration
  const normalEnd = new Date(epochEnd).toISOString()
  return {
    ...baseData,
    duration: {
      units: 'ms',
      value: duration
    },
    normalEnd,
    epochEnd
  }
}

function createRandomBasal(): Basal {
  const baseData = createBaseData()
  const duration = faker.datatype.number({ min: 60000, max: 300000 })
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  const epochEnd = baseData.epoch + duration
  const normalEnd = new Date(epochEnd).toISOString()
  return {
    ...baseData,
    type: 'basal',
    subType: 'automated',
    uploadId: faker.datatype.uuid(),
    internalId: faker.datatype.uuid(),
    deliveryType: 'automated',
    duration,
    rate: faker.datatype.number({ min: 0, max: 1, precision: 0.01 }),
    normalEnd,
    epochEnd
  }
}

function createRandomBolus(): Bolus {
  return {
    ...createBaseData(),
    type: 'bolus',
    subType: faker.helpers.arrayElement(bolusSubTypes),
    uploadId: faker.datatype.uuid(),
    normal: 0,
    prescriptor: 'test',
    wizard: null
  }
}

function createRandomCbg(): Cbg {
  return {
    ...createBaseData(),
    type: 'cbg',
    units: faker.helpers.arrayElement(bgUnits),
    value: faker.datatype.number(),
    localDate: '',
    isoWeekday: '',
    msPer24: 0
  }
}

function createModeData(mode: 'confidential' | 'warmup' | 'zen'): ConfidentialMode | WarmUp | ZenMode {
  const inputTime = faker.date.past().toISOString()
  return {
    ...createBaseDurationData(),
    type: 'deviceEvent',
    subType: mode,
    uploadId: faker.datatype.uuid(),
    guid: faker.datatype.uuid(),
    inputTime
  }
}

function createRandomConfidentialMode(): ConfidentialMode {
  return createModeData('confidential') as ConfidentialMode
}

function createRandomDeviceParameterChange(): DeviceParameterChange {
  return {
    ...createBaseData(),
    type: 'deviceEvent',
    subType: 'deviceParameter',
    params: []
  }
}

function createRandomMeal(): Meal {
  return {
    ...createBaseData(),
    type: 'food',
    meal: 'rescuecarbs',
    uploadId: faker.datatype.uuid(),
    nutrition: {
      carbohydrate: {
        net: faker.datatype.number({ min: 0, max: 200, precision: 0.01 }),
        units: 'g'
      }
    }
  }
}

function createRandomMessage(): Message {
  return {
    ...createBaseData(),
    type: 'message',
    userid: faker.datatype.uuid(),
    groupid: faker.datatype.uuid(),
    messageText: faker.random.words(5),
    parentMessage: null,
    user: {
      fullName: faker.name.fullName()
    }
  }
}

function createRandomPhysicalActivity(): PhysicalActivity {
  const inputTime = faker.date.past().toISOString()
  return {
    ...createBaseDurationData(),
    type: 'physicalActivity',
    uploadId: faker.datatype.uuid(),
    guid: faker.datatype.uuid(),
    reportedIntensity: faker.helpers.arrayElement(['low', 'medium', 'high']),
    eventId: faker.datatype.uuid(),
    inputTime
  }
}

function createRandomPumpSetttings(): PumpSettings {
  return {
    ...createBaseData(),
    type: 'pumpSettings',
    uploadId: faker.datatype.uuid(),
    basalSchedules: [],
    activeSchedule: '',
    deviceId: faker.datatype.uuid(),
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
        transmitterId: faker.datatype.uuid()
      },
      device: {
        deviceId: faker.datatype.uuid(),
        imei: '',
        manufacturer: '',
        name: '',
        swVersion: faker.system.semver()
      },
      parameters: [],
      history: [],
      pump: {
        expirationDate: faker.date.future().toISOString(),
        manufacturer: '',
        name: '',
        serialNumber: faker.datatype.uuid(),
        swVersion: faker.system.semver()
      }
    }
  }
}

function createRandomReservoirChange(): ReservoirChange {
  return {
    ...createBaseData(),
    type: 'deviceEvent',
    subType: 'reservoirChange',
    uploadId: faker.datatype.uuid()
  }
}

function createRandomSmbg(): Smbg {
  return {
    ...createRandomCbg(),
    type: 'smbg'
  }
}

function createRandomUpload(): Upload {
  return {
    ...createBaseData(),
    type: 'upload',
    uploadId: faker.datatype.uuid(),

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

function createRandomWarmUp(): WarmUp {
  return createModeData('warmup') as WarmUp
}

function createRandomWizard(): Wizard {
  return {
    ...createBaseData(),
    type: 'wizard',
    uploadId: faker.datatype.uuid(),
    bolusId: faker.datatype.uuid(),
    carbInput: faker.datatype.number({ min: 0, max: 200, precision: 0.01 }),
    units: 'g',
    bolus: null,
    recommended: undefined
  }
}

function createRandomZenMode(): ZenMode {
  return createModeData('zen') as ZenMode
}

function createRandomDatum(type: string, subtype?: string): Datum {
  switch (type) {
    case 'basal':
      return createRandomBasal()
    case 'bolus':
      return createRandomBolus()
    case 'cbg':
      return createRandomCbg()
    case 'deviceEvent':
      switch (subtype) {
        case 'confidential':
          return createRandomConfidentialMode()
        case 'deviceParameter':
          return createRandomDeviceParameterChange()
        case 'reservoirChange':
          return createRandomReservoirChange()
        case 'warmup':
          return createRandomWarmUp()
        case 'zen':
          return createRandomZenMode()
        default:
          throw new Error('unknown type')
      }
    case 'food':
      return createRandomMeal()
    case 'message':
      return createRandomMessage()
    case 'physicalActivity':
      return createRandomPhysicalActivity()
    case 'pumpSettings':
      return createRandomPumpSetttings()
    case 'smbg':
      return createRandomSmbg()
    case 'upload':
      return createRandomUpload()
    case 'wizard':
      return createRandomWizard()
    default:
      throw new Error('unknown type')
  }
}

export default createRandomDatum
export {
  createRandomBasal, createRandomBolus, createRandomCbg, createRandomConfidentialMode,
  createRandomDeviceParameterChange, createRandomMeal, createRandomMessage,
  createRandomPhysicalActivity, createRandomPumpSetttings, createRandomReservoirChange,
  createRandomSmbg, createRandomUpload, createRandomWarmUp, createRandomWizard, createRandomZenMode
}
