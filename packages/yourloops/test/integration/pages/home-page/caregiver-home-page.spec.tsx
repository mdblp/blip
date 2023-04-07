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

import PatientAPI from '../../../../lib/patient/patient.api'
import { loggedInUserId, mockAuth0Hook } from '../../mock/auth0.hook.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import { mockDirectShareApi, removeDirectShareMock } from '../../mock/direct-share.api.mock'
import {
  buildPatientAsTeamMember,
  mockPatientApiForCaregivers,
  monitoredPatientAsTeamMember,
  unmonitoredPatientAsTeamMember
} from '../../mock/patient.api.mock'
import { mockTeamAPI } from '../../mock/team.api.mock'
import { checkCaregiverLayout } from '../../assert/layout'
import { renderPage } from '../../utils/render'
import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DirectShareApi from '../../../../lib/share/direct-share.api'
import { UserRole } from '../../../../lib/auth/models/enums/user-role.enum'
import { mockUserApi } from '../../mock/user.api.mock'
import { checkPatientList } from '../../assert/patient-list-header'

describe('Caregiver home page', () => {
  const firstName = 'Eric'
  const lastName = 'Ard'

  beforeAll(() => {
    mockAuth0Hook(UserRole.Caregiver)
    mockNotificationAPI()
    mockTeamAPI()
    mockUserApi().mockUserDataFetch({ firstName, lastName })
    mockPatientApiForCaregivers()
    mockDirectShareApi()
  })

  it('should render the home page with correct components', async () => {
    const router = renderPage('/')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/home')
    })
    expect(await screen.findByTestId('app-main-header')).toBeVisible()
    await checkCaregiverLayout(`${firstName} ${lastName}`)
    checkPatientList(UserRole.Caregiver)
  })

  it('should filter patients correctly depending on the search value', async () => {
    const patient1 = buildPatientAsTeamMember({
      userId: 'patientId1',
      profile: {
        email: 'Akim@embett.com',
        firstName: 'Akim',
        lastName: 'Embett',
        fullName: 'Akim Embett',
        patient: { birthday: '2010-01-20' }
      }
    })
    const patient2 = buildPatientAsTeamMember({
      userId: 'patientId2',
      profile: {
        email: 'alain@provist.com',
        firstName: 'Alain',
        lastName: 'Provist',
        fullName: 'Alain Provist',
        patient: { birthday: '2010-01-20' }
      }
    })
    const patient3 = buildPatientAsTeamMember({
      userId: 'patientId3',
      profile: {
        email: 'annie@versaire.com',
        firstName: 'Annie',
        lastName: 'Versaire',
        fullName: 'Annie Versaire',
        patient: { birthday: '2015-05-25' }
      }
    })
    jest.spyOn(PatientAPI, 'getPatients').mockResolvedValueOnce([patient1, patient2, patient3])

    renderPage('/')

    expect(await screen.findByTestId('patient-list-grid')).toBeVisible()
    const patientTableBody = within(screen.getByTestId('patient-list-grid'))

    // Checking that all patients are displayed
    expect(patientTableBody.getByText(patient1.profile.fullName)).toBeVisible()
    expect(patientTableBody.getByText(patient2.profile.fullName)).toBeVisible()
    expect(patientTableBody.getByText(patient3.profile.fullName)).toBeVisible()

    const searchPatient = screen.getByPlaceholderText('Search for a patient...')

    // Searching by birthdate only
    await userEvent.type(searchPatient, '20/01/2010')
    expect(patientTableBody.getByText(patient1.profile.fullName)).toBeVisible()
    expect(patientTableBody.getByText(patient2.profile.fullName)).toBeVisible()
    expect(patientTableBody.queryByText(patient3.profile.fullName)).not.toBeInTheDocument()
    await userEvent.clear(searchPatient)

    // Searching by birthdate and first name
    await userEvent.type(searchPatient, '20/01/2010 Aki')
    expect(patientTableBody.getByText(patient1.profile.fullName)).toBeVisible()
    expect(patientTableBody.queryByText(patient2.profile.fullName)).not.toBeInTheDocument()
    expect(patientTableBody.queryByText(patient3.profile.fullName)).not.toBeInTheDocument()
    await userEvent.clear(searchPatient)

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

    await checkCaregiverLayout(`${firstName} ${lastName}`)
    checkPatientList(UserRole.Caregiver)

    const patientTableBody = screen.getByTestId('patient-list-grid')
    expect(within(patientTableBody).getAllByRole('row')).toHaveLength(5)
    expect(patientTableBody).toHaveTextContent('PatientSystemTime spent out of range from targetSevere hypoglycemiaData not transferredLast data updateActionsFlag patient monitored-patient2@diabeloop.frMonitored Monitored Patient 2DBLG110%20%30%N/AFlag patient monitored-patient@diabeloop.frMonitored PatientDBLG110%20%30%N/AFlag patient pending-patient@diabeloop.frPending PatientDBLG110%20%30%N/AFlag patient unmonitored-patient@diabeloop.frUnmonitored PatientDBLG110%20%30%N/AData calculated on the last 7 daysRows per page:101–4 of 4')

    const removePatientButton = screen.getByRole('button', { name: `Remove patient ${unmonitoredPatientAsTeamMember.email}` })
    expect(removePatientButton).toBeVisible()

    await userEvent.click(removePatientButton)

    const removePatientDialog = screen.getByRole('dialog')
    expect(removePatientDialog).toBeVisible()

    const removePatientDialogTitle = within(removePatientDialog).getByText('Remove a patient')
    expect(removePatientDialogTitle).toBeVisible()

    const removePatientDialogQuestion = within(removePatientDialog).getByText('Are you sure you want to remove Unmonitored Patient?')
    expect(removePatientDialogQuestion).toBeVisible()

    const removePatientDialogCancelButton = within(removePatientDialog).getByText('Cancel')
    expect(removePatientDialogCancelButton).toBeVisible()

    const removePatientDialogConfirmButton = within(removePatientDialog).getByRole('button', { name: 'Remove patient' })
    expect(removePatientDialogConfirmButton).toBeVisible()

    await userEvent.click(removePatientDialogCancelButton)

    expect(removePatientDialog).not.toBeInTheDocument()

    await userEvent.click(removePatientButton)

    const removePatientDialog2 = screen.getByRole('dialog')
    expect(removePatientDialog2).toBeVisible()

    const removePatientDialog2ConfirmButton = within(removePatientDialog2).getByRole('button', { name: 'Remove patient' })

    jest.spyOn(PatientAPI, 'getPatients').mockResolvedValueOnce([monitoredPatientAsTeamMember])
    await act(async () => {
      await userEvent.click(removePatientDialog2ConfirmButton)
    })

    expect(removeDirectShareMock).toHaveBeenCalledWith(unmonitoredPatientAsTeamMember.userId, loggedInUserId)
    expect(within(patientTableBody).getAllByRole('row')).toHaveLength(2)
    expect(patientTableBody).toHaveTextContent('PatientSystemTime spent out of range from targetSevere hypoglycemiaData not transferredLast data updateActionsFlag patient monitored-patient@diabeloop.frMonitored PatientDBLG110%20%30%N/AData calculated on the last 7 daysRows per page:101–1 of 1')
    expect(screen.queryByTestId('remove-direct-share-dialog')).toBeFalsy()
    expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('You no longer have access to your patient\'s data.')
  })

  it('should display an error message if patient removal failed', async () => {
    jest.spyOn(DirectShareApi, 'removeDirectShare').mockRejectedValueOnce('Error')

    await act(async () => {
      renderPage('/')
    })

    const removeButton = screen.getByRole('button', { name: `Remove patient ${unmonitoredPatientAsTeamMember.email}` })

    await userEvent.click(removeButton)

    const removeDialog = screen.getByRole('dialog')

    const confirmRemoveButton = within(removeDialog).getByRole('button', { name: 'Remove patient' })

    await act(async () => {
      await userEvent.click(confirmRemoveButton)
    })

    expect(removeDirectShareMock).toHaveBeenCalledWith(unmonitoredPatientAsTeamMember.userId, loggedInUserId)
    expect(screen.getByTestId('remove-direct-share-dialog')).toBeVisible()
    expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('Impossible to remove patient. Please try again later.')
  })
})
