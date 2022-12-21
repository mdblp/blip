/*
 * Copyright (c) 2021-2022, Diabeloop
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

import React, { FunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth0 } from '@auth0/auth0-react'

import { Theme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'

import Toolbar from '@mui/material/Toolbar'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import config from '../../lib/config/config'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import LoginActionButton from './login-action-button'
import Link from '@mui/material/Link'
import LanguageSelect from '../../components/language-select'
import LanguageIcon from '@mui/icons-material/Language'
import Typography from '@mui/material/Typography'

const styles = makeStyles({ name: 'login-page-styles' })((theme: Theme) => {
  return {
    appBar: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: theme.palette.common.white,
      color: 'var(--text-base-color)',
      paddingBlock: theme.spacing(2),
      paddingInline: theme.spacing(10)
    },
    link: {
      fontWeight: 'bold',
      color: theme.palette.primary.main,
      fontSize: 14,
      '&:hover': {
        color: theme.palette.primary.dark
      }
    },
    registerButton: {
      backgroundColor: '#575756',
      '&:hover': {
        backgroundColor: '#2e2e2d'
      }
    }
  }
})

const LoginPage: FunctionComponent = () => {
  const { loginWithRedirect, error } = useAuth0()
  const { t } = useTranslation('yourloops')
  const { classes, theme } = styles()

  // TODO redirect to a new page confirm-email
  if (error) {
    console.log(error)
  }

  const redirectToSignup = async (): Promise<void> => await loginWithRedirect({ screen_hint: 'signup' })

  return (
    <React.Fragment>
      <AppBar
        id="app-main-header"
        data-testid="app-main-header"
        elevation={0}
        className={classes.appBar}
        position="fixed"
      >
        <Toolbar>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <RouterLink to="/">
              <Avatar
                id="header-main-logo"
                aria-label={t('alt-img-logo')}
                variant="square"
                src={`/branding_${config.BRANDING}_logo.svg`}
                alt={t('alt-img-logo')}
                sx={{ width: 140 }}
              />
            </RouterLink>
            <Box display="flex">
              <LoginActionButton
                caption={t('first-visit')}
                className={classes.registerButton}
                onClick={redirectToSignup}
                title={t('register')}
              />
              <LoginActionButton
                caption={t('already-registered')}
                onClick={loginWithRedirect}
                title={t('connect')}
              />
              <Box display="flex" alignItems="center">
                <Link href="mailto:yourloops@diabeloop.com">
                  <Typography
                    variant="subtitle2"
                    className={classes.link}
                  >
                    {t('contact')}
                  </Typography>
                </Link>
                <Box marginX={1} color={theme.palette.primary.main}>|</Box>
                <LanguageIcon sx={{ color: theme.palette.primary.main, marginRight: theme.spacing(1) }} />
                <LanguageSelect className={classes.link} />
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  )
}

export default LoginPage
