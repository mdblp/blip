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

import React, { type FunctionComponent, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import { Trans, useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useAuth0 } from '@auth0/auth0-react'
import Container from '@mui/material/Container'
import config from '../../lib/config/config'
import { GlobalStyles } from 'tss-react'
import Link from '@mui/material/Link'
import { useAuth } from '../../lib/auth'
import { useAlert } from '../../components/utils/snackbar'
import { useNavigate } from 'react-router-dom'
import { setPageTitle } from '../../lib/utils'
import { useTheme } from '@mui/material/styles'
import { Auth0Error } from '../../lib/auth/models/enums/auth0-error.enum'
import { BasicHeader } from '../../components/header-bars/basic-header'

export const VerifyEmailPage: FunctionComponent = () => {
  const { loginWithRedirect, getAccessTokenSilently } = useAuth0()
  const { t } = useTranslation()
  const { logout } = useAuth()
  const alert = useAlert()
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true)
  const navigate = useNavigate()
  const theme = useTheme()

  const contactSupport = async (): Promise<void> => {
    window.open(config.CONTACT_SUPPORT_WEB_URL, '_blank')
  }

  const logoutUser = (): void => {
    logout()
  }

  const goToAppHome = async (): Promise<void> => {
    try {
      if (!isUserLoggedIn) {
        navigate('/')
        return
      }
      await loginWithRedirect()
    } catch (error) {
      const errorDescription = error.error_description
      if (errorDescription === Auth0Error.EmailNotVerified) {
        alert.warning(t('alert-email-not-verified'))
        return
      }
      if (errorDescription === Auth0Error.ConsentRequired) {
        await loginWithRedirect()
        return
      }
      throw error
    }
  }

  useEffect(() => {
    getAccessTokenSilently()
      .catch((error: Error) => {
      if (error.message === Auth0Error.LoginRequired) {
          setIsUserLoggedIn(false)
        }
      })
  }, [getAccessTokenSilently])

  setPageTitle(t('verify-email'))

  return (
    <>
      <BasicHeader testId="verify-email-header"/>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="90vh"
        textAlign="center"
        data-testid="verify-email-content"
      >
        <GlobalStyles styles={{ body: { backgroundColor: theme.palette.common.white } }} />

        <Container maxWidth="sm">
          <Box display="flex" justifyContent="center">
            <img
              data-testid="header-main-logo"
              aria-label={t('alt-img-logo')}
              src={`/branding_${config.BRANDING}_logo.svg`}
              alt={t('alt-img-logo')}
              width="140" />
          </Box>

          <Box mt={4} mb={3}>
            <Typography variant="h5">{t('verify-email-title')}</Typography>
          </Box>

          <Box textAlign="left">
            <Typography>{t('verify-email-details-1')}</Typography>

            <Box mt={3} mb={3} data-testid="verify-email-details-2">
              <Trans
                i18nKey="verify-email-details-2"
                t={t}
                components={{ underline: <Link component="button" underline="always" onClick={contactSupport} /> }} />
            </Box>

            <Box data-testid="verify-email-details-3">
              <Trans
                i18nKey="verify-email-details-3"
                t={t}
                components={{ underline: <Link component="button" underline="always" onClick={logoutUser} /> }} />
            </Box>

            <br />

            <Box data-testid="verify-email-details-4">
              <Trans
                i18nKey="verify-email-details-4"
                t={t}
                components={{ underline: <Link component="button" underline="always" onClick={logoutUser} /> }} />
            </Box>
          </Box>

          <Box marginTop={4}>
            <Button
              variant="contained"
              onClick={goToAppHome}
              disableElevation
            >
              {t('button-continue')}
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  )
}
