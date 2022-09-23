/**
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

import React, { FunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles, Theme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Paper from '@material-ui/core/Paper'

import metrics from '../../lib/metrics'
import SignupRadioLabel from './signup-radio-label'
import { useSignUpFormState } from './signup-formstate-context'
import SignupStepperActionButtons from './signup-stepper-action-buttons'
import { UserRoles } from '../../models/user'
import { SignUpFormProps } from './signup-stepper'
import { SignupFormKey } from './signup-form-reducer'
import { HcpProfession } from '../../models/hcp-profession'

const useStyles = makeStyles((theme: Theme) => ({
  Paper: {
    textAlign: 'start',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  FormControlLabel: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}))

const SignUpAccountSelector: FunctionComponent<SignUpFormProps> = (props) => {
  const { t } = useTranslation('yourloops')
  const classes = useStyles()
  const { state, dispatch } = useSignUpFormState()
  const { handleBack, handleNext } = props

  const isInvalidRole = state.accountRole === UserRoles.unset || state.accountRole === UserRoles.patient

  const handleRadioChange = (value: string, key: SignupFormKey): void => {
    dispatch({ type: 'EDIT_FORMVALUE', key, value })
    if (value === UserRoles.caregiver) {
      dispatch({ type: 'EDIT_FORMVALUE', key: 'hcpProfession', value: HcpProfession.empty })
      dispatch({ type: 'EDIT_FORMVALUE', key: 'feedback', value: false })
    }
  }

  const onNext = (): void => {
    handleNext()
    metrics.send('registration', 'select_account_type', state.accountRole)
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
        <RadioGroup
          aria-label="account-selector"
          name="account-selector"
          value={state.accountRole}
          onChange={event => handleRadioChange(event.target.value, 'accountRole')}
        >
          <Paper elevation={3} className={classes.Paper}>
            <FormControlLabel
              className={classes.FormControlLabel}
              value={UserRoles.caregiver}
              control={<Radio id="signup-account-selector-radio-caregiver" color="primary" />}
              label={
                <SignupRadioLabel
                  header={t('signup-radiolabel-caregiver-header')}
                  body={t('signup-radiolabel-caregiver-body')}
                />
              }
            />
          </Paper>
          <Paper elevation={3} className={classes.Paper}>
            <FormControlLabel
              className={classes.FormControlLabel}
              value={UserRoles.hcp}
              control={<Radio id="signup-account-selector-radio-hcp" color="primary" />}
              label={
                <SignupRadioLabel
                  header={t('signup-radiolabel-hcp-header')}
                  body={t('signup-radiolabel-hcp-body')}
                />
              }
            />
          </Paper>
          <Paper elevation={3} className={classes.Paper}>
            <FormControlLabel
              disabled
              className={classes.FormControlLabel}
              value={UserRoles.patient}
              id="form-label-signup-account-patient"
              control={<Radio id="signup-account-selector-radio-patient" color="primary" />}
              label={
                <SignupRadioLabel
                  header={t('signup-radiolabel-patient-header')}
                  body={t('signup-radiolabel-patient-body')}
                />
              }
            />
          </Paper>
        </RadioGroup>

      <SignupStepperActionButtons
        nextButtonLabel={t('next')}
        disabled={isInvalidRole}
        onClickBackButton={handleBack}
        onClickNextButton={onNext}
      />
    </Box>
  )
}

export default SignUpAccountSelector
