import BaseDatum from './basics/base-datum.model'
import Duration from './basics/duration.model'

type ZenMode = BaseDatum & Duration & {
  type: 'deviceEvent'
  subType: 'zen'
  uploadId: string
  guid: string
  inputTime: string
}

export default ZenMode
