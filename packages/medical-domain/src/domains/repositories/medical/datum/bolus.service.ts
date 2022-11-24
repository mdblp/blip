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

import Bolus, { isBolusSubType } from '../../../models/medical/datum/bolus.model'
import { DatumProcessor } from '../../../models/medical/datum.model'
import BaseDatumService from './basics/base-datum.service'
import MedicalDataOptions from '../../../models/medical/medical-data-options.model'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): Bolus => {
  const base = BaseDatumService.normalize(rawData, opts)
  if (!isBolusSubType(rawData.subType)) {
    throw new Error(`Invalid bolus subType:${rawData.subType as string}`)
  }
  const bolus: Bolus = {
    ...base,
    type: 'bolus',
    subType: rawData.subType,
    uploadId: rawData.uploadId as string,
    normal: rawData.normal as number,
    prescriptor: rawData.prescriptor as string,
    wizard: null
  }
  if (rawData.expectedNormal) {
    bolus.expectedNormal = rawData.expectedNormal as number
  }
  if (rawData.insulinOnBoard) {
    bolus.insulinOnBoard = rawData.insulinOnBoard as number
  }
  if (rawData.part) {
    bolus.part = rawData.part as string
  }
  if (rawData.biphasicId) {
    bolus.biphasicId = rawData.biphasicId as string
  } else if (rawData.eventId) {
    bolus.biphasicId = rawData.eventId as string
  }

  return bolus
}

const deduplicate = (data: Bolus[], _opts: MedicalDataOptions): Bolus[] => {
  // group bolus by normal time
  const initialGroups: Record<string, Bolus[]> = {}
  const timeGroups = data.reduce((previous, current: Bolus) => {
    if (previous[current.normalTime] === undefined) {
      previous[current.normalTime] = []
    }
    previous[current.normalTime].push(current)
    return previous
  }, initialGroups)
  // Getting only one bolus with the same normal time taking the maximum normal value
  return Object.values(timeGroups).flatMap(value => {
    if (value.length <= 1) {
      return value
    }
    const maxNormal = Math.max(...value.map(v => v.normal))
    const bolus = value.find(v => {
      return v.normal === maxNormal
    })
    if (bolus) {
      return [bolus]
    }
    return []
  })
}

const BolusService: DatumProcessor<Bolus> = {
  normalize,
  deduplicate
}

export default BolusService
