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
import { mockAuth0Hook } from '../../../mock/auth0.hook.mock'
import { mockTeamAPI, myThirdTeamId, myThirdTeamName } from '../../../mock/team.api.mock'
import {
  mockDataAPI,
  oneDayDashboardData,
} from '../../../mock/data.api.mock'
import { mockNotificationAPI } from '../../../mock/notification.api.mock'
import { patient1Id } from '../../../data/patient.api.data'
import { mockChatAPI } from '../../../mock/chat.api.mock'
import { mockMedicalFilesAPI } from '../../../mock/medical-files.api.mock'
import { mockDirectShareApi } from '../../../mock/direct-share.api.mock'
import { renderPage } from '../../../utils/render'
import { mockUserApi } from '../../../mock/user.api.mock'
import { Unit } from 'medical-domain'
import { mockPatientApiForHcp } from '../../../mock/patient.api.mock'
import { type Settings } from '../../../../../lib/auth/models/settings.model'
import { AppUserRoute } from '../../../../../models/enums/routes.enum'
import { mockDblCommunicationApi } from '../../../mock/dbl-communication.api'
import { mockAnalyticsApi } from '../../../mock/analytics.api.mock'
import { mockErrorApi } from '../../../mock/error.api.mock'
import { mockMobileScreen } from '../../../mock/mobile-screen.mock'
import { checkHCPAndCaregiverHeaderPatientViewMobile } from '../../../assert/header-mobile.assert'

describe('Dashboard view for HCP', () => {
  const patientDashboardRoute = `/teams/${myThirdTeamId}/patients/${patient1Id}${AppUserRoute.Dashboard}`
  const firstName = 'HCP firstName'
  const lastName = 'HCP lastName'
  const mgdlSettings: Settings = { units: { bg: Unit.MilligramPerDeciliter } }

  beforeEach(() => {
    mockAuth0Hook()
    mockDblCommunicationApi()
    mockNotificationAPI()
    mockDirectShareApi()
    mockTeamAPI()
    mockUserApi().mockUserDataFetch({ firstName, lastName, settings: mgdlSettings })
    mockPatientApiForHcp()
    mockChatAPI()
    mockMedicalFilesAPI(myThirdTeamId, myThirdTeamName)
    mockDataAPI()
    mockAnalyticsApi()
    mockErrorApi()
    mockMobileScreen()
  })

  it('should render correct components when navigating to a patient not scoped on the private team', async () => {
    mockDataAPI(oneDayDashboardData)

    await act(async () => {
      renderPage(patientDashboardRoute)
    })

    checkHCPAndCaregiverHeaderPatientViewMobile(`${lastName} ${firstName}`)
  })
})
