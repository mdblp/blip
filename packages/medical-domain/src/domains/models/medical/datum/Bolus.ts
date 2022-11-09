import BaseDatum from './basics/BaseDatum'
import Wizard from './Wizard'

const bolusSubTypes = ['normal', 'biphasic', 'pen', 'dual/square', 'square'] as const
type BolusSubType = typeof bolusSubTypes[number]

function isBolusSubType(value: unknown): value is BolusSubType {
  if (typeof value === 'string') {
    return bolusSubTypes.includes(value as BolusSubType)
  }
  return false
}

type Bolus = BaseDatum & {
  type: 'bolus'
  subType: BolusSubType
  uploadId: string
  normal: number
  prescriptor: string
  wizard: Wizard | null
  expectedNormal?: number
  insulinOnBoard?: number
  part?: string
  biphasicId?: string
}

export default Bolus
export { BolusSubType, isBolusSubType, bolusSubTypes }
