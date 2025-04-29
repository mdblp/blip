/*
 * Copyright (c) 2022-2025, Diabeloop
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

import type Intensity from '../../../models/medical/datum/enums/intensity.enum'
import type MedicalDataOptions from '../../../models/medical/medical-data-options.model'
import BaseDatumService from './basics/base-datum.service'
import DurationService from './basics/duration.service'
import type PhysicalActivity from '../../../models/medical/datum/physical-activity.model'
import { type DatumProcessor } from '../../../models/medical/datum.model'
import { DatumType } from '../../../models/medical/datum/enums/datum-type.enum'
import DatumService from '../datum.service'
import { defaultWeekDaysFilter, type WeekDaysFilter } from '../../../models/time/date-filter.model'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): PhysicalActivity => {
  const base = BaseDatumService.normalize(rawData, opts)
  const duration = DurationService.normalize(rawData, opts)
  const isValidRawDataInputTime = typeof rawData.inputTime === 'string' && rawData.inputTime.trim() !== ''
  const inputTime = isValidRawDataInputTime ? rawData.inputTime as string : base.normalTime
  const name = rawData.name as string
  return {
    ...base,
    ...duration,
    type: DatumType.PhysicalActivity,
    guid: rawData.guid as string,
    reportedIntensity: rawData.reportedIntensity as Intensity,
    inputTime,
    name
  }
}

const deduplicate = (data: PhysicalActivity[], _opts: MedicalDataOptions): PhysicalActivity[] => {
  const initialGroups: Record<string, PhysicalActivity> = {}
  const eventIdGroups = data.reduce((previous, current: PhysicalActivity) => {
    // For each eventID take the most recent item
    if (
      previous[current.guid] === undefined ||
      previous[current.guid].inputTime < current.inputTime
    ) {
      previous[current.guid] = current
    }
    return previous
  }, initialGroups)
  // Filtering only object with positive duration
  return Object.values(eventIdGroups).filter(pa => pa.duration.value > 0)
}

const filterOnDate = (data: PhysicalActivity[], start: number, end: number, weekDaysFilter: WeekDaysFilter = defaultWeekDaysFilter): PhysicalActivity[] => {
  return DatumService.filterOnDate(data, start, end, weekDaysFilter) as PhysicalActivity[]
}

const PhysicalActivityService: DatumProcessor<PhysicalActivity> = {
  normalize,
  deduplicate,
  filterOnDate
}

export default PhysicalActivityService
