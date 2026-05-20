/*
 * Copyright (c) 2024-2026, Diabeloop
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

import React, { FC } from 'react'
import { History, PhonelinkSetup } from '@mui/icons-material'
import { DeviceViewSection } from './device-view-section.enum'
import { useTranslation } from 'react-i18next'
import { DeviceSystemIcon } from '../../../components/icons/diabeloop/device-system-icon'
import AnalyticsApi, { ElementType } from '../../../lib/analytics/analytics.api'
import { SectionMenu } from '../../../components/menus/section-menu/section-menu'
import { BasalIcon } from '../../../components/icons/diabeloop/basal-icon'

interface DevicesViewMenuProps {
  shouldDisplaySafetyBasalProfile: boolean
  selectedSection: DeviceViewSection
  selectSection: (section: DeviceViewSection) => void
}

export const DevicesViewMenu: FC<DevicesViewMenuProps> = (props) => {
  const { t } = useTranslation()
  const { selectedSection, selectSection, shouldDisplaySafetyBasalProfile } = props

  function handleClick(section: DeviceViewSection) {
    selectSection(section)
    AnalyticsApi.trackClick(`device-view-section-${section}`, ElementType.Link)
  }

  const sections = [
    {
      label: t('current-parameters'),
      value: DeviceViewSection.CurrentParameters,
      testId: 'current-parameters-menu-button',
      icon: <PhonelinkSetup fontSize="small" />
    },
    ...shouldDisplaySafetyBasalProfile ? [{
      label: t('safety-basal-profile'),
      value: DeviceViewSection.SafetyBasalProfile,
      testId: 'safety-basal-profile-menu-button',
      icon: <BasalIcon fontSize="small" />
    }] : [],
    {
      label: t('change-history'),
      value: DeviceViewSection.ParametersChangeHistory,
      testId: 'change-history-menu-button',
      icon: <History fontSize="small" />
    },
    {
      label: t('device-change-history'),
      value: DeviceViewSection.DeviceChangeHistory,
      testId: 'device-change-history-menu-button',
      icon: <DeviceSystemIcon fontSize="small" />
    }
  ]

  return (
    <SectionMenu
      title={t('devices')}
      sections={sections}
      selectedSection={selectedSection}
      selectSection={handleClick}
      testId="devices-view-menu"
    />
  )
}
