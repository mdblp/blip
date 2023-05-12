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

import React, { type FC } from 'react'
import metrics from '../../lib/metrics'
import { useAuth } from '../../lib/auth'
import { type Patient } from '../../lib/patient/models/patient.model'
import { type TimePrefs } from 'medical-domain'
import Messages from 'blip/app/components/messages'
import { type MessageNote } from '../../lib/data/models/message-note.model'

export interface DailyNotesProps {
  closeMessageBox: () => void
  createMessageDatetime: string
  createNewMessage: (message: MessageNote) => Promise<string>
  editMessage: (message: MessageNote) => Promise<void>
  handleMessageCreation: (message: MessageNote) => Promise<void>
  messageThread: MessageNote[]
  patient: Patient
  replyToMessage: (message: MessageNote) => Promise<string>
  timePrefs: TimePrefs
}

export const DailyNotes: FC<DailyNotesProps> = (props) => {
  const {
    patient,
    timePrefs,
    closeMessageBox,
    createMessageDatetime,
    messageThread,
    handleMessageCreation,
    createNewMessage,
    replyToMessage,
    editMessage
  } = props
  const { user } = useAuth()

  return (
    <>
      {(createMessageDatetime || messageThread) &&
        <Messages
          createDatetime={createMessageDatetime}
          messages={messageThread}
          onNewMessage={handleMessageCreation}
          user={user}
          patient={patient}
          onClose={closeMessageBox}
          onSave={createMessageDatetime ? createNewMessage : replyToMessage}
          onEdit={editMessage}
          timePrefs={timePrefs}
          trackMetric={metrics.send}
        />
      }
    </>
  )
}
