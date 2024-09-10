/*
 * Copyright (c) 2022-2023, Diabeloop
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

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TuneIcon from '@mui/icons-material/Tune'

import { commonComponentStyles } from '../common'
import { type Team, useTeam } from '../../lib/team'
import { useAlert } from '../utils/snackbar'
import { type MonitoringAlertsParameters } from '../../lib/team/models/monitoring-alerts-parameters.model'
import { usePatientsContext } from '../../lib/patient/patients.provider'
import { TeamMemberRole } from '../../lib/team/models/enums/team-member-role.enum'
import { useAuth } from '../../lib/auth'
import {
  MonitoringAlertsTeamConfiguration
} from '../monitoring-alert/monitoring-alerts-team-configuration'
import { useParams } from 'react-router-dom'

export interface TeamMonitoringAlertsConfigurationProps {
  team: Team
}

function TeamMonitoringAlertsConfiguration(props: TeamMonitoringAlertsConfigurationProps): JSX.Element {
  const { team } = props
  const { classes: commonTeamClasses } = commonComponentStyles()
  const { t } = useTranslation('yourloops')
  const { refresh } = usePatientsContext()
  const alert = useAlert()
  const { user } = useAuth()
  const { teamId } = useParams()
  const { getTeam, updateTeam } = useTeam()
  const selectedTeam = getTeam(teamId)
  const [saveInProgress, setSaveInProgress] = useState<boolean>(false)

  const currentUserAsTeamMember = selectedTeam.members.find(member => member.userId === user.id)
  const isCurrentUserTeamAdmin = currentUserAsTeamMember?.role === TeamMemberRole.admin

  const save = async (monitoringAlertsParameters: MonitoringAlertsParameters): Promise<void> => {
    team.monitoringAlertsParameters = monitoringAlertsParameters
    setSaveInProgress(true)
    try {
      await updateTeam(team)
      refresh()
      alert.success(t('team-update-success'))
    } catch (error) {
      console.error(error)
      alert.error(t('team-update-error'))
    } finally {
      setSaveInProgress(false)
    }
  }

  return (
    <div className={commonTeamClasses.root} data-testid="team-monitoring-alerts-configuration">
      <div className={commonTeamClasses.categoryHeader}>
        <div data-stonlyid="care-team-settings-monitoring-alerts-configuration-title">
          <TuneIcon />
          <Typography className={commonTeamClasses.title} data-testid="monitoring-alert-configuration-section">
            {t('monitoring-alerts-configuration')}
          </Typography>
        </div>
      </div>

      <Box paddingX={3}>
        <MonitoringAlertsTeamConfiguration
          displayInReadonly={!isCurrentUserTeamAdmin}
          monitoringAlertsParameters={team.monitoringAlertsParameters}
          onSave={save}
          saveInProgress={saveInProgress}
        />
      </Box>
    </div>
  )
}

export default TeamMonitoringAlertsConfiguration
