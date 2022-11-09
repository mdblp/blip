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

import PatientAPI from '../../../../lib/patient/patient-api'
import { checkSecondaryBar } from '../../utils/patientSecondaryBar'
import { mockAuth0Hook } from '../../mock/mockAuth0Hook'
import { mockNotificationAPI } from '../../mock/mockNotificationAPI'
import { mockDirectShareApi } from '../../mock/mockDirectShareAPI'
import { buildPatient, mockPatientAPI } from '../../mock/mockPatientAPI'
import { mockUserDataFetch } from '../../mock/auth'
import { mockTeamAPI } from '../../mock/mockTeamAPI'
import { checkCaregiverLayout } from '../../assert/layout'
import { UserRoles } from '../../../../models/user'
import { renderPage } from '../../utils/render'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Caregiver home page', () => {
  const firstName = 'Eric'
  const lastName = 'Ard'
  beforeAll(() => {
    mockAuth0Hook(UserRoles.caregiver)
    mockNotificationAPI()
    mockTeamAPI()
    mockUserDataFetch(firstName, lastName)
    mockPatientAPI()
    mockDirectShareApi()
  })

  it('should render the home page with correct components', async () => {
    renderPage('/')
    expect(await screen.findByTestId('app-main-header')).toBeVisible()
    checkCaregiverLayout(`${firstName} ${lastName}`)
    checkSecondaryBar(false, false)
  })

  it('should filter patients correctly depending on the search value', async () => {
    const patient1 = buildPatient({
      userId: 'patientId1',
      profile: {
        firstName: 'Akim',
        lastName: 'Embett',
        fullName: 'Akim Embett',
        patient: { birthday: '2010-01-20' }
      }
    })
    const patient2 = buildPatient({
      userId: 'patientId2',
      profile: {
        firstName: 'Alain',
        lastName: 'Provist',
        fullName: 'Alain Provist',
        patient: { birthday: '2010-01-20' }
      }
    })
    const patient3 = buildPatient({
      userId: 'patientId3',
      profile: {
        firstName: 'Annie',
        lastName: 'Versaire',
        fullName: 'Annie Versaire',
        patient: { birthday: '2015-05-25' }
      }
    })
    jest.spyOn(PatientAPI, 'getPatients').mockResolvedValueOnce([patient1, patient2, patient3])

    renderPage('/')

    expect(await screen.findByTestId('patient-table-body')).toBeVisible()
    const patientTableBody = within(screen.getByTestId('patient-table-body'))

    // Checking that all patients are displayed
    expect(patientTableBody.getByText(patient1.profile.fullName)).toBeVisible()
    expect(patientTableBody.getByText(patient2.profile.fullName)).toBeVisible()
    expect(patientTableBody.getByText(patient3.profile.fullName)).toBeVisible()

    const searchPatient = screen.getByPlaceholderText('Search for a patient by first name, last name or birthdate (dd/mm/yyyy)')

    // Searching by birthdate only
    await userEvent.type(searchPatient, '20/01/2010')
    expect(patientTableBody.getByText(patient1.profile.fullName)).toBeVisible()
    expect(patientTableBody.getByText(patient2.profile.fullName)).toBeVisible()
    expect(patientTableBody.queryByText(patient3.profile.fullName)).not.toBeInTheDocument()
    userEvent.clear(searchPatient)

    // Searching by birthdate and first name
    await userEvent.type(searchPatient, '20/01/2010 Aki')
    expect(patientTableBody.getByText(patient1.profile.fullName)).toBeVisible()
    expect(patientTableBody.queryByText(patient2.profile.fullName)).not.toBeInTheDocument()
    expect(patientTableBody.queryByText(patient3.profile.fullName)).not.toBeInTheDocument()
    userEvent.clear(searchPatient)

    // Searching by birthdate and last name
    await userEvent.type(searchPatient, '20/01/2010provi')
    expect(patientTableBody.getByText(patient2.profile.fullName)).toBeVisible()
    expect(patientTableBody.queryByText(patient1.profile.fullName)).not.toBeInTheDocument()
    expect(patientTableBody.queryByText(patient3.profile.fullName)).not.toBeInTheDocument()
  })

  it('should display a list of patients and allow to remove one of them', async () => {
    await act(async () => {
      renderPage('/')
    })

    checkCaregiverLayout(`${firstName} ${lastName}`)
    checkPatientSecondaryBarCommon()

    expect(screen.queryAllByLabelText('flag-icon-active')).toHaveLength(0)
    expect(screen.getAllByLabelText('flag-icon-inactive')).toHaveLength(2)

    const patientRow = screen.queryByTestId(`patient-row-${unmonitoredPatient.userId}`)
    const removePatientButton = within(patientRow).getByRole('button', { name: 'Remove patient-ylp.ui.test.patient28@diabeloop.fr' })
    expect(removePatientButton).toBeVisible()

    userEvent.click(removePatientButton)

    const removePatientDialog = screen.getByRole('dialog')
    expect(removePatientDialog).toBeVisible()

    const removePatientDialogTitle = within(removePatientDialog).getByText('Remove a patient')
    expect(removePatientDialogTitle).toBeVisible()

    const removePatientDialogQuestion = within(removePatientDialog).getByText('Are you sure you want to remove patient Unmonitored Patient?')
    expect(removePatientDialogQuestion).toBeVisible()

    const removePatientDialogCancelButton = within(removePatientDialog).getByText('Cancel')
    expect(removePatientDialogCancelButton).toBeVisible()

    const removePatientDialogConfirmButton = within(removePatientDialog).getByRole('button', { name: 'Remove patient' })
    expect(removePatientDialogConfirmButton).toBeVisible()

    jest.spyOn(PatientAPI, 'getPatients').mockResolvedValueOnce([monitoredPatient])
    await act(async () => {
      userEvent.click(removePatientDialogConfirmButton)
    })

    expect(removeDirectShareMock).toHaveBeenCalledWith(unmonitoredPatient.userId, loggedInUserId)
    expect(screen.getAllByLabelText('flag-icon-inactive')).toHaveLength(1)
    expect(screen.queryByTestId('remove-direct-share-dialog')).toBeFalsy()
    expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('You no longer have access to your patient\'s data.')
  })

  it('should display an error message if patient removal failed', async () => {
    jest.spyOn(DirectShareApi, 'removeDirectShare').mockRejectedValueOnce('Error')

    await act(async () => {
      renderPage('/')
    })

    const patientRow = screen.queryByTestId(`patient-row-${unmonitoredPatient.userId}`)

    const removeButton = within(patientRow).getByRole('button', { name: `Remove patient-${unmonitoredPatient.email}` })

    userEvent.click(removeButton)

    const removeDialog = screen.getByRole('dialog')

    const confirmRemoveButton = within(removeDialog).getByRole('button', { name: 'Remove patient' })

    await act(async () => {
      userEvent.click(confirmRemoveButton)
    })

    expect(removeDirectShareMock).toHaveBeenCalledWith(unmonitoredPatient.userId, loggedInUserId)
    expect(screen.getByTestId('remove-direct-share-dialog')).toBeVisible()
    expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('Impossible to remove patient. Please try again later.')
  })
})
