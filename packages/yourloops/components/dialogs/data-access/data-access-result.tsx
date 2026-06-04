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

import React, { FC } from 'react'
import { PartnerName } from '../../../lib/external-consents/models/enum/partner-name.enum'
import { DataAccessResultValue } from '../../../lib/external-consents/models/enum/data-access-result-value.enum'
import DialogTitle from '@mui/material/DialogTitle'
import { Trans, useTranslation } from 'react-i18next'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import DialogContentText from '@mui/material/DialogContentText'
import {
  getRemoteMonitoringToolLabel
} from '../../../pages/user-account/sections/data-sharing-section/remote-monitoring.util'

interface DataAccessResultProps {
  partnerName: PartnerName
  result: DataAccessResultValue
  callbackUrl: string
  patientId: string
}

export const DataAccessResult: FC<DataAccessResultProps> = (props) => {
  const { partnerName, result, callbackUrl, patientId } = props
  const { t } = useTranslation()

  const partnerLabel = getRemoteMonitoringToolLabel(partnerName)

  const redirectUrl = new URL(callbackUrl)
  redirectUrl.searchParams.set('patientUserId', patientId)
  const redirectUrlString = redirectUrl.toString()

  const getTitle = (result: DataAccessResultValue): string => {
    switch (result) {
      case DataAccessResultValue.Accepted:
        return t('data-access-granted')
      case DataAccessResultValue.Denied:
        return t('data-access-denied')
      case DataAccessResultValue.Error:
        return t('data-access-error')
    }
  }

  const getDescriptionTranslationKey = (result: DataAccessResultValue): string => {
    switch (result) {
      case DataAccessResultValue.Accepted:
        return 'data-access-granted-description'
      case DataAccessResultValue.Denied:
        return 'data-access-denied-description'
      case DataAccessResultValue.Error:
        return 'data-access-error-description'
    }
  }

  return (
    <>
      <DialogTitle>
        {getTitle(result)}
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          <Trans
            i18nKey={getDescriptionTranslationKey(result)}
            t={t}
            components={{ strong: <strong /> }}
            values={{ partnerName: partnerLabel }}
            parent={React.Fragment}
          />
        </DialogContentText>

        <DialogContentText sx={{ mt: 2 }}>
          {t('redirection-to-application')}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          component="a"
          href={redirectUrlString}
          data-testid="redirect-ok-button"
        >
          {t('button-ok')}
        </Button>
      </DialogActions>
    </>
  )
}
