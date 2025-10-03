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

import { type DatumProcessor } from '../../../models/medical/datum.model'
import BaseDatumService from './basics/base-datum.service'
import type ZenMode from '../../../models/medical/datum/zen-mode.model'
import DurationService from './basics/duration.service'
import DatumService from '../datum.service'
import type MedicalDataOptions from '../../../models/medical/medical-data-options.model'
import { DatumType } from '../../../models/medical/datum/enums/datum-type.enum'
import { type WeekDaysFilter, defaultWeekDaysFilter } from '../../../models/time/date-filter.model'
import { DeviceEventSubtype } from '../../../models/medical/datum/enums/device-event-subtype.enum'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): ZenMode => {
  const base = BaseDatumService.normalize(rawData, opts)
  const duration = DurationService.normalize(rawData, opts)
  const zenMode: ZenMode = {
    ...base,
    ...duration,
    type: DatumType.DeviceEvent,
    subType: DeviceEventSubtype.Zen,
    guid: rawData.guid as string,
    inputTime: rawData.inputTime as string,
    glycemiaOffset: rawData.glycemiaOffset as number | null,
    glycemiaTarget: rawData.glycemiaTarget as number | null,
    glycemiaUnits: rawData.glycemiaUnits as string | null
  }
  return zenMode
}

const deduplicate = (data: ZenMode[], opts: MedicalDataOptions): ZenMode[] => {
  return DatumService.deduplicate(data, opts) as ZenMode[]
}

const filterOnDate = (data: ZenMode[], start: number, end: number, weekDaysFilter: WeekDaysFilter = defaultWeekDaysFilter): ZenMode[] => {
  return DatumService.filterOnDate(data, start, end, weekDaysFilter) as ZenMode[]
}

const ZenModeService: DatumProcessor<ZenMode> = {
  normalize,
  deduplicate,
  filterOnDate
}

export default ZenModeService
