import BaseDatum from './basics/base-datum.model'
import Duration from './basics/duration.model'

type ConfidentialMode = BaseDatum & Duration & {
  type: 'deviceEvent'
  subType: 'confidential'
  uploadId: string
  guid: string
  inputTime: string
}

export default ConfidentialMode
