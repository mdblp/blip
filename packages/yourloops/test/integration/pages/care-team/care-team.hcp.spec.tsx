/*
 * Copyright (c) 2023, Diabeloop
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

import { mockAuth0Hook } from '../../mock/auth0.hook.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import { buildAvailableTeams, mockTeamAPI, myThirdTeamId, myThirdTeamName } from '../../mock/team.api.mock'
import { mockUserApi } from '../../mock/user.api.mock'
import { mockPatientApiForHcp } from '../../mock/patient.api.mock'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'
import { mockDataAPI } from '../../mock/data.api.mock'
import { renderPage } from '../../utils/render'
import { waitFor } from '@testing-library/react'
import { type AppMainLayoutHcpParams, testAppMainLayoutForHcp } from '../../use-cases/app-main-layout-visualisation'
import { AppUserRoute } from '../../../../models/enums/routes.enum'
import { testCareTeamLayout } from '../../use-cases/care-team-visualisation'

describe('HCP care team page', () => {
  const firstName = 'Jacques'
  const lastName = 'Xellerre'

  beforeEach(() => {
    mockAuth0Hook()
    mockNotificationAPI()
    mockTeamAPI()
    mockUserApi().mockUserDataFetch({ firstName, lastName })
    mockPatientApiForHcp()
    mockDirectShareApi()
    mockDataAPI()
  })

  const renderCareTeamPage = async () => {
    const router = renderPage(AppUserRoute.Team)
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(AppUserRoute.Team)
    })
    return router
  }

  it('should render the correct layout', async () => {
    localStorage.setItem('selectedTeamId', myThirdTeamId)

    const appMainLayoutParams: AppMainLayoutHcpParams = {
      footerHasLanguageSelector: false,
      headerInfo: {
        loggedInUserFullName: `${firstName} ${lastName}`,
        teamMenuInfo: {
          selectedTeamName: myThirdTeamName,
          isSelectedTeamPrivate: false,
          availableTeams: buildAvailableTeams()
        }
      }
    }

    await renderCareTeamPage()

    await testAppMainLayoutForHcp(appMainLayoutParams)
  })

  it('should display the selected team information', async () => {
    localStorage.setItem('selectedTeamId', myThirdTeamId)

    await renderCareTeamPage()

    testCareTeamLayout()
  })
})
