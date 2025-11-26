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
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import React, { FC } from 'react'
import { AuthApi } from '../../../lib/auth/auth.api'
import { useAlert } from '../../../components/utils/snackbar'
import TextField from '@mui/material/TextField'
import { userAccountFormCommonClasses } from '../css-classes'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import { LoadingButton } from '@mui/lab'
import Dialog from '@mui/material/Dialog'

interface ChangeEmailModalProps {
  showChangeEmailModal: boolean
  setChangeEmailModal: (arg0: boolean) => void
}

export const ChangeEmailModal: FC<ChangeEmailModalProps> = ({ showChangeEmailModal, setChangeEmailModal }) => {
  const { t } = useTranslation('yourloops')
  const { user, logout } = useAuth()
  const alert = useAlert()
  const { classes } = userAccountFormCommonClasses()
  const [newEmail, setNewEmail] = React.useState<string>('')
  const [changeEmailCode, setChangeEmailCode] = React.useState<string>('')
  const [operationInProgress, setOperationInProgress] = React.useState<boolean>(false)
  const [emailSent, setEmailSent] = React.useState<boolean>(false)
  const [emailSentSuccess, setEmailSentSuccess] = React.useState<boolean>(false)
  const [codeValidationSent, setCodeValidationSent] = React.useState<boolean>(false)
  const [codeValidationSuccess, setCodeValidationSuccess] = React.useState<boolean>(false)

  const resetDialogState = (): void => {
    setNewEmail('')
    setChangeEmailCode('')
    setEmailSentSuccess(false)
    setCodeValidationSuccess(false)
    setEmailSent(false)
    setCodeValidationSent(false)
    setChangeEmailModal(false)
  }

  const sendChangeEmailRequest = async (): Promise<void> => {
    setOperationInProgress(true)
    try {
      await AuthApi.sendChangeEmailRequest(user.id, newEmail)
      setEmailSentSuccess(true)
    } catch (error: unknown) {
      setEmailSentSuccess(false)
    } finally {
      setEmailSent(true)
      setOperationInProgress(false)
    }
  }

  const validateChangeEmailRequest = async (): Promise<void> => {
    setOperationInProgress(true)
    try {
      await AuthApi.validateChangeEmailRequest(changeEmailCode)
      setCodeValidationSuccess(true)
      setOperationInProgress(false)
      resetDialogState()
      alert.success(t('alert-change-email-success'))
      //wait for 5 seconds before logging out
      await new Promise(resolve => setTimeout(resolve, 5000))
      logout()
    } catch (error: unknown) {
      setCodeValidationSuccess(false)
    } finally {
      setCodeValidationSent(true)
      setOperationInProgress(false)
    }
  }

  const emailSentError = emailSent && !emailSentSuccess
  const codeValidationError = codeValidationSent && !codeValidationSuccess

  return (
      <Dialog
        data-testid="confirm-email-change-dialog"
        open={showChangeEmailModal}
        fullWidth
        maxWidth="sm"
        onClose={() => {
          setChangeEmailModal(false)
        }}
      >
        <DialogTitle>
          {t('button-change-email')}
        </DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column">
            <TextField
              data-testid="user-email-current"
              label={t('email')}
              variant="outlined"
              value={user.email}
              disabled={true}
              className={classes.formInput}
            />
            <TextField
              data-testid="user-new-email"
              label={t('new-email')}
              error={emailSentError}
              helperText={emailSentError && t('error-occurred')}
              variant="outlined"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value)
              }}
              disabled={false}
              className={classes.formInput}
            />
            <TextField
              data-testid="user-new-email-code"
              label={t('code')}
              error={codeValidationError}
              helperText={codeValidationError && t('error-occurred')}
              variant="outlined"
              value={changeEmailCode}
              disabled={false}
              type={"number"}
              onChange={(e) => {
                setChangeEmailCode(e.target.value)
              }}
              className={classes.formInput}
              sx={{ display: emailSentSuccess ? 'inherit' : 'none' }}
            />
            <DialogContentText marginTop={2}>
              {t('email-change-dialog-text-part1')}<br />
              {t('email-change-dialog-text-part2')}
            </DialogContentText>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            data-testid="confirm-dialog-cancel-button"
            variant="outlined"
            onClick={() => {
              setChangeEmailModal(false)
              resetDialogState()
            }}
          >
            {t('button-cancel')}
          </Button>
          <LoadingButton
            loading={operationInProgress}
            data-testid="confirm-dialog-confirm-button"
            variant="contained"
            color={"primary"}
            disableElevation
            disabled={operationInProgress || newEmail.length == 0}
            onClick={emailSentSuccess   ? validateChangeEmailRequest : sendChangeEmailRequest}
          >
            {t('button-confirm')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
  )
}
