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

import { act } from '@testing-library/react'
import { mockAuth0Hook } from '../../mock/auth0.hook.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'
import { flaggedPatientId, patient1Info, patient1Metrics } from '../../data/patient.api.data'
import {
  buildAvailableTeams,
  mockTeamAPI,
} from '../../mock/team.api.mock'
import { renderPage } from '../../utils/render'
import { mockUserApi } from '../../mock/user.api.mock'
import { mockPatientApiForHcp } from '../../mock/patient.api.mock'
import PatientApi from '../../../../lib/patient/patient.api'
import { mockDataAPI } from '../../mock/data.api.mock'
import { UserInviteStatus } from '../../../../lib/team/models/enums/user-invite-status.enum'
import { type AppMainLayoutHcpParams, testAppMainLayoutForHcpMobile } from '../../use-cases/app-main-layout-visualisation'
import NotificationApi from '../../../../lib/notifications/notification.api'
import { type Router } from '../../models/router.model'
import { AppUserRoute } from '../../../../models/enums/routes.enum'
import { PRIVATE_TEAM_ID } from '../../../../lib/team/team.util'
import { mockDblCommunicationApi } from '../../mock/dbl-communication.api'
import { mockChatAPI } from '../../mock/chat.api.mock'
import { mockMedicalFilesApiEmptyResult } from '../../mock/medical-files.api.mock'
import { mockErrorApi } from '../../mock/error.api.mock'
import { mockAnalyticsApi } from '../../mock/analytics.api.mock'
import mediaQuery from 'css-mediaquery';

function mockScreenWidth(width: number): void {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: mediaQuery.match(query, { width }),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  });
}

describe('HCP home page', () => {
  const firstName = 'Eric'
  const lastName = 'Ard'

  const privatePatientsList = `${AppUserRoute.Teams}/${PRIVATE_TEAM_ID}/patients`

  beforeEach(() => {
    mockAuth0Hook()
    mockNotificationAPI()
    mockTeamAPI()
    mockUserApi().mockUserDataFetch({ firstName, lastName, preferences: { patientsStarred: [flaggedPatientId] } })
    mockPatientApiForHcp()
    mockDirectShareApi()
    mockDataAPI()
    mockChatAPI()
    mockDblCommunicationApi()
    mockMedicalFilesApiEmptyResult()
    mockErrorApi()
    mockAnalyticsApi()
    jest.spyOn(PatientApi, 'removePatient').mockResolvedValue(undefined)
    jest.spyOn(PatientApi, 'invitePatient').mockResolvedValue(undefined)
    jest.spyOn(NotificationApi, 'cancelInvitation').mockResolvedValue(undefined)
    // For testing with a mobile sized device
    mockScreenWidth(400);
  })

  const renderHomePage = async (route: string): Promise<Router> => {
    return await act(async () => {
      return renderPage(route)
    })
  }

  it('In mobile version, should render correct layout when scoped on the private practice team', async () => {

    jest.spyOn(PatientApi, 'getPatientsForHcp').mockResolvedValue([{
      ...patient1Info,
      invitationStatus: UserInviteStatus.Accepted
    }])
    jest.spyOn(PatientApi, 'getPatientsMetricsForHcp').mockResolvedValue([patient1Metrics])

    const appMainLayoutParams: AppMainLayoutHcpParams = {
      footerHasLanguageSelector: false,
      headerInfo: {
        loggedInUserFullName: `${lastName} ${firstName}`,
        teamMenuInfo: {
          isSelectedTeamPrivate: true,
          availableTeams: buildAvailableTeams()
        }
      }
    }

    await renderHomePage(privatePatientsList)

    await testAppMainLayoutForHcpMobile(appMainLayoutParams)
  })

})
