import Datum, { DatumProcessor } from '../../models/medical/Datum'
import MedicalDataOptions from '../../models/medical/MedicalDataOptions'
import BasalService from './datum/BasalService'
import BolusService from './datum/BolusService'
import CbgService from './datum/CbgService'
import ConfidentialModeService from './datum/ConfidentialModeService'
import DeviceParameterChangeService from './datum/DeviceParameterChangeService'
import MealService from './datum/MealService'
import MessageService from './datum/MessageService'
import PhysicalActivityService from './datum/PhysicalActivityService'
import PumpSettingsService from './datum/PumpSettingsService'
import ReservoirChangeService from './datum/ReservoirChangeService'
import SmbgService from './datum/SmbgService'
import UploadService from './datum/UploadService'
import WarmUpService from './datum/WarmUpService'
import WizardService from './datum/WizardService'
import ZenModeService from './datum/ZenModeService'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): Datum => {
  let type = rawData.type
  if (type === undefined && rawData.messagetext) {
    type = 'message'
  }
  switch (type as string) {
    case 'basal':
      return BasalService.normalize(rawData, opts)
    case 'bolus':
      return BolusService.normalize(rawData, opts)
    case 'cbg':
      return CbgService.normalize(rawData, opts)
    case 'deviceEvent':
      switch (rawData.subType as string) {
        case 'confidential':
          return ConfidentialModeService.normalize(rawData, opts)
        case 'deviceParameter':
          return DeviceParameterChangeService.normalize(rawData, opts)
        case 'reservoirChange':
          return ReservoirChangeService.normalize(rawData, opts)
        case 'zen':
          return ZenModeService.normalize(rawData, opts)
        case 'warmup':
          return WarmUpService.normalize(rawData, opts)
        default:
          throw new Error(`Unknown deviceEvent subType ${rawData.subType as string}`)
      }
    case 'food':
      return MealService.normalize(rawData, opts)
    case 'message':
      return MessageService.normalize(rawData, opts)
    case 'physicalActivity':
      return PhysicalActivityService.normalize(rawData, opts)
    case 'pumpSettings':
      return PumpSettingsService.normalize(rawData, opts)
    case 'smbg':
      return SmbgService.normalize(rawData, opts)
    case 'upload':
      return UploadService.normalize(rawData, opts)
    case 'wizard':
      return WizardService.normalize(rawData, opts)
    default:
      throw new Error(`Unknown datum type ${rawData.type as string}`)
  }
}

const deduplicate = (data: Datum[], _opts: MedicalDataOptions): Datum[] => {
  return data.flatMap((datum, index) => {
    const firstIndex = data.findIndex(element => element.id === datum.id)
    if (firstIndex === index) {
      return [datum]
    }
    return []
  })
}

const DatumService: DatumProcessor<Datum> = {
  normalize,
  deduplicate
}

export default DatumService
