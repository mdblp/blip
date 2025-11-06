/*
 * Copyright (c) 2023-2025, Diabeloop
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
import { mockTeamAPI, myFirstTeamId, mySecondTeamId, mySecondTeamName } from '../../mock/team.api.mock'
import { mockUserApi } from '../../mock/user.api.mock'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'
import { renderPage } from '../../utils/render'
import { waitFor } from '@testing-library/react'
import { AppUserRoute } from '../../../../models/enums/routes.enum'
import { testLeaveTeamPatient } from '../../use-cases/care-team-visualisation'
import { UserRole } from '../../../../lib/auth/models/enums/user-role.enum'
import { patient1Id } from '../../data/patient.api.data'
import { mockDataAPI } from '../../mock/data.api.mock'
import { mockMedicalFilesAPI } from '../../mock/medical-files.api.mock'
import { mockChatAPI } from '../../mock/chat.api.mock'
import { mockDblCommunicationApi } from '../../mock/dbl-communication.api'

describe('Patient care team settings page', () => {
  const firstName = 'Jacques'
  const lastName = 'Xellerre'

  const firstTeamDetailsRoute = `${AppUserRoute.Teams}/${myFirstTeamId}`

  beforeEach(() => {
    mockAuth0Hook(UserRole.Patient, patient1Id)
    mockNotificationAPI()
    mockDirectShareApi()
    mockTeamAPI()
    mockUserApi().mockUserDataFetch({ firstName, lastName })
    mockDataAPI()
    mockMedicalFilesAPI(mySecondTeamId, mySecondTeamName)
    mockChatAPI()
    mockDblCommunicationApi()
  })

  const renderCareTeamSettingsPage = async (route: string) => {
    const router = renderPage(route)
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(route)
    })
    return router
  }

  it('should be able to leave a team', async () => {
    await renderCareTeamSettingsPage(firstTeamDetailsRoute)

    await testLeaveTeamPatient()
  })
})
