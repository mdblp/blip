import { DatumProcessor } from '../../../models/medical/Datum'
import BaseDatumService from './basics/BaseDatumService'
import Fill from '../../../models/medical/datum/Fill'
import DatumService from '../DatumService'
import MedicalDataOptions from '../../../models/medical/MedicalDataOptions'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): Fill => {
  const base = BaseDatumService.normalize(rawData, opts)
  const fill: Fill = {
    ...base,
    type: 'fill',
    epochEnd: base.epoch,
    normalEnd: base.normalTime,
    fillColor: rawData.fillColor as string,
    startsAtMidnight: rawData.startsAtMidnight as boolean
  }
  return fill
}

const deduplicate = (data: Fill[], opts: MedicalDataOptions): Fill[] => {
  return DatumService.deduplicate(data, opts) as Fill[]
}

const FillService: DatumProcessor<Fill> = {
  normalize,
  deduplicate
}

export default FillService
