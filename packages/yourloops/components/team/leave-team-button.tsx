/**
 * Copyright (c) 2022, Diabeloop
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
import Button from '@material-ui/core/Button'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

import { Team, useTeam } from '../../lib/team'
import { commonComponentStyles } from '../common'
import { useAlert } from '../utils/snackbar'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import LeaveTeamDialog from '../dialogs/leave-team-dialog'
import TeamUtils from '../../lib/team/utils'
import { usePatientContext } from '../../lib/patient/provider'

export interface LeaveTeamButtonProps {
  team: Team
}

function LeaveTeamButton(props: LeaveTeamButtonProps): JSX.Element {
  const { team } = props
  const teamHook = useTeam()
  const patientHook = usePatientContext()
  const alert = useAlert()
  const { user } = useAuth()
  const historyHook = useHistory()
  const commonTeamClasses = commonComponentStyles()
  const { t } = useTranslation('yourloops')
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

  const onTeamLeft = async (hasLeft: boolean): Promise<void> => {
    if (hasLeft) {
      try {
        if (user.isUserPatient()) {
          await patientHook.leaveTeam(team.id)
        } else {
          await teamHook.leaveTeam(team)
        }
        const message = TeamUtils.teamHasOnlyOneMember(team) && !user.isUserPatient()
          ? t('team-page-success-deleted')
          : t('team-page-leave-success')
        alert.success(message)
        historyHook.push('/')
      } catch (reason: unknown) {
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
        className={commonTeamClasses.button}
        variant="contained"
        color="primary"
        disableElevation
        onClick={openLeaveTeamDialog}
      >
        <ExitToAppIcon className={commonTeamClasses.icon} />{t('button-team-leave')}
      </Button>
      {modalIsOpen && <LeaveTeamDialog team={team} onDialogResult={onTeamLeft} />}
    </React.Fragment>
  )
}

export default LeaveTeamButton
