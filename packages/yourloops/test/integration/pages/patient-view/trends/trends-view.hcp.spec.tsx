/*
 * Copyright (c) 2022-2024, Diabeloop
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

import { screen, waitFor } from '@testing-library/react'
import { mockAuth0Hook } from '../../../mock/auth0.hook.mock'
import { buildAvailableTeams, mockTeamAPI, myThirdTeamId, myThirdTeamName } from '../../../mock/team.api.mock'
import { mockDataAPI } from '../../../mock/data.api.mock'
import { mockNotificationAPI } from '../../../mock/notification.api.mock'
import { mockPatientApiForHcp } from '../../../mock/patient.api.mock'
import { mockChatAPI } from '../../../mock/chat.api.mock'
import { mockDirectShareApi } from '../../../mock/direct-share.api.mock'
import { checkPatientNavBarAsHcp } from '../../../assert/patient-nav-bar.assert'
import { renderPage } from '../../../utils/render'
import { mockUserApi } from '../../../mock/user.api.mock'
import { patient2Id } from '../../../data/patient.api.data'
import { type AppMainLayoutHcpParams, testAppMainLayoutForHcp } from '../../../use-cases/app-main-layout-visualisation'
import { mockWindowResizer } from '../../../mock/window-resizer.mock'
import { AppUserRoute } from '../../../../../models/enums/routes.enum'
import { getMinimalTrendViewData } from '../../../mock/minimal-trend-view-data'

describe('Trends view for HCP', () => {
  const firstName = 'HCP firstName'
  const lastName = 'HCP lastName'

  beforeEach(() => {
    mockWindowResizer()
    mockAuth0Hook()
    mockNotificationAPI()
    mockDirectShareApi()
    mockTeamAPI()
    mockUserApi().mockUserDataFetch({ firstName, lastName })
    mockPatientApiForHcp()
    mockChatAPI()
  })

  afterEach(() => {
    window.ResizeObserver = ResizeObserver
    jest.restoreAllMocks()
  })

  it('should render correct layout', async () => {
    mockDataAPI(getMinimalTrendViewData())

    const appMainLayoutParams: AppMainLayoutHcpParams = {
      footerHasLanguageSelector: false,
      headerInfo: {
        loggedInUserFullName: `${lastName} ${firstName}`,
        teamMenuInfo: {
          selectedTeamName: myThirdTeamName,
          isSelectedTeamPrivate: false,
          availableTeams: buildAvailableTeams()
        }
      }
    }
    const trendsRoute = `/teams/${myThirdTeamId}/patients/${patient2Id}${AppUserRoute.Trends}`
    const router = renderPage(trendsRoute)
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(trendsRoute)
    })

    expect(await screen.findByTestId('patient-nav-bar', {}, { timeout: 3000 })).toBeVisible()
    checkPatientNavBarAsHcp()
    await testAppMainLayoutForHcp(appMainLayoutParams)
  })
})
