/*
 * Copyright (c) 2021-2023, Diabeloop
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

import React, { type FunctionComponent, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Link from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'

import { REGEX_EMAIL } from '../../lib/utils'
import { diabeloopExternalUrls } from '../../lib/diabeloop-urls.model'
import { usePatientContext } from '../../lib/patient/patient.provider'
import { type PatientTeam } from '../../lib/patient/models/patient-team.model'
import { UserInvitationStatus } from '../../lib/team/models/enums/user-invitation-status.enum'
import { type Team, useTeam } from '../../lib/team'
import metrics from '../../lib/metrics'
import { useAlert } from '../utils/snackbar'
import { PATIENT_ALREADY_IN_TEAM_ERROR_MESSAGE } from '../../lib/patient/patient.api'
import { LoadingButton } from '@mui/lab'

export interface AddDialogProps {
  onClose: () => void
  onAddPatientSuccessful: (team: Team) => void
}

export const AddPatientDialog: FunctionComponent<AddDialogProps> = ({ onClose, onAddPatientSuccessful }) => {
  const alert = useAlert()
  const patientHook = usePatientContext()
  const { t } = useTranslation()
  const { teams, getTeam } = useTeam()
  const [email, setEmail] = useState<string>('')
  const [teamId, setTeamId] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [inProgress, setInProgress] = useState<boolean>(false)

  const isValidEmail = (mail = email): boolean => mail.length > 0 && REGEX_EMAIL.test(mail)

  const handleClickAdd = async (): Promise<void> => {
    if (isValidEmail() && teamId.length > 0) {
      await addPatient()
    } else {
      setErrorMessage(t('invalid-email'))
    }
  }

  const handleVerifyEmail = (): void => {
    if (email.length > 0 && !isValidEmail()) {
      setErrorMessage(t('invalid-email'))
    }
  }

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const inputEmail = event.target.value.trim()
    if (errorMessage !== null && isValidEmail(inputEmail)) {
      setErrorMessage(null)
    }
    setEmail(inputEmail)
    checkPatientInTeam(inputEmail, teamId)
  }

  const handleChangeTeam = (event: SelectChangeEvent<unknown>): void => {
    const inputTeamId = event.target.value as string
    setTeamId(inputTeamId)
    checkPatientInTeam(email, inputTeamId)
  }

  const checkPatientInTeam = (formEmail: string, formTeamId: string): void => {
    const patient = patientHook.getPatientByEmail(formEmail)
    const patientTeam = patient?.teams.find((team: PatientTeam) => team.teamId === formTeamId)

    if (patientTeam) {
      const isPatientPendingInTeam = patientTeam.status === UserInvitationStatus.pending

      if (isPatientPendingInTeam) {
        setErrorMessage(t('error-patient-already-invited'))
        return
      }
      setErrorMessage(t('error-patient-already-in-team'))
      return
    }

    if (errorMessage) {
      setErrorMessage(null)
    }
  }

  const addPatient = async (): Promise<void> => {
    try {
      setInProgress(true)
      const team = getTeam(teamId)
      await patientHook.invitePatient(team, email)
      alert.success(t('alert-invitation-sent-success'))
      metrics.send('invitation', 'send_invitation', 'patient')
      onAddPatientSuccessful(team)
    } catch (err: unknown) {
      const error = err as Error
      if (error.message === PATIENT_ALREADY_IN_TEAM_ERROR_MESSAGE) {
        alert.error(t('alert-invitation-patient-failed-already-invited'))
        return
      }
      alert.error(t('alert-invitation-patient-failed'))
    } finally {
      setInProgress(false)
    }
  }

  const termsOfUse = t('terms-of-use')
  const linkTerms = (
    <Link
      id="patient-list-dialog-add-warning-link-terms"
      aria-label={termsOfUse}
      href={diabeloopExternalUrls.terms}
      target="_blank"
      rel="noreferrer"
    >
      {termsOfUse}
    </Link>
  )
  const privacyPolicy = t('privacy-policy')
  const linkPrivacyPolicy = (
    <Link
      id="patient-list-dialog-add-warning-link-privacy"
      aria-label={privacyPolicy}
      href={diabeloopExternalUrls.privacyPolicy}
      target="_blank"
      rel="noreferrer"
    >
      {privacyPolicy}
    </Link>
  )

  return (
    <Dialog
      id="patient-list-dialog-add"
      aria-labelledby={t('add-patient')}
      open
      onClose={onClose}
    >
      <DialogTitle id="patient-list-dialog-add-title">
        <strong>{t('modal-add-patient')}</strong>
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column">
          <TextField
            id="patient-list-dialog-add-email"
            margin="normal"
            label={t('email')}
            value={email}
            required
            error={!!errorMessage}
            onBlur={handleVerifyEmail}
            onChange={handleChangeEmail}
            helperText={errorMessage}
          />
          <FormControl variant="standard">
            <InputLabel id="patient-list-dialog-add-team-label" htmlFor="patient-list-dialog-add-team-input">
              {t('team')}
            </InputLabel>
            <Select
              id="patient-list-dialog-add-team-input"
              data-testid="patient-team-selector"
              name="teamid"
              value={teamId}
              onChange={handleChangeTeam}
            >
              <MenuItem aria-label={t('none')} value="" />
              {teams.map((team) => (
                <MenuItem
                  id={`patient-list-dialog-add-team-option-${team.name}`}
                  value={team.id}
                  key={team.id}
                  aria-label={team.name}
                >
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box mt={2}>
            <DialogContentText id="patient-list-dialog-add-warning-line1">
              {t('modal-add-patient-warning-line1')}
            </DialogContentText>
          </Box>
          <Trans
            id="patient-list-dialog-add-warning-line2"
            data-testid="modal-add-patient-warning-line2"
            i18nKey="modal-add-patient-warning-line2"
            t={t}
            components={{ linkTerms, linkPrivacyPolicy }}
            values={{ terms: termsOfUse, privacyPolicy }}
            parent={DialogContentText}
          >
            Read our {linkTerms} and {linkPrivacyPolicy}.
          </Trans>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          id="patient-list-dialog-add-button-cancel"
          variant="outlined"
          onClick={onClose}
        >
          {t('button-cancel')}
        </Button>
        <LoadingButton
          id="patient-list-dialog-add-button-add"
          disabled={!!errorMessage || !isValidEmail() || teamId.length < 1}
          loading={inProgress}
          variant="contained"
          color="primary"
          disableElevation
          onClick={handleClickAdd}
        >
          {t('button-invite')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
