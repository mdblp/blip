/*
 * Copyright (c) 2022-2025, Diabeloop
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

import { loggedInUserId, mockAuth0Hook } from '../../mock/auth0.hook.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import { mockDirectShareApi, removeDirectShareMock } from '../../mock/direct-share.api.mock'
import { patient1Info, patient2Info } from '../../data/patient.api.data'
import { mockTeamAPI } from '../../mock/team.api.mock'
import { checkCaregiverLayout } from '../../assert/layout.assert'
import { renderPage } from '../../utils/render'
import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DirectShareApi from '../../../../lib/share/direct-share.api'
import { UserRole } from '../../../../lib/auth/models/enums/user-role.enum'
import { mockUserApi } from '../../mock/user.api.mock'
import { mockPatientApiForCaregivers } from '../../mock/patient.api.mock'
import PatientApi from '../../../../lib/patient/patient.api'
import { checkPatientListHeaderCaregiver } from '../../assert/patient-list.assert'
import { buildPatient } from '../../data/patient-builder.data'
import moment from 'moment-timezone'
import { PRIVATE_TEAM_ID } from '../../../../lib/team/team.util'
import ErrorApi from '../../../../lib/error/error.api'
import { mockDblCommunicationApi } from '../../mock/dbl-communication.api'

describe('Caregiver home page', () => {
  const firstName = 'Eric'
  const lastName = 'Ard'

  beforeEach(() => {
    mockAuth0Hook(UserRole.Caregiver)
    mockNotificationAPI()
    mockTeamAPI()
    mockUserApi().mockUserDataFetch({ firstName, lastName })
    mockPatientApiForCaregivers()
    mockDirectShareApi()
    mockDblCommunicationApi()
  })

  it('should render the patient list page with correct components', async () => {
    jest.spyOn(PatientApi, 'getPatientsMetricsForHcp')

    const router = renderPage('/')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(`/teams/${PRIVATE_TEAM_ID}/patients`)
    }, { timeout: 3000 })
    expect(await screen.findByTestId('app-main-header')).toBeVisible()
    await checkCaregiverLayout(`${lastName} ${firstName}`)
    checkPatientListHeaderCaregiver()

    expect(PatientApi.getPatientsMetricsForHcp).not.toHaveBeenCalled()
  })

  it('should filter patients correctly depending on the search value', async () => {
    const glycemiaIndicators = {
      timeInRange: 0,
      glucoseManagementIndicator: null,
      coefficientOfVariation: null,
      hypoglycemia: 0
    }
    const medicalData = { range: { startDate: '2023-06-21T07:02:25.378Z', endDate: '2023-06-22T07:02:25.378Z' } }

    const patient1 = buildPatient({
      userid: 'patientId1',
      profile: {
        email: 'Akim@embett.com',
        firstName: 'Akim',
        lastName: 'Embett',
        fullName: 'Akim Embett',
        birthdate: '2010-01-20T10:44:34+01:00'
      },
      glycemiaIndicators,
      medicalData
    })

    const patient2 = buildPatient({
      userid: 'patientId2',
      profile: {
        email: 'alain@provist.com',
        firstName: 'Alain',
        lastName: 'Provist',
        fullName: 'Alain Provist',
        birthdate: '2010-01-20T10:44:34+01:00'
      },
      glycemiaIndicators,
      medicalData
    })

    const patient3 = buildPatient({
      userid: 'patientId3',
      profile: {
        email: 'annie@versaire.com',
        firstName: 'Annie',
        lastName: 'Versaire',
        fullName: 'Annie Versaire',
        birthdate: '2015-05-25T10:44:34+01:00'
      },
      glycemiaIndicators,
      medicalData
    })

    jest.spyOn(PatientApi, 'getPatientsForCaregivers').mockResolvedValue([patient1, patient2, patient3])

    renderPage('/')

    await waitFor(() => {
      expect(screen.queryByTestId('current-patient-list-grid')).toBeVisible()
    }, { timeout: 10000 })

    const lastDataUploadDate = moment.tz(patient1.medicalData.range.endDate, new Intl.DateTimeFormat().resolvedOptions().timeZone).format('lll')

    // Checking that all patients are displayed
    const dataGridRow = screen.getByTestId('current-patient-list-grid')
    expect(within(dataGridRow).getAllByRole('row')).toHaveLength(4)
    expect(dataGridRow).toHaveTextContent(`PatientDate of birthTIRBelow rangeLast data updateActionsFlag patient Akim@embett.comEmbett AkimJan 20, 20100%0%Jun 22, 2023 7:02 AMFlag patient alain@provist.comProvist AlainJan 20, 20100%0%Jun 22, 2023 7:02 AMFlag patient annie@versaire.comVersaire AnnieMay 25, 20150%0%Jun 22, 2023 7:02 AM`)

    const searchPatient = screen.getByPlaceholderText('Search for a patient...')

    // Searching by birthdate only
    await userEvent.type(searchPatient, '20/01/2010')
    expect(dataGridRow).toHaveTextContent(`PatientDate of birthTIRBelow rangeLast data updateActionsFlag patient Akim@embett.comEmbett AkimJan 20, 20100%0%Jun 22, 2023 7:02 AMFlag patient alain@provist.comProvist AlainJan 20, 20100%0%Jun 22, 2023 7:02 AM`)
    await userEvent.clear(searchPatient)

    // Searching by birthdate and first name
    await userEvent.type(searchPatient, '20/01/2010 Aki')
    expect(dataGridRow).toHaveTextContent(`PatientDate of birthTIRBelow rangeLast data updateActionsFlag patient Akim@embett.comEmbett AkimJan 20, 20100%0%${lastDataUploadDate}`)
    await userEvent.clear(searchPatient)

    // Searching by birthdate and last name
    await userEvent.type(searchPatient, '20/01/2010provi')
    expect(dataGridRow).toHaveTextContent('PatientDate of birthTIRBelow rangeLast data updateActionsFlag patient alain@provist.comProvist AlainJan 20, 20100%0%Jun 22, 2023 7:02 AM')
  })

  it('should display a list of patients and allow to remove one of them', async () => {
    const router = renderPage('/')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(`/teams/${PRIVATE_TEAM_ID}/patients`)
    })

    await checkCaregiverLayout(`${lastName} ${firstName}`)
    checkPatientListHeaderCaregiver()

    const patientTableBody = screen.getByTestId('current-patient-list-grid')
    expect(within(patientTableBody).getAllByRole('row')).toHaveLength(5)
    expect(patientTableBody).toHaveTextContent('PatientDate of birthTIRBelow rangeLast data updateActionsFlag patient patient1@diabeloop.frGroby Patient1Jan 1, 1980Flag patient pending-patient@diabeloop.frPatient PendingJan 1, 1980Flag patient patient2@diabeloop.frRouis Patient2Jan 1, 1980Flag patient patient3@diabeloop.frSrairi Patient3Jan 1, 1980')
    const removePatientButton = screen.getByRole('button', { name: `Remove patient ${patient2Info.profile.email}` })
    expect(removePatientButton).toBeVisible()

    await userEvent.click(removePatientButton)

    const removePatientDialog = screen.getByRole('dialog')
    expect(removePatientDialog).toBeVisible()

    const removePatientDialogTitle = within(removePatientDialog).getByText('Remove patient Patient2 Rouis')
    expect(removePatientDialogTitle).toBeVisible()

    expect(removePatientDialog).toHaveTextContent('Are you sure you want to remove Patient2 Rouis?')

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

    await userEvent.click(removePatientDialog2ConfirmButton)

    expect(removeDirectShareMock).toHaveBeenCalledWith(patient2Info.userid, loggedInUserId)
    expect(jest.spyOn(PatientApi, 'getPatientsForCaregivers').mockResolvedValue([patient1Info])).toHaveBeenCalledTimes(2)
    expect(screen.queryByTestId('remove-direct-share-dialog')).toBeFalsy()
    expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('You no longer have access to your patient\'s data.')
  })

  it('should display an error message if patient removal failed', async () => {
    jest.spyOn(DirectShareApi, 'removeDirectShare').mockRejectedValueOnce('This error was thrown by a mock on purpose')
    jest.spyOn(ErrorApi, 'sendError').mockResolvedValue(null)

    await act(async () => {
      renderPage('/')
    })

    const removeButton = screen.getByRole('button', { name: `Remove patient ${patient2Info.profile.email}` })

    await userEvent.click(removeButton)

    const removeDialog = screen.getByRole('dialog')

    const confirmRemoveButton = within(removeDialog).getByRole('button', { name: 'Remove patient' })

    await userEvent.click(confirmRemoveButton)

    expect(removeDirectShareMock).toHaveBeenCalledWith(patient2Info.userid, loggedInUserId)
    expect(screen.getByTestId('remove-direct-share-dialog')).toBeVisible()
    expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('Impossible to remove patient. Please try again later.')
  })

  it('should display the right columns for caregivers and be able to change them', async () => {
    const router = renderPage('/')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(`/teams/${PRIVATE_TEAM_ID}/patients`)
    })

    const columnSettingsButton = screen.getByRole('button', { name: 'Change columns settings' })

    checkPatientListHeaderCaregiver()
    expect(screen.getByRole('columnheader', { name: 'Patient' })).toBeVisible()
    expect(screen.queryByRole('columnheader', { name: 'Age' })).not.toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Date of birth' })).toBeVisible()
    expect(screen.queryByRole('columnheader', { name: 'Gender' })).not.toBeInTheDocument()
    expect(screen.queryByRole('columnheader', { name: 'System' })).not.toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Last data update' })).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeVisible()

    await userEvent.click(columnSettingsButton)

    const columnSettingsPopover = screen.getByRole('presentation')
    const applyButton = within(columnSettingsPopover).getByRole('button', { name: 'Apply' })
    expect(columnSettingsPopover).toBeVisible()
    expect(within(columnSettingsPopover).getByText('Show column')).toBeVisible()

    const patientToggle = within(within(columnSettingsPopover).getByLabelText('Patient')).getByRole('checkbox')
    const ageToggle = within(within(columnSettingsPopover).getByLabelText('Age')).getByRole('checkbox')
    const dateOfBirthToggle = within(within(columnSettingsPopover).getByLabelText('Date of birth')).getByRole('checkbox')
    const genderToggle = within(within(columnSettingsPopover).getByLabelText('Gender')).getByRole('checkbox')
    const systemToggle = within(within(columnSettingsPopover).getByLabelText('System')).getByRole('checkbox')
    const lastUpdateToggle = within(within(columnSettingsPopover).getByLabelText('Last data update')).getByRole('checkbox')
    expect(patientToggle).toHaveProperty('checked', true)
    expect(patientToggle).toHaveProperty('disabled', true)
    expect(ageToggle).toHaveProperty('checked', false)
    expect(dateOfBirthToggle).toHaveProperty('checked', true)
    expect(genderToggle).toHaveProperty('checked', false)
    expect(systemToggle).toHaveProperty('checked', false)
    expect(lastUpdateToggle).toHaveProperty('checked', true)

    const disabledToggle = screen.getByLabelText('This column cannot be removed')
    await userEvent.hover(disabledToggle)
    expect(await screen.findByText('This column cannot be removed')).toBeVisible()

    await userEvent.click(ageToggle)
    await userEvent.click(lastUpdateToggle)
    expect(ageToggle).toHaveProperty('checked', true)
    expect(lastUpdateToggle).toHaveProperty('checked', false)

    await userEvent.click(applyButton)

    expect(columnSettingsPopover).not.toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Patient' })).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Age' })).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Date of birth' })).toBeVisible()
    expect(screen.queryByRole('columnheader', { name: 'Gender' })).not.toBeInTheDocument()
    expect(screen.queryByRole('columnheader', { name: 'System' })).not.toBeInTheDocument()
    expect(screen.queryByRole('columnheader', { name: 'Last data update' })).not.toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeVisible()
  })
})
