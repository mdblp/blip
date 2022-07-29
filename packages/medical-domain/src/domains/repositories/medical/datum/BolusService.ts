import Bolus, { isBolusSubType } from '../../../models/medical/datum/Bolus'
import { DatumProcessor } from '../../../models/medical/Datum'
import BaseDatumService from './basics/BaseDatumService'
import MedicalDataOptions from '../../../models/medical/MedicalDataOptions'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): Bolus => {
  const base = BaseDatumService.normalize(rawData, opts)
  if (!isBolusSubType(rawData.subType)) {
    throw new Error(`Invalid bolus subType:${rawData.subType as string}`)
  }
  const bolus: Bolus = {
    ...base,
    type: 'bolus',
    subType: rawData.subType,
    uploadId: rawData.uploadId as string,
    normal: rawData.normal as number,
    prescriptor: rawData.prescriptor as string,
    wizard: null
  }
  return bolus
}

const deduplicate = (data: Bolus[], _opts: MedicalDataOptions): Bolus[] => {
  // group bolus by normal time
  const initialGroups: Record<string, Bolus[]> = {}
  const timeGroups = data.reduce((previous, current: Bolus) => {
    if (previous[current.normalTime] === undefined) {
      previous[current.normalTime] = []
    }
    previous[current.normalTime].push(current)
    return previous
  }, initialGroups)
  // Getting only one bolus with the same normal time taking the maximum normal value
  return Object.values(timeGroups).flatMap(value => {
    if (value.length <= 1) {
      return value
    }
    const maxNormal = Math.max(...value.map(v => v.normal))
    const bolus = value.find(v => {
      return v.normal === maxNormal
    })
    if (bolus) {
      return [bolus]
    }
    return []
  })
}

const BolusService: DatumProcessor<Bolus> = {
  normalize,
  deduplicate
}

export default BolusService
