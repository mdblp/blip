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
import React, { type FunctionComponent } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { type Patient } from '../../../lib/patient/models/patient.model'
import DialogContentText from '@mui/material/DialogContentText'
import { useReinvitePatientDialog } from './reinvite-patient-dialog.hook'
import { useParams } from 'react-router-dom'
import { useTeam } from '../../../lib/team'

interface ReinvitePatientDialogProps {
  patient: Patient
  onClose: () => void
  onSuccess: () => void
}

export const ReinvitePatientDialog: FunctionComponent<ReinvitePatientDialogProps> = (
  {
    patient,
    onClose,
    onSuccess
  }) => {
  const { t } = useTranslation('yourloops')
  const { teamId } = useParams()
  const { getTeam } = useTeam()
  const selectedTeam = getTeam(teamId)
  const {
    processing,
    handleOnClickReinvite
  } = useReinvitePatientDialog({ patient, onSuccess })

  const selectedTeamLabel = selectedTeam.name
  const patientEmail = patient.profile.email

  const title = t('modal-reinvite-patient-title')

  return (
    <Dialog
      open
      onClose={onClose}
    >
      <DialogTitle>
        <strong>{title}</strong>
      </DialogTitle>

      <DialogContent>
        <DialogContentText data-testid="modal-reinvite-patient-question">
          <Trans
            i18nKey="modal-reinvite-patient-question"
            t={t}
            components={{ strong: <strong /> }}
            values={{ patientEmail, selectedTeamName: selectedTeamLabel }}
            parent={React.Fragment}
          >
          </Trans>
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          {t('button-cancel')}
        </Button>
        <Button
          data-testid="reinvite-confirm"
          loading={processing}
          color="error"
          variant="contained"
          disableElevation
          onClick={handleOnClickReinvite}
        >
          {t('button-resend-invite')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
