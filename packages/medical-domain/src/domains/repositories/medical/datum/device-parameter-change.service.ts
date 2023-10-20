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

import type DeviceParameterChange from '../../../models/medical/datum/device-parameter-change.model'
import { type DatumProcessor } from '../../../models/medical/datum.model'
import BaseDatumService from './basics/base-datum.service'
import type MedicalDataOptions from '../../../models/medical/medical-data-options.model'
import type Unit from '../../../models/medical/datum/enums/unit.enum'
import { getConvertedParamUnitAndValue } from '../../../utils/unit.util'
import { DatumType } from '../../../models/medical/datum/enums/datum-type.enum'
import DatumService from '../datum.service'
import { defaultWeekDaysFilter, type WeekDaysFilter } from '../../../models/time/date-filter.model'
import { DeviceEventSubtype } from '../../../models/medical/datum/enums/device-event-subtype.enum'

/**
 * Used to regroup device parameters in one tooltip, when the changes are too close.
 * This is to avoid superpositions of the icons in the daily view.
 * Format: Duration in milliseconds.
 */
const DEVICE_PARAMS_OFFSET = 30 * 60 * 1000

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): DeviceParameterChange => {
  const base = BaseDatumService.normalize(rawData, opts)
  const { unit, value } = getConvertedParamUnitAndValue(rawData.units as Unit, rawData.value as string, opts.bgUnits)
  const { value: previousValue } = getConvertedParamUnitAndValue(rawData.units as Unit, rawData.previousValue as string, opts.bgUnits)
  const deviceParameterChange: DeviceParameterChange = {
    ...base,
    type: DatumType.DeviceEvent,
    subType: DeviceEventSubtype.DeviceParameter,
    params: [
      {
        id: base.id,
        epoch: base.epoch,
        timezone: base.timezone,
        name: rawData.name as string,
        level: rawData.level as string,
        units: unit as Unit,
        value,
        previousValue,
        lastUpdateDate: rawData.lastUpdateDate as string
      }
    ]
  }
  return deviceParameterChange
}

const deduplicate = (data: DeviceParameterChange[], _opts: MedicalDataOptions): DeviceParameterChange[] => {
  return data
}

const groupData = (data: DeviceParameterChange[]): DeviceParameterChange[] => {
  data.sort((param1, param2) => param1.epoch - param2.epoch)
  const groupedData: DeviceParameterChange[] = []
  let currentGroup: DeviceParameterChange | null = null
  data.forEach((currentParam) => {
    const paramList = currentParam.params.map(p => {
      p.timezone = currentParam.timezone
      return p
    })
    currentParam.params = paramList
    if (currentGroup === null) {
      currentGroup = currentParam
    } else {
      if ((currentParam.epoch - currentGroup.epoch) < DEVICE_PARAMS_OFFSET) {
        const aggregatedParams = currentGroup.params.concat(currentParam.params)
        // unique params based on id
        const uniqueParams = [...new Map(aggregatedParams.map(p => [p.id, p])).values()]
        currentGroup.params = uniqueParams
      } else {
        groupedData.push(currentGroup)
        currentGroup = currentParam
      }
    }
  })
  if (currentGroup !== null) {
    groupedData.push(currentGroup)
  }
  return groupedData
}

const filterOnDate = (data: DeviceParameterChange[], start: number, end: number, weekDaysFilter: WeekDaysFilter = defaultWeekDaysFilter): DeviceParameterChange[] => {
  return DatumService.filterOnDate(data, start, end, weekDaysFilter) as DeviceParameterChange[]
}

interface DeviceParameterProcessor {
  groupData: (data: DeviceParameterChange[]) => DeviceParameterChange[]
}

const DeviceParameterChangeService: DatumProcessor<DeviceParameterChange> & DeviceParameterProcessor = {
  normalize,
  deduplicate,
  filterOnDate,
  groupData
}

export default DeviceParameterChangeService
