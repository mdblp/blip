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

import React, { type FunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'

import { useAuth } from '../../../lib/auth'
import { useUserAccountPageState } from '../user-account-page-context'
import { userAccountFormCommonClasses } from '../css-classes'
import { UserAccountFormKey } from '../models/enums/profile-form-key.enum'
import { Gender } from '../../../lib/auth/models/enums/gender.enum'
import PatientUtils from '../../../lib/patient/patient.util'

export const PatientProfileForm: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const { user } = useAuth()
  const { errors, userAccountForm, updateUserAccountForm } = useUserAccountPageState()
  const { classes } = userAccountFormCommonClasses()

  const genderLabel = t('gender')
  const genderLabelId = "gender-input-label"

  const genderIndeterminateLabel = PatientUtils.getGenderLabel(Gender.Indeterminate)
  const genderMaleLabel = PatientUtils.getGenderLabel(Gender.Male)
  const genderFemaleLabel = PatientUtils.getGenderLabel(Gender.Female)

  return (
    <Box className={classes.inputContainer}>
      <TextField
        disabled={true}
        id="account-textfield-email"
        label={t('email')}
        variant="outlined"
        value={user.email}
        className={classes.formInput}
        inputProps={{ maxLength: '50' }}
      />
      <FormControl
        variant="outlined"
        className={classes.formInput}
        error={errors.sex}
      >
        <InputLabel
          id={genderLabelId}
          htmlFor="profile-select-gender"
        >
          {genderLabel}
        </InputLabel>
        <Select
          id="profile-select-gender"
          labelId={genderLabelId}
          label={genderLabel}
          value={userAccountForm.sex}
          error={errors.sex}
          onChange={event => {
            updateUserAccountForm(UserAccountFormKey.sex, event.target.value)
          }}
        >
          <MenuItem value={Gender.Indeterminate}
                    aria-label={genderIndeterminateLabel}>{genderIndeterminateLabel}</MenuItem>
          <MenuItem value={Gender.Male} aria-label={genderMaleLabel}>{genderMaleLabel}</MenuItem>
          <MenuItem value={Gender.Female} aria-label={genderFemaleLabel}>{genderFemaleLabel}</MenuItem>
        </Select>
        <FormHelperText>{errors.sex && t('required-field')}</FormHelperText>
      </FormControl>
    </Box>
  )
}
