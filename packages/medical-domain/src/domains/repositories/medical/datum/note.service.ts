/*
 * Copyright (c) 2022-2026, Diabeloop
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

import type Note from '../../../models/medical/datum/note.model'
import { type DatumProcessor } from '../../../models/medical/datum.model'
import BaseDatumService from './basics/base-datum.service'
import DatumService from '../datum.service'
import type MedicalDataOptions from '../../../models/medical/medical-data-options.model'
import { DatumType } from '../../../models/medical/datum/enums/datum-type.enum'
import { type WeekDaysFilter, defaultWeekDaysFilter } from '../../../models/time/date-filter.model'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): Note => {
  rawData.time = rawData.timestamp
  rawData.timezone = rawData.timezone ?? 'UTC'
  const base = BaseDatumService.normalize(rawData, opts)
  const rawUser = (rawData?.user ?? {}) as Record<string, unknown>
  const note: Note = {
    ...base,
    type: DatumType.Note,
    userid: rawData.userid as string,
    groupid: rawData.groupid as string,
    messageText: rawData.messagetext as string,
    parentMessage: rawData.parentmessage ? rawData.parentmessage as string : null,
    user: {
      fullName: (rawUser?.fullName ?? '') as string
    }
  }
  return note
}

const deduplicate = (data: Note[], opts: MedicalDataOptions): Note[] => {
  return DatumService.deduplicate(data, opts) as Note[]
}

const filterOnDate = (data: Note[], start: number, end: number, weekDaysFilter: WeekDaysFilter = defaultWeekDaysFilter): Note[] => {
  return DatumService.filterOnDate(data, start, end, weekDaysFilter) as Note[]
}

const NoteService: DatumProcessor<Note> = {
  normalize,
  deduplicate,
  filterOnDate
}

export default NoteService
