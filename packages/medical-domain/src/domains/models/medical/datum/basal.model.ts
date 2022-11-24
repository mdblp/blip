import BaseDatum from './basics/base-datum.model'

type Basal = BaseDatum & {
  type: 'basal'
  subType: string
  uploadId: string
  internalId: string
  deliveryType: string
  duration: number
  rate: number
  normalEnd: string
  epochEnd: number
  replace?: string
  replacedBy?: string
}

export default Basal
