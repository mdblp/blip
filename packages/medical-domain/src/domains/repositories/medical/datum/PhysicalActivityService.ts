import { DatumProcessor } from '../../../models/medical/Datum'
import BaseDatumService from './basics/BaseDatumService'
import DurationService from './basics/DurationService'
import PhysicalActivity from '../../../models/medical/datum/PhysicalActivity'
import MedicalDataOptions from '../../../models/medical/MedicalDataOptions'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): PhysicalActivity => {
  const base = BaseDatumService.normalize(rawData, opts)
  const duration = DurationService.normalize(rawData, opts)
  let eventId = base.id
  if (typeof rawData.eventId === 'string' && rawData.eventId.trim() !== '') {
    eventId = rawData.eventId
  }
  let inputTime = base.normalTime
  if (typeof rawData.inputTime === 'string' && rawData.inputTime.trim() !== '') {
    inputTime = rawData.inputTime
  }
  const physicalActivity: PhysicalActivity = {
    ...base,
    ...duration,
    type: 'physicalActivity',
    uploadId: rawData.uploadId as string,
    guid: rawData.guid as string,
    reportedIntensity: rawData.reportedIntensity as string,
    eventId,
    inputTime
  }
  return physicalActivity
}

const deduplicate = (data: PhysicalActivity[], _opts: MedicalDataOptions): PhysicalActivity[] => {
  const initialGroups: Record<string, PhysicalActivity> = {}
  const eventIdGroups = data.reduce((previous, current: PhysicalActivity) => {
    // For each eventID take the most recent item
    if (
      previous[current.eventId] === undefined ||
        previous[current.eventId].inputTime < current.inputTime
    ) {
      previous[current.eventId] = current
    }
    return previous
  }, initialGroups)
  // Filtering only object with positive duration
  return Object.values(eventIdGroups).filter(pa => pa.duration.value > 0)
}

const PhysicalActivityService: DatumProcessor<PhysicalActivity> = {
  normalize,
  deduplicate
}

export default PhysicalActivityService
