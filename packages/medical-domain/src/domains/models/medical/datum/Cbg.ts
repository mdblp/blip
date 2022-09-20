import BaseDatum from './basics/BaseDatum'

const MGDL_UNITS = 'mg/dL'
const MMOLL_UNITS = 'mmol/L'

const units = [MGDL_UNITS, MMOLL_UNITS] as const
type BgUnit = typeof units[number]

function isBgUnit(value: unknown): value is BgUnit {
  if (typeof value === 'string') {
    return units.includes(value as BgUnit)
  }
  return false
}

type Bg = BaseDatum & {
  type: 'cbg' | 'smbg'
  units: BgUnit
  value: number
  // Used for trends view
  localDate: string
  isoWeekday: string
  msPer24: number
}

type Cbg = Bg & {
  type: 'cbg'
}

export default Cbg
export { Bg, MGDL_UNITS, MMOLL_UNITS, BgUnit, isBgUnit }
