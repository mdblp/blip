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

import React, { type FunctionComponent, useMemo, useState } from 'react'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'

import metrics from '../../lib/metrics'
import { useSignUpFormState } from './signup-formstate-context'
import { availableCountries } from '../../lib/language'
import { HcpProfessionList } from '../../lib/auth/models/enums/hcp-profession.enum'
import { useAuth } from '../../lib/auth'
import { useAlert } from '../../components/utils/snackbar'
import SignupStepperActionButtons from './signup-stepper-action-buttons'
import { type SignUpFormProps } from './signup-stepper'
import { UserRole } from '../../lib/auth/models/enums/user-role.enum'
import { SignupFormKey } from './models/enums/signup-form-key.enum'
import { logError } from '../../utils/error.util'
import { errorTextFromException } from '../../lib/utils'

interface Errors {
  firstName: boolean
  lastName: boolean
  country: boolean
  hcpProfession: boolean
}

const SignUpProfileForm: FunctionComponent<SignUpFormProps> = (props) => {
  const { completeSignup } = useAuth()
  const alert = useAlert()
  const { t } = useTranslation('yourloops')
  const { signupForm, updateForm } = useSignUpFormState()
  const { handleBack, handleNext } = props
  const [errors, setErrors] = useState<Errors>({
    firstName: false,
    lastName: false,
    country: false,
    hcpProfession: false
  })
  const [saving, setSaving] = useState<boolean>(false)

  const isFormEmpty = useMemo<boolean>(() => {
    return !_.some(errors) &&
      !signupForm.profileFirstname &&
      !signupForm.profileLastname &&
      !signupForm.profileCountry &&
      !signupForm.hcpProfession
  }, [errors, signupForm])

  const validateFirstname = (): boolean => {
    const err = !signupForm.profileFirstname.trim()
    setErrors({ ...errors, firstName: err })
    return !err
  }

  const validateLastname = (): boolean => {
    const err = !signupForm.profileLastname.trim()
    setErrors({ ...errors, lastName: err })
    return !err
  }

  const validateCountry = (): boolean => {
    const err = !signupForm.profileCountry
    setErrors({ ...errors, country: err })
    return !err
  }

  const validateHcpProfession = (): boolean => {
    let err = false
    if (signupForm.accountRole === UserRole.Hcp) {
      err = !signupForm.hcpProfession
      setErrors({ ...errors, hcpProfession: err })
    }
    return !err
  }

  const onFinishSignup = async (): Promise<void> => {
    if (validateFirstname() && validateLastname() && validateCountry() && validateHcpProfession()) {
      try {
        setSaving(true)
        await completeSignup(signupForm)
        metrics.send('registration', 'create_profile', signupForm.accountRole)
        handleNext()
      } catch (err) {
        const errorMessage = errorTextFromException(err)
        logError(errorMessage, 'complete-signup')

        alert.error(t('profile-update-failed'))
        setSaving(false)
      }
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <TextField
        data-testid="first-name"
        aria-label={t('first-name')}
        margin="normal"
        label={t('first-name')}
        value={signupForm.profileFirstname}
        required
        error={errors.firstName}
        onBlur={validateFirstname}
        onChange={event => { updateForm(SignupFormKey.ProfileFirstname, event.target.value) }}
        helperText={errors.firstName && t('required-field')}
      />
      <TextField
        data-testid="last-name"
        aria-label={t('last-name')}
        margin="normal"
        label={t('last-name')}
        value={signupForm.profileLastname}
        required
        error={errors.lastName}
        onBlur={validateLastname}
        onChange={event => { updateForm(SignupFormKey.ProfileLastname, event.target.value) }}
        helperText={errors.lastName && t('required-field')}
      />
      <FormControl
        margin="normal"
        required
        error={errors.country}
      >
        <InputLabel>
          {t('country')}
        </InputLabel>
        <Select
          label={t('country')}
          data-testid="country-selector"
          value={signupForm.profileCountry}
          onBlur={validateCountry}
          onChange={event => { updateForm(SignupFormKey.ProfileCountry, event.target.value) }}
        >
          {availableCountries.map((item) => (
            <MenuItem id={`signup-country-menuitem-${item.code}`} key={item.code} value={item.code}>
              {t(item.name)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {signupForm.accountRole === UserRole.Hcp &&
        <FormControl
          margin="normal"
          required
          error={errors.hcpProfession}
        >
          <InputLabel>
            {t('hcp-profession')}
          </InputLabel>
          <Select
            label={t('hcp-profession')}
            data-testid="hcp-profession-selector"
            value={signupForm.hcpProfession ?? ''}
            onBlur={validateHcpProfession}
            onChange={event => { updateForm(SignupFormKey.HcpProfession, event.target.value) }}
          >
            {HcpProfessionList.map((item) => (
              <MenuItem id={`signup-hcp-profession-menuitem-${item}`} key={item} value={item}>
                {t(item)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }

      <SignupStepperActionButtons
        nextButtonLabel={t('button-create-account')}
        inProgress={saving}
        disabled={_.some(errors) || saving || isFormEmpty}
        onClickBackButton={handleBack}
        onClickNextButton={onFinishSignup}
      />
    </Box>
  )
}

export default SignUpProfileForm
