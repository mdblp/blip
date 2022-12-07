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

import PumpSettings, {
  CgmConfig,
  DeviceConfig,
  ParameterConfig,
  ParametersChange,
  PumpConfig
} from '../../../models/medical/datum/PumpSettings'
import { DatumProcessor } from '../../../models/medical/Datum'
import BaseDatumService from './basics/BaseDatumService'
import DatumService from '../DatumService'
import MedicalDataOptions from '../../../models/medical/MedicalDataOptions'
import PumpManufacturer from '../../../models/medical/datum/enums/pump-manufacturer.enum'

const normalizeHistory = (rawHistory: Array<Record<string, unknown>>): ParametersChange[] => {
  return rawHistory.map(h => {
    const params = (h?.parameters ?? []) as Array<Record<string, string | number>>
    return {
      changeDate: (h?.changeDate ?? '') as string,
      parameters: params.map(p => ({
        changeType: p.changeType as string,
        effectiveDate: p.effectiveDate as string,
        level: p.level as number,
        name: p.name as string,
        unit: p.unit as string,
        value: p.value as string
      }))
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

const normalizeParameters = (rawParams: Array<Record<string, unknown>>): ParameterConfig[] => {
  return rawParams.map(rawParam => {
    return {
      effectiveDate: (rawParam?.effectiveDate ?? '') as string,
      level: (rawParam?.level ?? 1) as number,
      name: (rawParam?.name ?? '') as string,
      unit: (rawParam?.unit ?? '') as string,
      value: (rawParam?.value ?? '') as string
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
    type: 'pumpSettings',
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
      history: normalizeHistory(rawHistory),
      parameters: normalizeParameters(rawParams)
    }
  }
  return pumpSettings
}

const deduplicate = (data: PumpSettings[], opts: MedicalDataOptions): PumpSettings[] => {
  return DatumService.deduplicate(data, opts) as PumpSettings[]
}

const PumpSettingsService: DatumProcessor<PumpSettings> = {
  normalize,
  deduplicate
}

export default PumpSettingsService
