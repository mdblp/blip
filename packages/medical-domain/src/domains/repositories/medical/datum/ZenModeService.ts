import { DatumProcessor } from '../../../models/medical/Datum'
import BaseDatumService from './basics/BaseDatumService'
import ZenMode from '../../../models/medical/datum/ZenMode'
import DurationService from './basics/DurationService'
import DatumService from '../DatumService'
import MedicalDataOptions from '../../../models/medical/MedicalDataOptions'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): ZenMode => {
  const base = BaseDatumService.normalize(rawData, opts)
  const duration = DurationService.normalize(rawData, opts)
  const zenMode: ZenMode = {
    ...base,
    ...duration,
    type: 'deviceEvent',
    subType: 'zen',
    uploadId: rawData.uploadId as string,
    guid: rawData.guid as string,
    inputTime: rawData.inputTime as string
  }
  return zenMode
}

const deduplicate = (data: ZenMode[], opts: MedicalDataOptions): ZenMode[] => {
  return DatumService.deduplicate(data, opts) as ZenMode[]
}

const ZenModeService: DatumProcessor<ZenMode> = {
  normalize,
  deduplicate
}

export default ZenModeService
