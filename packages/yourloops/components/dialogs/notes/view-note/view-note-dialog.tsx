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
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { TimePrefs } from 'medical-domain'
import moment from 'moment-timezone'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../../lib/auth'
import { getInitials } from '../../../../lib/auth/user.util'
import { MessageNote } from '../../../../lib/data/models/message-note.model'
import metrics from '../../../../lib/metrics'
import { NotesApi } from '../../../../lib/notes/notes.api'
import { errorTextFromException } from '../../../../lib/utils'
import { logError } from '../../../../utils/error.util'
import { useAlert } from '../../../utils/snackbar'
import styles from './view-note-dialog.css'

interface ViewNoteDialogProps {
  notes: MessageNote[]
  timePrefs: TimePrefs
  onClose: () => void
}

const AVATAR_MEDIUM_SIZE = '40px'
const AVATAR_SMALL_SIZE = '32px'

const MEDIUM_FONT_SIZE = '20px'
const SMALL_FONT_SIZE = '16px'

export const ViewNoteDialog: FC<ViewNoteDialogProps> = (props) => {
  const { notes, timePrefs, onClose } = props
  const { t } = useTranslation('main')
  const { user } = useAuth()
  const alert = useAlert()
  const [comment, setComment] = React.useState('')

  const getDateTime = (timestamp: string) => {
    const format = t('MMM D, YYYY h:mm a')
    const timezone = timePrefs.timezoneName || 'UTC'
    const momentObject = moment.isMoment(timestamp) ? timestamp : moment.utc(timestamp)

    return momentObject.tz(timezone).format(format)
  }

  const isMainNote = (index: number): boolean => {
    return index === 0
  }

  const getSize = (index: number): string => {
    return isMainNote(index) ? AVATAR_MEDIUM_SIZE : AVATAR_SMALL_SIZE
  }

  const isSubmitDisabled = (comment: string): boolean => {
    return comment.trim().length === 0
  }

  const onClickSubmit = async (comment: string) => {
    const parentNote = notes[0]

    const newNoteComment = {
      parentmessage: parentNote.id,
      userid: user.id,
      groupid: parentNote.groupid,
      messagetext: comment.trim(),
      timestamp: new Date().toISOString()
    } as MessageNote

    try {
      metrics.send('note', 'reply_note')

      await NotesApi.postMessageThread(newNoteComment)
      alert.success(t('note-comment-add-success'))
    } catch (err) {
      const errorMessage = errorTextFromException(err)
      logError(errorMessage, 'add-note-comment')

      alert.error(t('error-occurred'))
    } finally {
      onClose()
    }
  }

  return (
    <Dialog
      open={true}
      onClose={onClose}
      role="dialog"
      fullWidth={true}
      maxWidth="sm"
      data-testid="view-note-dialog"
    >
      <DialogTitle data-testid="view-note-title">
        {t('note')}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} data-testid="view-note-content">
          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
            data-testid="view-note-thread"
          >
            {notes.map(((note: MessageNote, index: number) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  marginLeft: isMainNote(index) ? 0 : 3
                }}
                key={note.id}
                data-testid="note-thread-item"
              >
                <Avatar
                  sx={{
                    bgcolor: 'var(--dark-blue-main)',
                    width: getSize(index),
                    height: getSize(index),
                    fontSize: isMainNote(index) ? MEDIUM_FONT_SIZE : SMALL_FONT_SIZE
                  }}
                >
                  {getInitials(note.user.fullName)}
                </Avatar>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="caption" sx={{ px: 2, color: 'var(--text-color-secondary)' }}>
                    <span className={styles.bold}>{note.user.fullName}</span>
                    <span> - {getDateTime(note.timestamp)}</span>
                  </Typography>
                  <Box>
                    <Box
                      sx={{
                        backgroundColor: 'var(--info-color-10)',
                        borderRadius: '24px',
                        px: 2,
                        py: 1,
                        width: 'fit-content'
                      }}
                    >
                      <Typography variant="body2">{note.messagetext}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )))}
          </Box>
          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
            data-testid="view-note-add-comment"
          >
            <Typography
              variant="caption"
              sx={{ color: 'var(--text-color-secondary)' }}
              data-testid="new-comment-date"
            >
              <span>{getDateTime(new Date().toISOString())}</span>
            </Typography>
            <TextField
              variant="outlined"
              sx={{ width: '100%' }}
              placeholder={t('Type a comment here ...')}
              aria-label={t('note-comment-input')}
              data-testid="new-comment-input"
              value={comment}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setComment(event.target.value)
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions data-testid="view-note-actions">
        <Button
          variant="outlined"
          onClick={onClose}
          data-testid="close-button"
        >
          {t('button-close')}
        </Button>
        <Button
          variant="contained"
          onClick={() => onClickSubmit(comment)}
          data-testid="submit-button"
          disabled={isSubmitDisabled(comment)}
        >
          {t('button-post')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
