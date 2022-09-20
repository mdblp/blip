import BaseDatum, { DatumType } from '../../../../models/medical/datum/basics/BaseDatum'
import { DatumProcessor } from '../../../../models/medical/Datum'
import BaseTimeService from './BaseTimeService'
import MedicalDataOptions from '../../../../models/medical/MedicalDataOptions'

/**
 * extracted from packages/tideline/js/tidelinedata.js
 */
function genRandomId(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  const hexID = new Array(16)
  for (let i = 0; i < array.length; i++) {
    const b = array[i]
    const hex = (b + 0x100).toString(16).substr(1)
    hexID[i] = hex
  }
  return hexID.join('')
}

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): BaseDatum => {
  const baseTime = BaseTimeService.normalize(rawData, opts)
  let id: string
  if (typeof rawData.id !== 'string') {
    id = genRandomId()
  } else {
    id = rawData.id
  }
  const out: BaseDatum = {
    ...baseTime,
    id,
    type: rawData.type as DatumType,
    source: (rawData.source ?? opts.defaultSource) as string
  }
  return out
}

// Unused with partial types
const deduplicate = (data: BaseDatum[], _opts: MedicalDataOptions): BaseDatum[] => {
  return data
}

const BaseDatumService: DatumProcessor<BaseDatum> = {
  normalize,
  deduplicate
}

export default BaseDatumService
