/*
 * Copyright (c) 2024, Diabeloop
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

import type MedicalDataService from 'medical-domain'
import { Device } from '../../models/device.model'

export const isDBLG1 = (deviceName: string): boolean => {
  return deviceName.toUpperCase() === "DBLG1"
}

export const isDBLG2 = (deviceName: string): boolean => {
  return deviceName.toUpperCase() === "DBLG2"
}

export const isDeviceVersionHigherOrEqual = (device: Device, majorVersion: number, minorVersion: number): boolean => {
  if (device.majorVersion < majorVersion) {
    return false
  }
  return device.majorVersion > majorVersion || device.minorVersion >= minorVersion
}

// A version looks like "1.12.9.149-DBLG1-INS-DEXG6-COMMERCIAL"
const getDeviceMajorVersion = (deviceVersion: string): number => {
  return +deviceVersion.split('.')[0]
}

// A version looks like "1.12.9.149-DBLG1-INS-DEXG6-COMMERCIAL"
const getDeviceMinorVersion = (deviceVersion: string): number => {
  return +deviceVersion.split('.')[1]
}

export const buildDevice = (medicalData: MedicalDataService | null): Device | null => {
  if (!medicalData?.medicalData?.pumpSettings) {
    return null
  }
  const pumpSettings = medicalData.medicalData.pumpSettings
  if (pumpSettings.length === 0) {
    return null
  }
  const pumpSetting = pumpSettings[0]
  if (!pumpSetting.payload?.device) {
    return null
  }
  const pumpSettingDevice = pumpSetting.payload.device
  const name = pumpSettingDevice.name
  const softwareVersion = pumpSettingDevice.swVersion
  return {
    name,
    majorVersion: getDeviceMajorVersion(softwareVersion),
    minorVersion: getDeviceMinorVersion(softwareVersion)
  }
}
