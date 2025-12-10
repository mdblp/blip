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
import { useCancelInvitePatientDialog } from './cancel-invite-patient-dialog.hook'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'

interface CancelInvitePatientDialogProps {
  patient: Patient | null
  onClose: () => void
}

export const CancelInvitePatientDialog: FunctionComponent<CancelInvitePatientDialogProps> = ({ onClose, patient }) => {
  const { t } = useTranslation('yourloops')
  const {
    processing,
    handleOnClickCancelInvite
  } = useCancelInvitePatientDialog({ patient, onClose })

  return (
    <Dialog
      open
      onClose={onClose}
    >
      <DialogTitle>
        <strong>{t('modal-cancel-patient-invite-title')}</strong>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          <Trans
            i18nKey="modal-cancel-patient-invite-question"
            t={t}
            components={{ strong: <strong /> }}
            values={{ patientEmail: patient.profile.email }}
            parent={React.Fragment}
          />
        </DialogContentText>
        <Box mt={2}>
          <Alert severity="info">{t('modal-cancel-patient-invite-info')}</Alert>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          {t('modal-cancel-patient-invite-button-keep')}
        </Button>
        <Button
          loading={processing}
          data-testid="cancel-patient-invite-button"
          color="error"
          variant="contained"
          disableElevation
          onClick={handleOnClickCancelInvite}
        >
          {t('modal-cancel-patient-invite-button-cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
