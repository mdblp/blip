/*
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

import Tune from '@material-ui/icons/Tune'

import Box from '@material-ui/core/Box'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'

import { availableLanguageCodes, getLangName } from '../../lib/language'
import { ConsentFeedback } from '../../components/consents'
import { UserRoles } from '../../models/user'
import { Units } from '../../models/generic'
import { LanguageCodes } from '../../models/locales'
import { useProfilePageState } from './profile-page-context'
import { ProfileFormKey } from './models'
import { useAuth } from '../../lib/auth'
import { profileFormCommonClasses } from './css-classes'

const PreferencesForm: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const { user } = useAuth()
  const { profileForm, updateProfileForm } = useProfilePageState()
  const classes = profileFormCommonClasses()

  return (
    <React.Fragment>
      <Box className={classes.categoryLabel}>
        <Tune color="primary" />
        <strong className={classes.uppercase}>{t('preferences')}</strong>
      </Box>

      <Box className={classes.inputContainer}>
        <FormControl className={classes.formInput}>
          <InputLabel id="profile-units-input-label">{t('units')}</InputLabel>
          <Select
            disabled={user.role === UserRoles.patient}
            labelId="unit-selector"
            id="profile-units-selector"
            data-testid="profile-units-selector"
            value={profileForm.units}
            onChange={event => updateProfileForm(ProfileFormKey.units, event.target.value as Units)}
          >
            <MenuItem id="profile-units-mmoll" value={Units.mole}>
              {Units.mole}
            </MenuItem>
            <MenuItem id="profile-units-mgdl" value={Units.gram}>
              {Units.gram}
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formInput}>
          <InputLabel id="profile-language-input-label">{t('language')}</InputLabel>
          <Select
            labelId="locale-selector"
            id="profile-locale-selector"
            data-testid="profile-local-selector"
            value={profileForm.lang}
            onChange={event => updateProfileForm(ProfileFormKey.lang, event.target.value as LanguageCodes)}
          >
            {availableLanguageCodes.map((languageCode) => (
              <MenuItem id={`profile-locale-item-${languageCode}`} key={languageCode} value={languageCode}>
                {getLangName(languageCode)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {user.role === UserRoles.hcp &&
        <Box marginTop={1}>
          <ConsentFeedback
            id="profile"
            userRole={user.role}
            checked={profileForm.feedbackAccepted}
            onChange={() => updateProfileForm(ProfileFormKey.feedbackAccepted, !profileForm.feedbackAccepted)}
          />
        </Box>
      }
    </React.Fragment>
  )
}

export default PreferencesForm
