import BaseDatum from './basics/BaseDatum'
import Duration from './basics/Duration'

type PhysicalActivity = BaseDatum & Duration & {
  type: 'physicalActivity'
  uploadId: string
  guid: string
  reportedIntensity: string
  eventId: string
  inputTime: string
}

export default PhysicalActivity
