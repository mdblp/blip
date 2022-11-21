import BaseDatum from './basics/BaseDatum'
import Bolus from './Bolus'

export type Wizard = BaseDatum & {
  type: 'wizard'
  uploadId: string
  bolusId: string
  carbInput: number
  units: string
  bolus: Bolus | null
  recommended?: {
    carb: number
    correction: number
    net: number
  }
}

export default Wizard
