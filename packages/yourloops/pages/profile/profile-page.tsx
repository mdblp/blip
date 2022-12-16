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

import React, { FunctionComponent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import DialogTitle from '@mui/material/DialogTitle'
import Link from '@mui/material/Link'

import { getCurrentLang } from '../../lib/language'
import { setPageTitle } from '../../lib/utils'
import { useAuth } from '../../lib/auth'
import metrics from '../../lib/metrics'
import SwitchRoleDialogs from '../../components/switch-role'
import { ProfilePageContextProvider } from './profile-page-context'
import { ProfileForm } from './profile-form'
import { profileFormCommonClasses } from './css-classes'
import { UserRoles } from '../../lib/auth/models/enums/user-roles.enum'
import Button from '@mui/material/Button'
import { Lock } from '@mui/icons-material'
import { Divider } from '@mui/material'
import { AuthApi } from '../../lib/auth/auth.api'
import { useAlert } from '../../components/utils/snackbar'
import bows from 'bows'

const log = bows('ProfilePage')

const ProfilePage: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const { classes } = profileFormCommonClasses()
  const { user } = useAuth()
  const alert = useAlert()

  const [switchRoleOpen, setSwitchRoleOpen] = useState<boolean>(false)
  const lang = user.preferences?.displayLanguageCode ?? getCurrentLang()

  const handleSwitchRoleOpen = (): void => {
    setSwitchRoleOpen(true)
    metrics.send('switch_account', 'display_switch_preferences')
  }

  const handleSwitchRoleCancel = (): void => setSwitchRoleOpen(false)

  useEffect(() => setPageTitle(t('account-preferences')), [lang, t])

  const sendChangePasswordEmail = async (): Promise<void> => {
    try {
      await AuthApi.sendResetPasswordEmail(user.email)
      alert.success(t('alert-change-password-email-success'))
    } catch (reason: unknown) {
      log.error(reason)
      alert.error(t('alert-change-password-email-failed'))
    }
  }

  return (
    <React.Fragment>
      <Container className={classes.container} maxWidth="sm">
        <Box display="flex" flexDirection="column" margin={2}>
          <DialogTitle className={classes.title} id="profile-title">
            {t('account-preferences')}
          </DialogTitle>

          <ProfilePageContextProvider>
            <ProfileForm />
          </ProfilePageContextProvider>

          {/** TODO role changing was performed with a call to shoreline.
           *    Now it has to be done with Auth0 since role is a part of auth0 user metadata.
           *    see YLP-1590 (https://diabeloop.atlassian.net/browse/YLP-1590)
           **/}
          {UserRoles.caregiver === user.role &&
            <Link
              id="profile-link-switch-role"
              component="button"
              sx={{ marginBottom: 2 }}
              onClick={handleSwitchRoleOpen}>
              {t('modal-switch-hcp-title')}
            </Link>
          }

          {
            !user.isUserPatient() &&
            <>
              <Divider variant="middle" />
              <Box className={classes.categoryLabel}>
                <Lock color="primary" />
                <strong className={classes.uppercase}>{t('security')}</strong>
              </Box>
              <Box marginTop={2}>
                <div>{t('change-password-info')}</div>
                <Box display="flex" justifyContent="center" marginTop={2}>
                  <Button
                    id="profile-button-change-password"
                    variant="outlined"
                    color="primary"
                    disableElevation
                    className={classes.button}
                    onClick={sendChangePasswordEmail}
                  >
                    {t('button-change-password')}
                  </Button>
                </Box>
              </Box>
            </>
          }
        </Box>
      </Container>
      <SwitchRoleDialogs open={switchRoleOpen} onCancel={handleSwitchRoleCancel} />
    </React.Fragment>
  )
}

export default ProfilePage
