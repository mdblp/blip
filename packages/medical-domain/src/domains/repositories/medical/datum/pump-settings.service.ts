/*
 * Copyright (c) 2022-2024, Diabeloop
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

import {
  type CgmConfig,
  type ChangeType,
  type DeviceConfig, DeviceHistory, MobileAppConfig,
  type ParameterConfig,
  type ParametersChange,
  type PumpConfig,
  PumpSettings,
  SecurityBasalConfig,
  SecurityBasalRate
} from '../../../models/medical/datum/pump-settings.model'
import { type DatumProcessor } from '../../../models/medical/datum.model'
import BaseDatumService from './basics/base-datum.service'
import DatumService from '../datum.service'
import type MedicalDataOptions from '../../../models/medical/medical-data-options.model'
import PumpManufacturer from '../../../models/medical/datum/enums/pump-manufacturer.enum'
import { getConvertedParamUnitAndValue } from '../../../utils/unit.util'
import type Unit from '../../../models/medical/datum/enums/unit.enum'
import { DatumType } from '../../../models/medical/datum/enums/datum-type.enum'
import { defaultWeekDaysFilter, type WeekDaysFilter } from '../../../models/time/date-filter.model'
import i18next from 'i18next'
import { DeviceSystem } from '../../../models/medical/datum/enums/device-system.enum'

const t = i18next.t.bind(i18next)

const normalizeParamsHistory = (rawHistory: Array<Record<string, unknown>>, opts: MedicalDataOptions): ParametersChange[] => {
  return rawHistory.map(h => {
    const params = (h?.parameters ?? []) as Array<Record<string, string | number>>
    return {
      changeDate: (h?.changeDate ?? '') as string,
      parameters: params.map(param => {
        const { unit, value } = getConvertedParamUnitAndValue(param.unit as Unit, param.value as string, opts.bgUnits)
        const {
          unit: previousUnit,
          value: previousValue
        } = getConvertedParamUnitAndValue(param.previousUnit as Unit, param.previousValue as string, opts.bgUnits)
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

const normalizeDeviceHistory = (rawHistory: Array<Record<string, unknown>>): DeviceHistory[] => {
  return rawHistory.map(h => {
    const devices = (h?.devices ?? []) as Array<Record<string, string>>
    return {
      changeDate: (h?.changeDate ?? '') as string,
      devices: devices.map(device => {
        return {
          changeType: device.changeType as ChangeType,
          effectiveDate: device.effectiveDate,
          name: device.name,
          previousValue: device.previousValue,
          value: device.value
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
    name: (rawDevice?.name ?? '') as DeviceSystem,
    swVersion: (rawDevice?.swVersion ?? '') as string,
    smartphoneModel: (rawDevice?.smartphoneModel ?? '') as string,
    osVersion: (rawDevice?.osVersion ?? '') as string,
    operatingSystem: (rawDevice?.operatingSystem ?? '') as string
  }
}

const normalizePump = (rawPump: Record<string, unknown> | null): PumpConfig => {
  const notAvailableLabel = t('N/A')
  const manufacturer = (rawPump?.manufacturer ?? '') as string
  return {
    manufacturer: manufacturer?.toUpperCase() as PumpManufacturer || notAvailableLabel,
    product: (rawPump?.product ?? notAvailableLabel) as string,
    name: (rawPump?.name ?? notAvailableLabel) as string,
    serialNumber: (rawPump?.serialNumber ?? notAvailableLabel) as string,
    swVersion: (rawPump?.swVersion ?? notAvailableLabel) as string
  }
}

const normalizeMobileApplication = (rawMobileApplication: Record<string, unknown> | null): MobileAppConfig => {
  const notAvailableLabel = t('N/A')
  return {
    activationCode: (rawMobileApplication?.activationCode ?? '') as string,
    manufacturer: (rawMobileApplication?.manufacturer ?? '') as string,
    identifier: (rawMobileApplication?.identifier ?? '') as string,
    swVersion: (rawMobileApplication?.swVersion ?? notAvailableLabel) as string
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

const normalizeSecurityBasals = (rawSecurityBasals: Record<string, unknown>): SecurityBasalConfig => {
  return {
    rates: (rawSecurityBasals.rates ?? []) as SecurityBasalRate[],
  }
}

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): PumpSettings => {
  console.error("this method should not have been called")
  const base = BaseDatumService.normalize(rawData, opts)
  const payload = (rawData?.payload ?? {}) as Record<string, unknown>
  const rawCgm = (payload?.cgm ?? {}) as Record<string, unknown>
  const rawDevice = (payload?.device ?? {}) as Record<string, unknown>
  const rawPump = payload?.pump as Record<string, unknown> ?? null
  const rawHistory = (payload?.history ?? {}) as Record<string, unknown>
  const rawParamsHistory = (rawHistory.parameters ?? []) as Array<Record<string, unknown>>
  const rawDeviceHistory = (rawHistory.devices ?? []) as Array<Record<string, unknown>>
  const rawParams = (payload?.parameters ?? []) as Array<Record<string, unknown>>
  const rawSecurityBasals = (payload?.securityBasals ?? {}) as Record<string, unknown>
  const rawMobileApplication = (payload?.mobileApplication ?? {}) as Record<string, unknown>
  const pumpSettings: PumpSettings = {
    ...base,
    type: DatumType.PumpSettings,
    deviceId: rawData.deviceId as string,
    deviceTime: rawData.deviceTime as string,
    payload: {
      cgm: normalizeCgm(rawCgm),
      device: normalizeDevice(rawDevice),
      pump: normalizePump(rawPump),
      history: {
        parameters : normalizeParamsHistory(rawParamsHistory, opts),
        devices: normalizeDeviceHistory(rawDeviceHistory),
      },
      parameters: normalizeParameters(rawParams, opts),
      securityBasals: normalizeSecurityBasals(rawSecurityBasals),
      mobileApplication: normalizeMobileApplication(rawMobileApplication)
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
