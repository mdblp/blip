import { DatumProcessor } from '../../../models/medical/Datum'
import Smbg from '../../../models/medical/datum/Smbg'
import DatumService from '../DatumService'
import MedicalDataOptions from '../../../models/medical/MedicalDataOptions'
import { normalizeBg } from './CbgService'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): Smbg => {
  return normalizeBg(rawData, opts, 'smbg') as Smbg
}

const deduplicate = (data: Smbg[], opts: MedicalDataOptions): Smbg[] => {
  return DatumService.deduplicate(data, opts) as Smbg[]
}

const SmbgService: DatumProcessor<Smbg> = {
  normalize,
  deduplicate
}

export default SmbgService
