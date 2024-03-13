/*
 * Copyright (c) 2023-2024, Diabeloop
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

import { mockAuth0Hook, userTimFirstName, userTimId, userTimLastName } from '../../mock/auth0.hook.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import {
  buildAvailableTeams,
  filtersTeamId,
  mockTeamAPI,
  myFirstTeamId,
  mySecondTeamId,
  myThirdTeamId,
  myThirdTeamName
} from '../../mock/team.api.mock'
import { mockUserApi } from '../../mock/user.api.mock'
import { mockPatientApiForHcp } from '../../mock/patient.api.mock'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'
import { mockDataAPI } from '../../mock/data.api.mock'
import { renderPage } from '../../utils/render'
import { waitFor } from '@testing-library/react'
import { type AppMainLayoutHcpParams, testAppMainLayoutForHcp } from '../../use-cases/app-main-layout-visualisation'
import { AppUserRoute } from '../../../../models/enums/routes.enum'
import {
  testCareTeamLayout,
  testDeleteTeam,
  testGiveTeamMemberAdminRole,
  testLeaveTeamHcp,
  testNotTeamAdmin,
  testRemoveTeamMember,
  testRemoveTeamMemberAdminRole
} from '../../use-cases/care-team-visualisation'
import {
  testMonitoringAlertsParametersTeamAdmin,
  testMonitoringAlertsParametersTeamMember
} from '../../use-cases/monitoring-alerts-parameters-management'
import { UserRole } from '../../../../lib/auth/models/enums/user-role.enum'
import { PRIVATE_TEAM_ID } from '../../../../lib/team/team.util'

describe('HCP care team settings page', () => {
  const firstName = 'Jacques'
  const lastName = 'Xellerre'

  const firstTeamDetailsRoute = `${AppUserRoute.Teams}/${myFirstTeamId}`
  const secondTeamDetailsRoute = `${AppUserRoute.Teams}/${mySecondTeamId}`
  const thirdTeamDetailsRoute = `${AppUserRoute.Teams}/${myThirdTeamId}`
  const filtersTeamDetailsRoute = `${AppUserRoute.Teams}/${filtersTeamId}`

  beforeEach(() => {
    mockAuth0Hook()
    mockNotificationAPI()
    mockTeamAPI()
    mockUserApi().mockUserDataFetch({ firstName, lastName })
    mockPatientApiForHcp()
    mockDirectShareApi()
    mockDataAPI()
  })

  const renderCareTeamSettingsPage = async (route: string) => {
    const router = renderPage(route)
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(route)
    })
    return router
  }

  it('should render the correct layout', async () => {
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

    await renderCareTeamSettingsPage(thirdTeamDetailsRoute)

    await testAppMainLayoutForHcp(appMainLayoutParams)
  })

  it('should display the selected team information', async () => {
    await renderCareTeamSettingsPage(thirdTeamDetailsRoute)

    await testCareTeamLayout()
  })

  it('should be able to remove one team member from the team', async () => {
    await renderCareTeamSettingsPage(thirdTeamDetailsRoute)

    await testRemoveTeamMember()
  })

  it('should be able to give admin role to team member', async () => {
    await renderCareTeamSettingsPage(thirdTeamDetailsRoute)

    await testGiveTeamMemberAdminRole()
  })

  it('should be able to remove admin role from team member', async () => {
    await renderCareTeamSettingsPage(firstTeamDetailsRoute)

    await testRemoveTeamMemberAdminRole()
  })

  it('should delete team when last member is leaving the team', async () => {
    await renderCareTeamSettingsPage(secondTeamDetailsRoute)

    await testDeleteTeam()
  })

  it('should be able to leave a team', async () => {
    await renderCareTeamSettingsPage(firstTeamDetailsRoute)

    await testLeaveTeamHcp()
  })

  it('should not be able to change member roles when not admin', async () => {
    await renderCareTeamSettingsPage(filtersTeamDetailsRoute)

    await testNotTeamAdmin()
  })

  it('should be able to update monitoring alerts parameters when user is admin of the team', async () => {
    await renderCareTeamSettingsPage(thirdTeamDetailsRoute)

    await testMonitoringAlertsParametersTeamAdmin()
  })

  it('should not be able to update monitoring alerts parameters when user is not admin of the team', async () => {
    mockAuth0Hook(UserRole.Hcp, userTimId)
    mockUserApi().mockUserDataFetch({ firstName: userTimFirstName, lastName: userTimLastName })

    await renderCareTeamSettingsPage(thirdTeamDetailsRoute)

    await testMonitoringAlertsParametersTeamMember()
  })

  it('should render patient list instead of team details page when route matches /teams/private, user is hcp and selected team is private', async () => {
    localStorage.setItem('selectedTeamId', PRIVATE_TEAM_ID)

    const router = renderPage('/teams/private')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/teams/private/patients')
    }, { timeout: 3000 })
  })
})
