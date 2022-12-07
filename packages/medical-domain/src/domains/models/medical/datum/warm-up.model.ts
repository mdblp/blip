import BaseDatum from './basics/base-datum.model'
import Duration from './basics/duration.model'

type WarmUp = BaseDatum & Duration & {
  type: 'deviceEvent'
  subType: 'warmup'
  uploadId: string
  guid: string
  inputTime: string
}

export default WarmUp
