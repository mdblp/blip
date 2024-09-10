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

import type BaseTime from '../../../../models/medical/datum/basics/base-time.model'
import { type DatumProcessor } from '../../../../models/medical/datum.model'
import DatumService from '../../datum.service'
import type Datum from '../../../../models/medical/datum.model'
import { getNormalizedTime } from '../../../time/time.service'
import type MedicalDataOptions from '../../../../models/medical/medical-data-options.model'
import { type WeekDaysFilter, defaultWeekDaysFilter } from '../../../../models/time/date-filter.model'

const normalize = (rawData: Record<string, unknown>, _opts: MedicalDataOptions): BaseTime => {
  if (typeof rawData.time !== 'string') {
    throw new Error('Wrong data type for time field')
  }
  const timezone = rawData.timezone as string
  const out: BaseTime = {
    ...getNormalizedTime(rawData.time, timezone),
    timezone,
    guessedTimezone: false,
  }
  return out
}

// Unused with partial types
const deduplicate = (data: BaseTime[], _opts: MedicalDataOptions): BaseTime[] => {
  return data
}

const filterOnDate = (data: BaseTime[], start: number, end: number, weekDaysFilter: WeekDaysFilter = defaultWeekDaysFilter): BaseTime[] => {
  return DatumService.filterOnDate(data as Datum[], start, end, weekDaysFilter) as BaseTime[]
}

const BaseTimeService: DatumProcessor<BaseTime> = {
  normalize,
  deduplicate,
  filterOnDate
}

export default BaseTimeService
