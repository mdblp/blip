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
import useRemovePatientDialog from './remove-patient-dialog.hook'
import { type Patient } from '../../../lib/patient/models/patient.model'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import DialogContentText from '@mui/material/DialogContentText'
import { useParams } from 'react-router-dom'
import { useTeam } from '../../../lib/team'
import TeamUtils from '../../../lib/team/team.util'

interface RemovePatientDialogProps {
  patient: Patient | null
  onClose: () => void
}

const RemovePatientDialog: FunctionComponent<RemovePatientDialogProps> = ({ onClose, patient }) => {
  const { t } = useTranslation('yourloops')
  const { teamId } = useParams()
  const { getTeam } = useTeam()
  const {
    processing,
    handleOnClickRemove,
    patientName
  } = useRemovePatientDialog({ patient, onClose })

  const isSelectedTeamPrivate = TeamUtils.isPrivate(teamId)
  const selectedTeamLabel = isSelectedTeamPrivate ? t('my-private-practice') : getTeam(teamId).name

  const title = t('modal-remove-patient-title', {
    patientName,
    teamName: selectedTeamLabel
  })

  return (
    <Dialog
      id="remove-hcp-patient-dialog"
      data-testid="remove-hcp-patient-dialog"
      open
      onClose={onClose}
    >
      <DialogTitle>
        <strong>{title}</strong>
      </DialogTitle>

      <DialogContent>
        <DialogContentText data-testid="modal-remove-patient-question">
          <Trans
            i18nKey="modal-remove-patient-question"
            t={t}
            components={{ strong: <strong /> }}
            values={{ patientName, selectedTeamName: selectedTeamLabel }}
            parent={React.Fragment}
          >
          </Trans>
        </DialogContentText>

        <DialogContentText>
          {isSelectedTeamPrivate ? t('modal-remove-patient-from-private-practice-info') : t('modal-remove-patient-from-team-info')}
        </DialogContentText>

        <Box sx={{ mt: 2 }}>
          <Alert severity="info">
            {t('modal-remove-patient-alert-info')}
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          {t('button-cancel')}
        </Button>
        <Button
          loading={processing}
          data-testid="remove-patient-dialog-validate-button"
          color="error"
          variant="contained"
          disableElevation
          onClick={handleOnClickRemove}
        >
          {t('button-remove-patient')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RemovePatientDialog
