/*
 * Copyright (c) 2023-2026, Diabeloop
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

import MedicalDataService from 'medical-domain'
import moment, { type Moment } from 'moment-timezone'
import { type MutableRefObject, useState } from 'react'
import { type MessageNote } from '../../lib/data/models/message-note.model'
import metrics from '../../lib/metrics'
import { NotesApi } from '../../lib/notes/notes.api'
import { type DailyChartRef } from './models/daily-chart-ref.model'

export interface UseDailyNotesProps {
  dailyChartRef: MutableRefObject<DailyChartRef>
  dailyDate: number
  medicalData: MedicalDataService
}

interface UseDailyNotesReturn {
  closeMessageBox: () => void
  createMessageDatetime: string
  createNewMessage: (message: MessageNote) => Promise<string>
  handleMessageCreation: (message: MessageNote) => Promise<void>
  clickedNoteId: string
  showMessageCreation: (datetime: Moment | null) => void
  showNoteThread: (noteId: string) => Promise<void>
  hideNoteThread: () => void
  handleNoteUpdated: (note: MessageNote) => void
}

export const useDailyNotes = (props: UseDailyNotesProps): UseDailyNotesReturn => {
  const { dailyChartRef, medicalData, dailyDate } = props
  const [createMessageDatetime, setCreateMessageDatetime] = useState<string>(undefined)
  const [clickedNoteId, setClickedNoteId] = useState<string>(undefined)

  const createNewMessage = async (message: MessageNote): Promise<string> => {
    return await NotesApi.createNote(message)
  }

  const closeMessageBox = (): void => {
    setCreateMessageDatetime(undefined)
  }

  const handleMessageCreation = async (message: MessageNote): Promise<void> => {
    await dailyChartRef.current.createMessage(message)
    metrics.send('note', 'create_note')
  }

  const showMessageCreation = (datetime: Moment | null = null): void => {
    let mDate = datetime
    if (!datetime) {
      const timezone = medicalData.getTimezoneAt(dailyDate)
      mDate = moment.utc(dailyDate).tz(timezone)
    }
    setCreateMessageDatetime(mDate.toISOString())
  }

  const showNoteThread = async (noteId: string): Promise<void> => {
    setClickedNoteId(noteId)
  }

  const hideNoteThread = (): void => {
    setClickedNoteId(undefined)
  }

  const handleNoteUpdated = (note: MessageNote) => {
    dailyChartRef.current.editMessage(note)
  }

  return {
    createMessageDatetime,
    clickedNoteId,
    closeMessageBox,
    showMessageCreation,
    showNoteThread,
    hideNoteThread,
    createNewMessage,
    handleMessageCreation,
    handleNoteUpdated,
  }
}
