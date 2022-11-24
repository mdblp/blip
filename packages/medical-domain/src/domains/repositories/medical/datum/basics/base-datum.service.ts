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

import BaseDatum, { DatumType } from '../../../../models/medical/datum/basics/base-datum.model'
import { DatumProcessor } from '../../../../models/medical/datum.model'
import BaseTimeService from './base-time.service'
import MedicalDataOptions from '../../../../models/medical/medical-data-options.model'

/**
 * extracted from packages/tideline/js/tidelinedata.js
 */
function genRandomId(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  const hexID = new Array(16)
  for (let i = 0; i < array.length; i++) {
    const b = array[i]
    const hex = (b + 0x100).toString(16).substr(1)
    hexID[i] = hex
  }
  return hexID.join('')
}

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): BaseDatum => {
  const baseTime = BaseTimeService.normalize(rawData, opts)
  let id: string
  if (typeof rawData.id !== 'string') {
    id = genRandomId()
  } else {
    id = rawData.id
  }
  const out: BaseDatum = {
    ...baseTime,
    id,
    type: rawData.type as DatumType,
    source: (rawData.source ?? opts.defaultSource) as string
  }
  return out
}

// Unused with partial types
const deduplicate = (data: BaseDatum[], _opts: MedicalDataOptions): BaseDatum[] => {
  return data
}

const BaseDatumService: DatumProcessor<BaseDatum> = {
  normalize,
  deduplicate
}

export default BaseDatumService
