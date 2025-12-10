/*
 * Copyright (c) 2022-2025, Diabeloop
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
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import MedicalFilesApi from '../../lib/medical-files/medical-files.api'
import { useAlert } from '../utils/snackbar'
import { type MedicalReport } from '../../lib/medical-files/models/medical-report.model'
import { logError } from '../../utils/error.util'
import { errorTextFromException } from '../../lib/utils'

export interface MedicalReportDeleteDialogProps {
  onClose: () => void
  onDelete: (medicalReportId: string) => void
  medicalReport: MedicalReport
  teamName: string
}

export default function MedicalReportDeleteDialog({ onClose, medicalReport, onDelete, teamName }: MedicalReportDeleteDialogProps): JSX.Element {
  const { t } = useTranslation('yourloops')
  const alert = useAlert()

  const [inProgress, setInProgress] = useState<boolean>(false)

  const deleteMedicalReport = async (): Promise<void> => {
    try {
      setInProgress(true)
      await MedicalFilesApi.deleteMedicalReport(medicalReport.id)
      setInProgress(false)
      alert.success(t('medical-report-delete-success'))
      onDelete(medicalReport.id)
    } catch (err) {
      const errorMessage = errorTextFromException(err)
      logError(errorMessage, 'medical-report-delete')

      setInProgress(false)
      alert.error(t('medical-report-delete-failed'))
    }
  }

  return (
    <Dialog
      data-testid="delete-medical-report-dialog"
      open
      fullWidth
      maxWidth="sm"
      onClose={onClose}
    >
      <DialogTitle>
        {t('delete-medical-report')}
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {t('delete-medical-report-confirmation', { number: medicalReport.number, name: teamName })}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          disableElevation
          variant="outlined"
          onClick={onClose}
        >
          {t('button-cancel')}
        </Button>
        <Button
          variant="contained"
          disableElevation
          loading={inProgress}
          color="error"
          onClick={deleteMedicalReport}
        >
          {t('button-delete')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
