import BaseDatum from './basics/BaseDatum'
import Duration from './basics/Duration'

type ZenMode = BaseDatum & Duration & {
  type: 'deviceEvent'
  subType: 'zen'
  uploadId: string
  guid: string
  inputTime: string
}

export default ZenMode
