import ReservoirChange from '../../../models/medical/datum/ReservoirChange'
import { DatumProcessor } from '../../../models/medical/Datum'
import BaseDatumService from './basics/BaseDatumService'
import DatumService from '../DatumService'
import MedicalDataOptions from '../../../models/medical/MedicalDataOptions'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): ReservoirChange => {
  const base = BaseDatumService.normalize(rawData, opts)
  const reservoirChange: ReservoirChange = {
    ...base,
    type: 'deviceEvent',
    subType: 'reservoirChange',
    uploadId: rawData.uploadId as string
  }
  return reservoirChange
}

const deduplicate = (data: ReservoirChange[], opts: MedicalDataOptions): ReservoirChange[] => {
  return DatumService.deduplicate(data, opts) as ReservoirChange[]
}

const ReservoirChangeService: DatumProcessor<ReservoirChange> = {
  normalize,
  deduplicate
}

export default ReservoirChangeService
