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

import React, { FC } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Avatar from '@mui/material/Avatar'
import config from '../../lib/config/config'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { GlobalStyles } from 'tss-react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { setPageTitle } from '../../lib/utils'
import { useAuth } from '../../lib/auth'
import { Auth0VerifyEmailMessage } from '../../lib/auth/models/enums/auth0-verify-email-message.enum'
import { RightIcon } from '../../components/icons/diabeloop/right-icon'
import { WrongIcon } from '../../components/icons/diabeloop/wrong-icon'
import { useVerifyEmailStyles } from './verify-email.styles'
import { useTheme } from '@mui/material/styles'
import { Auth0Error } from '../../lib/auth/models/enums/auth0-error.enum'

const classes = makeStyles()(() => ({
  icon: {
    fontSize: '100px'
  }
}))

const AUTH0_QUERY_PARAM_SUCCESS = 'success'
const AUTH0_QUERY_PARAM_MESSAGE = 'message'

export const VerifyEmailResultPage: FC = () => {
  const { classes: { appBar, desktopLogo } } = useVerifyEmailStyles()
  const { classes: { icon } } = classes()
  const { t } = useTranslation()
  const { loginWithRedirect } = useAuth0()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const success = searchParams.get(AUTH0_QUERY_PARAM_SUCCESS)
  const message = searchParams.get(AUTH0_QUERY_PARAM_MESSAGE)

  const getErrorInfoLabel = (message: Auth0VerifyEmailMessage): string => {
    switch (message) {
      case Auth0VerifyEmailMessage.AccessExpired:
        return t('verification-link-expired')
      case Auth0VerifyEmailMessage.UrlAlreadyUsed:
        return t('verification-link-already-used')
      case Auth0VerifyEmailMessage.UserAccountDoesNotExist:
        return t('user-account-does-not-exist')
      case Auth0VerifyEmailMessage.AccountAlreadyVerified:
        return t('user-account-already-verified')
      case Auth0VerifyEmailMessage.EmailCouldNotBeVerified:
      default:
        return t('error-email-verification')
    }
  }

  const isSuccess = success === true.toString()
  const title = isSuccess ? t('verify-email-success-title') : t('verify-email-error-title')
  const infoLabel = isSuccess ? t('verify-email-success-info') : getErrorInfoLabel(message as Auth0VerifyEmailMessage)
  const buttonLabel = isSuccess ? t('button-continue') : t('button-logout')
  const theme = useTheme()

  const goToAppHome = async (): Promise<void> => {
    try {
      await loginWithRedirect()
    } catch (error) {
      const errorDescription = error.error_description
      if (errorDescription === Auth0Error.LoginRequired) {
        navigate('/')
        return
      }
      if (errorDescription === Auth0Error.ConsentRequired) {
        await loginWithRedirect()
        return
      }
      throw error
    }
  }

  const logoutUser = (): void => {
    logout()
  }

  setPageTitle(t('verify-email'))

  return (
    <>
      <AppBar
        elevation={0}
        className={appBar}
        position="fixed"
        data-testid="verify-email-result-header"
      >
        <Toolbar>
          <Avatar
            aria-label={t('alt-img-logo')}
            variant="square"
            src={`/branding_${config.BRANDING}_logo.svg`}
            alt={t('alt-img-logo')}
            className={desktopLogo}
          />
        </Toolbar>
      </AppBar>

      <Box
        data-testid="verify-email-result-content"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
          textAlign: "center"
        }}>
        <GlobalStyles styles={{ body: { backgroundColor: theme.palette.common.white } }} />

        <Container maxWidth="sm">
          <Box
            sx={{ mt: 4, mb: 3 }}>
            {isSuccess
              ? <RightIcon
                color="primary"
                className={icon}
                data-testid="right-icon"
              />
              : <WrongIcon
                color="error"
                className={icon}
                data-testid="wrong-icon"
              />}
          </Box>
          <Box
            sx={{ mt: 4, mb: 3 }}>
            <Typography variant="h5">{title}</Typography>
          </Box>

          <Box>
            <Typography>{infoLabel}</Typography>
          </Box>

          <Box sx={{ marginTop: 4 }}>
            <Button
              variant="contained"
              onClick={isSuccess ? goToAppHome : logoutUser}
              disableElevation
            >
              {buttonLabel}
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  )
}
