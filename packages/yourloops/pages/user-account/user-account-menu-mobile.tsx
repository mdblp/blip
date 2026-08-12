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

import { UserAccountPageContextProvider } from './user-account-page-context'
import { UserAccountMenuMobileCards } from './user-account-menu-mobile-cards'
import { ExternalConsentsApi } from '../../lib/external-consents/external-consents.api'
import { ExternalConsent } from '../../lib/external-consents/models/external-consent.model'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { errorTextFromException } from '../../lib/utils'
import { logError } from '../../utils/error.util'
import { useAlert } from '../../components/utils/snackbar'
import SpinningLoader from '../../components/loaders/spinning-loader'

export const UserAccountMenuMobile = () => {
  const { t } = useTranslation()
  const alert = useAlert()

  const [consents, setConsents] = useState([])
  const [refreshInProgress, setRefreshInProgress] = useState<boolean>(false)

  const fetchExternalConsents = useCallback(() => {
    setRefreshInProgress(true)

    ExternalConsentsApi.getConsents()
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
  }, [t, alert])

  useEffect(() => {
    fetchExternalConsents()
  }, [fetchExternalConsents]);

  return (
    <UserAccountPageContextProvider>
      {refreshInProgress
        ? <SpinningLoader className="centered-spinning-loader" />
        :
        <UserAccountMenuMobileCards
          consents={consents}
        />
      }
    </UserAccountPageContextProvider>
  )
}
