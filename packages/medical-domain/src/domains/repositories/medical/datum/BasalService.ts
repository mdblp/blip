import Basal from '../../../models/medical/datum/Basal'
import { DatumProcessor } from '../../../models/medical/Datum'
import BaseDatumService from './basics/BaseDatumService'
import { addMilliseconds } from '../../time/TimeService'
import MedicalDataOptions from '../../../models/medical/MedicalDataOptions'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): Basal => {
  const base = BaseDatumService.normalize(rawData, opts)
  let duration = 0
  if (typeof rawData.duration === 'number') {
    duration = rawData.duration
  }
  const normalEnd = addMilliseconds(base.normalTime, duration)
  const epochEnd = base.epoch + duration
  const basal: Basal = {
    ...base,
    type: 'basal',
    subType: rawData.deliveryType as string,
    uploadId: rawData.uploadId as string,
    internalId: rawData.internalId as string,
    deliveryType: rawData.deliveryType as string,
    rate: rawData.rate as number,
    duration,
    normalEnd,
    epochEnd
  }
  return basal
}

const deduplicate = (data: Basal[], opts: MedicalDataOptions): Basal[] => {
  const tempBasalMaxOffset = opts.YLP820_BASAL_TIME
  const automatedBasal = data.filter((d) => d.subType === 'automated' && d.duration === 60000)
  const nAutomatedBasal = automatedBasal.length
  const tempBasals = data.filter(d => d.subType === 'temp')

  for (let i = 0; i < nAutomatedBasal; i++) {
    const basal = automatedBasal[i]
    if (typeof basal.replace === 'string' || typeof basal.replacedBy === 'string') {
      continue
    }
    // Search for it's corresponding temp basal
    const tempBasalFound = tempBasals.find((tempBasal) =>
      Math.abs(tempBasal.epoch - basal.epoch) < tempBasalMaxOffset &&
      tempBasal.rate === basal.rate
    )
    if (tempBasalFound) {
      tempBasalFound.subType = 'automated'
      tempBasalFound.deliveryType = 'automated'
      tempBasalFound.replace = basal.id
      basal.duration = 0
      basal.replacedBy = tempBasalFound.id
    }
  }
  return data
}

const BasalService: DatumProcessor<Basal> = {
  normalize,
  deduplicate
}

export default BasalService
