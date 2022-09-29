import BaseDatum from './basics/BaseDatum'
import Duration from './basics/Duration'

type WarmUp = BaseDatum & Duration & {
  type: 'deviceEvent'
  subType: 'warmup'
  uploadId: string
  guid: string
  inputTime: string
}

export default WarmUp
