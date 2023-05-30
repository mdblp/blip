/*
 * Copyright (c) 2023, Diabeloop
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

import { type MutableRefObject, useState } from 'react'
import { type MessageNote } from '../../lib/data/models/message-note.model'
import moment, { type Moment } from 'moment-timezone'
import DataApi from '../../lib/data/data.api'
import metrics from '../../lib/metrics'
import { type DailyChartRef } from './models/daily-chart-ref.model'
import type MedicalDataService from 'medical-domain'

export interface UseDailyNotesProps {
  dailyChartRef: MutableRefObject<DailyChartRef>
  dailyDate: number
  medicalData: MedicalDataService
}

interface UseDailyNotesReturn {
  closeMessageBox: () => void
  createMessageDatetime: string
  createNewMessage: (message: MessageNote) => Promise<string>
  editMessage: (message: MessageNote) => Promise<void>
  handleMessageCreation: (message: MessageNote) => Promise<void>
  messageThread: MessageNote[]
  replyToMessage: (message: MessageNote) => Promise<string>
  showMessageCreation: (datetime: Moment | null) => void
  showMessageThread: (messageId: string) => Promise<void>
}

export const useDailyNotes = (props: UseDailyNotesProps): UseDailyNotesReturn => {
  const { dailyChartRef, medicalData, dailyDate } = props
  const [messageThread, setMessageThread] = useState<MessageNote[]>(undefined)
  const [createMessageDatetime, setCreateMessageDatetime] = useState<string>(undefined)

  const createNewMessage = async (message: MessageNote): Promise<string> => {
    return await DataApi.postMessageThread(message)
  }

  const closeMessageBox = (): void => {
    setMessageThread(undefined)
    setCreateMessageDatetime(undefined)
  }

  const editMessage = async (message: MessageNote): Promise<void> => {
    await DataApi.editMessage(message)
    metrics.send('note', 'edit_note')

    if (!message.parentmessage) {
      // Daily timeline view only cares for top-level note
      dailyChartRef.current.editMessage(message)
    }
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

  const showMessageThread = async (messageId: string): Promise<void> => {
    const messages = await DataApi.getMessageThread(messageId)
    setMessageThread(messages)
  }

  const replyToMessage = async (message: MessageNote): Promise<string> => {
    const id = await DataApi.postMessageThread(message)
    metrics.send('note', 'reply_note')
    return id
  }

  return {
    messageThread,
    createMessageDatetime,
    closeMessageBox,
    showMessageCreation,
    showMessageThread,
    createNewMessage,
    handleMessageCreation,
    editMessage,
    replyToMessage
  }
}
