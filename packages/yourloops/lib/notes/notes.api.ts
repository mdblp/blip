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

import { sortBy } from 'lodash'
import { MessageNote } from '../data/models/message-note.model'
import HttpService from '../http/http.service'

const NOTES_URL = '/message/v1'

export class NotesApi {
  static async getMessageThread(messageId: string): Promise<MessageNote[]> {
    const { data } = await HttpService.get<MessageNote[]>({ url: `${NOTES_URL}/thread/${messageId}` })
    return sortBy(data, (message: MessageNote) => Date.parse(message.timestamp))
  }

  static async postMessageThread(message: MessageNote): Promise<string> {
    const { data } = await HttpService.post<{ id: string }, MessageNote>({
      url: `${NOTES_URL}/send`,
      payload: message
    })
    return data.id
  }

  static async editMessage(message: MessageNote): Promise<void> {
    await HttpService.put<void, MessageNote>({
      url: `${NOTES_URL}/edit`,
      payload: message
    })
  }
}
