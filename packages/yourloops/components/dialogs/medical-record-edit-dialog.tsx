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

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Theme } from '@mui/material/styles'

import { makeStyles } from '@mui/styles'

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

import { MedicalRecord } from '../../lib/medical-files/model'
import { CategoryProps } from '../dashboard-widgets/medical-files/medical-files-widget'
import ProgressIconButtonWrapper from '../buttons/progress-icon-button-wrapper'
import useMedicalRecordEditDialog from './medical-record-edit-dialog.hook'
import { useAuth } from '../../lib/auth'

export interface MedicalRecordEditDialogProps extends CategoryProps {
  onClose: () => void
  onSaved: (payload: MedicalRecord) => void
  medicalRecord?: MedicalRecord
}

const classes = makeStyles((theme: Theme) => ({
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

export default function MedicalRecordEditDialog(props: MedicalRecordEditDialogProps): JSX.Element {
  const { title, textArea, divider } = classes()
  const { t } = useTranslation('yourloops')
  const { user } = useAuth()
  const { onClose, onSaved, medicalRecord, teamId, patientId } = props
  const readonly = user.isUserPatient()
  const {
    diagnosis,
    setDiagnosis,
    progressionProposal,
    setProgressionProposal,
    inProgress,
    trainingSubject,
    setTrainingSubject,
    disabled,
    saveMedicalRecord
  } = useMedicalRecordEditDialog({ onSaved, medicalRecord, teamId, patientId })

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
            {t('write-medical-record')}
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
          variant="outlined"
          disabled={readonly}
          data-testid="diagnosis"
          onChange={(event) => setDiagnosis(event.target.value)}
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
          variant="outlined"
          disabled={readonly}
          data-testid="progression-proposal"
          onChange={(event) => setProgressionProposal(event.target.value)}
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
          variant="outlined"
          disabled={readonly}
          data-testid="training-subject"
          onChange={(event) => setTrainingSubject(event.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button
          disableElevation
          onClick={onClose}
        >
          {t('cancel')}
        </Button>
        {!user.isUserPatient() &&
          <ProgressIconButtonWrapper inProgress={inProgress}>
            <Button
              variant="contained"
              color="primary"
              disableElevation
              disabled={disabled}
              onClick={saveMedicalRecord}
            >
              {t('save')}
            </Button>
          </ProgressIconButtonWrapper>
        }
      </DialogActions>
    </Dialog>
  )
}
