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

import React, { FunctionComponent, useMemo, useState } from 'react'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'

import metrics from '../../lib/metrics'
import { useSignUpFormState } from './signup-formstate-context'
import { availableCountries } from '../../lib/language'
import { HcpProfessionList } from '../../models/hcp-profession'
import { useAuth } from '../../lib/auth'
import { UserRoles } from '../../models/user'
import { useAlert } from '../../components/utils/snackbar'
import SignupStepperActionButtons from './signup-stepper-action-buttons'
import { SignUpFormProps } from './signup-stepper'
import { SignupFormKey } from '../../lib/auth/models'

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
  const { signupForm, setSignupForm } = useSignUpFormState()
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

  const onChange = (value: string | unknown, key: SignupFormKey): void => {
    setSignupForm(prevState => ({ ...prevState, [key]: value }))
  }

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
    if (signupForm.accountRole === UserRoles.hcp) {
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
        aria-label={t('firstName')}
        margin="normal"
        label={t('firstName')}
        variant="outlined"
        value={signupForm.profileFirstname}
        required
        error={errors.firstName}
        onBlur={validateFirstname}
        onChange={event => onChange(event.target.value, SignupFormKey.ProfileFirstname)}
        helperText={errors.firstName && t('required-field')}
      />
      <TextField
        aria-label={t('lastName')}
        margin="normal"
        label={t('lastName')}
        variant="outlined"
        value={signupForm.profileLastname}
        required
        error={errors.lastName}
        onBlur={validateLastname}
        onChange={event => onChange(event.target.value, SignupFormKey.ProfileLastname)}
        helperText={errors.lastName && t('required-field')}
      />
      <FormControl
        variant="outlined"
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
          onChange={event => onChange(event.target.value, SignupFormKey.ProfileCountry)}
        >
          {availableCountries.map((item) => (
            <MenuItem id={`signup-country-menuitem-${item.code}`} key={item.code} value={item.code}>
              {t(item.name)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {signupForm.accountRole === UserRoles.hcp &&
        <FormControl
          variant="outlined"
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
            value={signupForm.hcpProfession}
            onBlur={validateHcpProfession}
            onChange={event => onChange(event.target.value, SignupFormKey.HcpProfession)}
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
        nextButtonLabel={t('create-account')}
        disabled={_.some(errors) || saving || isFormEmpty}
        onClickBackButton={handleBack}
        onClickNextButton={onFinishSignup}
      />
    </Box>
  )
}

export default SignUpProfileForm
