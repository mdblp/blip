/*
 * Copyright (c) 2026, Diabeloop
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

import { act } from 'react'
import { ConfigService } from '../../../../lib/config/config.service'
import PatientApi from '../../../../lib/patient/patient.api'
import { AppUserRoute } from '../../../../models/enums/routes.enum'
import { flaggedPatientId } from '../../data/patient.api.data'
import { mockAnalyticsApi } from '../../mock/analytics.api.mock'
import { mockAuth0Hook } from '../../mock/auth0.hook.mock'
import { mockChatAPI } from '../../mock/chat.api.mock'
import { mockDataAPI } from '../../mock/data.api.mock'
import { mockDblCommunicationApi } from '../../mock/dbl-communication.api'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'
import { mockErrorApi } from '../../mock/error.api.mock'
import { mockMedicalFilesApiEmptyResult } from '../../mock/medical-files.api.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import { mockPatientApiForHcp } from '../../mock/patient.api.mock'
import { mockTeamAPI, myThirdTeamId } from '../../mock/team.api.mock'
import { mockUserApi } from '../../mock/user.api.mock'
import { testPatientListForHcp } from '../../use-cases/patient-list-management'
import { renderPage } from '../../utils/render'

describe('HCP home page, patient list', () => {
  const firstName = 'Eric'
  const lastName = 'Ard'

  const thirdTeamPatientsList = `${AppUserRoute.Teams}/${myThirdTeamId}/patients`

  beforeEach(() => {
    mockAuth0Hook()
    mockNotificationAPI()
    mockTeamAPI()
    mockUserApi().mockUserDataFetch({ firstName, lastName, preferences: { patientsStarred: [flaggedPatientId] } })
    mockPatientApiForHcp()
    mockDirectShareApi()
    mockDataAPI()
    mockChatAPI()
    mockDblCommunicationApi()
    mockMedicalFilesApiEmptyResult()
    mockErrorApi()
    mockAnalyticsApi()
    jest.spyOn(PatientApi, 'removePatient').mockResolvedValue(undefined)
    jest.spyOn(PatientApi, 'invitePatient').mockResolvedValue(undefined)
  })

  it('should be able to manage the patient list when scoped on a medical team', async () => {
    jest.spyOn(ConfigService, 'getDateOfBirthHidden').mockReturnValue(false)
    await act(async () => {
      return renderPage(thirdTeamPatientsList)
    })

    await testPatientListForHcp()
  }, 500000)
})
