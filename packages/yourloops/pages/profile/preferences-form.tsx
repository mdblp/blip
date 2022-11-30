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

import React from 'react'
import { useTranslation } from 'react-i18next'

import Tune from '@mui/icons-material/Tune'

import { ClassNameMap } from '@mui/styles/withStyles'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

import { availableLanguageCodes, getLangName } from '../../lib/language'
import { ConsentFeedback } from '../../components/consents'
import { UserRoles } from '../../models/user'
import { Units } from '../../models/generic'
import { LanguageCodes } from '../../models/locales'

interface PreferencesFormProps {
  classes: ClassNameMap
  feedbackAccepted: boolean
  lang: LanguageCodes
  role: UserRoles
  unit: Units
  setFeedbackAccepted: (feedbackAccepted: boolean) => void
  setLang: (lang: LanguageCodes) => void
  setUnit: (unit: Units) => void
}

function PreferencesForm(props: PreferencesFormProps): JSX.Element {
  const { t } = useTranslation('yourloops')

  return (
    <React.Fragment>
      <Box className={props.classes.categoryLabel}>
        <Tune color="primary" />
        <strong className={props.classes.uppercase}>{t('preferences')}</strong>
      </Box>

      <Box className={props.classes.inputContainer}>
        <FormControl variant="standard" className={`${props.classes.formInput} ${props.classes.halfWide}`}>
          <InputLabel id="profile-units-input-label">{t('units')}</InputLabel>
          <Select
            disabled={props.role === UserRoles.patient}
            labelId="unit-selector"
            id="profile-units-selector"
            value={props.unit}
            onChange={event => props.setUnit(event.target.value as Units)}
          >
            <MenuItem id="profile-units-mmoll" value={Units.mole}>
              {Units.mole}
            </MenuItem>
            <MenuItem id="profile-units-mgdl" value={Units.gram}>
              {Units.gram}
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="standard" className={`${props.classes.formInput} ${props.classes.halfWide}`}>
          <InputLabel id="profile-language-input-label">{t('language')}</InputLabel>
          <Select
            labelId="locale-selector"
            id="profile-locale-selector"
            value={props.lang}
            onChange={event => props.setLang(event.target.value as LanguageCodes)}
          >
            {availableLanguageCodes.map((languageCode) => (
              <MenuItem id={`profile-locale-item-${languageCode}`} key={languageCode} value={languageCode}>
                {getLangName(languageCode)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {props.role === UserRoles.hcp &&
        <Box marginTop={1}>
          <ConsentFeedback
            id="profile"
            userRole={props.role}
            checked={props.feedbackAccepted}
            onChange={() => props.setFeedbackAccepted(!props.feedbackAccepted)}
          />
        </Box>
      }
    </React.Fragment>
  )
}

export default PreferencesForm
