/*
 * Copyright (c) 2021-2023, Diabeloop
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

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

import { REGEX_EMAIL } from '../../../lib/utils'
import { type AddDialogContentProps } from './models/add-dialog-content-props.model'

export interface AddDialogProps {
  actions: AddDialogContentProps | null
}

/**
 * Add a caregiver dialog / modale
 */
function AddDialog(props: AddDialogProps): JSX.Element {
  const { t } = useTranslation('yourloops')
  const [email, setEmail] = React.useState<string>('')
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const isValidEmail = (mail = email): boolean => mail.length > 0 && REGEX_EMAIL.test(mail)
  const resetDialog = (): void => {
    setTimeout(() => {
      setEmail('')
      setErrorMessage(null)
    }, 100)
  }
  const handleClose = (): void => {
    props.actions?.onDialogResult(null)
    resetDialog()
  }
  const handleClickAdd = (): void => {
    if (isValidEmail()) {
      props.actions?.onDialogResult(email)
      resetDialog()
    } else {
      setErrorMessage(t('invalid-email'))
    }
  }
  const handleVerifyEmail = (): void => {
    if (email.length > 0 && !isValidEmail()) {
      setErrorMessage(t('invalid-email'))
    }
  }
  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const inputEmail = event.target.value.trim()
    if (errorMessage !== null && isValidEmail(inputEmail)) {
      setErrorMessage(null)
    }
    setEmail(inputEmail)
  }

  const dialogIsOpen = props.actions !== null
  const buttonAddDisabled = errorMessage !== null || !isValidEmail()

  return (
    <Dialog
      id="patient-add-caregiver-dialog"
      open={dialogIsOpen}
      aria-labelledby={t('modal-add-caregiver')}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="patient-add-caregiver-dialog-title">
        <strong>{t('modal-add-caregiver')}</strong>
      </DialogTitle>

      <DialogContent>
        <TextField
          id="patient-add-caregiver-dialog-email"
          label={t('email')}
          value={email}
          required
          error={errorMessage !== null}
          onBlur={handleVerifyEmail}
          onChange={handleChangeEmail}
          helperText={errorMessage}
          fullWidth
        />
      </DialogContent>

      <DialogActions>
        <Button
          id="patient-add-caregiver-dialog-button-cancel"
          variant="outlined"
          onClick={handleClose}
        >
          {t('button-cancel')}
        </Button>
        <Button
          id="patient-add-caregiver-dialog-button-add"
          disabled={buttonAddDisabled}
          variant="contained"
          color="primary"
          disableElevation
          onClick={handleClickAdd}
        >
          {t('button-invite')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddDialog
