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

import Upload from '../../../models/medical/datum/upload.model'
import { DatumProcessor } from '../../../models/medical/datum.model'
import BaseDatumService from './basics/base-datum.service'
import DatumService from '../datum.service'
import MedicalDataOptions from '../../../models/medical/medical-data-options.model'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): Upload => {
  const base = BaseDatumService.normalize(rawData, opts)
  const _deduplicator = (rawData?._deduplicator ?? {}) as Record<string, string>
  const client = (rawData?.client ?? {}) as Record<string, string>

  const upload: Upload = {
    ...base,
    type: 'upload',
    uploadId: rawData.uploadId as string,
    _dataState: rawData._dataState as string,
    _state: rawData._state as string,
    dataSetType: rawData.dataSetType as string,
    deviceManufacturers: (rawData?.deviceManufacturers ?? []) as string[],
    deviceModel: rawData.deviceModel as string,
    deviceTags: (rawData?.deviceTags ?? []) as string[],
    revision: rawData.revision as string,
    version: rawData.version as string,
    _deduplicator: {
      name: (_deduplicator?.name ?? ''),
      version: (_deduplicator?.version ?? '')
    },
    client: {
      name: (client?.name ?? ''),
      version: (client?.version ?? '')
    }

  }
  return upload
}

const deduplicate = (data: Upload[], opts: MedicalDataOptions): Upload[] => {
  return DatumService.deduplicate(data, opts) as Upload[]
}

const UploadService: DatumProcessor<Upload> = {
  normalize,
  deduplicate
}

export default UploadService
