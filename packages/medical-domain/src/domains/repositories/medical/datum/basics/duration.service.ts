/*
 * Copyright (c) 2022, Diabeloop
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import Duration from '../../../../models/medical/datum/basics/duration.model'
import { DatumProcessor } from '../../../../models/medical/datum.model'
import MedicalDataOptions from '../../../../models/medical/medical-data-options.model'
import { getNormalizedEnd } from '../../../time/time.service'

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
