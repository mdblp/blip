/*
 * Copyright (c) 2022, Diabeloop
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

import React, { useState } from 'react'

import { useAuth } from '../../lib/auth'
import { useTranslation } from 'react-i18next'
import { Profile } from '../../models/user'
import bows from 'bows'
import { useHistory } from 'react-router-dom'
import { HistoryState } from '../../models/generic'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import Box from '@material-ui/core/Box'
import appConfig from '../../lib/config'
import CardContent from '@material-ui/core/CardContent'
import Container from '@material-ui/core/Container'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import { diabeloopExternalUrls } from '../../lib/diabeloop-url'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'

const style = makeStyles((theme: Theme) => {
  return {
    mainContainer: {
      [theme.breakpoints.down('xs')]: {
        padding: 0
      }
    },
    card: {
      textAlign: 'center'
    },
    cardContent: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(0)
      }
    },
    centeredGrid: {
      minHeight: '90vh'
    },
    buttons: {
      marginTop: theme.spacing(3)
    },
    checkbox: {
      marginBottom: 'auto'
    },
    formControlLabel: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    }
  }
}, { name: 'ylp-training-page' })

/**
 * Training Page
 */
function TrainingPage(): JSX.Element {
  const { t } = useTranslation('yourloops')
  const auth = useAuth()
  const log = bows('consent')
  const historyHook = useHistory<HistoryState>()
  const fromPath = historyHook.location.state?.from?.pathname
  const user = auth.user
  const classes = style()
  const [trainingOpened, setTrainingOpened] = useState(false)
  const [checked, setChecked] = useState(false)

  const ackTraining = (): void => {
    const now = new Date().toISOString()
    const updatedProfile = user.profile ? user.profile : {} as Profile
    updatedProfile.trainingAck = { acceptanceTimestamp: now, isAccepted: true }

    auth.updateProfile(updatedProfile).catch((reason: unknown) => {
      log.error(reason)
    }).finally(() => {
      historyHook.push(fromPath ?? '/')
    })
  }

  const training = t('training').toLowerCase()

  return (
    <Container maxWidth="sm" className={classes.mainContainer} data-testid="training-container">
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
              {trainingOpened
                ? <FormControlLabel
                  id={'form-control-training'}
                  control={
                    <Checkbox
                      id={'checkbox-training'}
                      aria-label={t('training-checkbox')}
                      className={classes.checkbox}
                      checked={checked}
                      onChange={() => setChecked(true)}
                      name="training"
                      color="primary"
                    />
                  }
                  label={t('acknowledge-training')}
                  className={classes.formControlLabel}
                />
                : t('training-body')
              }
              <div className={classes.buttons}>
                {trainingOpened
                  ? <Button
                    variant="contained"
                    color="primary"
                    disableElevation
                    onClick={ackTraining}
                    disabled={!checked}
                  >
                    {t('button-accept')}
                  </Button>
                  : <Link
                    underline="none"
                    aria-label={training}
                    href={diabeloopExternalUrls.training(user?.role)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      disableElevation
                      onClick={() => setTrainingOpened(true)}
                    >
                      {t('open-training')}
                    </Button>
                  </Link>
                }
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default TrainingPage
