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
import { Link as LinkRedirect } from 'react-router-dom'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'

import PersonalInfoForm from './personal-info-form'
import PreferencesForm from './preferences-form'
import ProgressIconButtonWrapper from '../../components/buttons/progress-icon-button-wrapper'
import { useTranslation } from 'react-i18next'
import { useProfilePageState } from './profile-page-context'
import { profileFormCommonClasses } from './css-classes'

export const ProfileForm: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const { canSave, saving, saveProfile } = useProfilePageState()
  const classes = profileFormCommonClasses()

  return (
    <React.Fragment>
      <PersonalInfoForm />
      <PreferencesForm />
      <Box display="flex" justifyContent="flex-end" my={3}>
        <LinkRedirect className={classes.cancelLink} to="/">
          <Button>
            {t('button-cancel')}
          </Button>
        </LinkRedirect>
        <ProgressIconButtonWrapper inProgress={saving}>
          <Button
            id="profile-button-save"
            variant="contained"
            disabled={!canSave}
            color="primary"
            disableElevation
            className={classes.button}
            onClick={saveProfile}
          >
            {t('button-save')}
          </Button>
        </ProgressIconButtonWrapper>
      </Box>
    </React.Fragment>
  )
}
