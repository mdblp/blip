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
import { checkSecondaryBar } from '../../utils/patientSecondaryBar'
import { mockAuth0Hook } from '../../mock/mockAuth0Hook'
import { mockNotificationAPI } from '../../mock/mockNotificationAPI'
import { mockDirectShareApi } from '../../mock/mockDirectShareAPI'
import {
  mockPatientAPI,
  monitoredPatient,
  removePatientMock,
  unmonitoredPatient,
  pendingPatient
} from '../../mock/mockPatientAPI'
import { mockUserDataFetch } from '../../mock/auth'
import { mockTeamAPI, teamOne, teamThree, teamTwo } from '../../mock/mockTeamAPI'
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
    checkSecondaryBar(false, true)
  })

  it('should display a list of patient and be able to remove one of them', async () => {
    await act(async () => {
      render(getHomePage())
    })

    expect(screen.queryAllByLabelText('flag-icon-active')).toHaveLength(0)
    expect(screen.getAllByLabelText('flag-icon-inactive')).toHaveLength(2)

    const patientRow = screen.queryByTestId(`patient-row-${unmonitoredPatient.userId}`)
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
    expect(removePatientMock).toHaveBeenCalledWith(unmonitoredPatient.teamId, unmonitoredPatient.userId)
    expect(screen.getAllByLabelText('flag-icon-inactive')).toHaveLength(1)
    expect(screen.queryByTestId('remove-hcp-patient-dialog')).toBeFalsy()
    expect(screen.getByTestId('alert-snackbar')).toHaveTextContent(`${unmonitoredPatient.profile.firstName} ${unmonitoredPatient.profile.lastName} is no longer a member of ${teamThree.name}`)
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

    const patientRow = screen.queryByTestId(`patient-row-${unmonitoredPatient.userId}`)
    const removeButton = within(patientRow).getByRole('button', { name: `Remove patient-${unmonitoredPatient.email}` })
    removeButton.click()
    const removeDialog = screen.getByRole('dialog')
    const confirmRemoveButton = within(removeDialog).getByRole('button', { name: 'Remove patient' })

    await act(async () => {
      confirmRemoveButton.click()
    })
    expect(removePatientMock).toHaveBeenCalledWith(unmonitoredPatient.teamId, unmonitoredPatient.userId)
    expect(screen.getByTestId('remove-hcp-patient-dialog')).toBeInTheDocument()
    expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('Impossible to remove patient. Please try again later.')
  })

  it('should display Add patient dialog with appropriate error messages depending on the input user and the selected team', async () => {
    await act(async () => {
      render(getHomePage())
    })

    const secondaryBar = screen.getByTestId('patients-secondary-bar')
    const addPatientButton = within(secondaryBar).getByText('Add patient')
    expect(addPatientButton).toBeVisible()

    userEvent.click(addPatientButton)

    const addPatientDialog = screen.getByRole('dialog')
    expect(addPatientDialog).toBeVisible()

    const title = within(addPatientDialog).getByText('New patient')
    expect(title).toBeVisible()

    const warningLine1 = within(addPatientDialog).getByText('By inviting this patient to share their data with me and their care team, I declare under my professional responsibility that I am part of this patient’s care team and, as such, have the right to access the patient’s personal data according to the applicable regulations.')
    expect(warningLine1).toBeVisible()

    const warningLine2 = within(addPatientDialog).getByTestId('modal-add-patient-warning-line2')
    expect(warningLine2).toHaveTextContent('Read our Terms of use and Privacy Policy.')
    const termsOfUseLink = within(addPatientDialog).getByRole('link', { name: 'Terms of use' })
    expect(termsOfUseLink).toBeVisible()
    const privacyPolicyLink = within(addPatientDialog).getByRole('link', { name: 'Privacy Policy' })
    expect(privacyPolicyLink).toBeVisible()

    const cancelButton = within(addPatientDialog).getByText('Cancel')
    expect(cancelButton).toBeVisible()

    const invitePatientButton = within(addPatientDialog).getByRole('button', { name: 'Invite' })
    expect(invitePatientButton).toBeVisible()

    const emailInput = within(addPatientDialog).getByRole('textbox', { name: 'Email' })
    expect(emailInput).toBeVisible()
    await userEvent.type(emailInput, monitoredPatient.email)

    const select = within(addPatientDialog).getByTestId('patient-team-selector')
    fireEvent.mouseDown(within(select).getByRole('button'))
    fireEvent.click(screen.getByRole('option', { name: teamTwo.name }))

    const alreadyInTeamErrorMessage = within(addPatientDialog).getByText('This patient already shared their data with the team.')
    expect(alreadyInTeamErrorMessage).toBeVisible()
    expect(invitePatientButton).toBeDisabled()

    userEvent.clear(emailInput)
    await userEvent.type(emailInput, pendingPatient.email)
    fireEvent.mouseDown(within(select).getByRole('button'))
    fireEvent.click(screen.getByRole('option', { name: teamThree.name }))

    const pendingErrorMessage = within(addPatientDialog).getByText('This patient has already been invited and hasn\'t confirmed yet.')
    expect(pendingErrorMessage).toBeVisible()
    expect(invitePatientButton).toBeDisabled()

    fireEvent.mouseDown(within(select).getByRole('button'))
    fireEvent.click(screen.getByRole('option', { name: teamOne.name }))

    expect(invitePatientButton).toBeEnabled()
  })
})
