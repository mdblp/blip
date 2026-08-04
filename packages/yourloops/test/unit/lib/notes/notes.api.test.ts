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

import type { AxiosResponse } from 'axios'
import { sortBy } from 'lodash'
import type { MessageNote } from '../../../../lib/data/models/message-note.model'
import HttpService from '../../../../lib/http/http.service'
import { NotesApi } from '../../../../lib/notes/notes.api'

describe('Notes API', () => {
  const patientId = 'patientId'

  describe('editMessage', () => {
    it('should edit a message', async () => {
      jest.spyOn(HttpService, 'put').mockResolvedValue(undefined)
      const message = { userid: patientId } as MessageNote
      await NotesApi.editMessage(message)
      expect(HttpService.put).toHaveBeenCalledWith({
        url: '/message/v1/edit',
        payload: message
      })
    })
  })

  describe('getMessageThread', () => {
    it('should get the message thread sorted by date', async () => {
      const messageId = 'messageId'
      const data: MessageNote[] = [
        { userid: patientId, timestamp: new Date('2022-02-02') } as unknown as MessageNote,
        { userid: patientId, timestamp: new Date('2022-02-03') } as unknown as MessageNote
      ]
      jest.spyOn(HttpService, 'get').mockResolvedValue({ data } as AxiosResponse)

      let response = await NotesApi.getMessageThread(messageId)
      response = sortBy(response, (message: MessageNote) => Date.parse(message.timestamp))
      expect(response).toEqual(data)

      expect(HttpService.get).toHaveBeenCalledWith({ url: `/message/v1/thread/${messageId}` })
    })
  })

  describe('postMessageThread', () => {
    it('should post a new message', async () => {
      const message = { userid: patientId } as MessageNote
      const messageId = 'messageId'
      const data = { id: messageId }
      jest.spyOn(HttpService, 'post').mockResolvedValue({ data } as AxiosResponse)

      const response = await NotesApi.postMessageThread(message)
      expect(response).toEqual(messageId)
      expect(HttpService.post).toHaveBeenCalledWith({
        url: '/message/v1/send',
        payload: message
      })
    })
  })
})
