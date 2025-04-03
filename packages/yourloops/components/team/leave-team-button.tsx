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
import Button from '@mui/material/Button'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

import { type Team, useTeam } from '../../lib/team'
import { useAlert } from '../utils/snackbar'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import LeaveTeamDialog from '../dialogs/leave-team-dialog'
import TeamUtils from '../../lib/team/team.util'
import { useTheme } from '@mui/material/styles'
import PatientApi from '../../lib/patient/patient.api'
import metrics from '../../lib/metrics'
import { AppUserRoute } from '../../models/enums/routes.enum'
import { logError } from '../../utils/error.util'
import { errorTextFromException } from '../../lib/utils'

export interface LeaveTeamButtonProps {
  team: Team
}

function LeaveTeamButton(props: LeaveTeamButtonProps): JSX.Element {
  const { team } = props
  const { leaveTeam: leaveTeamAsHcp, refresh: refreshTeams, getDefaultTeamId } = useTeam()
  const alert = useAlert()
  const { user } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const { t } = useTranslation('yourloops')
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

  const leaveTeamAsPatient = async (): Promise<void> => {
    await PatientApi.removePatient(team.id, user.id)
    alert.success(t('team-page-leave-success'))
    metrics.send('team_management', 'leave_team')
    refreshTeams()
  }

  const onTeamLeft = async (hasLeft: boolean): Promise<void> => {
    if (hasLeft) {
      try {
        if (user.isUserPatient()) {
          await leaveTeamAsPatient()
          navigate(AppUserRoute.Dashboard)
        } else {
          await leaveTeamAsHcp(team)
          const message = TeamUtils.teamHasOnlyOneMember(team)
            ? t('team-page-success-deleted')
            : t('team-page-leave-success')
          alert.success(message)
          const defaultTeamId = getDefaultTeamId()
          navigate(`/teams/${defaultTeamId}/patients`)
        }
      } catch (reason: unknown) {
        const errorMessage = errorTextFromException(reason)
        logError(errorMessage, 'leave-team')

        const message = TeamUtils.teamHasOnlyOneMember(team) && !user.isUserPatient()
          ? t('team-page-failure-deleted')
          : t('team-page-failed-leave')
        alert.error(message)
      }
    } else {
      setModalIsOpen(false)
    }
  }

  const openLeaveTeamDialog = (): void => {
    setModalIsOpen(true)
  }

  return (
    <React.Fragment>
      <Button
        data-testid="leave-team-button"
        startIcon={<ExitToAppIcon />}
        variant="contained"
        color="primary"
        disableElevation
        sx={{ marginRight: theme.spacing(2) }}
        onClick={openLeaveTeamDialog}
      >
        {t('button-team-leave')}
      </Button>
      {modalIsOpen && <LeaveTeamDialog team={team} onDialogResult={onTeamLeft} />}
    </React.Fragment>
  )
}

export default LeaveTeamButton
