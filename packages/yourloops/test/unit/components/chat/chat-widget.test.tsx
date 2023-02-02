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

import React from 'react'
import { act, Simulate } from 'react-dom/test-utils'

import ChatWidget from '../../../../components/chat/chat-widget'
import { render, unmountComponentAtNode } from 'react-dom'
import { type IMessage } from '../../../../lib/chat/models/i-message.model'
import type User from '../../../../lib/auth/models/user.model'
import ChatApi from '../../../../lib/chat/chat.api'
import PatientUtils from '../../../../lib/patient/patient.util'
import * as selectedTeamHookMock from '../../../../lib/selected-team/selected-team.provider'
import * as authHookMock from '../../../../lib/auth/auth.hook'
import { type PatientTeam } from '../../../../lib/patient/models/patient-team.model'
import { type Patient } from '../../../../lib/patient/models/patient.model'

jest.mock('../../../../lib/team')
jest.mock('../../../../lib/selected-team/selected-team.provider')
jest.mock('../../../../lib/auth/auth.hook')
describe('Chat widget', () => {
  const teamId = '777'
  const patientTeam = { teamId } as PatientTeam
  const patient: Patient = {
    alarms: {},
    profile: {},
    settings: {},
    userid: '132',
    teams: [patientTeam],
    metadata: { hasSentUnreadMessages: false }
  } as Patient

  let container: HTMLElement | null = null

  async function mountComponent(): Promise<void> {
    await act(() => {
      return new Promise((resolve) => {
        render(<ChatWidget patient={patient} userRole={'patient'} userId={'254'} />, container, resolve)
      })
    })
  }

  beforeAll(() => {
    Element.prototype.scroll = jest.fn()
    jest.spyOn(PatientUtils, 'getRemoteMonitoringTeam').mockReturnValue(patientTeam);

    (selectedTeamHookMock.useSelectedTeamContext as jest.Mock).mockImplementation(() => {
      return { selectedTeamId: teamId }
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { isUserHcp: () => true } }
    })
  })

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container)
      container.remove()
      container = null
    }
  })

  function expectBaseState() {
    const sendButton = container.querySelector('#chat-widget-send-button')
    expect(sendButton).toBeDefined()
    expect(sendButton.getAttribute('disabled')).toBeDefined()
    const textInput = container.querySelector('#standard-multiline-flexible')
    expect(textInput).toBeDefined()
    expect(textInput.innerHTML.length).toEqual(0)
    const emojiPicker = container.querySelector('#chat-widget-emoji-picker')
    expect(emojiPicker).toBeNull()
  }

  it('should render an empty chat widget when no messages for HCP', async () => {
    const apiStub = jest.spyOn(ChatApi, 'getChatMessages').mockResolvedValue(Promise.resolve([]))
    await mountComponent()
    expect(apiStub).toHaveBeenCalled()
    expectBaseState()
  })

  it('should render an empty chat widget when no messages for patient', async () => {
    const apiStub = jest.spyOn(ChatApi, 'getChatMessages').mockResolvedValue(Promise.resolve([]))
    await mountComponent()
    expect(apiStub).toHaveBeenCalled()
    expectBaseState()
  })

  it('should display messages', async () => {
    const mockedMessages: IMessage[] = [{
      id: '123456',
      patientId: patient.userid,
      teamId: 'team1',
      authorId: patient.userid,
      destAck: false,
      text: 'Hello HCPs',
      timezone: 'UTC',
      timestamp: Date.now().toString(),
      user: {} as User,
      private: false
    } as IMessage]
    const apiStub = jest.spyOn(ChatApi, 'getChatMessages').mockResolvedValue(Promise.resolve(mockedMessages))
    await mountComponent()
    expect(apiStub).toHaveBeenCalled()
    const messages = container.querySelectorAll('.message')
    expect(messages.length).toEqual(mockedMessages.length)
  })

  it('should send the message when clicking on send button', async () => {
    jest.spyOn(ChatApi, 'getChatMessages').mockResolvedValue(Promise.resolve([]))
    await mountComponent()

    const textInput = container.querySelector('#standard-multiline-flexible')
    expect(textInput).toBeDefined()
    textInput.innerHTML = 'Hello'
    Simulate.change(textInput)

    const apiStubSendMessage = jest.spyOn(ChatApi, 'sendChatMessage').mockResolvedValue(true)
    const sendButton = container.querySelector('#chat-widget-send-button')
    expect(sendButton).toBeDefined()
    expect(sendButton.getAttribute('disabled')).toBeNull()
    Simulate.click(sendButton)
    expect(apiStubSendMessage).toHaveBeenCalled()
  })
})
