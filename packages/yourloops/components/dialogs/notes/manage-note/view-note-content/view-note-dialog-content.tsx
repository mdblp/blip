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

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { formatLocalizedFromUTC, getLongDayHourFormat } from 'dumb'
import { TimePrefs } from 'medical-domain'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../../../lib/auth'
import { MessageNote } from '../../../../../lib/data/models/message-note.model'
import metrics from '../../../../../lib/metrics'
import { NotesApi } from '../../../../../lib/notes/notes.api'
import { errorTextFromException } from '../../../../../lib/utils'
import { logError } from '../../../../../utils/error.util'
import SpinningLoader from '../../../../loaders/spinning-loader'
import { NoteThreadItem } from '../../../../notes/note-thread-item/note-thread-item'
import { useAlert } from '../../../../utils/snackbar'

interface ViewNoteDialogProps {
  notes: MessageNote[]
  timePrefs: TimePrefs
  onClose: () => void
  onClickEdit: (note: MessageNote) => void
}

export const ViewNoteDialogContent: FC<ViewNoteDialogProps> = (props) => {
  const { notes, timePrefs, onClose, onClickEdit } = props
  const { t } = useTranslation('main')
  const { user } = useAuth()
  const userId = user.id
  const alert = useAlert()
  const [comment, setComment] = React.useState('')

  const getDateTime = (timestamp: string) => {
    const format = getLongDayHourFormat()
    return formatLocalizedFromUTC(timestamp, timePrefs, format)
  }

  const isMainNote = (index: number): boolean => {
    return index === 0
  }

  const isSubmitDisabled = (comment: string): boolean => {
    return comment.trim().length === 0
  }

  const onClickSubmit = async (comment: string) => {
    const parentNote = notes[0]

    const newNoteComment = {
      parentmessage: parentNote.id,
      userid: userId,
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

  const isAuthor = (authorId: string): boolean => {
    return authorId === userId
  }

  return (
    <>
      <DialogTitle data-testid="view-note-title">
        {t('note')}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} data-testid="view-note-content">
          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
            data-testid="view-note-thread"
          >
            {notes.length === 0 && <SpinningLoader />}
            {notes.map(((note: MessageNote, index: number) => (
              <NoteThreadItem
                key={note.id}
                note={note}
                isMainNote={isMainNote(index)}
                isAuthor={isAuthor(note.userid)}
                getDateTime={getDateTime}
                onClickEdit={onClickEdit}
              />
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
    </>
  )
}
