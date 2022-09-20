import BaseDatum from './basics/BaseDatum'

type TimeZoneChange = BaseDatum & {
  type: 'deviceEvent'
  subType: 'timeChange'
  from: {
    time: string
    timeZoneName: string
  }
  to: {
    time: string
    timeZoneName: string
  }
  method: string
}

export default TimeZoneChange
