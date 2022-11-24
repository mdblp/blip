import BaseDatum from './basics/base-datum.model'

type ReservoirChange = BaseDatum & {
  type: 'deviceEvent'
  subType: 'reservoirChange'
  uploadId: string
}

export default ReservoirChange
