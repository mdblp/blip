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

import React, { FC, useCallback, useEffect, useState } from 'react'
import CardHeader from '@mui/material/CardHeader'
import { useTranslation } from 'react-i18next'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { errorTextFromException } from '../../../../lib/utils'
import { logError } from '../../../../utils/error.util'
import { ExternalConsentsApi } from '../../../../lib/external-consents/external-consents.api'
import { useAuth } from '../../../../lib/auth'
import { ExternalConsent } from '../../../../lib/external-consents/models/external-consent.model'
import { useAlert } from '../../../../components/utils/snackbar'
import SpinningLoader from '../../../../components/loaders/spinning-loader'
import { RemoteMonitoringTools } from './remote-monitoring-tools'

export const DataSharingSection: FC = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const alert = useAlert()

  const [consents, setConsents] = useState([])
  const [refreshInProgress, setRefreshInProgress] = useState<boolean>(false)

  const userId = user.id

  const fetchExternalConsents = useCallback(() => {
    setRefreshInProgress(true)

    ExternalConsentsApi.getConsents(userId)
      .then((consents: ExternalConsent[]) => {
        setConsents(consents)
        return consents
      })
      .catch((reason: unknown) => {
        const message = errorTextFromException(reason)
        logError(message, 'fetch-external-consents')

        alert.error(t('error-http-40x'))
        setConsents([])
      })
      .finally(() => {
        setRefreshInProgress(false)
      })
  }, [t, userId, alert])

  useEffect(() => {
    fetchExternalConsents()
  }, [fetchExternalConsents]);

  return (
    <>
      <CardHeader title={t('data-sharing')} data-testid="data-sharing-title" />

      <CardContent>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>{t('remote-monitoring-tools')}</Typography>

        {refreshInProgress
          ? <SpinningLoader className="centered-spinning-loader" />
          : <RemoteMonitoringTools
            consents={consents}
            patientId={userId}
            refresh={fetchExternalConsents}
          />
        }
      </CardContent>
    </>
  )
}
