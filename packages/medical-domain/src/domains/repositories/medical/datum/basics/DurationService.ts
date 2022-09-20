import Duration from '../../../../models/medical/datum/basics/Duration'
import { DatumProcessor } from '../../../../models/medical/Datum'
import MedicalDataOptions from '../../../../models/medical/MedicalDataOptions'
import { getNormalizedEnd } from '../../../time/TimeService'

const normalize = (rawData: Record<string, unknown>, _opts: MedicalDataOptions): Duration => {
  if (typeof rawData.time !== 'string') {
    throw new Error('Wrong data type for time field')
  }
  const strTime = rawData.time
  const rawDuration = (rawData?.duration ?? {}) as Record<string, unknown>
  const duration = {
    units: (rawDuration?.units ?? 'hours') as string,
    value: (rawDuration?.value ?? 0) as number
  }
  const out: Duration = {
    duration,
    ...getNormalizedEnd(strTime, duration.value, duration.units)
  }
  return out
}

// Unused with partial types
const deduplicate = (data: Duration[], _opts: MedicalDataOptions): Duration[] => {
  return data
}

const DurationService: DatumProcessor<Duration> = {
  normalize,
  deduplicate
}

export default DurationService
