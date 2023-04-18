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

import ChatApi from '../../../lib/chat/chat.api'
import { type IMessage } from '../../../lib/chat/models/i-message.model'
import { myFirstTeamName, mySecondTeamId, mySecondTeamName, myTeamId } from './team.api.mock'
import { monitoredPatientAsTeamMember, monitoredPatientId } from '../data/patient.api.data'
import type User from '../../../lib/auth/models/user.model'

export const mockChatAPI = () => {
  jest.spyOn(ChatApi, 'getChatMessages').mockImplementation((teamId, patientId): Promise<IMessage[]> => {
    if (teamId === myTeamId && patientId === monitoredPatientId) {
      const message: IMessage = {
        id: 'fakeMessageId',
        patientId: monitoredPatientId,
        teamId: myTeamId,
        authorId: monitoredPatientId,
        destAck: true,
        private: false,
        text: `This is a message sent to the team ${myFirstTeamName}`,
        timezone: 'timezone not used',
        timestamp: '2023-03-30T09:10:06Z',
        user: { profile: monitoredPatientAsTeamMember.profile } as User
      }
      return Promise.resolve([message])
    }
    if (teamId === mySecondTeamId && patientId === monitoredPatientId) {
      const message: IMessage = {
        id: 'fakeMessageId',
        patientId: monitoredPatientId,
        teamId: mySecondTeamId,
        authorId: 'someoneElse',
        destAck: false,
        private: false,
        text: `This is a message sent from the team ${mySecondTeamName}`,
        timezone: 'timezone not used 2',
        timestamp: '2023-03-21T15:32:19Z',
        user: { profile: { firstName: 'fakeFirstName', lastName: 'fakeLastName' } } as User
      }
      return Promise.resolve([message])
    }
    return Promise.resolve([])
  })
}
