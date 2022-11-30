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

import { Theme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

import SignUpStepper from './signup-stepper'
import { SignUpFormStateProvider } from './signup-formstate-context'
import appConfig from '../../lib/config'

const formStyle = makeStyles((theme: Theme) => ({
  card: {
    marginTop: theme.spacing(2)
  },
  cardContent: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    padding: `0 ${theme.spacing(4)}`
  },
  logoHeader: {
    margin: theme.spacing(2)
  }
}), { name: 'signup-page-styles' })

const CompleteSignUpPage: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const classes = formStyle()

  return (
    <Container maxWidth="sm">
      <Grid container spacing={0} alignItems="center" justifyContent="center">
        <Grid item xs={12}>
          <SignUpFormStateProvider>
            <Card id="card-signup" className={classes.card} elevation={4}>
              <CardMedia className={classes.logoHeader}>
                <img src={`/branding_${appConfig.BRANDING}_logo.svg`} height={35} alt={t('alt-img-logo')} />
              </CardMedia>
              <CardContent className={classes.cardContent}>
                <SignUpStepper />
              </CardContent>
            </Card>
          </SignUpFormStateProvider>
        </Grid>
      </Grid>
    </Container>
  )
}

export default CompleteSignUpPage
