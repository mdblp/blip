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

import { Datum, type DatumProcessor } from '../../models/medical/datum.model'
import type MedicalDataOptions from '../../models/medical/medical-data-options.model'
import AlarmEventService from './datum/alarm-event.service'
import BasalService from './datum/basal.service'
import BolusService from './datum/bolus.service'
import CbgService from './datum/cbg.service'
import ConfidentialModeService from './datum/confidential-mode.service'
import DeviceParameterChangeService from './datum/device-parameter-change.service'
import MealService from './datum/meal.service'
import MessageService from './datum/message.service'
import PhysicalActivityService from './datum/physical-activity.service'
import PumpSettingsService from './datum/pump-settings.service'
import ReservoirChangeService from './datum/reservoir-change.service'
import SmbgService from './datum/smbg.service'
import WarmUpService from './datum/warm-up.service'
import WizardService from './datum/wizard.service'
import ZenModeService from './datum/zen-mode.service'
import { isEpochBetweenBounds } from '../time/time.service'
import { isBasal } from '../../models/medical/datum/basal.model'
import { isDuration } from '../../models/medical/datum/basics/duration.model'
import { defaultWeekDaysFilter, type WeekDaysFilter } from '../../models/time/date-filter.model'
import { DatumType } from '../../models/medical/datum/enums/datum-type.enum';
import { DeviceEventSubtype } from '../../models/medical/datum/enums/device-event-subtype.enum';

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): Datum => {
  let type = rawData.type
  if (type === undefined && rawData.messagetext) {
    type = DatumType.Message
  }
  switch (type as DatumType) {
    case DatumType.Basal:
      return BasalService.normalize(rawData, opts)
    case DatumType.Bolus:
      return BolusService.normalize(rawData, opts)
    case DatumType.Cbg:
      return CbgService.normalize(rawData, opts)
    case DatumType.DeviceEvent:
      switch (rawData.subType as string) {
        case DeviceEventSubtype.Alarm:
          return AlarmEventService.normalize(rawData, opts)
        case DeviceEventSubtype.Confidential:
          return ConfidentialModeService.normalize(rawData, opts)
        case DeviceEventSubtype.DeviceParameter:
          return DeviceParameterChangeService.normalize(rawData, opts)
        case DeviceEventSubtype.ReservoirChange:
          return ReservoirChangeService.normalize(rawData, opts)
        case DeviceEventSubtype.Zen:
          return ZenModeService.normalize(rawData, opts)
        case DeviceEventSubtype.Warmup:
          return WarmUpService.normalize(rawData, opts)
        default:
          throw new Error(`Unknown deviceEvent subType ${rawData.subType as string}`)
      }
    case DatumType.Food:
      return MealService.normalize(rawData, opts)
    case DatumType.Message:
      return MessageService.normalize(rawData, opts)
    case DatumType.PhysicalActivity:
      return PhysicalActivityService.normalize(rawData, opts)
    case DatumType.PumpSettings:
      return PumpSettingsService.normalize(rawData, opts)
    case DatumType.Smbg:
      return SmbgService.normalize(rawData, opts)
    case DatumType.Wizard:
      return WizardService.normalize(rawData, opts)
    default:
      throw new Error(`Unknown datum type ${rawData.type as string}`)
  }
}

const deduplicate = (data: Datum[], _opts: MedicalDataOptions): Datum[] => {
  return data.flatMap((datum, index) => {
    const firstIndex = data.findIndex(element => element.id === datum.id)
    if (firstIndex === index) {
      return [datum]
    }
    return []
  })
}

export const filterOnDate = (data: Datum[], start: number, end: number, weekDaysFilter: WeekDaysFilter = defaultWeekDaysFilter): Datum[] => {
  return data.filter((dat: Datum) => {
    const isEpochStartInBounds = isEpochBetweenBounds(dat.epoch, start, end)
    if (dat.isoWeekday !== undefined && !weekDaysFilter[dat.isoWeekday]) {
      return false
    }
    if (isBasal(dat) || isDuration(dat)) {
      const isEpochEndInBounds = isEpochBetweenBounds(dat.epochEnd, start, end)
      return isEpochStartInBounds || isEpochEndInBounds
    }
    return isEpochStartInBounds
  })
}

const DatumService: DatumProcessor<Datum> = {
  normalize,
  deduplicate,
  filterOnDate
}

export default DatumService
