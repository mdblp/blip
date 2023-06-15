/*
 * Copyright (c) 2022-2023, Diabeloop
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

import { Trans, useTranslation } from 'react-i18next'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import React, { type FunctionComponent } from 'react'
import useRemoveDirectShareDialog from './remove-direct-share-dialog.hook'
import { useAuth } from '../../lib/auth'

export interface UserToRemove {
  id: string
  email: string
  fullName: string
}

export type OnCloseRemoveDirectShareDialog = (shouldRefresh: boolean) => void

export interface RemoveDirectShareProps {
  userToRemove: UserToRemove
  onClose: OnCloseRemoveDirectShareDialog
}

const RemoveDirectShareDialog: FunctionComponent<RemoveDirectShareProps> = ({ onClose, userToRemove }) => {
  const { t } = useTranslation('yourloops')
  const { removeDirectShare } = useRemoveDirectShareDialog(onClose)
  const { user: currentUser } = useAuth()
  const isCurrentUserCaregiver = currentUser.isUserCaregiver()
  const userToRemoveName = userToRemove.fullName

  const title = isCurrentUserCaregiver ? t('modal-caregiver-remove-patient-title', { patientName: userToRemoveName }) : t('modal-patient-remove-caregiver-title', { caregiverName: userToRemoveName })
  const questionKey = isCurrentUserCaregiver ? 'modal-caregiver-remove-patient-question' : 'modal-remove-caregiver-question'
  const infoLabel = isCurrentUserCaregiver ? t('modal-caregiver-remove-patient-info-2') : t('modal-patient-remove-caregiver-info-2')
  const removeButtonLabel = isCurrentUserCaregiver ? t('modal-caregiver-remove-patient-remove') : t('remove-caregiver')

  const closeDialog = (): void => {
    onClose(false)
  }

  const removeUser = async (): Promise<void> => {
    await removeDirectShare(userToRemove, currentUser)
  }

  return (
    <Dialog
      data-testid="remove-direct-share-dialog"
      open
      aria-labelledby={title}
      onClose={closeDialog}
    >
      <DialogTitle id="remove-direct-share-dialog-title">
        <strong>{title}</strong>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          <Trans
            i18nKey={questionKey}
            t={t}
            components={{ strong: <strong /> }}
            values={{ name: userToRemoveName }}
            parent={React.Fragment}
          />
        </DialogContentText>
        <DialogContentText>
          {infoLabel}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          onClick={closeDialog}
        >
          {t('button-cancel')}
        </Button>
        <Button
          data-testid="remove-direct-share-dialog-button-remove"
          color="error"
          variant="contained"
          disableElevation
          onClick={removeUser}
        >
          {removeButtonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RemoveDirectShareDialog
