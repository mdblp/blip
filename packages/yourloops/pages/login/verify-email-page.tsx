/*
 * Copyright (c) 2023, Diabeloop
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
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useAuth0 } from '@auth0/auth0-react'
import Divider from '@mui/material/Divider'
import Container from '@mui/material/Container'
import config from '../../lib/config/config'
import { useTheme } from '@mui/styles'
import { GlobalStyles } from 'tss-react'

const VerifyEmailPage: FunctionComponent = () => {
  const { loginWithRedirect, logout } = useAuth0()
  const { t } = useTranslation()
  const theme = useTheme()

  const onClickLogout = (): void => {
    logout({ returnTo: window.location.origin })
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="90vh"
      textAlign="center"
    >
      <GlobalStyles styles={{ body: { backgroundColor: 'white' } }} />
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" marginBottom={4}>
          <img
            data-testid="header-main-logo"
            aria-label={t('alt-img-logo')}
            src={`/branding_${config.BRANDING}_logo.svg`}
            alt={t('alt-img-logo')}
            width="140"
          />
        </Box>
        <Typography variant="h5">{t('verify-email-title')}</Typography>
        <Divider sx={{ marginBlock: theme.spacing(3) }} />
        <Typography>{t('verify-email-details')}</Typography>
        <Box marginTop={4}>
          <Button
            variant="outlined"
            color="info"
            sx={{ marginRight: theme.spacing(4) }}
            onClick={onClickLogout}
          >
            {t('logout')}
          </Button>
          <Button
            variant="outlined"
            onClick={loginWithRedirect}
          >
            {t('continue')}
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default VerifyEmailPage
