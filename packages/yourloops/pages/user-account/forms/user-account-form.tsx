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
import { Link as LinkRedirect } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import { PersonalInfoForm } from './personal-info-form'
import { PreferencesForm } from './preferences-form'
import { useTranslation } from 'react-i18next'
import { useUserAccountPageState } from '../user-account-page-context'
import { userAccountFormCommonClasses } from '../css-classes'
import { LoadingButton } from '@mui/lab'

export const UserAccountForm: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const { canSave, saving, saveUserAccount } = useUserAccountPageState()
  const { classes } = userAccountFormCommonClasses()

  return (
    <React.Fragment>
      <PersonalInfoForm />
      <PreferencesForm />
      <Box display="flex" justifyContent="flex-end" my={3}>
        <LinkRedirect className={classes.cancelLink} to="/">
          <Button variant="outlined">
            {t('button-cancel')}
          </Button>
        </LinkRedirect>
        <LoadingButton
          loading={saving}
          data-testid="user-account-save-button"
          variant="contained"
          disabled={!canSave}
          color="primary"
          disableElevation
          className={classes.button}
          onClick={saveUserAccount}
        >
          {t('button-save')}
        </LoadingButton>
      </Box>
    </React.Fragment>
  )
}
