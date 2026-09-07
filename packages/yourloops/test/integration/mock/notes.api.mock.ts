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

import { MessageNote } from '../../../lib/data/models/message-note.model'
import { NotesApi } from '../../../lib/notes/notes.api'
import { patient2Id } from '../data/patient.api.data'
import { patient2FullName, userTimFullName, userTimId } from './auth0.hook.mock'
import { NOTE_ID } from './data.api.mock'

const noteData = {
  "id": NOTE_ID,
  "timezone": "Europe/Paris",
  "createdtime": "2022-08-08T12:00:00.000Z",
  "modifiedtime": "2022-08-08T12:00:00.000Z",
  "timestamp": "2022-08-08T12:00:00.000Z",
  "groupid": "b3549d738546",
  "userid": patient2Id,
  "messagetext": "This day was very stressful",
  "user": {
    "fullName": patient2FullName
  }
}

const noteAnswersData = [
  {
    "id": "68f5db7c612ea9466ce8c28c",
    "groupid": "b3549d738546",
    "userid": userTimId,
    "parentmessage": "68f5d86d612ea9466ce8c28b",
    "messagetext": "Really? What happened?",
    "timestamp": "2022-08-08T15:00:00.000Z",
    "createdtime": "2022-08-08T15:00:00.000Z",
    "modifiedtime": "2022-08-08T15:00:00.000Z",
    "user": {
      "fullName": userTimFullName
    }
  },
  {
    "id": "68f5db7c612ea9466ce8c2zz",
    "groupid": "b3549d738546",
    "userid": patient2Id,
    "parentmessage": "68f5d86d612ea9466ce8c28b",
    "messagetext": "A lot of things...",
    "timestamp": "2022-08-08T15:16:00.000Z",
    "createdtime": "2022-08-08T15:16:00.000Z",
    "modifiedtime": "2022-08-08T15:16:00.000Z",
    "user": {
      "fullName": patient2FullName
    }
  }
]

export const NOTES_THREAD = [noteData, ...noteAnswersData]

export const mockNotesApi = (notesThread: MessageNote[] = []) => {
  jest.spyOn(NotesApi, 'getNoteThread').mockResolvedValue(notesThread)
  jest.spyOn(NotesApi, 'createNote').mockResolvedValue('note-id')
  jest.spyOn(NotesApi, 'editNote').mockResolvedValue()
}
