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
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import appConfig from '../../lib/config'

const loginStyle = makeStyles((theme: Theme) => {
  return {
    card: {
      padding: theme.spacing(2)
    },
    cardContent: {
      textAlign: 'center',
      margin: `${theme.spacing(2)} 0`
    },
    cardActions: {
      justifyContent: 'center'
    }
  }
}, { name: 'login-page-styles' })

const LoginPage: FunctionComponent = () => {
  const { loginWithRedirect, error, logout } = useAuth0()
  const { t } = useTranslation('yourloops')
  const { cardContent, card, cardActions } = loginStyle()

  const onClickLogout = async (): Promise<void> => {
    await logout({ returnTo: window.location.origin })
  }

  if (error) {
    console.log(error)
  }

  return (
    <Container maxWidth="sm">
      <Card className={card} elevation={4}>
        <CardMedia>
          <img
            src={`/branding_${appConfig.BRANDING}_logo.svg`}
            height={35}
            alt={t('alt-img-logo')}
          />
        </CardMedia>
        <CardContent className={cardContent}>
          {error
            ? <Typography variant="h6">
              {t('valid-email-alert')}
            </Typography>
            : <Typography variant="h6" data-testid="welcome-message">
              {t('welcome-message')}
            </Typography>
          }
        </CardContent>
        <CardActions className={cardActions}>
          <Button
            id="login-button"
            variant="contained"
            color="primary"
            disableElevation
            onClick={loginWithRedirect}
          >
            {t(error ? 'refresh' : 'login')}
          </Button>
          {error
            ? <Button
              variant="contained"
              color="primary"
              disableElevation
              onClick={onClickLogout}
            >
              {t('logout')}
            </Button>
            : <Button
              variant="contained"
              color="primary"
              disableElevation
              onClick={async () => await loginWithRedirect({ screen_hint: 'signup' })}
            >
              {t('register')}
            </Button>
          }
        </CardActions>
      </Card>
    </Container>
  )
}

export default LoginPage
