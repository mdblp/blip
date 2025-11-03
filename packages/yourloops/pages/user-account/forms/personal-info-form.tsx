/*
 * Copyright (c) 2022-2025, Diabeloop
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
import TextField from '@mui/material/TextField'

import { useAuth } from '../../../lib/auth'
import { HcpProfession, HcpProfessionList } from '../../../lib/auth/models/enums/hcp-profession.enum'
import BasicDropdownWithValidation from '../../../components/dropdown/basic-dropdown-with-validation'
import { PatientProfileForm } from './patient-account-form'
import { useUserAccountPageState } from '../user-account-page-context'
import { userAccountFormCommonClasses } from '../css-classes'
import { UserAccountFormKey } from '../models/enums/user-account-form-key.enum'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import { availableCountries } from '../../../lib/language'
import MenuItem from '@mui/material/MenuItem'
import FormGroup from '@mui/material/FormGroup'
import Typography from '@mui/material/Typography'

export const PersonalInfoForm: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const { user } = useAuth()
  const { userAccountForm, updateUserAccountForm, errors } = useUserAccountPageState()
  const { classes } = userAccountFormCommonClasses()

  const countryLabel = t('country')
  const countryLabelId = "country-input-label"

  return (
    <React.Fragment>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>{t('personal-information')}</Typography>

      <Box className={classes.inputContainer}>
        <TextField
          data-testid="user-account-first-name"
          label={t('first-name')}
          variant="outlined"
          value={userAccountForm.firstName}
          onChange={event => {
            updateUserAccountForm(UserAccountFormKey.firstName, event.target.value)
          }}
          error={errors.firstName}
          helperText={errors.firstName && t('required-field')}
          className={classes.formInput}
        />
        <TextField
          data-testid="user-account-last-name"
          label={t('last-name')}
          variant="outlined"
          value={userAccountForm.lastName}
          onChange={event => {
            updateUserAccountForm(UserAccountFormKey.lastName, event.target.value)
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
                updateUserAccountForm(UserAccountFormKey.hcpProfession, value)
              }}
              defaultValue={userAccountForm.hcpProfession}
              disabledValues={[HcpProfession.empty]}
              values={HcpProfessionList.filter(item => item !== HcpProfession.empty)}
              id="profession"
              inputTranslationKey="hcp-profession"
              errorTranslationKey="profession-dialog-title"
            />
          </Box>
          <FormControl
            margin="normal"
            variant="outlined"
          >
            <FormGroup>
              <InputLabel id={countryLabelId}>{countryLabel}</InputLabel>
              <Select
                label={countryLabel}
                labelId={countryLabelId}
                data-testid="country-selector"
                value={userAccountForm.country}
                onChange={event => {
                  updateUserAccountForm(UserAccountFormKey.country, event.target.value)
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
