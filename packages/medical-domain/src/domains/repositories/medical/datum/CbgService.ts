import { DatumProcessor } from '../../../models/medical/Datum'
import BaseDatumService from './basics/BaseDatumService'
import Cbg, { Bg, MGDL_UNITS, MMOLL_UNITS, BgUnit, isBgUnit } from '../../../models/medical/datum/Cbg'
import DatumService from '../DatumService'
import MedicalDataOptions from '../../../models/medical/MedicalDataOptions'
import { getTrendsTime } from '../../time/TimeService'

const MGDL_PER_MMOLL = 18.01577

/**
 * extracted from packages/tideline/js/data/util/format.js
 * convertBG is a common util function to convert bg values
 * to/from "mg/dL" and "mmol/L"
 * @param {number} value The value to convert
 * @param {BgUnit} unit The unit of the passed value
 * @return: The converted value in the opposite unit
 */
const convertBG = (value: number, unit: BgUnit): number => {
  if (value < 0) {
    throw new Error('Invalid glycemia value')
  }
  switch (unit) {
    case MGDL_UNITS:
      return Math.round(10.0 * value / MGDL_PER_MMOLL) / 10
    case MMOLL_UNITS:
      return Math.round(value * MGDL_PER_MMOLL)
    default:
      throw new Error('Invalid parameter unit')
  }
}

const normalizeBg = (rawData: Record<string, unknown>, opts: MedicalDataOptions, bgType: 'cbg' | 'smbg'): Bg => {
  const base = BaseDatumService.normalize(rawData, opts)
  let bgValue = rawData.value as number
  if (bgValue < 0) {
    throw new Error(`Invalid glycemia value:${bgValue}`)
  }
  let bgUnit = rawData.units as BgUnit
  if (!isBgUnit(bgUnit)) {
    throw new Error(`Invalid glycemia unit:${bgUnit as string}`)
  }
  if (opts.bgUnits !== bgUnit) {
    bgValue = convertBG(bgValue, bgUnit)
    bgUnit = opts.bgUnits
  }

  const bg: Bg = {
    ...base,
    type: bgType,
    units: bgUnit,
    value: bgValue,
    // only used for trends view ?
    ...getTrendsTime(base.epoch, base.timezone)
  }
  return bg
}

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): Cbg => {
  return normalizeBg(rawData, opts, 'cbg') as Cbg
}

const deduplicate = (data: Cbg[], opts: MedicalDataOptions): Cbg[] => {
  return DatumService.deduplicate(data, opts) as Cbg[]
}

const CbgService: DatumProcessor<Cbg> = {
  normalize,
  deduplicate
}

export default CbgService
export { normalizeBg, convertBG }
