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

import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { myFirstTeamName, mySecondTeamId, mySecondTeamName } from '../mock/team.api.mock'
import userEvent from '@testing-library/user-event'
import { monitoredPatientId } from '../data/patient.api.data'
import ChatApi from '../../../lib/chat/chat.api'

export const checkChatWidgetForPatient = async (): Promise<void> => {
  const dashboard = within(screen.getByTestId('patient-dashboard'))
  const chatCard = dashboard.queryByTestId('chat-card')
  expect(chatCard).toHaveTextContent('Messages MyFirstTeamThis is a message sent to the team MyFirstTeam')
  const chatCardHeader = within(within(chatCard).getByTestId('card-header')).getByText(myFirstTeamName)
  fireEvent.mouseDown(chatCardHeader)
  await userEvent.click(within(screen.getByRole('listbox')).getByText(mySecondTeamName))
  await waitFor(() => {
    expect(chatCard).toHaveTextContent('Messages (+1)MySecondTeamThis is a message sent from the team MySecondTeam')
  })
  const chatInput = within(chatCard).getByRole('textbox')
  const message = 'Hey man, how are things going?'
  await userEvent.type(chatInput, message)
  await userEvent.click(within(chatCard).getByRole('button', { name: 'Send' }))
  expect(jest.spyOn(ChatApi, 'sendChatMessage')).toHaveBeenCalledWith(mySecondTeamId, monitoredPatientId, message, false)
}
