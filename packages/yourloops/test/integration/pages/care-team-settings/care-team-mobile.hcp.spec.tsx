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

import { mockAuth0Hook } from '../../mock/auth0.hook.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import {
  buildAvailableTeams,
  mockTeamAPI,
  myThirdTeamId,
  myThirdTeamName
} from '../../mock/team.api.mock'
import {
  testCareTeamSectionsOverviewVisibleMobile,
  testClickViewMoreInfos,
  testClickViewMoreMembers,
  testClickViewMoreAlerts
} from '../../use-cases/care-team-sections-overview-visualisation'
import { mockUserApi } from '../../mock/user.api.mock'
import { mockPatientApiForHcp } from '../../mock/patient.api.mock'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'
import { mockDataAPI } from '../../mock/data.api.mock'
import { renderPage } from '../../utils/render'
import { act } from '@testing-library/react'
import {
  type AppMainLayoutHcpMobileParams,
  testAppMainLayoutForHcpMobile
} from '../../use-cases/app-main-layout-visualisation'
import { AppUserRoute } from '../../../../models/enums/routes.enum'
import { mockDblCommunicationApi } from '../../mock/dbl-communication.api'
import { mockErrorApi } from '../../mock/error.api.mock'
import { mockAnalyticsApi } from '../../mock/analytics.api.mock'
import { mockMobileScreen } from '../../mock/mobile-screen.mock'

describe('HCP care team settings page', () => {
  const firstName = 'Jacques'
  const lastName = 'Xellerre'

  const thirdTeamDetailsRoute = `${AppUserRoute.Teams}/${myThirdTeamId}/sections-overview`

  beforeEach(() => {
    mockAuth0Hook()
    mockNotificationAPI()
    mockTeamAPI()
    mockUserApi().mockUserDataFetch({ firstName, lastName })
    mockPatientApiForHcp()
    mockDirectShareApi()
    mockDataAPI()
    mockDblCommunicationApi()
    mockErrorApi()
    mockAnalyticsApi()
    mockMobileScreen()
  })

  const renderCareTeamSettingsPage = async (route: string) => {
    await act(async () => {
      renderPage(route)
    })
  }

  it('should render the correct layout', async () => {
    const appMainLayoutParams: AppMainLayoutHcpMobileParams = {
      footerHasLanguageSelector: false,
      headerInfoMobile: {
        loggedInUserFullName: `${lastName} ${firstName}`,
        homePageBoolean : false,
        teamMenuInfo: {
          selectedTeamName: myThirdTeamName,
          isSelectedTeamPrivate: false,
          availableTeams: buildAvailableTeams()
        }
      }
    }

    await renderCareTeamSettingsPage(thirdTeamDetailsRoute)

    await testAppMainLayoutForHcpMobile(appMainLayoutParams)
  })

  it('should display the section overview page in mobile version', async () => {
    await renderCareTeamSettingsPage(thirdTeamDetailsRoute)

    await testCareTeamSectionsOverviewVisibleMobile()
  })

  it('should be able to access the pages linked by the cards', async () => {
    await renderCareTeamSettingsPage(thirdTeamDetailsRoute)

    await testClickViewMoreInfos()
    await testClickViewMoreMembers()
    await testClickViewMoreAlerts()
  })

})
