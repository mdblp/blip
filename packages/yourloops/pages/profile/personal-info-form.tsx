/*
 * Copyright (c) 2022-2024, Diabeloop
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

import AccountCircle from '@mui/icons-material/AccountCircle'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

import { useAuth } from '../../lib/auth'
import { HcpProfession, HcpProfessionList } from '../../lib/auth/models/enums/hcp-profession.enum'
import BasicDropdownWithValidation from '../../components/dropdown/basic-dropdown-with-validation'
import CertifiedProfessionalIcon from '../../components/icons/certified-professional-icon'
import PatientProfileForm from './patient-form'
import { useProfilePageState } from './profile-page-context'
import { profileFormCommonClasses } from './css-classes'
import { ProfileFormKey } from './models/enums/profile-form-key.enum'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import { availableCountries } from '../../lib/language'
import MenuItem from '@mui/material/MenuItem'
import FormGroup from '@mui/material/FormGroup'

const PersonalInfoForm: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const { user } = useAuth()
  const { profileForm, updateProfileForm, errors } = useProfilePageState()
  const { classes } = profileFormCommonClasses()

  return (
    <React.Fragment>
      <Box className={classes.categoryLabel}>
        <AccountCircle color="primary" />
        <strong className={classes.uppercase}>{t('personal-information')}</strong>
        {user.frProId && <CertifiedProfessionalIcon />}
      </Box>

      <Box className={classes.inputContainer}>
        <TextField
          id="profile-textfield-firstname"
          data-testid="profile-first-name"
          label={t('first-name')}
          variant="standard"
          value={profileForm.firstName}
          onChange={event => {
            updateProfileForm(ProfileFormKey.firstName, event.target.value)
          }}
          error={errors.firstName}
          helperText={errors.firstName && t('required-field')}
          className={classes.formInput}
        />
        <TextField
          id="profile-textfield-lastname"
          data-testid="profile-last-name"
          label={t('last-name')}
          variant="standard"
          value={profileForm.lastName}
          onChange={event => {
            updateProfileForm(ProfileFormKey.lastName, event.target.value)
          }}
          error={errors.lastName}
          helperText={errors.lastName && t('required-field')}
          className={classes.formInput}
        />
      </Box>

      {user.isUserHcp() &&
        <Box className={classes.inputContainer}>
          <Box className={classes.formInput}>
            <BasicDropdownWithValidation
              onSelect={(value: string) => {
                updateProfileForm(ProfileFormKey.hcpProfession, value)
              }}
              defaultValue={profileForm.hcpProfession}
              disabledValues={[HcpProfession.empty]}
              values={HcpProfessionList.filter(item => item !== HcpProfession.empty)}
              id="profession"
              inputTranslationKey="hcp-profession"
              errorTranslationKey="profession-dialog-title"
            />
          </Box>
          <FormControl
            margin="normal"
            variant="standard"
          >
            <FormGroup>
              <InputLabel>
                {t('country')}
              </InputLabel>
              <Select
                label={t('country')}
                data-testid="country-selector"
                value={profileForm.country}
                onChange={event => {
                  updateProfileForm(ProfileFormKey.country, event.target.value)
                }}
              >
                {availableCountries.map((item) => (
                  <MenuItem key={item.code} value={item.code}>
                    {t(item.name)}
                  </MenuItem>
                ))}
              </Select>
            </FormGroup>
          </FormControl>
        </Box>
      }

      {user.isUserPatient() && <PatientProfileForm />}
    </React.Fragment>
  )
}

export default PersonalInfoForm
