import BaseTime from './base-time.model'

const datumTypes = [
  'upload', 'cbg', 'pumpSettings', 'basal', 'bolus', 'deviceEvent',
  'fill', 'food', 'message', 'smbg', 'physicalActivity', 'wizard'
] as const

type DatumType = typeof datumTypes[number]

type BaseDatum = BaseTime & {
  id: string
  type: DatumType
  source: string
}

export default BaseDatum
export { DatumType, datumTypes }
