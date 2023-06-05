/*
 * Copyright (c) 2021-2023, Diabeloop
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

import React, { type FunctionComponent, useMemo } from 'react'
import { tz } from 'moment-timezone'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'

import { useAuth } from '../../lib/auth'
import { useProfilePageState } from './profile-page-context'
import { profileFormCommonClasses } from './css-classes'
import { ProfileFormKey } from './models/enums/profile-form-key.enum'
import { Gender } from '../../lib/auth/models/enums/gender.enum'
import PatientUtils from '../../lib/patient/patient.util'

const PatientProfileForm: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const { user } = useAuth()
  const { errors, profileForm, updateProfileForm } = useProfilePageState()
  const { classes } = profileFormCommonClasses()

  const browserTimezone = useMemo(() => new Intl.DateTimeFormat().resolvedOptions().timeZone, [])

  const a1cDate = user.settings?.a1c?.rawdate
  const a1cValue = user.settings?.a1c?.value

  const genderIndeterminateLabel = PatientUtils.getGenderLabel(Gender.Indeterminate)
  const genderMaleLabel = PatientUtils.getGenderLabel(Gender.Male)
  const genderFemaleLabel = PatientUtils.getGenderLabel(Gender.Female)

  return (
    <React.Fragment>
      <Box className={classes.inputContainer}>
        <TextField
          id="profile-textfield-birthdate"
          label={t('date-of-birth')}
          variant="standard"
          value={profileForm.birthday}
          onChange={event => { updateProfileForm(ProfileFormKey.birthday, event.target.value) }}
          error={errors.birthday}
          helperText={errors.birthday && t('required-field')}
          className={classes.formInput}
          inputProps={{ maxLength: '10' }}
        />
        <TextField
          id="profile-textfield-birthplace"
          label={t('birthplace')}
          variant="standard"
          value={profileForm.birthPlace}
          onChange={event => { updateProfileForm(ProfileFormKey.birthPlace, event.target.value) }}
          className={classes.formInput}
          inputProps={{ maxLength: '50' }}
        />
      </Box>

      <Box className={classes.inputContainer}>
        <FormControl
          variant="standard"
          className={classes.formInput}
          error={errors.sex}
        >
          <InputLabel
            id="profile-select-gender-label"
            htmlFor="profile-select-gender"
          >
            {t('gender')}
          </InputLabel>
          <Select
            id="profile-select-gender"
            labelId="profile-select-gender-label"
            value={profileForm.sex}
            error={errors.sex}
            onChange={event => { updateProfileForm(ProfileFormKey.sex, event.target.value) }}
          >
            <MenuItem value={Gender.Indeterminate} aria-label={genderIndeterminateLabel}>{genderIndeterminateLabel}</MenuItem>
            <MenuItem value={Gender.Male} aria-label={genderMaleLabel}>{genderMaleLabel}</MenuItem>
            <MenuItem value={Gender.Female} aria-label={genderFemaleLabel}>{genderFemaleLabel}</MenuItem>
          </Select>
          <FormHelperText>{errors.sex && t('required-field')}</FormHelperText>
        </FormControl>
        {a1cValue && a1cDate &&
          <TextField
            label={t('patient-profile-hba1c', { hba1cDate: tz(a1cDate, browserTimezone).format('L') })}
            variant="standard"
            disabled
            value={`${a1cValue}%`}
            className={classes.formInput}
          />
        }
      </Box>
    </React.Fragment>
  )
}

export default PatientProfileForm
