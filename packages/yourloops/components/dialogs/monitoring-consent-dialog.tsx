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

import { useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'

import { MonitoringConsentForm } from '../consents/form'

interface MonitoringConsentDialogProps {
  onAccept: () => void
  onCancel: () => void
  teamName: string
}

function MonitoringConsentDialog(props: MonitoringConsentDialogProps): JSX.Element {
  const theme = useTheme()
  const isXSBreakpoint: boolean = useMediaQuery(theme.breakpoints.only('xs'))

  const { onAccept, onCancel, teamName } = props
  const { t } = useTranslation('yourloops')
  const [termsAccepted, setTermsAccepted] = React.useState(false)

  const resetForm = (): void => {
    setTermsAccepted(false)
  }

  const handleAccept = (): void => {
    onAccept()
    resetForm()
  }

  const onClose = (): void => {
    onCancel()
    resetForm()
  }

  return (
    <Dialog
      id="monitoring-consent-dialog"
      open
      onClose={onClose}
      maxWidth="sm"
      fullScreen={isXSBreakpoint}
    >
      <DialogTitle id="monitoring-consent-dialog-title">
        <strong>{t('modal-monitoring-consent-title', { careteam: teamName })}</strong>
      </DialogTitle>
      <DialogContent id="monitoring-consequences-dialog-content">
        <MonitoringConsentForm
          id="monitoring-consequences-dialog"
          termsAccepted={termsAccepted}
          setTermsAccepted={setTermsAccepted}
        />
      </DialogContent>

      <DialogActions id="monitoring-consent-dialog-actions">
        <Button
          id="monitoring-consent-dialog-button-decline"
          onClick={onClose}
        >
          {t('button-decline')}
        </Button>
        <Button
          id="monitoring-consent-dialog-button-accept"
          variant="contained"
          color="primary"
          disableElevation
          disabled={!termsAccepted}
          onClick={handleAccept}
        >
          {t('button-accept')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MonitoringConsentDialog
