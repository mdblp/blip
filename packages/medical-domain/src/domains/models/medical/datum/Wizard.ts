import BaseDatum from './basics/BaseDatum'
import Bolus from './Bolus'

export type Wizard = BaseDatum & {
  type: 'wizard'
  uploadId: string
  bolusId: string
  carbInput: number
  units: string
  bolus: Bolus | null
}

export default Wizard
