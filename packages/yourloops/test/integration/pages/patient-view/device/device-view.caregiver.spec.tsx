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

import { mockAuth0Hook } from '../../../mock/auth0.hook.mock'
import { mockDataAPI, pumpSettingsData } from '../../../mock/data.api.mock'
import { mockNotificationAPI } from '../../../mock/notification.api.mock'
import { patient1Id } from '../../../data/patient.api.data'
import { mockDirectShareApi } from '../../../mock/direct-share.api.mock'
import { renderPage } from '../../../utils/render'
import { mockUserApi } from '../../../mock/user.api.mock'
import { mockPatientApiForCaregivers } from '../../../mock/patient.api.mock'
import { mockWindowResizer } from '../../../mock/window-resizer.mock'
import { UserRole } from '../../../../../lib/auth/models/enums/user-role.enum'
import { testDeviceSettingsVisualisation } from '../../../use-cases/device-settings-visualisation'
import { testDeviceSettingsNavigationForCaregiver } from '../../../use-cases/device-settings-navigation'
import { testAppMainLayoutForCaregiver } from '../../../use-cases/app-main-layout-visualisation'
import { AppUserRoute } from '../../../../../models/enums/routes.enum'
import { act } from '@testing-library/react'
import { PRIVATE_TEAM_ID } from '../../../../../lib/team/team.util'

describe('Device view for Caregiver', () => {
  const firstName = 'Caregiver firstName'
  const lastName = 'Caregiver lastName'

  const deviceRoute = `/teams/${PRIVATE_TEAM_ID}/patients/${patient1Id}${AppUserRoute.Device}`

  beforeEach(() => {
    mockWindowResizer()
    mockAuth0Hook(UserRole.Caregiver)
    mockNotificationAPI()
    mockDirectShareApi()
    mockUserApi().mockUserDataFetch({ firstName, lastName })
    mockPatientApiForCaregivers()
    mockDataAPI(pumpSettingsData)
  })

  it('should render correct layout', async () => {
    renderPage(deviceRoute)
    await testAppMainLayoutForCaregiver({ loggedInUserFullName: `${lastName} ${firstName}` })
  })

  it('should display correct parameters', async () => {
    await act(async () => {
      renderPage(deviceRoute)
    })
    await testDeviceSettingsVisualisation()
  })

  it('should navigate to daily page when clicking on the daily button', async () => {
    let router
    await act(async () => {
      router = renderPage(deviceRoute)
    })
    await testDeviceSettingsNavigationForCaregiver(router)
  })
})
