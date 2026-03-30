/*
 * Copyright (c) 2023-2026, Diabeloop
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
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { type Patient } from '../../../lib/patient/models/patient.model'
import useAckMonitoringAlertDialog from './ack-monitoring-alert-dialog.hook'
import AnalyticsApi, { ElementType } from '../../../lib/analytics/analytics.api'

export enum MonitoringAlertType {
  Hyperglycemia = 'hyperglycemia',
  Hypoglycemia = 'hypoglycemia',
  TimeSpentOutOfRange = 'time-out-of-range',
  DataNotTransmitted = 'data-not-transmitted',
}

interface AcknowledgeMonitoringAlertDialogProps {
  open: boolean
  patient: Patient
  alertType: MonitoringAlertType
  onClose: () => void
}

export const AcknowledgeMonitoringAlertDialog: FunctionComponent<AcknowledgeMonitoringAlertDialogProps> = ({
  open,
  patient,
  alertType,
  onClose
}) => {
  const { t } = useTranslation()
  const { handleAnalyse, handleAcknowledge } = useAckMonitoringAlertDialog({ patient, alertType, onClose })
  const patientName = `${patient.profile.firstName} ${patient.profile.lastName}`
  const alertName = t(alertType)
  return (
    <Dialog
      data-testid="acknowledge-monitoring-alert-dialog"
      open={open}
      onClose={onClose}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>{t('acknowledge-monitoring-alert-dialog-title', { alertName })}</strong>
        <IconButton
          aria-label={t('button-close')}
          onClick={onClose}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          <Trans
            i18nKey={'acknowledge-monitoring-alert-dialog-body'}
            t={t}
            components={{ strong: <strong /> }}
            values={{ alertName, patientName }}
            parent={React.Fragment}
          />
        </DialogContentText>

        <Box sx={{ mt: 2 }}>
          <Alert severity="info">
            {t('acknowledge-monitoring-alert-dialog-warning')}
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          data-testid="acknowledge-monitoring-alert-dialog-analyse-button"
          variant="outlined"
          onClick={() => {
            handleAnalyse()
            AnalyticsApi.trackClick(`acknowledge-monitoring-alert-dialog-analyse-${alertName}`, ElementType.Button)
          }}
        >
          {t('acknowledge-monitoring-alert-dialog-analyse-button')}
        </Button>
        <Button
          data-testid="acknowledge-monitoring-alert-dialog-acknowledge-button"
          variant="contained"
          disableElevation
          onClick={() => {
            AnalyticsApi.trackClick(`acknowledge-monitoring-alert-dialog-acknowledge-${alertName}`, ElementType.Button)
            return handleAcknowledge()
          }}
        >
          {t('acknowledge-monitoring-alert-dialog-acknowledge-button')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
