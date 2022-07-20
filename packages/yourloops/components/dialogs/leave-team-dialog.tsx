/**
 * Copyright (c) 2021, Diabeloop
 * Team dialog to leave a team
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

import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import { Team } from '../../lib/team'
import { useAuth } from '../../lib/auth'
import { makeButtonsStyles } from '../theme'
import TeamUtils from '../../lib/team/utils'

export interface LeaveTeamDialogProps {
  team: Readonly<Team>
  onDialogResult: (result: boolean) => void
}

interface LeaveTeamDialogElementsProps {
  team: Team
  teamName: string
  isUserPatient: boolean
  onlyHcpMember: boolean
  userIsTheOnlyAdministrator: boolean
  handleClose: () => void
  handleLeaveTeam: () => void
}

const makeButtonsClasses = makeStyles(makeButtonsStyles, { name: 'YlpLeaveTeamDialogButtons' })

function LeaveTeamDialogTitle(props: LeaveTeamDialogElementsProps): JSX.Element {
  const { teamName, onlyHcpMember, userIsTheOnlyAdministrator } = props
  const { t } = useTranslation('yourloops')

  let msg
  if (onlyHcpMember) {
    msg = t('team-leave-dialog-and-del-title')
  } else if (userIsTheOnlyAdministrator) {
    msg = t('team-leave-dialog-only-admin-title')
  } else {
    msg = t('team-leave-dialog-title')
  }

  return (
    <DialogTitle>
      <strong data-testid="team-leave-dialog-title">{msg}</strong>
      <br />
      <span id="team-leave-dialog-title-team-name">{teamName}</span>
    </DialogTitle>
  )
}

function LeaveTeamDialogContent(props: LeaveTeamDialogElementsProps): JSX.Element {
  const { teamName, onlyHcpMember, userIsTheOnlyAdministrator, isUserPatient } = props
  const { t } = useTranslation('yourloops')

  let question: JSX.Element
  let consequences: JSX.Element

  if (onlyHcpMember) {
    question = (
      <DialogContentText color="textPrimary" data-testid="team-leave-dialog-question">
        <Trans
          i18nKey="team-leave-dialog-and-del-question"
          t={t}
          components={{ strong: <strong /> }}
          values={{ teamName }}
          parent={React.Fragment}
        />
      </DialogContentText>
    )
    consequences = (
      <DialogContentText color="textPrimary" data-testid="team-leave-dialog-consequences">
        {t('team-leave-dialog-and-del-consequences')}
      </DialogContentText>
    )
  } else if (userIsTheOnlyAdministrator) {
    consequences = (
      <DialogContentText color="textPrimary" data-testid="team-leave-dialog-consequences">
        <Trans
          i18nKey="team-leave-dialog-only-admin-consequences"
          t={t}
          components={{ strong: <strong /> }}
          parent={React.Fragment}
        />
      </DialogContentText>
    )
  } else {
    question = (
      <DialogContentText color="textPrimary" data-testid="team-leave-dialog-question">
        {t('team-leave-dialog-question')}
      </DialogContentText>
    )
    consequences = (
      <DialogContentText color="textPrimary" data-testid="team-leave-dialog-consequences">
        {t('team-leave-dialog-consequences')}
      </DialogContentText>
    )
  }

  return (
    <DialogContent>
      {question}
      {!isUserPatient && consequences}
    </DialogContent>
  )
}

function LeaveTeamDialogActions(props: LeaveTeamDialogElementsProps): JSX.Element {
  const { onlyHcpMember, userIsTheOnlyAdministrator, handleClose, handleLeaveTeam } = props
  const buttonClasses = makeButtonsClasses()

  const { t } = useTranslation('yourloops')

  let buttonOK: JSX.Element
  let buttonCancel: JSX.Element = (
    <Button
      id="team-leave-dialog-button-cancel"
      onClick={handleClose}
    >
      {t('button-cancel')}
    </Button>
  )

  if (onlyHcpMember) {
    buttonOK = (
      <Button
        id="team-leave-dialog-button-leave"
        onClick={handleLeaveTeam}
        className={buttonClasses.alertActionButton}
        variant="contained"
        disableElevation
      >
        {t('team-leave-dialog-button-leave-and-del')}
      </Button>
    )
  } else if (userIsTheOnlyAdministrator) {
    buttonOK = (
      <Button
        id="team-leave-dialog-button-ok"
        color="primary"
        variant="contained"
        disableElevation
        onClick={handleClose}
      >
        {t('button-ok')}
      </Button>
    )
    buttonCancel = undefined
  } else {
    buttonOK = (
      <Button
        className={buttonClasses.alertActionButton}
        id="team-leave-dialog-button-leave"
        color="primary"
        variant="contained"
        disableElevation
        onClick={handleLeaveTeam}
      >
        {t('team-leave-dialog-button-leave')}
      </Button>
    )
  }

  return (
    <DialogActions>
      {buttonCancel}
      {buttonOK}
    </DialogActions>
  )
}

function LeaveTeamDialog(props: LeaveTeamDialogProps): JSX.Element {
  const { team, onDialogResult } = props
  const auth = useAuth()
  const { t } = useTranslation('yourloops')
  const teamName = team.name
  const isUserPatient = auth.user.isUserPatient()
  const onlyHcpMember = auth.user.isUserHcp() && TeamUtils.getNumMedicalMembers(team) < 2
  const userIsTheOnlyAdministrator = TeamUtils.isUserTheOnlyAdministrator(team, auth.user?.id)

  const ariaTitle = t('aria-team-leave-dialog-title')
  const ariaQuestion = t('aria-team-leave-dialog-question', { teamName })

  const handleClose = (): void => {
    onDialogResult(false)
  }
  const handleLeaveTeam = (): void => {
    onDialogResult(true)
  }

  const dialogProps: LeaveTeamDialogElementsProps = {
    team,
    teamName,
    isUserPatient,
    onlyHcpMember,
    userIsTheOnlyAdministrator,
    handleClose,
    handleLeaveTeam
  }

  return (
    <Dialog
      id="team-leave-dialog"
      open
      maxWidth="sm"
      fullWidth
      aria-labelledby={ariaTitle}
      aria-describedby={ariaQuestion}
      onClose={handleClose}
    >
      <LeaveTeamDialogTitle {...dialogProps} />
      <LeaveTeamDialogContent {...dialogProps} />
      <LeaveTeamDialogActions {...dialogProps} />
    </Dialog>
  )
}

export default LeaveTeamDialog
