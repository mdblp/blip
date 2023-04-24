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

import TeamAPI from '../../../lib/team/team.api'
import { act, fireEvent, screen, within } from '@testing-library/react'
import { PhonePrefixCode } from '../../../lib/utils'
import userEvent from '@testing-library/user-event'

export const checkCreateCareTeamDialog = async () => {
  jest.spyOn(TeamAPI, 'createTeam').mockResolvedValue(undefined)
  const teamMenu = screen.getByLabelText('Open team selection menu')
  await userEvent.click(teamMenu)
  await userEvent.click(screen.getByText('Create a new care team'))
  const dialogTeam = screen.getByRole('dialog')
  const createTeamButton = within(dialogTeam).getByRole('button', { name: 'Create team' })
  const nameInput = within(dialogTeam).getByRole('textbox', { name: 'Name' })
  const address1Input = within(dialogTeam).getByRole('textbox', { name: 'Address 1' })
  const address2Input = within(dialogTeam).getByRole('textbox', { name: 'Address 2' })
  const zipcodeInput = within(dialogTeam).getByRole('textbox', { name: 'Zipcode' })
  const cityInput = within(dialogTeam).getByRole('textbox', { name: 'City (State / Province)' })
  const phoneNumberInput = within(dialogTeam).getByRole('textbox', { name: 'Phone number' })
  const prefixPhoneNumber = within(dialogTeam).getByText('+33')
  const emailInput = within(dialogTeam).getByRole('textbox', { name: 'Email' })

  // Team creation button disabled and all fields empty
  expect(nameInput).toHaveTextContent('')
  expect(address1Input).toHaveTextContent('')
  expect(address2Input).toHaveTextContent('')
  expect(zipcodeInput).toHaveTextContent('')
  expect(cityInput).toHaveTextContent('')
  expect(phoneNumberInput).toHaveTextContent('')
  expect(emailInput).toHaveTextContent('')
  expect(dialogTeam).toBeInTheDocument()
  expect(prefixPhoneNumber).toHaveTextContent(PhonePrefixCode.FR)
  expect(createTeamButton).toBeDisabled()

  // Team dropdown with prefix phone number
  fireEvent.mouseDown(within(screen.getByTestId('team-edit-dialog-select-country')).getByRole('button'))
  await userEvent.click(screen.getByRole('option', { name: 'Austria' }))
  expect(prefixPhoneNumber).toHaveTextContent(PhonePrefixCode.AT)

  // Team creation button activated and all fields filled
  const teamName = 'teamName'
  const teamAddress = '5 rue buisson perdu'
  const teamCity = 'Grenoble'
  const teamZipCode = '38000'
  const teamPhoneNumber = '06000000'
  const teamEmail = 'team@fake.com'
  await userEvent.type(nameInput, teamName)
  await userEvent.type(address1Input, teamAddress)
  await userEvent.type(cityInput, teamCity)
  await userEvent.type(phoneNumberInput, '0600000000')
  await userEvent.type(zipcodeInput, teamZipCode)
  await userEvent.type(emailInput, teamEmail)
  expect(createTeamButton).toBeEnabled()

  // Team creation button disabled and a field in error with the error message
  await userEvent.clear(zipcodeInput)
  expect(createTeamButton).toBeDisabled()
  await userEvent.type(zipcodeInput, '75d')
  expect(within(dialogTeam).getByText('Please enter a valid zipcode')).toBeVisible()
  expect(createTeamButton).toBeDisabled()
  await userEvent.clear(zipcodeInput)
  await userEvent.type(zipcodeInput, teamZipCode)
  expect(createTeamButton).toBeEnabled()

  await userEvent.clear(phoneNumberInput)
  expect(createTeamButton).toBeDisabled()
  await userEvent.type(phoneNumberInput, '060')
  expect(within(dialogTeam).getByText('Please enter a valid phone number')).toBeVisible()
  expect(createTeamButton).toBeDisabled()
  await userEvent.clear(phoneNumberInput)
  await userEvent.type(phoneNumberInput, teamPhoneNumber)
  expect(createTeamButton).toBeEnabled()

  await userEvent.clear(emailInput)
  await userEvent.type(emailInput, 'tototiti.com')
  expect(within(dialogTeam).getByText('Invalid email address (special characters are not allowed).')).toBeVisible()
  expect(createTeamButton).toBeDisabled()
  await userEvent.clear(emailInput)
  await userEvent.type(emailInput, teamEmail)
  expect(createTeamButton).toBeEnabled()

  await act(async () => {
    await userEvent.click(createTeamButton)
  })
  expect(TeamAPI.createTeam).toHaveBeenCalledWith({
    address: {
      city: teamCity,
      country: 'AT',
      line1: teamAddress,
      zip: teamZipCode
    },
    email: teamEmail,
    name: teamName,
    phone: teamPhoneNumber,
    type: undefined
  })

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}
