/*
 * Copyright (c) 2022, Diabeloop
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

import { Message } from '../../../../components/chat/chat-widget'
import HttpService from '../../../../services/http.service'
import { AxiosResponse } from 'axios'
import ChatApi from '../../../../lib/chat/api'

describe('Chat API', () => {
  const teamId = 'teamId'
  const patientId = 'patientId'

  it('should get chat messages', async () => {
    const data: Message[] = [
      { text: 'hello doc', isMine: true },
      { text: 'hi patient', isMine: false }
    ]
    jest.spyOn(HttpService, 'get').mockResolvedValueOnce({ data } as AxiosResponse)

    const messages = await ChatApi.getChatMessages(teamId, patientId)
    expect(messages).toEqual(data)
    expect(HttpService.get).toHaveBeenCalledWith({
      url: `chat/v1/messages/teams/${teamId}/patients/${patientId}`
    })
  })

  it('should send chat messages', async () => {
    const text = 'hello doc'
    const isPrivate = false
    jest.spyOn(HttpService, 'post').mockResolvedValueOnce({ data: true } as AxiosResponse)

    const messageIsSent = await ChatApi.sendChatMessage(teamId, patientId, text, isPrivate)
    expect(messageIsSent).toBeTruthy()
    expect(HttpService.post).toHaveBeenCalledWith({
      url: `chat/v1/messages/teams/${teamId}/patients/${patientId}`,
      payload: { text, private: isPrivate }
    })
  })
})
