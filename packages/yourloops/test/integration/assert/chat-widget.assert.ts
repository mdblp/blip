/*
 * Copyright (c) 2023-2025, Diabeloop
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

import { fireEvent, screen, within } from '@testing-library/react'
import { myFirstTeamId, myFirstTeamName, mySecondTeamId, mySecondTeamName } from '../mock/team.api.mock'
import userEvent from '@testing-library/user-event'
import { patient1Id } from '../data/patient.api.data'
import ChatApi from '../../../lib/chat/chat.api'

export const checkChatWidgetMessageReadingForHcp = async (): Promise<void> => {
  const dashboard = within(screen.getByTestId('patient-dashboard'))
  const chatCard = dashboard.queryByTestId('chat-card')
  expect(chatCard).toHaveTextContent('Messages (+1)This messages is in the team A - MyThirdTeam - to be deleted which is the best')
  expect(chatCard).toHaveTextContent('NewReplyPrivate')
}

export const checkChatWidgetMessageReadingForPatient = async (): Promise<void> => {
  const dashboard = within(await screen.findByTestId('patient-dashboard'))
  const chatCard = dashboard.queryByTestId('chat-card')
  expect(chatCard).toHaveTextContent('Messages MyFirstTeam​This is a message sent to the team MyFirstTeam')

  const chatCardHeaderTeamDropdown = within(within(chatCard).getByTestId('chat-widget-header')).getByText(myFirstTeamName)
  checkDropdownBadge(true)

  fireEvent.mouseDown(chatCardHeaderTeamDropdown)

  expect(within(screen.getByRole('listbox')).queryByTestId(`unread-messages-badge-team-${myFirstTeamId}`)).not.toBeInTheDocument()
  expect(within(screen.getByRole('listbox')).getByTestId(`unread-messages-badge-team-${mySecondTeamId}`)).toBeVisible()

  await userEvent.click(within(screen.getByRole('listbox')).getByText(mySecondTeamName))

  checkDropdownBadge(false)
  expect(chatCard).toHaveTextContent('Messages (+1)MySecondTeam​This is a message sent from the team MySecondTeam')

  fireEvent.mouseDown(chatCardHeaderTeamDropdown)

  expect(within(screen.getByRole('listbox')).queryByTestId(`unread-messages-badge-team-${myFirstTeamId}`)).not.toBeInTheDocument()
  expect(within(screen.getByRole('listbox')).queryByTestId(`unread-messages-badge-team-${mySecondTeamId}`)).not.toBeInTheDocument()

  await userEvent.click(screen.getByRole('presentation').firstChild as HTMLElement)
}

export const checkChatWidgetMessageSending = async (teamId): Promise<void> => {
  const dashboard = within(screen.getByTestId('patient-dashboard'))
  const chatCard = dashboard.queryByTestId('chat-card')
  const chatInput = within(chatCard).getByRole('textbox')
  const message = 'Hey man, how are things going?'
  await userEvent.type(chatInput, message)
  await userEvent.click(within(chatCard).getByRole('button', { name: 'Send' }))
  expect(ChatApi.sendChatMessage).toHaveBeenCalledWith(teamId, patient1Id, message, false)
}

const checkDropdownBadge = (isVisible: boolean): void => {
  const dashboard = within(screen.getByTestId('patient-dashboard'))
  const chatCard = dashboard.queryByTestId('chat-card')
  const chatCardHeader = within(within(chatCard).getByTestId('chat-widget-header'))
  const badge = chatCardHeader.getByTestId('unread-messages-badge')

  const array = new Array(badge.children.length).fill('')
  const isBadgeFound = array.reduce((isFound: boolean, _: string, currentIndex: number) => {
    const element = badge.children[currentIndex]
    if (element.classList.contains('MuiBadge-badge')) {
      if (isVisible) {
        expect(element).not.toHaveClass('MuiBadge-invisible')
      } else {
        expect(element).toHaveClass('MuiBadge-invisible')
      }
      return true
    }
    return isFound || false
  }, false)

  expect(isBadgeFound).toEqual(true)
}
