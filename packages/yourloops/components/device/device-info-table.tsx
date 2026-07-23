/*
 * Copyright (c) 2023-2026, Diabeloop
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

import { type DeviceConfig } from 'medical-domain'
import React, { type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { GenericListCard } from './generic-list-card'

interface DeviceInfoProps {
  device: DeviceConfig
}

export const DeviceInfoTable: FC<DeviceInfoProps> = ({ device }) => {
  const { t } = useTranslation()

  const getTableLines = (device: DeviceConfig): { value: string, label: string }[] => {
    return [
      { label: t('Manufacturer'), value: device.manufacturer },
      { label: t('Identifier'), value: device.deviceId },
      { label: t('IMEI'), value: device.imei },
      { label: t('Software version'), value: device.swVersion },
    ]
  }

  return (
    <GenericListCard
      title={device.name}
      tableLines={getTableLines(device)}
      data-testid="settings-table-terminal"
    />
  )
}
