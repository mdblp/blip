import { DatumProcessor } from '../../../models/medical/Datum'
import BaseDatumService from './basics/BaseDatumService'
import WarmUp from '../../../models/medical/datum/WarmUp'
import DurationService from './basics/DurationService'
import DatumService from '../DatumService'
import MedicalDataOptions from '../../../models/medical/MedicalDataOptions'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): WarmUp => {
  const base = BaseDatumService.normalize(rawData, opts)
  const duration = DurationService.normalize(rawData, opts)
  const warmUp: WarmUp = {
    ...base,
    ...duration,
    type: 'deviceEvent',
    subType: 'warmup',
    uploadId: rawData.uploadId as string,
    guid: rawData.guid as string,
    inputTime: rawData.inputTime as string
  }
  return warmUp
}

const deduplicate = (data: WarmUp[], opts: MedicalDataOptions): WarmUp[] => {
  return DatumService.deduplicate(data, opts) as WarmUp[]
}

const WarmUpService: DatumProcessor<WarmUp> = {
  normalize,
  deduplicate
}

export default WarmUpService
