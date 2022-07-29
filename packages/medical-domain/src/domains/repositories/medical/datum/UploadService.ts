import Upload from '../../../models/medical/datum/Upload'
import { DatumProcessor } from '../../../models/medical/Datum'
import BaseDatumService from './basics/BaseDatumService'
import DatumService from '../DatumService'
import MedicalDataOptions from '../../../models/medical/MedicalDataOptions'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): Upload => {
  const base = BaseDatumService.normalize(rawData, opts)
  const _deduplicator = (rawData?._deduplicator ?? {}) as Record<string, string>
  const client = (rawData?.client ?? {}) as Record<string, string>

  const upload: Upload = {
    ...base,
    type: 'upload',
    uploadId: rawData.uploadId as string,
    _dataState: rawData._dataState as string,
    _state: rawData._state as string,
    dataSetType: rawData.dataSetType as string,
    deviceManufacturers: (rawData?.deviceManufacturers ?? []) as string[],
    deviceModel: rawData.deviceModel as string,
    deviceTags: (rawData?.deviceTags ?? []) as string[],
    revision: rawData.revision as string,
    version: rawData.version as string,
    _deduplicator: {
      name: (_deduplicator?.name ?? ''),
      version: (_deduplicator?.version ?? '')
    },
    client: {
      name: (client?.name ?? ''),
      version: (client?.version ?? '')
    }

  }
  return upload
}

const deduplicate = (data: Upload[], opts: MedicalDataOptions): Upload[] => {
  return DatumService.deduplicate(data, opts) as Upload[]
}

const UploadService: DatumProcessor<Upload> = {
  normalize,
  deduplicate
}

export default UploadService
