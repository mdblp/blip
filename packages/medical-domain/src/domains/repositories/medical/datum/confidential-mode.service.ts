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

import { DatumProcessor } from '../../../models/medical/datum.model'
import BaseDatumService from './basics/base-datum.service'
import ConfidentialMode from '../../../models/medical/datum/confidential-mode.model'
import DurationService from './basics/duration.service'
import DatumService from '../datum.service'
import MedicalDataOptions from '../../../models/medical/medical-data-options.model'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): ConfidentialMode => {
  const base = BaseDatumService.normalize(rawData, opts)
  const duration = DurationService.normalize(rawData, opts)
  const confidentialMode: ConfidentialMode = {
    ...base,
    ...duration,
    type: 'deviceEvent',
    subType: 'confidential',
    uploadId: rawData.uploadId as string,
    guid: rawData.guid as string,
    inputTime: rawData.inputTime as string
  }
  return confidentialMode
}

const deduplicate = (data: ConfidentialMode[], opts: MedicalDataOptions): ConfidentialMode[] => {
  return DatumService.deduplicate(data, opts) as ConfidentialMode[]
}

const ConfidentialModeService: DatumProcessor<ConfidentialMode> = {
  normalize,
  deduplicate
}

export default ConfidentialModeService
