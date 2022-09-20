import BaseDatum from './basics/BaseDatum'

type Fill = BaseDatum & {
  type: 'fill'
  epochEnd: number
  normalEnd: string
  fillColor: string
  startsAtMidnight: boolean
}

export default Fill
