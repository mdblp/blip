/*
 * Copyright (c) 2022-2026, Diabeloop
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

import { act, screen } from '@testing-library/react'
import moment from 'moment-timezone'
import { UserRole } from '../../../../lib/auth/models/enums/user-role.enum'
import PatientApi from '../../../../lib/patient/patient.api'
import DirectShareApi from '../../../../lib/share/direct-share.api'
import { checkCaregiverLayout } from '../../assert/layout.assert'
import { checkPatientListHeaderCaregiver } from '../../assert/patient-list.assert'
import { buildPatient } from '../../data/patient-builder.data'
import { mockAnalyticsApi } from '../../mock/analytics.api.mock'
import { mockAuth0Hook } from '../../mock/auth0.hook.mock'
import { mockDblCommunicationApi } from '../../mock/dbl-communication.api'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'
import { mockErrorApi } from '../../mock/error.api.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import { mockPatientApiForCaregivers } from '../../mock/patient.api.mock'
import { mockTeamAPI } from '../../mock/team.api.mock'
import { mockUserApi } from '../../mock/user.api.mock'
import {
  testPatientListColumnsCaregiver,
  testPatientListSearchCaregiver,
  testRemovePatientCaregiver,
  testRemovePatientErrorCaregiver
} from '../../use-cases/patient-list-management'
import { renderPage } from '../../utils/render'

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
    mockErrorApi()
    mockAnalyticsApi()
  })

  it('should render the patient list page with correct components', async () => {
    jest.spyOn(PatientApi, 'getPatientsMetricsForHcp')

    await act(async () => {
      renderPage('/')
    })

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

    await act(async () => {
      renderPage('/')
    })

    const lastDataUploadDate = moment.tz(patient1.medicalData.range.endDate, new Intl.DateTimeFormat().resolvedOptions().timeZone).format('lll')

    await testPatientListSearchCaregiver(lastDataUploadDate)
  })

  it('should display a list of patients and allow to remove one of them', async () => {
    await act(async () => {
      renderPage('/')
    })

    await testRemovePatientCaregiver(lastName, firstName)
  })

  it('should display an error message if patient removal failed', async () => {
    jest.spyOn(DirectShareApi, 'removeDirectShare').mockRejectedValueOnce('This error was thrown by a mock on purpose')

    await act(async () => {
      renderPage('/')
    })

    await testRemovePatientErrorCaregiver()
  })

  it('should display the right columns for caregivers and be able to change them', async () => {
    await act(async () => {
      renderPage('/')
    })

    await testPatientListColumnsCaregiver()
  })
})
