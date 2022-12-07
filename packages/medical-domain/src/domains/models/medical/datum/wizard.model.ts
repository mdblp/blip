import BaseDatum from './basics/base-datum.model'
import Bolus from './bolus.model'

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
