/**
 * Copyright (c) 2022, Diabeloop
 * Chat widget tests
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

import ChatWidget from '../../../components/chat/chat-widget'
import { render, unmountComponentAtNode } from 'react-dom'
import { Patient, PatientTeam } from '../../../lib/data/patient'
import * as teamHookMock from '../../../lib/team'
import { IMessage } from '../../../models/chat'
import User from '../../../lib/auth/user'
import ChatApi from '../../../lib/chat/api'

jest.mock('../../../lib/team')
describe('Chat widget', () => {
  const teamId = '777'
  const patientTeam = { teamId } as PatientTeam
  const patient: Patient = {
    userid: '132',
    teams: [patientTeam],
    metadata: { unreadMessagesSent: 0 }
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
    Element.prototype.scroll = jest.fn();
    (teamHookMock.TeamContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children
    });
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return { getPatientRemoteMonitoringTeam: jest.fn().mockReturnValue(patientTeam) }
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

  it('should render an emoji picker when clicking on the emoji button and add the clicked emoji in the text input before disappearing', async () => {
    const apiStub = jest.spyOn(ChatApi, 'getChatMessages').mockResolvedValue(Promise.resolve([]))
    await mountComponent()
    expect(apiStub).toHaveBeenCalled()

    // when clicking on the emoji button
    const emojiButton = container.querySelector('#chat-widget-emoji-button')
    expect(emojiButton).toBeDefined()
    Simulate.click(emojiButton)
    let emojiPicker = container.querySelector('#chat-widget-emoji-picker')
    expect(emojiPicker).toBeDefined()

    // when clicking on an emoji
    const emojiItem = emojiPicker.querySelector('.emoji')
    expect(emojiItem).toBeDefined()
    Simulate.click(emojiItem.querySelector('button'))
    emojiPicker = container.querySelector('#chat-widget-emoji-picker')
    expect(emojiPicker).toBeNull()

    const textInput = container.querySelector('#standard-multiline-flexible')
    expect(textInput.innerHTML.length).toBeGreaterThanOrEqual(1)
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
