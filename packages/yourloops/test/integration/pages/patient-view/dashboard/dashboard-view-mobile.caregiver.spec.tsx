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
import { mockNotificationAPI } from '../../../mock/notification.api.mock'
import { patient1Id } from '../../../data/patient.api.data'
import { mockDirectShareApi } from '../../../mock/direct-share.api.mock'
import { renderPage } from '../../../utils/render'
import { mockUserApi } from '../../../mock/user.api.mock'
import { mockPatientApiForCaregivers } from '../../../mock/patient.api.mock'
import { UserRole } from '../../../../../lib/auth/models/enums/user-role.enum'
import {
  mockDataAPI,
  oneDayDashboardData,
} from '../../../mock/data.api.mock'
import {
  type AppMainLayoutParams,
  testAppMainLayoutForCaregiverMobile
} from '../../../use-cases/app-main-layout-visualisation'
import { AppUserRoute } from '../../../../../models/enums/routes.enum'
import { PRIVATE_TEAM_ID } from '../../../../../lib/team/team.util'
import { mockDblCommunicationApi } from '../../../mock/dbl-communication.api'
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

describe('Dashboard view for caregiver', () => {
  const patientDashboardRoute = `/teams/${PRIVATE_TEAM_ID}/patients/${patient1Id}${AppUserRoute.Dashboard}`
  const firstName = 'Caregiver firstName'
  const lastName = 'Caregiver lastName'

  beforeEach(() => {
    mockAuth0Hook(UserRole.Caregiver)
    mockDblCommunicationApi()
    mockNotificationAPI()
    mockDirectShareApi()
    mockUserApi().mockUserDataFetch({ firstName, lastName })
    mockPatientApiForCaregivers()
    // For testing with a mobile sized device
    mockScreenWidth(400);
  })

  it('In mobile version, should render correct components', async () => {
    mockDataAPI(oneDayDashboardData)
    const appMainLayoutParams: AppMainLayoutParams = {
      footerHasLanguageSelector: false,
      loggedInUserFullName: `${lastName} ${firstName}`
    }

    await act(async () => {
      renderPage(patientDashboardRoute)
    })

    await testAppMainLayoutForCaregiverMobile(appMainLayoutParams)
  })

})
