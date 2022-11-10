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

import AccountCircle from '@material-ui/icons/AccountCircle'

import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'

import appConfig from '../../lib/config'
import { useAuth } from '../../lib/auth'
import { ProfileFormKey } from './models'
import { HcpProfession, HcpProfessionList } from '../../models/hcp-profession'
import BasicDropdownWithValidation from '../../components/dropdown/basic-dropdown-with-validation'
import CertifiedProfessionalIcon from '../../components/icons/certified-professional-icon'
import PatientProfileForm from './patient-form'
import { useProfilePageState } from './profile-page-context'
import { profileFormCommonClasses } from './css-classes'

const PersonalInfoForm: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const { user } = useAuth()
  const { profileForm, updateProfileForm, errors } = useProfilePageState()
  const classes = profileFormCommonClasses()

  return (
    <React.Fragment>
      <Box className={classes.categoryLabel}>
        <AccountCircle color="primary" />
        <strong className={classes.uppercase}>{t('personal-information')}</strong>
        {user.frProId && <CertifiedProfessionalIcon id={`certified-professional-icon-${user.id}`} />}
      </Box>

      <Box className={classes.inputContainer}>
        <TextField
          id="profile-textfield-firstname"
          label={t('firstname')}
          value={profileForm.firstName}
          onChange={event => updateProfileForm(ProfileFormKey.firstName, event.target.value)}
          error={errors.firstName}
          helperText={errors.firstName && t('required-field')}
          className={classes.formInput}
        />
        <TextField
          id="profile-textfield-lastname"
          label={t('lastname')}
          value={profileForm.lastName}
          onChange={event => updateProfileForm(ProfileFormKey.lastName, event.target.value)}
          error={errors.lastName}
          helperText={errors.lastName && t('required-field')}
          className={classes.formInput}
        />
      </Box>

      {user.isUserHcp() &&
        <Box className={classes.inputContainer}>
          <Box className={classes.formInput}>
            <BasicDropdownWithValidation
              onSelect={(value: string) => updateProfileForm(ProfileFormKey.hcpProfession, value)}
              defaultValue={profileForm.hcpProfession}
              disabledValues={[HcpProfession.empty]}
              values={HcpProfessionList.filter(item => item !== HcpProfession.empty)}
              id="profession"
              dataTestId="hcp-profession-selector"
              inputTranslationKey="hcp-profession"
              errorTranslationKey="profession-dialog-title"
            />
          </Box>

          {appConfig.ECPS_ENABLED && user.settings?.country === 'FR' &&
            <React.Fragment>
              {user.frProId &&
                <TextField
                  id="professional-account-number-text-field"
                  value={user.frProId}
                  label={t('professional-account-number')}
                  disabled
                  className={classes.formInput}
                />
              }
            </React.Fragment>
          }
        </Box>
      }

      {user.isUserPatient() && <PatientProfileForm />}
    </React.Fragment>
  )
}

export default PersonalInfoForm
