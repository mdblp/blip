/*
 * Copyright (c) 2023, Diabeloop
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
  type DeviceConfig,
  type ParameterConfig,
  type ParametersChange,
  type PumpConfig,
  type PumpSettings
} from 'medical-domain'
import type MedicalDataService from 'medical-domain'
import { useTranslation } from 'react-i18next'
import textTable from 'text-table'
import { formatParameterValue } from './utils/device.utils'
import { useEffect } from 'react'
import moment from 'moment'

interface UseDeviceSettingsReturn {
  cgm: CgmConfig
  copySettingsToClipboard: () => Promise<void>
  device: DeviceConfig
  history: ParametersChange[]
  lastUploadDate: string
  parameters: ParameterConfig[]
  pump: PumpConfig
}

export const useDevice = (medicalData: MedicalDataService): UseDeviceSettingsReturn => {
  const { t } = useTranslation()
  const pumpSettings = [...medicalData.grouped.pumpSettings].pop() as PumpSettings
  const { device, pump, cgm, parameters, history } = pumpSettings.payload
  const lastUploadDate = moment.tz(pumpSettings.normalTime, 'UTC').tz(new Intl.DateTimeFormat().resolvedOptions().timeZone).format('LLLL')

  const formatParameters = (): void => {
    parameters.forEach(parameter => {
      parameter.value = formatParameterValue(parameter.value, parameter.unit)
    })
  }

  const copySettingsToClipboard = async (): Promise<void> => {
    let rawText = `${lastUploadDate}\n\n`
    rawText += `-- ${t('Device')} --\n`
    rawText += textTable([
      [t('Manufacturer'), device.manufacturer],
      [t('Identifier'), device.deviceId],
      [t('IMEI'), device.imei],
      [t('Software version'), device.swVersion]]
    ) as string
    rawText += `\n\n-- ${t('Parameters')} --\n`

    const parametersTable = [[
      t('Name'),
      t('Value'),
      t('Unit')
    ]]
    parameters.forEach((parameter) => {
      parametersTable.push([t(`params|${parameter.name}`), parameter.value, parameter.unit])
    })
    rawText += textTable(parametersTable, { align: ['l', 'r', 'l'] }) as string

    try {
      await navigator.clipboard.writeText(rawText)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    formatParameters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { copySettingsToClipboard, lastUploadDate, parameters, device, cgm, pump, history }
}
