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
import React, { FC, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageNote } from '../../../../lib/data/models/message-note.model'
import { NotesApi } from '../../../../lib/notes/notes.api'
import { errorTextFromException } from '../../../../lib/utils'
import { logError } from '../../../../utils/error.util'
import { useAlert } from '../../../utils/snackbar'
import { EditNoteDialogContent } from './edit-note-content/edit-note-dialog-content'
import { ViewNoteDialogContent } from './view-note-content/view-note-dialog-content'

interface ManageNoteDialogProps {
  mainNoteId: string
  timePrefs: TimePrefs
  onClose: () => void
  onMainNoteEdited: (note: MessageNote) => void
}

export const ManageNoteDialog: FC<ManageNoteDialogProps> = (props) => {
  const { mainNoteId, timePrefs, onClose, onMainNoteEdited } = props
  const { t } = useTranslation('main')
  const alert = useAlert()
  const [editingNote, setEditingNote] = React.useState<MessageNote | null>(null)
  const [noteThread, setNoteThread] = React.useState<MessageNote[]>([])

  const dataTestId = editingNote ? 'edit-note-dialog' : 'view-note-dialog'

  const refreshThread = useCallback(async () => {
    try {
      const updatedNotes = await NotesApi.getNoteThread(mainNoteId)
      setNoteThread(updatedNotes)
    } catch (err) {
      const errorMessage = errorTextFromException(err)
      logError(errorMessage, 'refresh-note-thread')
      alert.error(t('error-occurred'))
      onClose()
    }
  }, [alert, mainNoteId, onClose, t])

  const onCloseEditNote = async () => {
    setEditingNote(null)
    await refreshThread()
  }

  useEffect(() => {
    refreshThread()
  }, [refreshThread])

  return (
    <Dialog
      open={true}
      onClose={onClose}
      role="dialog"
      fullWidth={true}
      maxWidth="sm"
      data-testid={dataTestId}
    >
      {editingNote
        ? <EditNoteDialogContent
          note={editingNote}
          timezone={timePrefs.timezoneName}
          onClose={onCloseEditNote}
          onMainNoteEdited={onMainNoteEdited}
        />
        : <ViewNoteDialogContent
          notes={noteThread}
          timePrefs={timePrefs}
          onClose={onClose}
          onClickEdit={(note: MessageNote) => setEditingNote(note)}
        />
      }
    </Dialog>
  )
}
