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

import Wizard from '../../../models/medical/datum/wizard.model'
import { DatumProcessor } from '../../../models/medical/datum.model'
import BaseDatumService from './basics/base-datum.service'
import DatumService from '../datum.service'
import MedicalDataOptions from '../../../models/medical/medical-data-options.model'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): Wizard => {
  const base = BaseDatumService.normalize(rawData, opts)
  const wizard: Wizard = {
    ...base,
    type: 'wizard',
    uploadId: rawData.uploadId as string,
    bolusId: (rawData?.bolus ?? '') as string,
    carbInput: rawData.carbInput as number,
    units: rawData.units as string,
    bolus: null
  }
  if (rawData.recommended) {
    const recommended = rawData?.recommended as Record<string, unknown>
    wizard.recommended = {
      carb: recommended.carb as number,
      correction: recommended.correction as number,
      net: recommended.net as number
    }
  }
  return wizard
}

const deduplicate = (data: Wizard[], opts: MedicalDataOptions): Wizard[] => {
  return DatumService.deduplicate(data, opts) as Wizard[]
}

const WizardService: DatumProcessor<Wizard> = {
  normalize,
  deduplicate
}

export default WizardService
