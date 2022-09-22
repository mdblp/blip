/**
 * Copyright (c) 2021, Diabeloop
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

import Box from '@material-ui/core/Box'

import metrics from '../../lib/metrics'
import { ConsentForm } from '../../components/consents'
import { useSignUpFormState, FormValuesType } from './signup-formstate-context'
import { useAuth } from '../../lib/auth'
import { SignUpFormProps } from './signup-stepper'
import SignupStepperActionButtons from './signup-stepper-action-buttons'

const SignUpConsent: FunctionComponent<SignUpFormProps> = (props) => {
  const { user } = useAuth()
  const userRole = user?.role
  const { t } = useTranslation('yourloops')
  const { handleBack, handleNext } = props
  const { state, dispatch } = useSignUpFormState()
  const consentsChecked = state.formValues.terms && state.formValues.privacyPolicy

  const handleChange = (checked: boolean, keyField: FormValuesType): void => {
    dispatch({ type: 'EDIT_FORMVALUE', key: keyField, value: checked })
  }

  const setPolicyAccepted: React.Dispatch<boolean> = (value: boolean): void => {
    handleChange(value, 'privacyPolicy')
  }

  const setTermsAccepted: React.Dispatch<boolean> = (value: boolean): void => {
    handleChange(value, 'terms')
  }

  const setFeedbackAccepted: React.Dispatch<boolean> = (value: boolean): void => {
    handleChange(value, 'feedback')
  }

  const onNext = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault()
    handleNext()
    metrics.send('registration', 'accept_terms', userRole)
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <ConsentForm
        id="signup"
        userRole={userRole}
        policyAccepted={state.formValues.privacyPolicy}
        setPolicyAccepted={setPolicyAccepted}
        termsAccepted={state.formValues.terms}
        setTermsAccepted={setTermsAccepted}
        feedbackAccepted={state.formValues.feedback}
        setFeedbackAccepted={setFeedbackAccepted}
      />

      <SignupStepperActionButtons
        nextButtonLabel={t('signup-steppers-next')}
        disabled={!consentsChecked}
        onClickBackButton={handleBack}
        onClickNextButton={onNext}
      />
    </Box>
  )
}

export default SignUpConsent
