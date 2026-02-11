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

import { act } from '@testing-library/react'
import { mockAuth0Hook } from '../../../mock/auth0.hook.mock'
import { buildAvailableTeams, mockTeamAPI, myThirdTeamId, myThirdTeamName } from '../../../mock/team.api.mock'
import {
  mockDataAPI,
  pumpSettingsData,
  pumpSettingsDblg1Mobigo,
  pumpSettingsDblg2,
  pumpSettingsDblg2WithoutSecurityBasalData
} from '../../../mock/data.api.mock'
import { mockNotificationAPI } from '../../../mock/notification.api.mock'
import { patient1Id } from '../../../data/patient.api.data'
import { mockDirectShareApi } from '../../../mock/direct-share.api.mock'
import { renderPage } from '../../../utils/render'
import { mockUserApi } from '../../../mock/user.api.mock'
import { mockPatientApiForHcp } from '../../../mock/patient.api.mock'
import { mockWindowResizer } from '../../../mock/window-resizer.mock'
import { type AppMainLayoutHcpParams, testAppMainLayoutForHcp } from '../../../use-cases/app-main-layout-visualisation'
import {
  testDevicesMenuLayoutForMobigoDevice,
  testDevicesVisualisationForHcp,
  testEmptySafetyBasalProfileGenericErrorMessage,
  testG2DevicesVisualisationForHcp
} from '../../../use-cases/device-settings-visualisation'
import { testDeviceSettingsNavigationForHcp } from '../../../use-cases/device-settings-navigation'
import { AppUserRoute } from '../../../../../models/enums/routes.enum'
import { mockDblCommunicationApi } from '../../../mock/dbl-communication.api'

describe('Device view for HCP', () => {
  const firstName = 'HCP firstName'
  const lastName = 'HCP lastName'

  const deviceRoute = `/teams/${myThirdTeamId}/patients/${patient1Id}${AppUserRoute.Devices}`

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
  })

  it('should render correct layout', async () => {
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
    await act(async () => {
      renderPage(deviceRoute)
    })
    await testAppMainLayoutForHcp(appMainLayoutParams)
  })

  it('should display correct parameters when having g1 patients', async () => {
    await act(async () => {
      renderPage(deviceRoute)
    })
    await testDevicesVisualisationForHcp()
  })

  it('should display correct parameters when having g2 patients', async () => {
    mockDataAPI(pumpSettingsDblg2)

    await act(async () => {
      renderPage(deviceRoute)
    })
    await testG2DevicesVisualisationForHcp()
  })

  it('should navigate to daily page when clicking on the daily button', async () => {
    let router
    await act(async () => {
      router = renderPage(deviceRoute)
    })
    await testDeviceSettingsNavigationForHcp(router)
  })

  it('should display a generic error message if the basal safety profile is not available', async () => {
    mockDataAPI(pumpSettingsDblg2WithoutSecurityBasalData)

    await act(async () => {
      renderPage(deviceRoute)
    })
    await testEmptySafetyBasalProfileGenericErrorMessage()
  })

  it('should hide the basal safety profile menu for a DBLG1/Mobigo+ patient', async () => {
    mockDataAPI(pumpSettingsDblg1Mobigo)

    await act(async () => {
      renderPage(deviceRoute)
    })
    testDevicesMenuLayoutForMobigoDevice()
  })
})
