import BaseDatum from './basics/BaseDatum'
import Duration from './basics/Duration'

type ConfidentialMode = BaseDatum & Duration & {
  type: 'deviceEvent'
  subType: 'confidential'
  uploadId: string
  guid: string
  inputTime: string
}

export default ConfidentialMode
