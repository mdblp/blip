/*
 * Copyright (c) 2026, Diabeloop
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
import { CareTeamSettingsSection } from './care-team-settings-section.enum'
import { Info, Notifications } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import AnalyticsApi, { ElementType } from '../../lib/analytics/analytics.api'
import { SectionMenu } from '../../components/menus/section-menu/section-menu'

interface CareTeamSettingsMenuProps {
  selectedSection: CareTeamSettingsSection
  selectSection: (section: CareTeamSettingsSection) => void
}

export const CareTeamSettingsMenu: FC<CareTeamSettingsMenuProps> = (props) => {
  const { selectedSection, selectSection } = props
  const { t } = useTranslation()

  function handleClick(section: CareTeamSettingsSection) {
    selectSection(section)
    AnalyticsApi.trackClick(`care-team-settings-menu-${section}`, ElementType.Link)
  }

  const sections = [
    {
      label: t('info-and-members'),
      value: CareTeamSettingsSection.InfoAndMembers,
      testId: 'info-and-members-menu-button',
      icon: <Info fontSize="small" />
    },
    {
      label: t('monitoring-alerts'),
      value: CareTeamSettingsSection.MonitoringAlerts,
      testId: 'monitoring-alerts-menu-button',
      icon:  <Notifications fontSize="small" />
    }
  ]

  return (
    <SectionMenu<CareTeamSettingsSection>
      title={t('header-tab-care-team-settings')}
      sections={sections}
      selectedSection={selectedSection}
      selectSection={handleClick}
      testId="care-team-settings-menu"
    />
  )
}
