import BaseDatum from './basics/BaseDatum'

type DeviceParameterChange = BaseDatum & {
  type: 'deviceEvent'
  subType: 'deviceParameter'
  uploadId: string
  name: string
  level: string
  units: string
  value: string
  previousValue: string
  lastUpdateDate: string
}

export default DeviceParameterChange
