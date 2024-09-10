/*
 * Copyright (c) 2021-2024, Diabeloop
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

import { type Theme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import loginPageBackground from 'images/login-page-background-mobile.png'
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

const styles = makeStyles({ name: 'login-page-styles' })((theme: Theme) => ({
  button: {
    fontSize: '1.1rem',
    width: '100%',
    paddingBlock: theme.spacing(1)
  },
  infoText: {
    fontFamily: 'MuseoSlab',
    fontSize: '1.8rem',
    lineHeight: '36px',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(4)
  },
  languageSelect: {
    fontWeight: 'bold',
    color: 'var(--logo-color)',
    fontSize: '1rem'
  },
  link: {
    textTransform: 'capitalize',
    fontFamily: 'MuseoSlab',
    fontWeight: 900,
    paddingTop: theme.spacing(1),
    fontSize: '1.4rem'
  },
  topBackground: {
    minWidth: '100%'
  }
}))

const LoginPageMobile: FunctionComponent = () => {
  const { loginWithRedirect } = useAuth0()
  const { t, i18n } = useTranslation()
  const { classes, theme } = styles()
  const { redirectToSignupInformation } = useLogin()

  return (
    <React.Fragment>
      <img
        src={loginPageBackground}
        alt={t('alt-img-login-page-background')}
        className={classes.topBackground}
      />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        marginTop={5}
        paddingX={2}
        height="100vh"
      >
        <img
          data-testid="header-main-logo"
          aria-label={t('alt-img-logo')}
          src={`/branding_${config.BRANDING}_logo.svg`}
          alt={t('alt-img-logo')}
          width="180"
        />

        <Typography data-testid="page-title" className={classes.infoText}>
          <Trans
            i18nKey="login-page-mobile-title"
            components={{ strong: <strong /> }}
          />
        </Typography>

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

        <Box
          width={`calc(100% - ${theme.spacing(4)})`}
          position="absolute"
          bottom={theme.spacing(4)}
        >
          <Box>
            <LanguageIcon
              data-testid="language-icon"
              sx={{ color: 'var(--logo-color)', marginRight: theme.spacing(1), fontSize: '1.4rem' }}
            />
            <LanguageSelect className={classes.languageSelect} />
          </Box>
          <Button
            data-testid="register-button"
            variant="outlined"
            disableElevation
            onClick={redirectToSignupInformation}
            className={classes.button}
            sx={{ marginBlock: theme.spacing(3) }}
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
        </Box>
      </Box>

    </React.Fragment>
  )
}

export default LoginPageMobile
