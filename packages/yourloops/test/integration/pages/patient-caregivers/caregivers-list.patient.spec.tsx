/*
 * Copyright (c) 2023-2024, Diabeloop
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

import { mockPatientLogin } from '../../mock/patient-login.mock'
import { patient1AsTeamMember, patient1Info } from '../../data/patient.api.data'
import { mockPatientApiForPatients } from '../../mock/patient.api.mock'
import { renderPage } from '../../utils/render'
import { waitFor } from '@testing-library/react'
import { testCaregiversVisualisation } from '../../use-cases/patient-caregivers-management'
import { mockMedicalFilesAPI } from '../../mock/medical-files.api.mock'
import { mySecondTeamId, mySecondTeamName } from '../../mock/team.api.mock'
import { mockChatAPI } from '../../mock/chat.api.mock'
import { completeDashboardData, mockDataAPI } from '../../mock/data.api.mock'
import { testAppMainLayoutForPatient } from '../../use-cases/app-main-layout-visualisation'

describe('Caregivers list for patient', () => {
  const patientCaregiversRoute = '/caregivers'

  beforeEach(() => {
    mockPatientLogin(patient1AsTeamMember)
    mockPatientApiForPatients()
    mockMedicalFilesAPI(mySecondTeamId, mySecondTeamName)
    mockChatAPI()
    mockDataAPI(completeDashboardData)
  })

  it('should display a list of caregivers and allow to manage them', async () => {
    const router = renderPage(patientCaregiversRoute)

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(patientCaregiversRoute)
    })

    await testAppMainLayoutForPatient({ loggedInUserFullName: `${patient1Info.profile.lastName} ${patient1Info.profile.firstName}` })
    await testCaregiversVisualisation()
  })
})
