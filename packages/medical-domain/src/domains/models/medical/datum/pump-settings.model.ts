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

import type BaseDatum from './basics/base-datum.model'
import type PumpManufacturer from './enums/pump-manufacturer.enum'
import { type DatumType } from './enums/datum-type.enum'
import type Unit from './enums/unit.enum'

export enum ChangeType {
  Added = 'added',
  Deleted = 'deleted',
  Updated = 'updated'
}

interface CgmConfig {
  apiVersion: string
  endOfLifeTransmitterDate: string
  expirationDate: string
  manufacturer: string
  name: string
  swVersionTransmitter: string
  transmitterId: string
}

interface DeviceConfig {
  deviceId: string
  imei: string
  manufacturer: string
  name: string
  swVersion: string
}

export interface PumpSettingsParameter {
  changeType: ChangeType
  effectiveDate: string
  level: number
  name: string
  unit: Unit
  value: string
  previousUnit?: Unit
  previousValue?: string
}

interface ParametersChange {
  changeDate: string
  parameters: PumpSettingsParameter[]
}

interface PumpConfig {
  manufacturer: PumpManufacturer
  name: string
  serialNumber: string
  swVersion: string
}

interface ParameterConfig {
  effectiveDate: string
  level: number
  name: string
  unit: Unit
  value: string
}

type PumpSettings = BaseDatum & {
  type: DatumType.PumpSettings
  basalSchedules: object[]
  activeSchedule: string
  deviceId: string
  deviceTime: string
  payload: {
    basalsecurityprofile: object
    cgm: CgmConfig
    device: DeviceConfig
    parameters: ParameterConfig[]
    history: ParametersChange[]
    pump: PumpConfig
  }
}

export default PumpSettings
export type { CgmConfig, DeviceConfig, ParametersChange, PumpConfig, ParameterConfig }
