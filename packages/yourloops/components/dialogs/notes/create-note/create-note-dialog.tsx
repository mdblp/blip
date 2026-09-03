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

import Dialog from '@mui/material/Dialog'
import { TimePrefs } from 'medical-domain'
import type { Moment } from 'moment-timezone'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../../lib/auth'
import { MessageNote } from '../../../../lib/data/models/message-note.model'
import metrics from '../../../../lib/metrics'
import { NotesApi } from '../../../../lib/notes/notes.api'
import { errorTextFromException } from '../../../../lib/utils'
import { logError } from '../../../../utils/error.util'
import { useAlert } from '../../../utils/snackbar'
import { NoteFormDialogContent } from '../note-form-dialog-content'

interface CreateNoteDialogProps {
  createDatetime: string
  patientId: string
  timePrefs: TimePrefs
  onNoteCreated: (note: MessageNote) => Promise<void>
  onClose: () => void
}

export const CreateNoteDialog: FC<CreateNoteDialogProps> = (props) => {
  const { createDatetime, patientId, timePrefs, onNoteCreated, onClose } = props
  const { t } = useTranslation('main')
  const alert = useAlert()
  const { user } = useAuth()

  const onClickCreate = async ({ message, datetime }: { message: string, datetime: Moment }) => {
    const note: MessageNote = {
      userid: user.id,
      user: { fullName: user.fullName },
      groupid: patientId,
      messagetext: message,
      timestamp: datetime.toISOString(),
      timezone: timePrefs.timezoneName
    }

    try {
      const noteId = await NotesApi.createNote(note)

      metrics.send('note', 'create_note')
      alert.success(t('note-create-success'))

      note.id = noteId
      await onNoteCreated(note)
    } catch (err) {
      const errorMessage = errorTextFromException(err)
      logError(errorMessage, 'create-note')

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
      data-testid="create-note-dialog"
    >
      <NoteFormDialogContent
        title={t('new-note')}
        defaultDateTime={createDatetime}
        timezone={timePrefs.timezoneName}
        showDateTimePicker={true}
        onClickSubmit={onClickCreate}
        onClose={onClose}
      />
    </Dialog>
  )
}
