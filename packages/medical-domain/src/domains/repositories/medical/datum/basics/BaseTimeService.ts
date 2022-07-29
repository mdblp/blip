import BaseTime from '../../../../models/medical/datum/basics/BaseTime'
import { DatumProcessor } from '../../../../models/medical/Datum'
import { getNormalizedTime } from '../../../time/TimeService'
import MedicalDataOptions from '../../../../models/medical/MedicalDataOptions'

const normalize = (rawData: Record<string, unknown>, _opts: MedicalDataOptions): BaseTime => {
  if (typeof rawData.time !== 'string') {
    throw new Error('Wrong data type for time field')
  }
  const timezone = rawData.timezone as string
  const out: BaseTime = {
    ...getNormalizedTime(rawData.time, timezone),
    timezone,
    guessedTimezone: false
  }
  return out
}

// Unused with partial types
const deduplicate = (data: BaseTime[], _opts: MedicalDataOptions): BaseTime[] => {
  return data
}

const BaseTimeService: DatumProcessor<BaseTime> = {
  normalize,
  deduplicate
}

export default BaseTimeService
