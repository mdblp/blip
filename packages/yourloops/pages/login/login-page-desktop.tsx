/*
 * Copyright (c) 2021-2025, Diabeloop
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

import React, { type FunctionComponent, type MouseEventHandler } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useAuth0 } from '@auth0/auth0-react'
import { makeStyles } from 'tss-react/mui'
import loginPageBackground from 'images/login-page-background-desktop.png'
import loginPageLaptop from 'images/login-page-laptop.png'

import Toolbar from '@mui/material/Toolbar'
import AppBar from '@mui/material/AppBar'
import config from '../../lib/config/config'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import LanguageSelect from '../../components/language-select'
import LanguageIcon from '@mui/icons-material/Language'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { diabeloopExternalUrls } from '../../lib/diabeloop-urls.model'
import { LanguageCodes } from '../../lib/auth/models/enums/language-codes.enum'
import { useLogin } from './login.hook'

const styles = makeStyles({ name: 'login-page-styles' })((theme) => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.common.white,
    color: 'var(--text-color-primary)',
    paddingBlock: theme.spacing(2),
    paddingInline: theme.spacing(7)
  },
  backgroundImage: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: -1,
    height: '100%'
  },
  button: {
    marginRight: theme.spacing(2),
    paddingInline: theme.spacing(3),
    width: 150,
    fontWeight: 600
  },
  link: {
    textTransform: 'capitalize',
    fontFamily: 'MuseoSlab',
    fontWeight: 'bold',
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
    color: 'var(--text-color-secondary)',
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
      color: theme.palette.primary.light
    }
  },
  laptopImage: {
    width: '75%',
    maxWidth: '650px'
  }
}))

const LoginPageDesktop: FunctionComponent = () => {
  const { loginWithRedirect } = useAuth0()
  const { t, i18n } = useTranslation()
  const { classes, theme } = styles()
  const { redirectToSignupInformation } = useLogin()

  return (
    <React.Fragment>
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
                onClick={redirectToSignupInformation}
                className={classes.button}
              >
                {t('button-register')}
              </Button>
              <Button
                data-testid="login-button"
                variant="contained"
                disableElevation
                onClick={loginWithRedirect as MouseEventHandler}
                className={classes.button}
              >
                {t('button-connect')}
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
      >
        <img src={loginPageBackground} alt={t('alt-img-login-page-background')} className={classes.backgroundImage} />

        <Box display="flex" height="100%">
          <Box className={classes.infoContainer} data-testid="info-container">
            <Box className={classes.heading} data-testid="login-page-desktop-title">
              <Trans
                i18nKey="login-page-desktop-title"
                components={{ strong: <strong /> }}
              />
            </Box>
            <Box className={classes.info}>
              <p>
                <Trans
                  i18nKey="login-page-desktop-info-1"
                  components={{ strong: <strong /> }}
                />
              </p>
              <p>
                <Trans
                  i18nKey="login-page-desktop-info-2"
                  components={{ strong: <strong /> }}
                />
              </p>
              <p>
                <Trans
                  i18nKey="login-page-desktop-info-3"
                  components={{ strong: <strong /> }}
                />
              </p>
            </Box>
            {i18n.language !== LanguageCodes.Fr &&
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
    </React.Fragment>
  )
}

export default LoginPageDesktop
