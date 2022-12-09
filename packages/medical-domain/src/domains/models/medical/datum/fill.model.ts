import BaseDatum from './basics/base-datum.model'

type Fill = BaseDatum & {
  type: 'fill'
  epochEnd: number
  normalEnd: string
  fillColor: string
  startsAtMidnight: boolean
}

export default Fill
