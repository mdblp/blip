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

import { type Moment } from 'moment-timezone'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageNote } from '../../../../../lib/data/models/message-note.model'
import metrics from '../../../../../lib/metrics'
import { NotesApi } from '../../../../../lib/notes/notes.api'
import { errorTextFromException } from '../../../../../lib/utils'
import { logError } from '../../../../../utils/error.util'
import { useAlert } from '../../../../utils/snackbar'
import { CreateEditNoteContent } from '../../create-edit-note-content'

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

  const onClickEdit = async ({ message, datetime }: { message: string; datetime: Moment }) => {
    const editedNote: MessageNote = {
      id: note.id,
      parentmessage: note.parentmessage,
      userid: note.userid,
      user: note.user,
      groupid: note.groupid,
      messagetext: message,
      timestamp: datetime.toISOString()
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
    <CreateEditNoteContent
      title={title}
      defaultDateTime={note.timestamp}
      defaultMessage={note.messagetext}
      timezone={timezone}
      showDateTimePicker={isMainNote}
      onClickSubmit={onClickEdit}
      onClose={onClose}
    />
  )
}
