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
import { useSignUpFormState } from './signup-formstate-context'
import { SignUpFormProps } from './signup-stepper'
import SignupStepperActionButtons from './signup-stepper-action-buttons'
import { SignupFormKey } from './signup-form-reducer'

const SignUpConsent: FunctionComponent<SignUpFormProps> = (props) => {
  const { t } = useTranslation('yourloops')
  const { handleBack, handleNext } = props
  const { state, dispatch } = useSignUpFormState()
  const consentsChecked = state.terms && state.privacyPolicy

  const handleChange = (value: boolean, key: SignupFormKey): void => {
    dispatch({ type: 'EDIT_FORMVALUE', key, value })
  }

  const setPolicyAccepted = (value: boolean): void => {
    handleChange(value, 'privacyPolicy')
  }

  const setTermsAccepted = (value: boolean): void => {
    handleChange(value, 'terms')
  }

  const setFeedbackAccepted = (value: boolean): void => {
    handleChange(value, 'feedback')
  }

  const onNext = (): void => {
    handleNext()
    metrics.send('registration', 'accept_terms', state.accountRole)
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      data-testid="consents"
    >
      <ConsentForm
        id="signup"
        userRole={state.accountRole}
        policyAccepted={state.privacyPolicy}
        setPolicyAccepted={setPolicyAccepted}
        termsAccepted={state.terms}
        setTermsAccepted={setTermsAccepted}
        feedbackAccepted={state.feedback}
        setFeedbackAccepted={setFeedbackAccepted}
      />

      <SignupStepperActionButtons
        nextButtonLabel={t('next')}
        disabled={!consentsChecked}
        onClickBackButton={handleBack}
        onClickNextButton={onNext}
      />
    </Box>
  )
}

export default SignUpConsent
