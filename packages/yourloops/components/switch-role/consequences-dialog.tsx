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

import { useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import { type SwitchRoleConsequencesDialogProps } from './models'

function SwitchRoleConsequencesDialog(props: SwitchRoleConsequencesDialogProps): JSX.Element {
  const { open, onAccept, onCancel } = props
  const { t } = useTranslation('yourloops')
  const theme = useTheme()
  const isXSBreakpoint: boolean = useMediaQuery(theme.breakpoints.only('xs'))

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      onClose={onCancel}
      fullScreen={isXSBreakpoint}
    >
      <DialogTitle>
        <strong>{t('modal-switch-hcp-title')}</strong>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {t('modal-switch-hcp-info')}
        </DialogContentText>
        <DialogContentText component="div">
          <span>{t('modal-switch-hcp-info-3')}</span>
          <ul>
            <li>{t('modal-switch-hcp-list-1')}</li>
            <li>{t('modal-switch-hcp-list-2')}</li>
            <li>{t('modal-switch-hcp-list-3')}</li>
          </ul>
        </DialogContentText>
        <DialogContentText>
          {t('modal-switch-hcp-info-4')}
        </DialogContentText>
        <DialogContentText>
          {t('modal-switch-hcp-info-5')}
        </DialogContentText>
        <DialogContentText>
          <strong>{t('modal-switch-hcp-info-2')}</strong>
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          onClick={onCancel}
        >
          {t('button-cancel')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={onAccept}
        >
          {t('button-modal-switch-hcp-action')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SwitchRoleConsequencesDialog
