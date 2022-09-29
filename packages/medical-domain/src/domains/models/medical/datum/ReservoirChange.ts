import BaseDatum from './basics/BaseDatum'

type ReservoirChange = BaseDatum & {
  type: 'deviceEvent'
  subType: 'reservoirChange'
  uploadId: string
}

export default ReservoirChange
