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
import { FormValuesType, useSignUpFormState } from './signup-formstate-context'
import { availableCountries } from '../../lib/language'
import { HcpProfessionList } from '../../models/hcp-profession'
import { useAuth } from '../../lib/auth'
import { UserRoles } from '../../models/user'
import { useAlert } from '../../components/utils/snackbar'
import SignupStepperActionButtons from './signup-stepper-action-buttons'
import { SignUpFormProps } from './signup-stepper'

interface Errors {
  firstName: boolean
  lastName: boolean
  country: boolean
  hcpProfession: boolean
}

const SignUpProfileForm: FunctionComponent<SignUpFormProps> = (props) => {
  const { user, completeSignup } = useAuth()
  const userRole = user?.role
  const alert = useAlert()
  const { t } = useTranslation('yourloops')
  const { state, dispatch } = useSignUpFormState()
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
      !state.formValues?.profileFirstname &&
      !state.formValues?.profileLastname &&
      !state.formValues?.profileCountry &&
      !state.formValues?.hcpProfession
  }, [errors, state.formValues])

  const onChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    keyField: FormValuesType
  ): void => {
    dispatch({
      type: 'EDIT_FORMVALUE',
      key: keyField,
      value: event.target.value
    })
  }

  const onSelectChange = (
    event: React.ChangeEvent<{
      name?: string | undefined
      value: string | unknown
    }>,
    keyField: FormValuesType
  ): void => {
    dispatch({
      type: 'EDIT_FORMVALUE',
      key: keyField,
      value: event.target.value as string
    })
  }

  const validateFirstName = (): boolean => {
    const err = !state.formValues?.profileFirstname.trim()
    setErrors({ ...errors, firstName: err })
    return !err
  }

  const validateLastName = (): boolean => {
    const err = !state.formValues?.profileLastname.trim()
    setErrors({ ...errors, lastName: err })
    return !err
  }

  const validateCountry = (): boolean => {
    const err = !state.formValues?.profileCountry
    setErrors({ ...errors, country: err })
    return !err
  }

  const validateHcpProfession = (): boolean => {
    let err = false
    if (userRole === UserRoles.hcp) {
      err = !state.formValues?.hcpProfession
      setErrors({ ...errors, hcpProfession: err })
    }
    return !err
  }

  const onFinishSignup = async (): Promise<void> => {
    if (validateFirstName() && validateLastName() && validateCountry() && validateHcpProfession()) {
      try {
        setSaving(true)
        await completeSignup(state.formValues)
        metrics.send('registration', 'create_profile', userRole)
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
        id="firstname"
        margin="normal"
        label={t('firstname')}
        variant="outlined"
        value={state.formValues?.profileFirstname}
        required
        error={errors.firstName}
        onBlur={() => validateFirstName()}
        onChange={(e) => onChange(e, 'profileFirstname')}
        helperText={errors.firstName && t('required-field')}
      />
      <TextField
        id="lastname"
        margin="normal"
        label={t('lastname')}
        variant="outlined"
        value={state.formValues?.profileLastname}
        required
        error={errors.lastName}
        onBlur={() => validateLastName()}
        onChange={(e) => onChange(e, 'profileLastname')}
        helperText={errors.lastName && t('required-field')}
      />
      <FormControl
        variant="outlined"
        margin="normal"
        required
        error={errors.country}
      >
        <InputLabel id="country-selector-input-label">
          {t('signup-country')}
        </InputLabel>
        <Select
          labelId="country-selector-label"
          label={t('signup-country')}
          id="country-selector"
          value={state.formValues?.profileCountry}
          onBlur={() => validateCountry()}
          onChange={(e) => onSelectChange(e, 'profileCountry')}
        >
          <MenuItem key="" value="" />
          {availableCountries.map((item) => (
            <MenuItem id={`signup-country-menuitem-${item.code}`} key={item.code} value={item.code}>
              {t(item.name)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {userRole === UserRoles.hcp &&
        <FormControl
          variant="outlined"
          margin="normal"
          required
          error={errors.hcpProfession}
        >
          <InputLabel id="hcp-profession-selector-input-label">
            {t('hcp-profession')}
          </InputLabel>
          <Select
            labelId="hcp-profession-selector-label"
            label={t('hcp-profession')}
            id="hcp-profession-selector"
            value={state.formValues?.hcpProfession}
            onBlur={validateHcpProfession}
            onChange={(e) => onSelectChange(e, 'hcpProfession')}
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
        nextButtonLabel={t('signup-steppers-create-account')}
        disabled={_.some(errors) || saving || isFormEmpty}
        onClickBackButton={handleBack}
        onClickNextButton={onFinishSignup}
      />
    </Box>
  )
}

export default SignUpProfileForm
