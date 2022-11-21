import Wizard from '../../../models/medical/datum/Wizard'
import { DatumProcessor } from '../../../models/medical/Datum'
import BaseDatumService from './basics/BaseDatumService'
import DatumService from '../DatumService'
import MedicalDataOptions from '../../../models/medical/MedicalDataOptions'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): Wizard => {
  const base = BaseDatumService.normalize(rawData, opts)
  const wizard: Wizard = {
    ...base,
    type: 'wizard',
    uploadId: rawData.uploadId as string,
    bolusId: (rawData?.bolus ?? '') as string,
    carbInput: rawData.carbInput as number,
    units: rawData.units as string,
    bolus: null
  }
  if (rawData.recommended) {
    const recommended = rawData?.recommended as Record<string, unknown>
    wizard.recommended = {
      carb: recommended.carb as number,
      correction: recommended.correction as number,
      net: recommended.net as number
    }
  }
  return wizard
}

const deduplicate = (data: Wizard[], opts: MedicalDataOptions): Wizard[] => {
  return DatumService.deduplicate(data, opts) as Wizard[]
}

const WizardService: DatumProcessor<Wizard> = {
  normalize,
  deduplicate
}

export default WizardService
