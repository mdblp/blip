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

import React, { type FunctionComponent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import SignUpProfileForm from './signup-profile-form'
import SignUpConsent from './signup-consent'
import { useAuth } from '../../lib/auth'
import SignUpAccountSelector from './signup-account-selector'
import { SignupCompleteMessage } from './signup-complete-message'

export interface SignUpFormProps {
  handleBack: () => void
  handleNext: () => void
}

const useStyles = makeStyles()((theme) => ({
  stepper: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0)
  }
}))

export const SignUpStepper: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const { classes: { stepper } } = useStyles()
  const { logout } = useAuth()
  const steps = ['select-account-type', 'consent', 'create-profile']
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = (): void => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1)
    } else {
      logout()
    }
  }

  return (
    <React.Fragment>
      <Box
        sx={{
          marginX: "auto",
          marginY: 3,
          textAlign: "center",
          maxWidth: "60%"
        }}>
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

      {activeStep === 0 && <SignUpAccountSelector handleBack={handleBack} handleNext={handleNext} />}
      {activeStep === 1 && <SignUpConsent handleBack={handleBack} handleNext={handleNext} />}
      {activeStep === 2 && <SignUpProfileForm handleBack={handleBack} handleNext={handleNext} />}
      {activeStep === 3 && <SignupCompleteMessage />}
    </React.Fragment>
  )
}
