/*
 * Copyright (c) 2021-2025, Diabeloop
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
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'

import { errorTextFromException, REGEX_EMAIL } from '../../../lib/utils'
import { diabeloopExternalUrls } from '../../../lib/diabeloop-urls.model'
import { usePatientsContext } from '../../../lib/patient/patients.provider'
import { UserInviteStatus } from '../../../lib/team/models/enums/user-invite-status.enum'
import { type Team, useTeam } from '../../../lib/team'
import metrics from '../../../lib/metrics'
import { useAlert } from '../../utils/snackbar'
import { PATIENT_ALREADY_IN_TEAM_ERROR_MESSAGE } from '../../../lib/patient/patient.api'
import { useParams } from 'react-router-dom'
import { logError } from '../../../utils/error.util'

export interface AddDialogProps {
  onClose: () => void
  onAddPatientSuccessful: (team: Team) => void
}

export const InvitePatientDialog: FunctionComponent<AddDialogProps> = ({ onClose, onAddPatientSuccessful }) => {
  const alert = useAlert()
  const patientsHook = usePatientsContext()
  const { t } = useTranslation()
  const [email, setEmail] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [inProgress, setInProgress] = useState<boolean>(false)
  const { teamId } = useParams()
  const { getTeam } = useTeam()
  const selectedTeam = getTeam(teamId)

  const isValidEmail = (mail = email): boolean => mail.length > 0 && REGEX_EMAIL.test(mail)

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const inputEmail = event.target.value.trim()
    if (errorMessage !== null) {
      setErrorMessage(null)
    }

    setEmail(inputEmail)

    if (!isValidEmail(inputEmail)) {
      setErrorMessage(t('invalid-email'))
      return
    }
    checkPatientInTeam(inputEmail)
  }

  const checkPatientInTeam = (formEmail: string): void => {
    const patient = patientsHook.getPatientByEmail(formEmail)

    if (patient) {
      const isPatientPendingInTeam = patient.invitationStatus === UserInviteStatus.Pending

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
      await patientsHook.invitePatient(selectedTeam, email)
      alert.success(t('alert-invite-sent-success'))
      metrics.send('invitation', 'send_invitation', 'patient')
      onAddPatientSuccessful(selectedTeam)
    } catch (err: unknown) {
      const error = err as Error
      if (error.message === PATIENT_ALREADY_IN_TEAM_ERROR_MESSAGE) {
        alert.error(t('alert-invite-patient-failed-already-invited'))
        return
      }
      const errorMessage = errorTextFromException(err)
      logError(errorMessage, 'invite-patient')

      alert.error(t('alert-invite-patient-failed'))
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
        <strong>{t('modal-add-patient', { selectedCareTeam: selectedTeam.name })}</strong>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column"
          }}>
          <Alert severity="info">{t('modal-add-patient-info')}</Alert>
          <TextField
            id="patient-list-dialog-add-email"
            margin="normal"
            label={t('email')}
            value={email}
            required
            error={!!errorMessage}
            onChange={handleChangeEmail}
            helperText={errorMessage}
          />
          <Box sx={{ mt: 2 }}>
            <DialogContentText id="patient-list-dialog-add-warning-line1">
              {t('modal-add-patient-warning-line1')}
            </DialogContentText>
          </Box>
          <Box sx={{ mt: 1 }}>
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
        <Button
          id="patient-list-dialog-add-button-add"
          disabled={!!errorMessage || !isValidEmail()}
          loading={inProgress}
          variant="contained"
          color="primary"
          disableElevation
          onClick={addPatient}
        >
          {t('button-invite')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
