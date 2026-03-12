/*
 * Copyright (c) 2022-2026, Diabeloop
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

import React, { type FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTeam } from '../../lib/team'
import { useAuth } from '../../lib/auth'
import { useParams } from 'react-router-dom'
import { setPageTitle } from '../../lib/utils'
import { CareTeamSettingsSection } from './care-team-settings-section.enum'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { CareTeamSettingsMenu } from './care-team-settings-menu'
import { InfoAndMembersSection } from './sections/info-and-members-section'
import { MonitoringAlertsSection } from './sections/monitoring-alerts-section'
import Card from '@mui/material/Card'
import SpinningLoader from '../../components/loaders/spinning-loader'

export const CareTeamSettingsPage: FC = () => {
  const { getTeam } = useTeam()

  const { teamId } = useParams()
  const team = getTeam(teamId)
  const { user } = useAuth()
  const isUserHcp = user?.isUserHcp()

  const { t } = useTranslation('yourloops')

  setPageTitle(t('header-tab-care-team-settings'))

  const [selectedSection, setSelectedSection] = useState(CareTeamSettingsSection.InfoAndMembers)

  const selectSection = (section: CareTeamSettingsSection): void => {
    setSelectedSection(section)
  }

  const displaySelectedSection = (): JSX.Element => {
    switch (selectedSection) {
      case CareTeamSettingsSection.InfoAndMembers:
        return <InfoAndMembersSection team={team} isUserHcp={isUserHcp} />
      case CareTeamSettingsSection.MonitoringAlerts:
        return <MonitoringAlertsSection team={team} />
      default:
        return <></>
    }
  }

  return (
    <Container maxWidth="xl" sx={{ my: 6 }}>
      {
        team ?
          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            {user.isUserHcp() &&
              <Grid size={3}>
                <CareTeamSettingsMenu
                  selectedSection={selectedSection}
                  selectSection={selectSection}
                />
              </Grid>
            }
            <Grid size={9}>
              <Card variant="outlined" sx={{ px: 2, py: 5 }}>
                {displaySelectedSection()}
              </Card>
            </Grid>
          </Grid>
          : <SpinningLoader />
      }

    </Container>
  )
}
