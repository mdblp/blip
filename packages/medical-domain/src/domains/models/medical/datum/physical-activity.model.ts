import BaseDatum from './basics/base-datum.model'
import Duration from './basics/duration.model'

type PhysicalActivity = BaseDatum & Duration & {
  type: 'physicalActivity'
  uploadId: string
  guid: string
  reportedIntensity: string
  eventId: string
  inputTime: string
}

export default PhysicalActivity
