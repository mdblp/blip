/**
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

import { Router } from 'react-router-dom'
import { AuthContextProvider } from '../../../../lib/auth'
import { MainLobby } from '../../../../app/main-lobby'
import React from 'react'
import { createMemoryHistory } from 'history'
import { act, fireEvent, logDOM, render, screen, within } from '@testing-library/react'
import PatientAPI from '../../../../lib/patient/patient-api'
import { checkPatientSecondaryBar } from '../../utils/patientSecondaryBar'
import { mockAuth0Hook } from '../../mock/mockAuth0Hook'
import { mockNotificationAPI } from '../../mock/mockNotificationAPI'
import { mockDirectShareApi } from '../../mock/mockDirectShareAPI'
import { mockPatientAPI, monitoredPatient, removePatientMock, unMonitoredPatient } from '../../mock/mockPatientAPI'
import { mockUserDataFetch } from '../../mock/auth'
import { mockTeamAPI, teamThree, teamTwo } from '../../mock/mockTeamAPI'
import { checkFooter } from '../../assert/footer'
import { checkHCPLayout } from '../../assert/layout'
import userEvent from '@testing-library/user-event'

describe('HCP home page', () => {
  const firstName = 'Eric'
  const lastName = 'Ard'
  beforeAll(() => {
    mockAuth0Hook()
    mockNotificationAPI()
    mockTeamAPI()
    mockUserDataFetch(firstName, lastName)
    mockPatientAPI()
    mockDirectShareApi()
  })

  function getHomePage() {
    const history = createMemoryHistory({ initialEntries: ['/'] })
    return (
      <Router history={history}>
        <AuthContextProvider>
          <MainLobby />
        </AuthContextProvider>
      </Router>
    )
  }

  it('should render the home page with correct components', async () => {
    await act(async () => {
      render(getHomePage())
    })
    checkHCPLayout(`${firstName} ${lastName}`)
    checkFooter()
    checkPatientSecondaryBar()
  })

  it('should display a list of patient and be able to remove one of them', async () => {
    await act(async () => {
      render(getHomePage())
    })

    expect(screen.queryAllByLabelText('flag-icon-active')).toHaveLength(0)
    expect(screen.getAllByLabelText('flag-icon-inactive')).toHaveLength(2)

    const patientRow = screen.queryByTestId(`patient-row-${unMonitoredPatient.userId}`)
    const removeButton = within(patientRow).getByRole('button', { name: 'Remove patient-ylp.ui.test.patient28@diabeloop.fr' })
    expect(removeButton).toBeInTheDocument()

    removeButton.click()
    const removeDialog = screen.getByRole('dialog')
    expect(removeDialog).toBeInTheDocument()
    const confirmRemoveButton = within(removeDialog).getByRole('button', { name: 'Remove patient' })

    jest.spyOn(PatientAPI, 'getPatients').mockResolvedValueOnce([monitoredPatient])
    await act(async () => {
      confirmRemoveButton.click()
    })
    expect(removePatientMock).toHaveBeenCalledWith(unMonitoredPatient.teamId, unMonitoredPatient.userId)
    expect(screen.getAllByLabelText('flag-icon-inactive')).toHaveLength(1)
    expect(screen.queryByTestId('remove-hcp-patient-dialog')).toBeFalsy()
    expect(screen.getByTestId('alert-snackbar')).toHaveTextContent(`${unMonitoredPatient.profile.firstName} ${unMonitoredPatient.profile.lastName} is no longer a member of ${teamThree.name}`)
  })

  it('should be able to remove a patient who is in many teams', async () => {
    await act(async () => {
      render(getHomePage())
    })

    const patientRow = screen.queryByTestId(`patient-row-${monitoredPatient.userId}`)
    const removeButton = within(patientRow).getByRole('button', { name: 'Remove patient-ylp.ui.test.patient28@diabeloop.fr' })
    expect(removeButton).toBeInTheDocument()

    removeButton.click()
    const removeDialog = screen.getByRole('dialog')
    expect(removeDialog).toBeInTheDocument()
    const confirmRemoveButton = within(removeDialog).getByRole('button', { name: 'Remove patient' })

    const select = within(removeDialog).getByTestId('patient-team-selector')
    fireEvent.mouseDown(within(select).getByRole('button'))

    screen.getByRole('listbox')
    fireEvent.click(screen.getByRole('option', { name: teamTwo.name }))

    await act(async () => {
      confirmRemoveButton.click()
    })
    expect(removePatientMock).toHaveBeenCalledWith(monitoredPatient.teamId, monitoredPatient.userId)
    expect(screen.queryByTestId('remove-hcp-patient-dialog')).not.toBeInTheDocument()
    expect(screen.getByTestId('alert-snackbar')).toHaveTextContent(`${monitoredPatient.profile.firstName} ${monitoredPatient.profile.lastName} is no longer a member of ${teamTwo.name}`)
  })

  it('should display an error message if patient removal failed', async () => {
    mockPatientAPI()
    jest.spyOn(PatientAPI, 'removePatient').mockRejectedValueOnce(Error('error'))
    await act(async () => {
      render(getHomePage())
    })

    const patientRow = screen.queryByTestId(`patient-row-${unMonitoredPatient.userId}`)
    const removeButton = within(patientRow).getByRole('button', { name: `Remove patient-${unMonitoredPatient.email}` })
    removeButton.click()
    const removeDialog = screen.getByRole('dialog')
    const confirmRemoveButton = within(removeDialog).getByRole('button', { name: 'Remove patient' })

    await act(async () => {
      confirmRemoveButton.click()
    })
    expect(removePatientMock).toHaveBeenCalledWith(unMonitoredPatient.teamId, unMonitoredPatient.userId)
    expect(screen.getByTestId('remove-hcp-patient-dialog')).toBeInTheDocument()
    expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('Impossible to remove patient. Please try again later.')
  })
  it('should check that the team creation button is valid if all fields are complete', async () => {
    await act(async () => {
      render(getHomePage())
    })
    const teamMenu = screen.getByLabelText('Open team menu')
    userEvent.click(teamMenu)
    userEvent.click(screen.getByText('New care team'))
    const dialogTeam = screen.getByRole('dialog')
    const createTeamButton = within(dialogTeam).getByRole('button', { name: 'Create team' })
    const nameInput = within(dialogTeam).getByRole('textbox', { name: 'Name' })
    const adress1Input: HTMLInputElement = within(dialogTeam).getByRole('textbox', { name: 'Address 1' })
    const adress2Input: HTMLInputElement = within(dialogTeam).getByRole('textbox', { name: 'Address 2' })
    const zipcodeInput: HTMLInputElement = within(dialogTeam).getByRole('textbox', { name: 'Zipcode' })
    const cityInput: HTMLInputElement = within(dialogTeam).getByRole('textbox', { name: 'City (State / Province)' })
    const phoneNumberInput: HTMLInputElement = within(dialogTeam).getByRole('textbox', { name: 'Phone number' })
    const emailInput: HTMLInputElement = within(dialogTeam).getByRole('textbox', { name: 'Email' })

    expect(nameInput).toHaveTextContent('')
    expect(adress1Input).toHaveTextContent('')
    expect(adress2Input).toHaveTextContent('')
    expect(zipcodeInput).toHaveTextContent('')
    expect(cityInput).toHaveTextContent('')
    expect(phoneNumberInput).toHaveTextContent('')
    expect(emailInput).toHaveTextContent('')
    expect(dialogTeam).toBeInTheDocument()
    expect(createTeamButton).toBeDisabled()
  })
})
