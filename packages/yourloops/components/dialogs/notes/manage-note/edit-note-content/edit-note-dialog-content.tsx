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
import { DateTimePicker } from '@mui/x-date-pickers'
import moment, { type Moment } from 'moment-timezone'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageNote } from '../../../../../lib/data/models/message-note.model'
import metrics from '../../../../../lib/metrics'
import { NotesApi } from '../../../../../lib/notes/notes.api'
import { errorTextFromException } from '../../../../../lib/utils'
import { logError } from '../../../../../utils/error.util'
import { useAlert } from '../../../../utils/snackbar'

interface EditNoteDialogProps {
  note: MessageNote
  timezone: string
  onClose: () => void
  onMainNoteEdited: (note: MessageNote) => void
}

export const EditNoteDialogContent: FC<EditNoteDialogProps> = (props) => {
  const { note, timezone, onClose, onMainNoteEdited } = props
  const { t } = useTranslation('main')
  const alert = useAlert()

  const isMainNote = !note.parentmessage
  const title = isMainNote ? t('note-edit') : t('note-comment-edit')
  const editionSuccessLabel = isMainNote ? t('note-edit-success') : t('note-comment-edit-success')

  const defaultDateTime = moment.utc(note.timestamp).tz(timezone)
  const defaultComment = note.messagetext

  const [noteComment, setNoteComment] = React.useState<string>(defaultComment)
  const [noteDateTime, setNoteDateTime] = React.useState<Moment>(defaultDateTime)

  const isFormValidAndUpdated = (): boolean => {
    const isDateTimeUpdated = noteDateTime?.toISOString() !== defaultDateTime.toISOString()
    const isCommentUpdated = noteComment !== defaultComment
    const isFormUpdated = isMainNote ? isDateTimeUpdated || isCommentUpdated : isCommentUpdated

    const isDateTimeValid = noteDateTime?.isValid()
    const isCommentValid = noteComment.trim().length > 0
    const isFormValid = isMainNote ? isDateTimeValid && isCommentValid : isCommentValid

    return isFormUpdated && isFormValid
  }

  const onClickEdit = async () => {
    const editedNote: MessageNote = {
      id: note.id,
      parentmessage: note.parentmessage,
      userid: note.userid,
      user: note.user,
      groupid: note.groupid,
      messagetext: noteComment,
      timestamp: noteDateTime.toISOString()
    }

    try {
      await NotesApi.editNote(editedNote)

      metrics.send('note', 'edit_note')
      alert.success(editionSuccessLabel)

      if (isMainNote) {
        onMainNoteEdited(editedNote)
      }
    } catch (err) {
      const errorMessage = errorTextFromException(err)
      logError(errorMessage, 'edit-note')

      alert.error(t('error-occurred'))
    } finally {
      onClose()
    }
  }

  return (
    <>
      <DialogTitle data-testid="edit-note-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {isMainNote &&
            <DateTimePicker
              value={noteDateTime}
              onChange={(newDateTime: Moment) => setNoteDateTime(newDateTime)}
              slotProps={{
                textField: {
                  slotProps: {
                    htmlInput: {
                      'data-testid': 'edit-note-datetime-input'
                    } as React.InputHTMLAttributes<HTMLInputElement>
                  }
                }
              }}
            />
          }
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} data-testid="edit-note-content">
            <TextField
              variant="outlined"
              sx={{ width: '100%' }}
              aria-label={t('note-edit-input')}
              data-testid="note-edit-input"
              value={noteComment}
              multiline
              rows={4}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setNoteComment(event.target.value)
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions data-testid="edit-note-actions">
        <Button
          variant="outlined"
          onClick={onClose}
          data-testid="cancel-button"
        >
          {t('button-cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={onClickEdit}
          data-testid="edit-button"
          disabled={!isFormValidAndUpdated()}
        >
          {t('button-edit')}
        </Button>
      </DialogActions>
    </>
  )
}
