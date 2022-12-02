/*
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

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import { MedicalRecord } from '../../lib/medical-files/model'
import MedicalFilesApi from '../../lib/medical-files/medical-files-api'
import { useAlert } from '../utils/snackbar'
import ProgressIconButtonWrapper from '../buttons/progress-icon-button-wrapper'

export interface MedicalRecordDeleteDialogProps {
  onClose: () => void
  onDelete: (medicalRecordId: string) => void
  medicalRecord: MedicalRecord
}

export default function MedicalRecordDeleteDialog({ onClose, medicalRecord, onDelete }: MedicalRecordDeleteDialogProps): JSX.Element {
  const { t } = useTranslation('yourloops')
  const alert = useAlert()

  const [inProgress, setInProgress] = useState<boolean>(false)

  const deleteMedicalRecord = async (): Promise<void> => {
    try {
      setInProgress(true)
      await MedicalFilesApi.deleteMedicalRecord(medicalRecord.id)
      setInProgress(false)
      alert.success(t('medical-record-delete-success'))
      onDelete(medicalRecord.id)
    } catch (err) {
      console.log(err)
      setInProgress(false)
      alert.error(t('medical-record-delete-failed'))
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
          {t('delete-warning', { fileName: t('medical-record-pdf', { pdfName: new Date(medicalRecord.creationDate).toLocaleDateString() }) })}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          disableElevation
          onClick={onClose}
        >
          {t('cancel')}
        </Button>
        <ProgressIconButtonWrapper inProgress={inProgress}>
          <Button
            variant="contained"
            disableElevation
            disabled={inProgress}
            color="error"
            onClick={deleteMedicalRecord}
          >
            {t('delete')}
          </Button>
        </ProgressIconButtonWrapper>
      </DialogActions>
    </Dialog>
  )
}
