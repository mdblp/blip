/*
 * Copyright (c) 2022-2023, Diabeloop
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

import PumpManufacturer from '../../../models/medical/datum/enums/pump-manufacturer.enum'
import type MedicalDataOptions from '../../../models/medical/medical-data-options.model'
import type ReservoirChange from '../../../models/medical/datum/reservoir-change.model'
import BaseDatumService from './basics/base-datum.service'
import { type PumpConfig } from '../../../models/medical/datum/pump-settings.model'
import DatumService from '../datum.service'
import { type DatumProcessor } from '../../../models/medical/datum.model'
import { DatumType } from '../../../models/medical/datum/enums/datum-type.enum'
import { type WeekDaysFilter, defaultWeekDaysFilter } from '../../../models/time/date-filter.model'
import { DeviceEventSubtype } from '../../../models/medical/datum/enums/device-event-subtype.enum'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): ReservoirChange => {
  const base = BaseDatumService.normalize(rawData, opts)
  const reservoirChange: ReservoirChange = {
    ...base,
    type: DatumType.DeviceEvent,
    subType: DeviceEventSubtype.ReservoirChange,
    pump: { manufacturer: PumpManufacturer.Default } as PumpConfig
  }
  return reservoirChange
}

const deduplicate = (data: ReservoirChange[], opts: MedicalDataOptions): ReservoirChange[] => {
  return DatumService.deduplicate(data, opts) as ReservoirChange[]
}

const filterOnDate = (data: ReservoirChange[], start: number, end: number, weekDaysFilter: WeekDaysFilter = defaultWeekDaysFilter): ReservoirChange[] => {
  return DatumService.filterOnDate(data, start, end, weekDaysFilter) as ReservoirChange[]
}

const ReservoirChangeService: DatumProcessor<ReservoirChange> = {
  normalize,
  deduplicate,
  filterOnDate
}

export default ReservoirChangeService
