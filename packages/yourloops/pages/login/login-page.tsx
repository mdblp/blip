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
import loginPageBackground from 'login-page-background.png'

import Toolbar from '@mui/material/Toolbar'
import AppBar from '@mui/material/AppBar'
import config from '../../lib/config/config'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import LoginActionButton from './login-action-button'
import Link from '@mui/material/Link'
import LanguageSelect from '../../components/language-select'
import LanguageIcon from '@mui/icons-material/Language'
import Typography from '@mui/material/Typography'
import { GlobalStyles } from 'tss-react'

const LOGO_COLOR_LIGHT = '#40BAE9'
const styles = makeStyles({ name: 'login-page-styles' })((theme: Theme) => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.common.white,
    color: 'var(--text-base-color)',
    paddingBlock: theme.spacing(2),
    paddingInline: theme.spacing(7)
  },
  backgroundImage: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: -1
  },
  heading: {
    fontFamily: 'MuseoSlab',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2)
  },
  info: {
    fontSize: '1.1rem',
    lineHeight: theme.spacing(4)
  },
  infoContainer: {
    color: 'var(--text-base-color-light)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    paddingInline: theme.spacing(10),
    width: '45%'
  },
  hoverable: {
    fontWeight: 'bold',
    color: 'var(--logo-color)',
    fontSize: '1rem',
    '&:hover': {
      color: LOGO_COLOR_LIGHT
    }
  },
  link: {
    color: 'var(--logo-color)',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginTop: theme.spacing(2),
    '&:hover': {
      color: LOGO_COLOR_LIGHT
    }
  },
  loginButton: {
    backgroundColor: 'var(--logo-color)',
    '&:hover': {
      backgroundColor: LOGO_COLOR_LIGHT
    }
  },
  registerButton: {
    backgroundColor: 'var(--text-base-color-light)',
    '&:hover': {
      backgroundColor: '#2e2e2d'
    }
  }
}))

const LoginPage: FunctionComponent = () => {
  const { loginWithRedirect, error } = useAuth0()
  const { t, i18n } = useTranslation()
  const { classes, theme } = styles()

  // TODO redirect to a new page confirm-email
  if (error) {
    console.log(error)
  }

  const redirectToSignup = async (): Promise<void> => await loginWithRedirect({ screen_hint: 'signup' })

  return (
    <React.Fragment>
      <GlobalStyles styles={{ body: { backgroundColor: 'white' } }} />
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
            <RouterLink className="flex" to="/">
              <img
                id="header-main-logo"
                aria-label={t('alt-img-logo')}
                src={`/branding_${config.BRANDING}_logo.svg`}
                alt={t('alt-img-logo')}
                width="180"
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
                className={classes.loginButton}
                onClick={loginWithRedirect}
                title={t('connect')}
              />
              <Box
                display="flex"
                alignItems="center"
                marginLeft={1}
              >
                <Link href="mailto:yourloops@diabeloop.com">
                  <Typography
                    variant="subtitle2"
                    className={classes.hoverable}
                  >
                    {t('contact')}
                  </Typography>
                </Link>
                <Box marginX={1} color={theme.palette.primary.main}>|</Box>
                <LanguageIcon sx={{ color: 'var(--logo-color)', marginRight: theme.spacing(1) }} />
                <LanguageSelect className={classes.hoverable} />
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ marginBlock: theme.spacing(2) }} />
      <Box
        width="100%"
        height="calc(100% - 97px)"
        position="relative"
      >
        <img src={loginPageBackground} alt="login-page-background" className={classes.backgroundImage} />
        <Box className={classes.infoContainer}>
          <Box className={classes.heading}>
            <Box color="var(--logo-color)" component="span">YourLoops</Box> {t('login-page-title')}
          </Box>
          <p className={classes.info}>{t('login-page-info-1')}</p>
          <p className={classes.info}>{t('login-page-info-2')}</p>
          <p className={classes.info}>{t('login-page-info-3')}</p>
          {i18n.language !== 'fr' &&
            <Link
              className={classes.link}
              href="https://www.dbl-diabetes.com"
              target="_blank"
              rel="nofollow"
            >
              {t('learn-more')}
            </Link>
          }
        </Box>
      </Box>
    </React.Fragment>
  )
}

export default LoginPage
