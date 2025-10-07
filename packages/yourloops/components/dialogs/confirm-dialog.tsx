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

import React from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { LoadingButton } from '@mui/lab'

export interface ConfirmDialogProps {
  open?: boolean
  title: string
  label: string
  inProgress?: boolean
  onClose: () => void
  onConfirm: () => void
  confirmColor?: 'primary' | 'error'
}

export default function ConfirmDialog(props: ConfirmDialogProps): JSX.Element {
  const { open,title, label, inProgress, onClose, onConfirm, confirmColor } = props
  const { t } = useTranslation('yourloops')

  return (
    <Dialog
      data-testid="confirm-dialog"
      open={open}
      fullWidth
      maxWidth="sm"
      onClose={onClose}
    >
      <DialogTitle>
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {label}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          data-testid="confirm-dialog-cancel-button"
          variant="outlined"
          onClick={onClose}
        >
          {t('button-cancel')}
        </Button>
        <LoadingButton
          loading={inProgress}
          data-testid="confirm-dialog-confirm-button"
          variant="contained"
          color={confirmColor ?? "error"}
          disableElevation
          disabled={inProgress}
          onClick={onConfirm}
        >
          {t('button-confirm')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
