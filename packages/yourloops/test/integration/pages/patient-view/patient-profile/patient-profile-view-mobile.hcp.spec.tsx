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
import { mockNotificationAPI } from '../../../mock/notification.api.mock'
import { mockDirectShareApi } from '../../../mock/direct-share.api.mock'
import {
  mockTeamAPI,
  myThirdTeamId,
} from '../../../mock/team.api.mock'
import { mockUserApi } from '../../../mock/user.api.mock'
import { mockPatientApiForHcp } from '../../../mock/patient.api.mock'
import { mockDataAPI } from '../../../mock/data.api.mock'
import { renderPage } from '../../../utils/render'
import { patient1Id } from '../../../data/patient.api.data'
import { AppUserRoute } from '../../../../../models/enums/routes.enum'
import { act } from '@testing-library/react'
import { mockDblCommunicationApi } from '../../../mock/dbl-communication.api'
import { mockLeadCliniciansApi } from '../../../mock/clinicians.api.mock'
import { mockErrorApi } from '../../../mock/error.api.mock'
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

describe('Patient profile view for HCP', () => {
  beforeEach(() => {
    mockAuth0Hook()
    mockNotificationAPI()
    mockDirectShareApi()
    mockTeamAPI()
    mockUserApi().mockUserDataFetch({ firstName, lastName })
    mockPatientApiForHcp()
    mockDataAPI()
    mockDblCommunicationApi()
    mockLeadCliniciansApi()
    mockErrorApi()
    mockAnalyticsApi()
    mockScreenWidth(400)
  })

  const firstName = 'HCP firstName'
  const lastName = 'HCP lastName'

  const patientProfileRoute = `/teams/${myThirdTeamId}/patients/${patient1Id}${AppUserRoute.PatientProfile}`

  describe('Alerts section', () => {
    it('should render correct layout', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      checkHCPAndCaregiverHeaderPatientViewMobile(`${lastName} ${firstName}`)
    })

  })
})
