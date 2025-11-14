/*
 * Copyright (c) 2025, Diabeloop
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

import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../lib/auth'
import { Divider } from '@mui/material'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import React, { FC } from 'react'
import { AuthApi } from '../../../lib/auth/auth.api'
import { errorTextFromException } from '../../../lib/utils'
import { logError } from '../../../utils/error.util'
import { useAlert } from '../../../components/utils/snackbar'
import TextField from '@mui/material/TextField'
import { userAccountFormCommonClasses } from '../css-classes'
import ConfirmDialog from '../../../components/dialogs/confirm-dialog'
import { ChangeEmailModal } from '../modals/change-email-modal'

export const SecurityForm: FC = () => {
  const { t } = useTranslation('yourloops')
  const { user } = useAuth()
  const alert = useAlert()
  const { classes } = userAccountFormCommonClasses()
  const [showUpdatePasswordDialog, setShowUpdatePasswordDialog] = React.useState<boolean>(false)
  const [showChangeEmailModal, setShowChangeEmailModal] = React.useState<boolean>(false)

  const sendChangePasswordEmail = async (): Promise<void> => {
    try {
      await AuthApi.sendResetPasswordEmail(user.email)
      alert.success(t('alert-change-password-email-success'))
    } catch (error: unknown) {
      const errorMessage = errorTextFromException(error)
      logError(errorMessage, 'change-password')
      alert.error(t('alert-change-password-email-failed'))
    }
  }

  return (
    <>
      <Divider variant="middle" sx={{ marginY: 3 }} />
      <Box marginY={2}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>{t('security')}</Typography>
        <Box className={classes.inputContainer}>
          <TextField
            data-testid="user-email"
            label={t('email')}
            variant="outlined"
            value={user.email}
            disabled={true}
            className={classes.formInput}
          />
        </Box>
        <Box marginTop={2}>
          <Box display="flex" marginTop={2}>
            <Button
              data-testid="change-email-button"
              sx={{ marginRight: 2 }}
              variant="outlined"
              color="primary"
              disableElevation
              onClick={() => {
                setShowChangeEmailModal(true)
              }}
            >
              {t('button-change-email')}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              disableElevation
              onClick={() => {
                setShowUpdatePasswordDialog(true)
              }}
            >
              {t('button-change-password')}
            </Button>
          </Box>
        </Box>
      </Box>
      <ConfirmDialog
        confirmColor={"primary"}
        open={showUpdatePasswordDialog}
        title={t('button-change-password')}
        label={t('change-password-info')}
        onClose={() => {
          setShowUpdatePasswordDialog(false)
        }}
        onConfirm={sendChangePasswordEmail}
      />
      <ChangeEmailModal showChangeEmailModal={showChangeEmailModal} setChangeEmailModal={setShowChangeEmailModal} />
    </>
  )
}
