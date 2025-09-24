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
import { addMilliseconds } from '../../time/time.service'
import type MedicalDataOptions from '../../../models/medical/medical-data-options.model'
import { DatumType } from '../../../models/medical/datum/enums/datum-type.enum'
import DatumService from '../datum.service'
import { defaultWeekDaysFilter, type WeekDaysFilter } from '../../../models/time/date-filter.model'
import { BasalDeliveryType } from '../../../models/medical/datum/enums/basal-delivery-type.enum'
import { Basal } from '../../../models/medical/datum/basal.model'

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
    type: DatumType.Basal,
    subType: rawData.deliveryType as BasalDeliveryType,
    deliveryType: rawData.deliveryType as BasalDeliveryType,
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
      tempBasalFound.subType = BasalDeliveryType.Automated
      tempBasalFound.deliveryType = BasalDeliveryType.Automated
      tempBasalFound.replace = basal.id
      basal.duration = 0
      basal.replacedBy = tempBasalFound.id
    }
  }
  return data
}

const filterOnDate = (data: Basal[], start: number, end: number, weekDaysFilter: WeekDaysFilter = defaultWeekDaysFilter): Basal[] => {
  return DatumService.filterOnDate(data, start, end, weekDaysFilter) as Basal[]
}

const BasalService: DatumProcessor<Basal> = {
  normalize,
  deduplicate,
  filterOnDate
}

export default BasalService
