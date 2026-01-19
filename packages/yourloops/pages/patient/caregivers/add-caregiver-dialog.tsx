/*
 * Copyright (c) 2021-2025, Diabeloop
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
import { type ShareUser } from '../../../lib/share/models/share-user.model'
import Box from '@mui/material/Box'

export interface AddDialogProps {
  actions: AddDialogContentProps | null
  currentCaregivers: ShareUser[]
}

/**
 * Add a caregiver dialog / modale
 */
function AddCaregiverDialog(props: AddDialogProps): JSX.Element {
  const { actions, currentCaregivers } = props
  const { t } = useTranslation('yourloops')
  const [email, setEmail] = React.useState<string>('')
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const isValidEmail = (caregiverEmail: string): boolean => caregiverEmail.length > 0 && REGEX_EMAIL.test(caregiverEmail)

  const handleClose = (): void => {
    actions.onDialogResult(null)
  }

  const handleClickAdd = (): void => {
    actions.onDialogResult(email)
  }

  const checkCaregiverAlreadyInvited = (caregiverEmail: string): void => {
    const currentCaregiversEmails = currentCaregivers.map((caregiver: ShareUser) => caregiver.user.username)
    if (currentCaregiversEmails.includes(caregiverEmail)) {
      setErrorMessage(t('error-caregiver-already-in-list'))
    } else {
      setErrorMessage(null)
    }
  }

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const inputEmail = event.target.value.trim()
    if (isValidEmail(inputEmail)) {
      checkCaregiverAlreadyInvited(inputEmail)
    } else {
      setErrorMessage(t('invalid-email'))
    }
    setEmail(inputEmail)
  }

  const buttonAddDisabled = !!errorMessage || email.length === 0

  return (
    <Dialog
      id="patient-add-caregiver-dialog"
      open
      aria-labelledby={t('modal-add-caregiver')}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="patient-add-caregiver-dialog-title">
        <strong>{t('modal-add-caregiver')}</strong>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ paddingTop: 1 }}>
          <TextField
            id="patient-add-caregiver-dialog-email"
            data-testid="patient-add-caregiver-dialog-email"
            label={t('email')}
            value={email}
            required
            error={!!errorMessage}
            onChange={handleChangeEmail}
            helperText={errorMessage}
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          id="patient-add-caregiver-dialog-button-cancel"
          data-testid="add-caregiver-dialog-cancel-button"
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

export default AddCaregiverDialog
