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

import type PumpSettings from '../../../models/medical/datum/pump-settings.model'
import {
  type CgmConfig,
  type ChangeType,
  type DeviceConfig,
  type ParameterConfig,
  type ParametersChange,
  type PumpConfig
} from '../../../models/medical/datum/pump-settings.model'
import { type DatumProcessor } from '../../../models/medical/datum.model'
import BaseDatumService from './basics/base-datum.service'
import DatumService from '../datum.service'
import type MedicalDataOptions from '../../../models/medical/medical-data-options.model'
import type PumpManufacturer from '../../../models/medical/datum/enums/pump-manufacturer.enum'
import { getConvertedParamUnitAndValue } from '../../../utils/unit.util'
import type Unit from '../../../models/medical/datum/enums/unit.enum'
import { DatumType } from '../../../models/medical/datum/enums/datum-type.enum'
import { defaultWeekDaysFilter, type WeekDaysFilter } from '../../../models/time/date-filter.model'

const normalizeHistory = (rawHistory: Array<Record<string, unknown>>, opts: MedicalDataOptions): ParametersChange[] => {
  return rawHistory.map(h => {
    const params = (h?.parameters ?? []) as Array<Record<string, string | number>>
    return {
      changeDate: (h?.changeDate ?? '') as string,
      parameters: params.map(param => {
        const { unit, value } = getConvertedParamUnitAndValue(param.unit as Unit, param.value as string, opts.bgUnits)
        const { unit: previousUnit, value: previousValue } = getConvertedParamUnitAndValue(param.previousUnit as Unit, param.previousValue as string, opts.bgUnits)
        return {
          changeType: param.changeType as ChangeType,
          effectiveDate: param.effectiveDate as string,
          level: param.level as number,
          name: param.name as string,
          unit: unit as Unit,
          previousUnit: previousUnit as Unit,
          previousValue,
          value
        }
      })
    }
  })
}

const normalizeCgm = (rawCgm: Record<string, unknown>): CgmConfig => {
  return {
    apiVersion: (rawCgm?.apiVersion ?? '') as string,
    endOfLifeTransmitterDate: (rawCgm?.endOfLifeTransmitterDate ?? '') as string,
    expirationDate: (rawCgm?.expirationDate ?? '') as string,
    manufacturer: (rawCgm?.manufacturer ?? '') as string,
    name: (rawCgm?.name ?? '') as string,
    swVersionTransmitter: (rawCgm?.swVersionTransmitter ?? '') as string,
    transmitterId: (rawCgm?.transmitterId ?? '') as string
  }
}

const normalizeDevice = (rawDevice: Record<string, unknown>): DeviceConfig => {
  return {
    deviceId: (rawDevice?.deviceId ?? '') as string,
    imei: (rawDevice?.imei ?? '') as string,
    manufacturer: (rawDevice?.manufacturer ?? '') as string,
    name: (rawDevice?.name ?? '') as string,
    swVersion: (rawDevice?.swVersion ?? '') as string
  }
}

const normalizePump = (rawPump: Record<string, unknown>): PumpConfig => {
  const manufacturer = (rawPump?.manufacturer ?? '') as string
  return {
    expirationDate: (rawPump?.expirationDate ?? '') as string,
    manufacturer: manufacturer.toUpperCase() as PumpManufacturer,
    name: (rawPump?.name ?? '') as string,
    serialNumber: (rawPump?.serialNumber ?? '') as string,
    swVersion: (rawPump?.swVersion ?? '') as string
  }
}

const normalizeParameters = (rawParams: Array<Record<string, unknown>>, opts: MedicalDataOptions): ParameterConfig[] => {
  return rawParams.map(rawParam => {
    const {
      unit,
      value
    } = getConvertedParamUnitAndValue(rawParam.unit as Unit, rawParam.value as string, opts.bgUnits)
    return {
      effectiveDate: (rawParam?.effectiveDate ?? '') as string,
      level: (rawParam?.level ?? 1) as number,
      name: (rawParam?.name ?? '') as string,
      unit: unit as Unit,
      value
    }
  })
}

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): PumpSettings => {
  const base = BaseDatumService.normalize(rawData, opts)
  const payload = (rawData?.payload ?? {}) as Record<string, unknown>
  const rawCgm = (payload?.cgm ?? {}) as Record<string, unknown>
  const rawDevice = (payload?.device ?? {}) as Record<string, unknown>
  const rawPump = (payload?.pump ?? {}) as Record<string, unknown>
  const rawHistory = (payload?.history ?? []) as Array<Record<string, unknown>>
  const rawParams = (payload?.parameters ?? []) as Array<Record<string, unknown>>

  const pumpSettings: PumpSettings = {
    ...base,
    type: DatumType.PumpSettings,
    uploadId: rawData.uploadId as string,
    activeSchedule: rawData.activeSchedule as string,
    deviceId: rawData.deviceId as string,
    deviceTime: rawData.deviceTime as string,
    basalSchedules: (rawData?.basalSchedules ?? []) as object[],
    payload: {
      basalsecurityprofile: (payload?.basalsecurityprofile ?? {}) as object,
      cgm: normalizeCgm(rawCgm),
      device: normalizeDevice(rawDevice),
      pump: normalizePump(rawPump),
      history: normalizeHistory(rawHistory, opts),
      parameters: normalizeParameters(rawParams, opts)
    }
  }
  return pumpSettings
}

const deduplicate = (data: PumpSettings[], opts: MedicalDataOptions): PumpSettings[] => {
  return DatumService.deduplicate(data, opts) as PumpSettings[]
}

const filterOnDate = (data: PumpSettings[], start: number, end: number, weekDaysFilter: WeekDaysFilter = defaultWeekDaysFilter): PumpSettings[] => {
  return DatumService.filterOnDate(data, start, end, weekDaysFilter) as PumpSettings[]
}

const PumpSettingsService: DatumProcessor<PumpSettings> = {
  normalize,
  deduplicate,
  filterOnDate
}

export default PumpSettingsService
