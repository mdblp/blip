/*
 * Copyright (c) 2022-2025, Diabeloop
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

import React, { type FC, useState } from 'react'
import { useAuth } from '../../lib/auth'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Box from '@mui/material/Box'
import appConfig from '../../lib/config/config'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import { makeStyles } from 'tss-react/mui'
import Link from '@mui/material/Link'
import { diabeloopExternalUrls } from '../../lib/diabeloop-urls.model'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { setPageTitle } from '../../lib/utils'
import { UserAccount } from '../../lib/auth/models/user-account.model'

const style = makeStyles({ name: 'ylp-training-page' })((theme) => {
  return {
    mainContainer: {
      [theme.breakpoints.down('sm')]: {
        padding: 0
      }
    },
    card: {
      textAlign: 'center'
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
})

export const TrainingPage: FC = () => {
  const { t } = useTranslation('yourloops')
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const fromPath = location.state?.from?.pathname
  const user = auth.user
  const { classes } = style()
  const [trainingOpened, setTrainingOpened] = useState(false)
  const [checked, setChecked] = useState(false)

  const ackTraining = (): void => {
    const now = new Date().toISOString()
    const updatedUserAccount = user.account || {} as UserAccount
    updatedUserAccount.trainingAck = { acceptanceTimestamp: now, isAccepted: true }

    auth.updateUserAccount(updatedUserAccount).catch((reason: unknown) => {
      console.error(reason)
    }).finally(() => {
      navigate(fromPath ?? '/')
    })
  }

  setPageTitle(t('training'))

  return (
    <Container maxWidth="sm" className={classes.mainContainer} data-testid="training-container">
      <Grid
        container
        spacing={0}
        className={classes.centeredGrid}
        sx={{
          alignItems: "center",
          justifyContent: "center"
        }}>
        <Grid size={12}>
          <Card className={classes.card}>
            <CardMedia>
              <Box sx={{ marginY: 2 }}>
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
                  control={
                    <Checkbox
                      aria-label={t('training-checkbox')}
                      className={classes.checkbox}
                      checked={checked}
                      onChange={() => {
                        setChecked(!checked)
                      }}
                      name="training"
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
                    {t('button-confirm')}
                  </Button>
                  : <Link
                    underline="none"
                    href={diabeloopExternalUrls.training(user?.role)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      disableElevation
                      onClick={() => {
                        setTrainingOpened(true)
                      }}
                    >
                      {t('button-open-training')}
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
