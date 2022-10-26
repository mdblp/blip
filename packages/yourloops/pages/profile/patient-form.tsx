/**
 * Copyright (c) 2021, Diabeloop
 * Profile page - Patient part
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

import React, { FunctionComponent, useMemo } from 'react'
import { tz } from 'moment-timezone'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'

import { useAuth } from '../../lib/auth'
import { ProfileFormKey } from './models'
import { useProfilePageState } from './profile-page-context'
import { profileFormCommonClasses } from './css-classes'

const PatientProfileForm: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const { user } = useAuth()
  const { errors, profileForm, updateProfileForm } = useProfilePageState()
  const classes = profileFormCommonClasses()

  const browserTimezone = useMemo(() => new Intl.DateTimeFormat().resolvedOptions().timeZone, [])

  const a1cDate = user.settings?.a1c?.date
  const a1cValue = user.settings?.a1c?.value
  const country = user.settings?.country ?? ''

  return (
    <React.Fragment>
      <Box className={classes.inputContainer}>
        <TextField
          id="profile-textfield-birthdate"
          label={t('birthdate')}
          value={profileForm.birthday}
          onChange={event => updateProfileForm(ProfileFormKey.birthday, event.target.value)}
          error={errors.birthday}
          helperText={errors.birthday && t('required-field')}
          className={classes.formInput}
          inputProps={{ maxLength: '10' }}
        />
        <TextField
          id="profile-textfield-birthplace"
          label={t('birthplace')}
          value={profileForm.birthPlace}
          onChange={event => updateProfileForm(ProfileFormKey.birthPlace, event.target.value)}
          className={classes.formInput}
          inputProps={{ maxLength: '50' }}
        />
      </Box>
      {country === 'FR' &&
        <React.Fragment>
          <Box className={classes.inputContainer}>
            <TextField
              label={t('birth-first-name')}
              value={profileForm.birthFirstName}
              onChange={event => updateProfileForm(ProfileFormKey.birthFirstName, event.target.value)}
              error={errors.birthFirstName}
              helperText={errors.birthFirstName && t('required-field')}
              className={classes.formInput}
              inputProps={{ maxLength: '50' }}
            />
            <TextField
              label={t('birth-last-name')}
              value={profileForm.birthLastName}
              onChange={event => updateProfileForm(ProfileFormKey.birthLastName, event.target.value)}
              className={classes.formInput}
              error={errors.birthLastName}
              helperText={errors.birthLastName && t('required-field')}
              inputProps={{ maxLength: '50' }}
            />
          </Box>
          <Box className={classes.inputContainer}>
            <TextField
              label={t('birth-names')}
              value={profileForm.birthNames}
              onChange={event => updateProfileForm(ProfileFormKey.birthNames, event.target.value)}
              error={errors.birthNames}
              helperText={errors.birthNames && t('required-field')}
              className={classes.formInput}
              inputProps={{ maxLength: '50' }}
            />
            <TextField
              label={t('birth-place-insee-code')}
              value={profileForm.birthPlaceInseeCode}
              onChange={event => updateProfileForm(ProfileFormKey.birthPlaceInseeCode, event.target.value)}
              className={classes.formInput}
              error={errors.birthPlaceInseeCode}
              helperText={errors.birthPlaceInseeCode && t('required-field')}
            />
          </Box>
          <Box className={classes.inputContainer}>
            <TextField
              id="profile-textfield-ins"
              label={t('ins')}
              value={profileForm.ins}
              onChange={event => updateProfileForm(ProfileFormKey.ins, event.target.value)}
              className={classes.formInput}
              inputProps={{ maxLength: '15' }}
              error={errors.ins}
              helperText={errors.ins && t('field-with-exactly-15-characters')}
            />
            <TextField
              id="profile-textfield-ssn"
              label={t('ssn')}
              value={profileForm.ssn}
              onChange={event => updateProfileForm(ProfileFormKey.ssn, event.target.value)}
              className={classes.formInput}
              error={errors.ssn}
              helperText={errors.ssn && t('field-with-exactly-15-characters')}
              inputProps={{ maxLength: '15' }}
            />
          </Box>
          <TextField
            label={t('oid')}
            value={profileForm.oid}
            onChange={event => updateProfileForm(ProfileFormKey.oid, event.target.value)}
            className={classes.formInput}
            error={errors.oid}
            helperText={errors.oid && t('required-field')}
          />
        </React.Fragment>
      }

      <Box className={classes.inputContainer}>
        <FormControl className={`${classes.formInput}`}>
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
            onChange={event => updateProfileForm(ProfileFormKey.sex, event.target.value as string)}
          >
            <MenuItem value="" aria-label={t('none')}>{t('none')}</MenuItem>
            <MenuItem value="M" aria-label={t('male')}>{t('male')}</MenuItem>
            <MenuItem value="F" aria-label={t('female')}>{t('female')}</MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="profile-textfield-referring-doctor"
          label={t('referring-doctor')}
          value={profileForm.referringDoctor}
          onChange={event => updateProfileForm(ProfileFormKey.referringDoctor, event.target.value)}
          className={classes.formInput}
          inputProps={{ maxLength: '50' }}
        />
      </Box>

      {a1cValue && a1cDate &&
        <TextField
          id="hbA1c"
          label={t('patient-profile-hba1c', { hba1cMoment: tz(a1cDate, browserTimezone).format('L') })}
          disabled
          value={`${a1cValue}%`}
          className={classes.formInput}
        />
      }
    </React.Fragment>
  )
}

export default PatientProfileForm
