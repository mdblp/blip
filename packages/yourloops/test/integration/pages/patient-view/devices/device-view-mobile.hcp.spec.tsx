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

import { act, screen } from '@testing-library/react'
import { mockAuth0Hook } from '../../../mock/auth0.hook.mock'
import { mockTeamAPI, myThirdTeamId } from '../../../mock/team.api.mock'
import { mockDataAPI, pumpSettingsData } from '../../../mock/data.api.mock'
import { mockNotificationAPI } from '../../../mock/notification.api.mock'
import { patient1Id } from '../../../data/patient.api.data'
import { mockDirectShareApi } from '../../../mock/direct-share.api.mock'
import { renderPage } from '../../../utils/render'
import { mockUserApi } from '../../../mock/user.api.mock'
import { mockPatientApiForHcp } from '../../../mock/patient.api.mock'
import { mockWindowResizer } from '../../../mock/window-resizer.mock'
import { AppUserRoute } from '../../../../../models/enums/routes.enum'
import { mockDblCommunicationApi } from '../../../mock/dbl-communication.api'
import { mockAnalyticsApi } from '../../../mock/analytics.api.mock'
import { checkHCPAndCaregiverHeaderPatientViewMobile } from '../../../assert/header-mobile.assert'
import { mockMobileScreen } from '../../../mock/mobile-screen.mock'
import {
  testClickViewMoreBasalSafety,
  testClickViewMoreCurrentSettings,
  testClickViewMoreDevicesHistory,
  testClickViewMoreSettingsHistory, testDeviceSectionsOverviewVisibleMobile
} from '../../../use-cases/device-settings-sections-overview-visualisation'

describe('Device view for HCP', () => {
  const firstName = 'HCP firstName'
  const lastName = 'HCP lastName'

  const deviceSectionsOverviewRoute = `/teams/${myThirdTeamId}/patients/${patient1Id}${AppUserRoute.DevicesSectionsOverview}`

  beforeEach(() => {
    mockWindowResizer()
    mockAuth0Hook()
    mockDblCommunicationApi()
    mockNotificationAPI()
    mockDirectShareApi()
    mockTeamAPI()
    mockUserApi().mockUserDataFetch({ firstName, lastName })
    mockPatientApiForHcp()
    mockDataAPI(pumpSettingsData)
    mockAnalyticsApi()
    mockMobileScreen()
  })

  const renderDeviceSectionsOverviewPage = async (route: string) => {
    await act(async () => {
      renderPage(route)
    })
  }

  it('should render correct layout', async () => {

    await renderDeviceSectionsOverviewPage(deviceSectionsOverviewRoute)

    await checkHCPAndCaregiverHeaderPatientViewMobile(`${lastName} ${firstName}`)
  })

  it('should display the section overview page in mobile version', async () => {
    await renderDeviceSectionsOverviewPage(deviceSectionsOverviewRoute)
    await screen.findByTestId('device-view-overview-card-current-settings')
    await testDeviceSectionsOverviewVisibleMobile()
  })

  it('should be able to access the pages linked by the cards', async () => {
    await renderDeviceSectionsOverviewPage(deviceSectionsOverviewRoute)

    await screen.findByTestId('device-view-overview-card-current-settings')

    await testClickViewMoreCurrentSettings()
    await testClickViewMoreBasalSafety()
    await testClickViewMoreSettingsHistory()
    await testClickViewMoreDevicesHistory()

  })

})
