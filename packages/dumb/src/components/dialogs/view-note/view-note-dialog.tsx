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

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import { Note, TimePrefs } from 'medical-domain'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { computeDateValue, getDateTitleForBaseDatum } from '../../../utils/tooltip/tooltip.util'
import styles from './view-note-dialog.css'

const getInitials = (fullName: string): string => {
  if (!fullName) {
    return ''
  }

  const splitName = fullName.split(' ')
  const firstInitial = splitName[0]?.charAt(0) || ''
  const secondInitial = splitName[1]?.charAt(0) || ''

  const initials = `${firstInitial}${secondInitial}`

  return initials.toUpperCase()
}

interface ViewNoteDialogProps {
  note: Note
  timePrefs: TimePrefs
  onClose: () => void
}

export const ViewNoteDialog: FC<ViewNoteDialogProps> = (props) => {
  const { note, timePrefs, onClose } = props
  const { t } = useTranslation('main')

  const authorInitials = getInitials(note.user.fullName)
  const dateTitle = getDateTitleForBaseDatum(note, timePrefs)
  const time = computeDateValue(dateTitle)

  return (
    <Dialog
      open={true}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      role="alertdialog"
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle>
        {t('note')}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'top', gap: 1 }}>
          <Avatar sx={{ bgcolor: 'var(--dark-blue-main)' }}>
            {authorInitials}
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="caption" sx={{ px: 2, color: 'var(--text-color-secondary)' }}>
              <span className={styles.bold}>{note.user.fullName}</span>
              <span> - {time}</span>
            </Typography>
            <Box>
              <Box
                sx={{
                  backgroundColor: 'var(--info-color-10)',
                  borderRadius: '24px',
                  px: 2,
                  py: 1,
                  width: 'fit-content',
                }}
              >
                <Typography variant="subtitle2">{note.messageText}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          {t('button-close')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
