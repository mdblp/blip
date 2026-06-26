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
import { renderPage } from '../../../utils/render'
import {
  mockDataAPI,
  oneDayDashboardData,
} from '../../../mock/data.api.mock'
import { mockPatientLogin } from '../../../mock/patient-login.mock'
import { mockMedicalFilesAPI } from '../../../mock/medical-files.api.mock'
import TeamAPI from '../../../../../lib/team/team.api'
import {
  anotherTeam,
  buildTeamOne,
  buildTeamTwo,
  mySecondTeamId,
  mySecondTeamName
} from '../../../mock/team.api.mock'
import { patient1Info } from '../../../data/patient.api.data'
import { mockChatAPI } from '../../../mock/chat.api.mock'
import { type AppMainLayoutParams, testAppMainLayoutForPatientMobile } from '../../../use-cases/app-main-layout-visualisation'
import { testJoinTeam } from '../../../use-cases/teams-management'
import { AppUserRoute } from '../../../../../models/enums/routes.enum'
import { mockErrorApi } from '../../../mock/error.api.mock'
import { mockAnalyticsApi } from '../../../mock/analytics.api.mock'
import { mockExternalConsentsApi } from '../../../mock/external-consents.api.mock'
import mediaQuery from 'css-mediaquery';

function mockScreenWidth(width: number): void {
  globalThis.matchMedia = (query: string): MediaQueryList => ({
    matches: mediaQuery.match(query, { width }),
    media: query,
    onchange: null,
    addListener: () => {
    },
    removeListener: () => {
    },
    addEventListener: () => {
    },
    removeEventListener: () => {
    },
    dispatchEvent: () => true
  });
}

describe('Dashboard view for patient', () => {
  const patientDashboardRoute = AppUserRoute.Dashboard
  const firstName = patient1Info.profile.firstName
  const lastName = patient1Info.profile.lastName

  beforeEach(() => {
    mockPatientLogin(patient1Info)
    mockMedicalFilesAPI(mySecondTeamId, mySecondTeamName)
    mockChatAPI()
    mockErrorApi()
    mockAnalyticsApi()
    mockExternalConsentsApi()
    jest.spyOn(TeamAPI, 'getTeams').mockResolvedValue([buildTeamOne(), buildTeamTwo()])
    jest.spyOn(TeamAPI, 'joinTeam').mockResolvedValue()
    jest.spyOn(TeamAPI, 'getTeamFromCode').mockResolvedValue(anotherTeam)
    mockScreenWidth(400)
  })

  it('should display correct components when patient is in some medical teams', async () => {
    mockDataAPI(oneDayDashboardData)
    const appMainLayoutParams: AppMainLayoutParams = {
      footerHasLanguageSelector: false,
      loggedInUserFullName: `${lastName} ${firstName}`
    }

    await act(async () => {
      renderPage(patientDashboardRoute)
    })

    await testAppMainLayoutForPatientMobile(appMainLayoutParams)
  })

  it('should be able to join a team', async () => {
    await act(async () => {
      renderPage(patientDashboardRoute)
    })

    await testJoinTeam()
  })

})
