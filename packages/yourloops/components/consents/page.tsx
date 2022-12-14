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

import React, { useMemo, useState } from 'react'
import _ from 'lodash'
import bows from 'bows'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { Theme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { useAuth } from '../../lib/auth'
import ConsentForm from './form'
import appConfig from '../../lib/config/config'
import { Profile } from '../../lib/auth/models/profile.model'
import { HistoryState } from '../../models/history-state.model'

interface ConsentProps {
  messageKey: string
}

const style = makeStyles({ name: 'ylp-component-consent' })((theme: Theme) => {
  return {
    mainContainer: {
      [theme.breakpoints.down('sm')]: {
        padding: 0
      }
    },
    card: {
      textAlign: 'center',
      padding: theme.spacing(4)
    },
    cardContent: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      [theme.breakpoints.down('md')]: {
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(0)
      }
    },
    centeredGrid: {
      minHeight: '90vh'
    },
    buttons: {
      display: 'flex',
      justifyContent: 'space-around',
      marginTop: theme.spacing(2),
      [theme.breakpoints.down('md')]: {
        justifyContent: 'space-between'
      }
    }
  }
})

/**
 * Renew consents page
 */
function Page(props: ConsentProps): JSX.Element {
  const { t } = useTranslation('yourloops')
  const historyHook = useHistory<HistoryState>()
  const auth = useAuth()
  const { classes } = style()
  const [policyAccepted, setPolicyAccepted] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [feedbackAccepted, setFeedbackAccepted] = useState(auth.user?.profile?.contactConsent?.isAccepted)
  const log = useMemo(() => bows('consent'), [])
  const fromPath = useMemo(() => historyHook.location.state?.from?.pathname, [historyHook])

  const user = auth.user

  if (user) {
    const consentsChecked = policyAccepted && termsAccepted
    // Ask for feedback only if the user is an HCP, and didn't have previously
    // see that option (e.g. Account created before it was implemented)
    const showFeedback = user.isUserHcp() && !user.profile?.contactConsent

    const onDecline = (): void => {
      auth.logout().catch((reason) => console.error('logout', reason))
    }

    const onConfirm = (): void => {
      const now = new Date().toISOString()
      const updatedProfile = _.cloneDeep(user.profile ?? {}) as Profile
      updatedProfile.termsOfUse = { acceptanceTimestamp: now, isAccepted: termsAccepted }
      updatedProfile.privacyPolicy = { acceptanceTimestamp: now, isAccepted: policyAccepted }
      if (showFeedback) {
        updatedProfile.contactConsent = { acceptanceTimestamp: now, isAccepted: feedbackAccepted }
      }
      auth.updateProfile(updatedProfile).catch((reason: unknown) => {
        log.error(reason)
      }).finally(() => {
        historyHook.push(fromPath ?? '/')
      })
    }

    return (
      <Container maxWidth="sm" className={classes.mainContainer}>
        <Grid
          container
          spacing={0}
          alignItems="center"
          justifyContent="center"
          className={classes.centeredGrid}
        >
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardMedia>
                <Box marginY={2}>
                  <img
                    src={`/branding_${appConfig.BRANDING}_logo.svg`}
                    height="60"
                    alt={t('alt-img-logo')}
                  />
                </Box>
              </CardMedia>
              <CardContent className={classes.cardContent}>
                <Typography variant="body1" gutterBottom>
                  {t(props.messageKey)}
                </Typography>
                <ConsentForm
                  id="login-renew-consents"
                  userRole={user.role}
                  policyAccepted={policyAccepted}
                  setPolicyAccepted={setPolicyAccepted}
                  termsAccepted={termsAccepted}
                  setTermsAccepted={setTermsAccepted}
                  feedbackAccepted={feedbackAccepted}
                  setFeedbackAccepted={showFeedback ? setFeedbackAccepted : undefined}
                />
                <div id="consent-button-group" className={classes.buttons}>
                  <Button
                    id="consent-button-decline"
                    onClick={onDecline}
                  >
                    {t('button-decline')}
                  </Button>
                  <Button
                    id="consent-button-confirm"
                    variant="contained"
                    color="primary"
                    disableElevation
                    disabled={!consentsChecked}
                    onClick={onConfirm}
                  >
                    {t('button-accept')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    )
  }
  return <React.Fragment />
}

export default Page
