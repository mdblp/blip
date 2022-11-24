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

import Datum, { DatumProcessor } from '../../models/medical/datum.model'
import MedicalDataOptions from '../../models/medical/medical-data-options.model'
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
import UploadService from './datum/upload.service'
import WarmUpService from './datum/warm-up.service'
import WizardService from './datum/wizard.service'
import ZenModeService from './datum/zen-mode.service'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): Datum => {
  let type = rawData.type
  if (type === undefined && rawData.messagetext) {
    type = 'message'
  }
  switch (type as string) {
    case 'basal':
      return BasalService.normalize(rawData, opts)
    case 'bolus':
      return BolusService.normalize(rawData, opts)
    case 'cbg':
      return CbgService.normalize(rawData, opts)
    case 'deviceEvent':
      switch (rawData.subType as string) {
        case 'confidential':
          return ConfidentialModeService.normalize(rawData, opts)
        case 'deviceParameter':
          return DeviceParameterChangeService.normalize(rawData, opts)
        case 'reservoirChange':
          return ReservoirChangeService.normalize(rawData, opts)
        case 'zen':
          return ZenModeService.normalize(rawData, opts)
        case 'warmup':
          return WarmUpService.normalize(rawData, opts)
        default:
          throw new Error(`Unknown deviceEvent subType ${rawData.subType as string}`)
      }
    case 'food':
      return MealService.normalize(rawData, opts)
    case 'message':
      return MessageService.normalize(rawData, opts)
    case 'physicalActivity':
      return PhysicalActivityService.normalize(rawData, opts)
    case 'pumpSettings':
      return PumpSettingsService.normalize(rawData, opts)
    case 'smbg':
      return SmbgService.normalize(rawData, opts)
    case 'upload':
      return UploadService.normalize(rawData, opts)
    case 'wizard':
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

const DatumService: DatumProcessor<Datum> = {
  normalize,
  deduplicate
}

export default DatumService
