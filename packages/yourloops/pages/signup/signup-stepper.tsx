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

import React, { FunctionComponent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'

import SignUpProfileForm from './signup-profile-form'
import SignUpConsent from './signup-consent'
import { useAuth } from '../../lib/auth'
import SignUpAccountSelector from './signup-account-selector'

export interface SignUpFormProps {
  handleBack: () => void
  handleNext: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
  stepper: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0)
  }
}))

const SignUpStepper: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const { stepper } = useStyles()
  const { logout } = useAuth()
  const history = useHistory()
  const [activeStep, setActiveStep] = useState(0)
  const steps = [
    'select-account-type',
    'consent',
    'create-profile'
  ]

  const handleNext = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = async (): Promise<void> => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1)
    } else {
      await logout()
    }
  }

  const redirectToHome = (): void => {
    history.replace('/')
  }

  const getStepContent = (step: number): JSX.Element | string => {
    switch (step) {
      case 0:
        return <SignUpAccountSelector handleBack={handleBack} handleNext={handleNext} />
      case 1:
        return <SignUpConsent handleBack={handleBack} handleNext={handleNext} />
      case 2:
        return <SignUpProfileForm handleBack={handleBack} handleNext={handleNext} />
      default:
        return t('signup-unknown-step')
    }
  }

  return (
    <React.Fragment>
      <Box
        marginX="auto"
        marginY={3}
        textAlign="center"
        maxWidth="60%"
      >
        <Typography variant="h5">
          {t('account-creation-finalization')}
        </Typography>
      </Box>
      <Stepper
        aria-label={t('signup-stepper')}
        activeStep={activeStep}
        alternativeLabel
        className={stepper}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel aria-label={t(label)}>{t(label)}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === steps.length
        ? <Box paddingX={2} paddingTop={1} textAlign="left">
          <Typography id="signup-steppers-ending-text-1" variant="h6" gutterBottom>
            {t('account-creation-finalized')}
          </Typography>
          <Typography gutterBottom>
            {t('account-created-info-1')}.
          </Typography>
          <Typography gutterBottom>
            {t('account-created-info-2')}.
          </Typography>
          <Box
            id="signup-consent-button-group"
            display="flex"
            justifyContent="center"
            mx={0}
            mt={4}
          >
            <Button
              id="button-signup-steppers-next"
              variant="contained"
              color="primary"
              disableElevation
              onClick={redirectToHome}
            >
              {t('continue')}
            </Button>
          </Box>
        </Box>
        : getStepContent(activeStep)
      }
    </React.Fragment>
  )
}

export default SignUpStepper
