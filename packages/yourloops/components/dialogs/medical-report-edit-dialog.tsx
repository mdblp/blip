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

import React from 'react'
import { useTranslation } from 'react-i18next'
import { type Theme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'

import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Divider from '@mui/material/Divider'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { type CategoryProps } from '../dashboard-cards/medical-files/medical-files-card'
import { useMedicalReportEditDialog } from './medical-report-edit-dialog.hook'
import { type MedicalReport } from '../../lib/medical-files/models/medical-report.model'
import { LoadingButton } from '@mui/lab'

export interface MedicalReportEditDialogProps extends CategoryProps {
  onClose: () => void
  onSaved: (payload: MedicalReport) => void
  medicalReport?: MedicalReport
}

const classes = makeStyles()((theme: Theme) => ({
  divider: {
    margin: '30px 0 10px 16px'
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& > svg': {
      marginRight: theme.spacing(1)
    }
  },
  textArea: {
    marginTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    '& textarea:disabled': {
      color: theme.palette.text.primary
    }
  }
}))

export default function MedicalReportEditDialog(props: MedicalReportEditDialogProps): JSX.Element {
  const { classes: { title, textArea, divider } } = classes()
  const { t } = useTranslation('yourloops')
  const { onClose, onSaved, medicalReport, teamId, patientId } = props
  const {
    diagnosis,
    dialogTitle,
    setDiagnosis,
    progressionProposal,
    inProgress,
    isInReadOnly,
    trainingSubject,
    isSaveButtonDisabled,
    setProgressionProposal,
    setTrainingSubject,
    saveMedicalReport
  } = useMedicalReportEditDialog({ onSaved, medicalReport, teamId, patientId })

  return (
    <Dialog
      open
      fullWidth
      maxWidth="md"
      onClose={onClose}
    >
      <DialogTitle>
        <Box className={title}>
          <DescriptionOutlinedIcon />
          <Typography variant="h5">
            {dialogTitle}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="h6">
          1. {t('diagnosis')}
        </Typography>
        <TextField
          value={diagnosis}
          className={textArea}
          fullWidth
          multiline
          rows={4}
          disabled={isInReadOnly}
          data-testid="diagnosis"
          onChange={(event) => {
            setDiagnosis(event.target.value)
          }}
        />

        <Divider className={divider} />

        <Typography variant="h6">
          2. {t('progression-proposal')}
        </Typography>
        <TextField
          value={progressionProposal}
          className={textArea}
          fullWidth
          multiline
          rows={4}
          disabled={isInReadOnly}
          data-testid="progression-proposal"
          onChange={(event) => {
            setProgressionProposal(event.target.value)
          }}
        />

        <Divider className={divider} />

        <Typography variant="h6">
          3. {t('training-subject')}
        </Typography>
        <TextField
          value={trainingSubject}
          className={textArea}
          fullWidth
          multiline
          rows={4}
          disabled={isInReadOnly}
          data-testid="training-subject"
          onChange={(event) => {
            setTrainingSubject(event.target.value)
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button
          data-testid="medical-report-close"
          disableElevation
          variant="outlined"
          onClick={onClose}
        >
          {isInReadOnly ? t('button-close') : t('button-cancel')}
        </Button>
        {!isInReadOnly &&
          <LoadingButton
            loading={inProgress}
            variant="contained"
            color="primary"
            disableElevation
            disabled={isSaveButtonDisabled}
            onClick={saveMedicalReport}
          >
            {t('button-save')}
          </LoadingButton>
        }
      </DialogActions>
    </Dialog>
  )
}
