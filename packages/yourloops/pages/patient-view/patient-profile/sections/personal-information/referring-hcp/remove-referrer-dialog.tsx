/*
 * Copyright (c) 2026, Diabeloop
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

import React, { FC } from 'react'
import { Button, DialogTitle } from '@mui/material'
import DialogContent from '@mui/material/DialogContent'
import { Trans, useTranslation } from 'react-i18next'
import DialogActions from '@mui/material/DialogActions'
import Dialog from '@mui/material/Dialog'
import { User } from '../../../../../../lib/auth'

interface RemoveReferrerDialogProps {
  referrerName: string
  patientName: string
  user: User
  onClose: () => void
}

export const RemoveReferrerDialog: FC<RemoveReferrerDialogProps> = (props) => {
  const { referrerName, patientName, user, onClose } = props
  const { t } = useTranslation()

  return (
    <Dialog onClose={onClose} open={true}>
      <DialogTitle>{t('remove-referrer-title')}</DialogTitle>
      <DialogContent>
        {user.isUserPatient() ?
          <Trans
            i18nKey="remove-referrer-question-patient"
            t={t}
            components={{ strong: <strong /> }}
            values={{ referrerName }}
            parent={React.Fragment}
          />
          : <Trans
            i18nKey="remove-referrer-question"
            t={t}
            components={{ strong: <strong /> }}
            values={{ referrerName, patientName }}
            parent={React.Fragment}
          />
        }
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          {t('button-cancel')}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onClose}
        >
          {t('button-remove-referrer')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
