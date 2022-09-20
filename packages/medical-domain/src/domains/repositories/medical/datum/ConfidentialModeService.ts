import { DatumProcessor } from '../../../models/medical/Datum'
import BaseDatumService from './basics/BaseDatumService'
import ConfidentialMode from '../../../models/medical/datum/ConfidentialMode'
import DurationService from './basics/DurationService'
import DatumService from '../DatumService'
import MedicalDataOptions from '../../../models/medical/MedicalDataOptions'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): ConfidentialMode => {
  const base = BaseDatumService.normalize(rawData, opts)
  const duration = DurationService.normalize(rawData, opts)
  const confidentialMode: ConfidentialMode = {
    ...base,
    ...duration,
    type: 'deviceEvent',
    subType: 'confidential',
    uploadId: rawData.uploadId as string,
    guid: rawData.guid as string,
    inputTime: rawData.inputTime as string
  }
  return confidentialMode
}

const deduplicate = (data: ConfidentialMode[], opts: MedicalDataOptions): ConfidentialMode[] => {
  return DatumService.deduplicate(data, opts) as ConfidentialMode[]
}

const ConfidentialModeService: DatumProcessor<ConfidentialMode> = {
  normalize,
  deduplicate
}

export default ConfidentialModeService
