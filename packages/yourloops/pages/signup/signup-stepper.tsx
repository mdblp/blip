/*
 * Copyright (c) 2021-2026, Diabeloop
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

import React, { type FunctionComponent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import SignUpProfileForm from './signup-profile-form'
import SignUpConsent from './signup-consent'
import { useAuth } from '../../lib/auth'
import SignUpAccountSelector from './signup-account-selector'
import { SignupCompleteMessage } from './signup-complete-message'
import SignupStepperActionButtons from './signup-stepper-action-buttons'
import { useSignupInvitations } from './use-signup-invitations.hook'
import { useSignUpFormState } from './signup-formstate-context'
import { SignupInvitationsStatus } from './models/enums/signup-invitations-status.enum'
import { SignupStep } from './models/enums/signup-step.enum'
import { SignupFormKey } from './models/enums/signup-form-key.enum'
import { UserRole } from '../../lib/auth/models/enums/user-role.enum'
import metrics from '../../lib/metrics'

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
  const { signupForm, updateForm } = useSignUpFormState()
  const { status, hasInvitations, retry } = useSignupInvitations()
  const [activeStep, setActiveStep] = useState(0)

  // A user with pending team invitations can only be a HCP: the account type selection is skipped
  const steps = hasInvitations
    ? [SignupStep.Consent, SignupStep.Profile]
    : [SignupStep.AccountType, SignupStep.Consent, SignupStep.Profile]
  const mustForceHcpRole = status === SignupInvitationsStatus.Ready && hasInvitations
  const isRoleForced = mustForceHcpRole && signupForm.accountRole === UserRole.Hcp

  useEffect(() => {
    if (mustForceHcpRole && signupForm.accountRole !== UserRole.Hcp) {
      updateForm(SignupFormKey.AccountRole, UserRole.Hcp)
      metrics.send('registration', 'select_account_type', UserRole.Hcp)
    }
  }, [mustForceHcpRole, signupForm.accountRole, updateForm])

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

  const renderStep = (): React.ReactNode => {
    if (activeStep >= steps.length) {
      return <SignupCompleteMessage />
    }
    switch (steps[activeStep]) {
      case SignupStep.AccountType:
        return <SignUpAccountSelector handleBack={handleBack} handleNext={handleNext} />
      case SignupStep.Consent:
        return <SignUpConsent handleBack={handleBack} handleNext={handleNext} />
      case SignupStep.Profile:
        return <SignUpProfileForm handleBack={handleBack} handleNext={handleNext} />
    }
  }

  const renderContent = (): React.ReactNode => {
    if (status === SignupInvitationsStatus.Error) {
      return (
        <Box sx={{ marginY: 3 }}>
          <Alert id="signup-invitations-error" severity="error">
            {t('signup-invitations-loading-error')}
          </Alert>
          <SignupStepperActionButtons
            nextButtonLabel={t('button-retry')}
            disabled={false}
            onClickBackButton={logout}
            onClickNextButton={retry}
          />
        </Box>
      )
    }
    if (status === SignupInvitationsStatus.Loading || (hasInvitations && !isRoleForced)) {
      return (
        <Box sx={{ textAlign: 'center', marginY: 3 }}>
          <CircularProgress data-testid="signup-invitations-loading" aria-label={t('account-creation-finalization')} />
        </Box>
      )
    }
    return (
      <React.Fragment>
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
        {renderStep()}
      </React.Fragment>
    )
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
      {renderContent()}
    </React.Fragment>
  )
}
