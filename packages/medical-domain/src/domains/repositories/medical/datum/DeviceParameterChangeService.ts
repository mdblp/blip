import DeviceParameterChange from '../../../models/medical/datum/DeviceParameterChange'
import { DatumProcessor } from '../../../models/medical/Datum'
import BaseDatumService from './basics/BaseDatumService'
import DatumService from '../DatumService'
import MedicalDataOptions from '../../../models/medical/MedicalDataOptions'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): DeviceParameterChange => {
  const base = BaseDatumService.normalize(rawData, opts)
  const deviceParameterChange: DeviceParameterChange = {
    ...base,
    type: 'deviceEvent',
    subType: 'deviceParameter',
    uploadId: rawData.uploadId as string,
    name: rawData.name as string,
    level: rawData.level as string,
    units: rawData.units as string,
    value: rawData.value as string,
    previousValue: rawData.previousValue as string,
    lastUpdateDate: rawData.lastUpdateDate as string
  }
  return deviceParameterChange
}

const deduplicate = (data: DeviceParameterChange[], opts: MedicalDataOptions): DeviceParameterChange[] => {
  return DatumService.deduplicate(data, opts) as DeviceParameterChange[]
}

const DeviceParameterChangeService: DatumProcessor<DeviceParameterChange> = {
  normalize,
  deduplicate
}

export default DeviceParameterChangeService
