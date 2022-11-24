import BaseDatum from './basics/base-datum.model'

interface CgmConfig {
  apiVersion: string
  endOfLifeTransmitterDate: string
  expirationDate: string
  manufacturer: string
  name: string
  swVersionTransmitter: string
  transmitterId: string
}

interface DeviceConfig {
  deviceId: string
  imei: string
  manufacturer: string
  name: string
  swVersion: string
}

interface ParametersChange {
  changeDate: string
  parameters: Array<{
    changeType: string
    effectiveDate: string
    level: number
    name: string
    unit: string
    value: string
  }>
}

interface PumpConfig {
  expirationDate: string
  manufacturer: string
  name: string
  serialNumber: string
  swVersion: string
}

interface ParameterConfig {
  effectiveDate: string
  level: number
  name: string
  unit: string
  value: string
}

type PumpSettings = BaseDatum & {
  type: 'pumpSettings'
  uploadId: string
  basalSchedules: object[]
  activeSchedule: string
  deviceId: string
  deviceTime: string
  payload: {
    basalsecurityprofile: object
    cgm: CgmConfig
    device: DeviceConfig
    parameters: ParameterConfig[]
    history: ParametersChange[]
    pump: PumpConfig
  }
}

export default PumpSettings
export { CgmConfig, DeviceConfig, ParametersChange, PumpConfig, ParameterConfig }
