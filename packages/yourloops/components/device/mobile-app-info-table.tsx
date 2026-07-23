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

import { type DeviceConfig, MobileAppConfig } from 'medical-domain'
import React, { type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { formatCode } from '../../utils/format.utils'
import { GenericListCard } from './generic-list-card'

interface MobileApplicationInfoProps {
  app: MobileAppConfig,
  device: DeviceConfig
}

export const MobileAppInfoTable: FC<MobileApplicationInfoProps> = ({ app, device }) => {
  const { t } = useTranslation()

  const getTableLines = (app: MobileAppConfig, device: DeviceConfig): { value: string, label: string }[] => {
    return [
      { label: t('Manufacturer'), value: app?.manufacturer?.toUpperCase() },
      { label: t('Name'), value: device.name },
      { label: t('Software version'), value: app.swVersion },
      { label: t('activation-code'), value: formatCode(app.activationCode) },
      { label: t('Identifier'), value: app.identifier },
      { label: t('smartphone-model'), value: device.smartphoneModel },
      { label: t('smartphone-os-version'), value: device.osVersion }
    ]
  }

  return (
    <GenericListCard
      title={t('mobile-application')}
      tableLines={getTableLines(app, device)}
      data-testid="settings-table-mobileapp"
    />
  )
}
