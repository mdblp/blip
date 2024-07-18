/*
 * Copyright (c) 2024, Diabeloop
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
import { setPageTitle } from '../../lib/utils'
import { Trans, useTranslation } from 'react-i18next'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import appConfig from '../../lib/config/config'
import CardContent from '@mui/material/CardContent'
import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useAuth } from '../../lib/auth'
import Alert from '@mui/material/Alert'
import { useAuth0 } from '@auth0/auth0-react'

const formStyle = makeStyles({ name: 'signup-page-styles' })((theme: Theme) => ({
  card: {
    marginBlock: theme.spacing(2)
  },
  cardContent: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    padding: `0 ${theme.spacing(4)}`
  },
  logoHeader: {
    margin: theme.spacing(2)
  }
}))

const AUTH0_SCREEN_HINT_SIGNUP = 'signup'

export const SignupInformationPage: FC = () => {
  const { t } = useTranslation('yourloops')
  const { classes } = formStyle()
  const { logout } = useAuth()
  const { loginWithRedirect } = useAuth0()

  setPageTitle(t('signup-information'))

  const onClickCancelButton = () => {
    logout()
  }

  const onClickRegisterButton = async () => {
    await loginWithRedirect({ authorizationParams: { screen_hint: AUTH0_SCREEN_HINT_SIGNUP } })
  }

  return (
    <Container maxWidth="sm" data-testid="signup-information-content">
      <Grid
        container
        spacing={0}
        alignItems="center"
        justifyContent="center"
        minHeight="90vh"
      >
        <Grid item xs={12}>
            <Card className={classes.card} elevation={4}>
              <CardMedia className={classes.logoHeader}>
                <img src={`/branding_${appConfig.BRANDING}_logo.svg`} height={35} alt={t('alt-img-logo')} data-testid="yourloops-logo" />
              </CardMedia>
              <CardContent className={classes.cardContent}>
                <Box
                  marginX="auto"
                  marginY={3}
                  textAlign="center"
                  maxWidth="60%"
                >
                  <Typography variant="h5">
                    {t('signup-information')}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <p>{t('signup-information-message-1')}</p>

                  <Alert severity="info" data-testid="signup-information-alert">
                    <Trans
                      i18nKey="signup-information-message-2"
                      t={t}
                      components={{ strong: <strong /> }}
                      parent={React.Fragment}
                    />
                    <p>{t('signup-information-message-3')}</p>
                  </Alert>
                </Box>
                <Box
                  display="flex"
                  justifyContent="end"
                  mx={0}
                  mt={4}
                >
                  <Box marginRight={2}>
                    <Button
                      variant="outlined"
                      data-testid="cancel-button"
                      onClick={onClickCancelButton}
                    >
                      {t('button-cancel')}
                    </Button>
                  </Box>
                  <Box marginRight={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      disableElevation
                      onClick={onClickRegisterButton}
                    >
                      {t('button-register')}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
