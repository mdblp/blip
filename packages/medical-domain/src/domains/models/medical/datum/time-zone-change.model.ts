import BaseDatum from './basics/base-datum.model'

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
