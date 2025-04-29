/*
 * Copyright (c) 2023-2025, Diabeloop
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

import React, { type FunctionComponent, useEffect } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../../components/utils/snackbar'
import LoginPageMobile from './login-page-mobile'
import LoginPageDesktop from './login-page-desktop'
import { GlobalStyles } from 'tss-react'
import { useQueryParams } from '../../lib/custom-hooks/query-params.hook'
import { IDLE_USER_QUERY_PARAM } from '../../lib/auth'
import { useTranslation } from 'react-i18next'
import { AppRoute } from '../../models/enums/routes.enum'
import { setPageTitle } from '../../lib/utils'
import { Auth0Error } from '../../lib/auth/models/enums/auth0-error.enum'

export const LoginPageLanding: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const { error } = useAuth0()
  const navigate = useNavigate()
  const alert = useAlert()
  const theme = useTheme()
  const isMobileView: boolean = useMediaQuery(theme.breakpoints.only('xs'))
  const queryParams = useQueryParams()

  useEffect(() => {
    if (queryParams.get(IDLE_USER_QUERY_PARAM)) {
      alert.warning(t('alert-inactive-user-logged-out'), { infiniteTimeout: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams])

  useEffect(() => {
    if (error) {
      const auth0Message = error.message

      if (auth0Message === Auth0Error.EmailNotVerified) {
        navigate(AppRoute.VerifyEmail)
        return
      }

      const errorMessage = auth0Message === Auth0Error.AccountFlaggedForDeletion ? t('account-flagged-for-deletion') : t('error-http-40x')
      alert.error(errorMessage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  setPageTitle(t('login'))

  return (
    <React.Fragment>
      <GlobalStyles styles={{ body: { backgroundColor: 'white' } }} />
      {isMobileView
        ? <LoginPageMobile />
        : <LoginPageDesktop />
      }
    </React.Fragment>
  )
}
