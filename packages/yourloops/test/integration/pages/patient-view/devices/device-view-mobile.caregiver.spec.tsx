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
import { AppUserRoute } from '../../../../../models/enums/routes.enum'
import { PRIVATE_TEAM_ID } from '../../../../../lib/team/team.util'
import { mockDblCommunicationApi } from '../../../mock/dbl-communication.api'
import { mockAnalyticsApi } from '../../../mock/analytics.api.mock'
import { checkHCPAndCaregiverHeaderPatientViewMobile } from '../../../assert/header-mobile.assert'
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

describe('Devices view for Caregiver', () => {
  const firstName = 'Caregiver firstName'
  const lastName = 'Caregiver lastName'

  const devicesRoute = `/teams/${PRIVATE_TEAM_ID}/patients/${patient1Id}${AppUserRoute.Devices}`

  beforeEach(() => {
    mockWindowResizer()
    mockAuth0Hook(UserRole.Caregiver)
    mockDblCommunicationApi()
    mockNotificationAPI()
    mockDirectShareApi()
    mockUserApi().mockUserDataFetch({ firstName, lastName })
    mockPatientApiForCaregivers()
    mockDataAPI(pumpSettingsData)
    mockAnalyticsApi()
    mockScreenWidth(400)
  })

  it('should render correct layout', async () => {
    renderPage(devicesRoute)
    checkHCPAndCaregiverHeaderPatientViewMobile(`${lastName} ${firstName}`)
  })

})
