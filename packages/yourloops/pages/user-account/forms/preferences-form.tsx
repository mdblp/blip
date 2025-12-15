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
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

import { availableLanguageCodes, getLangName } from '../../../lib/language'
import { ConsentFeedback } from '../../../components/consents'
import { type LanguageCodes } from '../../../lib/auth/models/enums/language-codes.enum'
import { useUserAccountPageState } from '../user-account-page-context'
import { useAuth } from '../../../lib/auth'
import { userAccountFormCommonClasses } from '../css-classes'
import { UserAccountFormKey } from '../models/enums/user-account-form-key.enum'
import { type BgUnit, Unit } from 'medical-domain'
import Typography from '@mui/material/Typography'

export const PreferencesForm: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const { user } = useAuth()
  const { userAccountForm, updateUserAccountForm } = useUserAccountPageState()
  const { classes } = userAccountFormCommonClasses()

  const unitsLabel = t('units')
  const unitsLabelId = "units-input-label"
  const languageLabel = t('language')
  const languageLabelId = "language-input-label"

  return (
    <Box sx={{ marginTop: 4 }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>{t('preferences')}</Typography>

      <Box className={classes.inputContainer}>
        <FormControl variant="outlined" className={classes.formInput}>
          <InputLabel id={unitsLabelId}>{unitsLabel}</InputLabel>
          <Select
            disabled={user.isUserPatient()}
            labelId={unitsLabelId}
            label={unitsLabel}
            data-testid="user-account-units-selector"
            value={userAccountForm.units}
            onChange={event => {
              updateUserAccountForm(UserAccountFormKey.units, event.target.value as BgUnit)
            }}
          >
            <MenuItem id="user-account-units-mmoll" data-testid="user-account-units-mmoll" value={Unit.MmolPerLiter}>
              {Unit.MmolPerLiter}
            </MenuItem>
            <MenuItem id="user-account-units-mgdl" data-testid="user-account-units-mgdl" value={Unit.MilligramPerDeciliter}>
              {Unit.MilligramPerDeciliter}
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" className={classes.formInput}>
          <InputLabel id={languageLabelId}>{languageLabel}</InputLabel>
          <Select
            labelId={languageLabelId}
            label={languageLabel}
            data-testid="user-account-locale-selector"
            value={userAccountForm.lang}
            onChange={event => {
              updateUserAccountForm(UserAccountFormKey.lang, event.target.value as LanguageCodes)
            }}
          >
            {availableLanguageCodes.map((languageCode) => (
              <MenuItem id={`profile-locale-item-${languageCode}`} key={languageCode} value={languageCode}>
                {getLangName(languageCode)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {user.isUserHcp() &&
        <Box sx={{ marginTop: 1 }}>
          <ConsentFeedback
            id="user-account"
            userRole={user.role}
            checked={userAccountForm.feedbackAccepted}
            onChange={() => {
              updateUserAccountForm(UserAccountFormKey.feedbackAccepted, !userAccountForm.feedbackAccepted)
            }}
          />
        </Box>
      }
    </Box>
  )
}
