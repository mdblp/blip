/*
 * Copyright (c) 2021-2023, Diabeloop
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

import React, { FunctionComponent, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth0 } from '@auth0/auth0-react'

import { Theme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import loginPageBackground from 'login-page-background.png'
import loginPageLaptop from 'login-page-laptop.png'

import Toolbar from '@mui/material/Toolbar'
import AppBar from '@mui/material/AppBar'
import config from '../../lib/config/config'
import { useHistory } from 'react-router-dom'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import LanguageSelect from '../../components/language-select'
import LanguageIcon from '@mui/icons-material/Language'
import Typography from '@mui/material/Typography'
import { GlobalStyles } from 'tss-react'
import { useAlert } from '../../components/utils/snackbar'
import Button from '@mui/material/Button'
import { diabeloopExternalUrls } from '../../lib/diabeloop-urls.model'
import { LanguageCodes } from '../../lib/auth/models/language-codes.model'

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
    bottom: -1,
    zIndex: -1
  },
  button: {
    marginRight: theme.spacing(2),
    paddingInline: theme.spacing(3),
    textTransform: 'capitalize',
    width: 136
  },
  link: {
    textTransform: 'capitalize',
    fontFamily: 'MuseoSlab',
    paddingTop: theme.spacing(1),
    fontSize: '1.125rem'
  },
  heading: {
    fontFamily: 'MuseoSlab',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2)
  },
  info: {
    fontSize: '1.125rem',
    lineHeight: theme.spacing(4)
  },
  infoContainer: {
    color: 'var(--text-base-color-light)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(8),
    width: '45%',
    [theme.breakpoints.down('lg')]: {
      width: '55%'
    }
  },
  hoverable: {
    fontWeight: 'bold',
    color: 'var(--logo-color)',
    fontSize: '1rem',
    '&:hover': {
      color: LOGO_COLOR_LIGHT
    }
  },
  laptopImage: {
    width: '720px',
    [theme.breakpoints.down('lg')]: {
      width: '550px'
    }
  }
}))

const LoginPage: FunctionComponent = () => {
  const { loginWithRedirect, error } = useAuth0()
  const { t, i18n } = useTranslation()
  const history = useHistory()
  const alert = useAlert()
  const { classes, theme } = styles()

  const redirectToSignup = async (): Promise<void> => await loginWithRedirect({ screen_hint: 'signup' })

  useEffect(() => {
    if (error) {
      if (error.message === 'Please verify your email before logging in.') {
        history.replace('/verify-email')
        return
      }
      alert.error(error.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  return (
    <Box>
      <GlobalStyles styles={{ body: { backgroundColor: 'white' } }} />
      <AppBar
        data-testid="login-page-header"
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
            <img
              data-testid="header-main-logo"
              aria-label={t('alt-img-logo')}
              src={`/branding_${config.BRANDING}_logo.svg`}
              alt={t('alt-img-logo')}
              width="180"
            />
            <Box display="flex">
              <Button
                data-testid="register-button"
                variant="outlined"
                disableElevation
                onClick={redirectToSignup}
                className={classes.button}
              >
                {t('register')}
              </Button>
              <Button
                data-testid="login-button"
                variant="contained"
                disableElevation
                onClick={loginWithRedirect}
                className={classes.button}
              >
                {t('connect')}
              </Button>
              <Box
                display="flex"
                alignItems="center"
                marginLeft={1}
              >
                <Link href={`mailto:${diabeloopExternalUrls.contactEmail}`}>
                  <Typography
                    variant="subtitle2"
                    className={classes.hoverable}
                  >
                    {t('contact')}
                  </Typography>
                </Link>
                <Box marginX={1} color={theme.palette.primary.main}>|</Box>
                <LanguageIcon
                  data-testid="language-icon"
                  sx={{ color: 'var(--logo-color)', marginRight: theme.spacing(1) }}
                />
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
        <img src={loginPageBackground} alt={t('alt-img-login-page-background')} className={classes.backgroundImage} />

        <Box display="flex" height="100%">
          <Box className={classes.infoContainer} data-testid="info-container">
            <Box className={classes.heading} data-testid="login-page-title">
              <Box color="var(--logo-color)" component="span">YourLoops</Box> {t('login-page-title')}
            </Box>
            <p className={classes.info}>{t('login-page-info-1')}</p>
            <p className={classes.info}>{t('login-page-info-2')}</p>
            <p className={classes.info}>{t('login-page-info-3')}</p>
            {i18n.language !== LanguageCodes.fr &&
              <Link
                underline="none"
                href={diabeloopExternalUrls.dblDiabetes}
                target="_blank"
                rel="nofollow"
              >
               <Typography className={classes.link}>{t('learn-more')}</Typography>
              </Link>
            }
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
            <img src={loginPageLaptop} alt={t('alt-img-login-page-laptop')} className={classes.laptopImage} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default LoginPage
