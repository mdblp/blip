/*
 * Copyright (c) 2026, Diabeloop
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

import { Button, DialogTitle } from '@mui/material'
import DialogContent from '@mui/material/DialogContent'
import { Trans, useTranslation } from 'react-i18next'
import React, { FC } from 'react'
import DialogActions from '@mui/material/DialogActions'
import Dialog from '@mui/material/Dialog'
import { errorTextFromException } from '../../../../lib/utils'
import { logError } from '../../../../utils/error.util'
import { ExternalConsentsApi } from '../../../../lib/external-consents/external-consents.api'
import { ExternalConsent } from '../../../../lib/external-consents/models/external-consent.model'
import { useAlert } from '../../../../components/utils/snackbar'
import Box from '@mui/material/Box'
import { getRemoteMonitoringToolLabel } from './remote-monitoring.util'

interface RevokeConsentDialogProps {
  patientId: string
  consent: ExternalConsent
  onClose: () => void
  onSuccess: () => void
}

export const RevokeConsentDialog: FC<RevokeConsentDialogProps> = (props) => {
  const { patientId, consent, onClose, onSuccess } = props
  const { t } = useTranslation()
  const alert = useAlert()

  const appName = getRemoteMonitoringToolLabel(consent.partnerName)

  const onClickRevokeConsent = async () => {
    try {
      await ExternalConsentsApi.revokeConsent(patientId, consent.partnerId)
      alert.success(t('consent-revoke-success'))

      onSuccess()
    } catch (err) {
      const errorMessage = errorTextFromException(err)
      logError(errorMessage, 'revoke-consent')

      alert.error(t('error-occurred'))
      onClose()
    }
  }

  return (
    <Dialog onClose={onClose} open={true} data-testid="revoke-consent-dialog">
      <DialogTitle>{t('revoke-consent')}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Trans
            i18nKey="revoke-consent-question"
            t={t}
            components={{ strong: <strong /> }}
            values={{ appName }}
            parent={React.Fragment}
          />
        </Box>

        {t('revoke-consent-consequences', { appName })}
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          {t('button-cancel')}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onClickRevokeConsent}
          data-testid="revoke-consent-confirm-button"
        >
          {t('revoke-consent')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
