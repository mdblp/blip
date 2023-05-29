/*
 * Copyright (c) 2022-2023, Diabeloop
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

import { type IMessage } from './models/i-message.model'
import HttpService from '../http/http.service'

export default class ChatApi {
  static async getChatMessages(teamId: string, patientId: string): Promise<IMessage[]> {
    const { data } = await HttpService.get<IMessage[]>({ url: `chat/v1/messages/teams/${teamId}/patients/${patientId}` })
    return data
  }

  static async sendChatMessage(teamId: string, patientId: string, text: string, isPrivate: boolean): Promise<boolean> {
    await HttpService.post<boolean, { text: string, private: boolean }>({
      url: `chat/v1/messages/teams/${teamId}/patients/${patientId}`,
      payload: { text, private: isPrivate }
    })
    return true
  }

  static async getUnreadMessagesCountForPatient(patientId: string): Promise<Record<string, number>> {
    const { data } = await HttpService.get<Record<string, number>>({ url: `chat/v1/unread/patients/${patientId}/teams` })
    return data
  }
}
