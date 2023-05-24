/*
 * Copyright (c) 2022-2023, Diabeloop
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

import { waitFor } from '@testing-library/react'
import { mockAuth0Hook } from '../../mock/auth0.hook.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'
import { flaggedPatientId, patient1 } from '../../data/patient.api.data'
import { buildAvailableTeams, mockTeamAPI, myThirdTeamId, myThirdTeamName } from '../../mock/team.api.mock'
import { renderPage } from '../../utils/render'
import { mockUserApi } from '../../mock/user.api.mock'
import { mockPatientApiForHcp } from '../../mock/patient.api.mock'
import PatientApi from '../../../../lib/patient/patient.api'
import { mockDataAPI } from '../../mock/data.api.mock'
import { UserInvitationStatus } from '../../../../lib/team/models/enums/user-invitation-status.enum'
import { type AppMainLayoutHcpParams, testAppMainLayoutForHcp } from '../../use-cases/app-main-layout-visualisation'
import { PRIVATE_TEAM_ID } from '../../../../lib/team/team.hook'
import {
  testPatientListForHcp,
  testPatientListForHcpPrivateTeam,
  testPatientListForHcpWithMmolL
} from '../../use-cases/patient-list-management'
import { testPatientManagementMedicalTeam, testPatientManagementPrivateTeam } from '../../use-cases/patients-management'
import { testTeamCreation } from '../../use-cases/teams-management'
import { Unit } from 'medical-domain'
import NotificationApi from '../../../../lib/notifications/notification.api'

describe('HCP home page', () => {
  const firstName = 'Eric'
  const lastName = 'Ard'

  beforeEach(() => {
    mockAuth0Hook()
    mockNotificationAPI()
    mockTeamAPI()
    mockUserApi().mockUserDataFetch({ firstName, lastName, preferences: { patientsStarred: [flaggedPatientId] } })
    mockPatientApiForHcp()
    mockDirectShareApi()
    mockDataAPI()
    jest.spyOn(PatientApi, 'removePatient').mockResolvedValue(undefined)
    jest.spyOn(PatientApi, 'invitePatient').mockResolvedValue(undefined)
    jest.spyOn(NotificationApi, 'cancelInvitation').mockResolvedValue(undefined)
  })

  const renderHomePage = async () => {
    const router = renderPage('/')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/home')
    })
    return router
  }

  it('should render correct layout when scoped on the private practice team', async () => {
    localStorage.setItem('selectedTeamId', PRIVATE_TEAM_ID)
    jest.spyOn(PatientApi, 'getPatientsForHcp').mockResolvedValue([{
      ...patient1,
      invitationStatus: UserInvitationStatus.accepted
    }])

    const appMainLayoutParams: AppMainLayoutHcpParams = {
      footerHasLanguageSelector: false,
      headerInfo: {
        loggedInUserFullName: `${firstName} ${lastName}`,
        teamMenuInfo: {
          isSelectedTeamPrivate: true,
          availableTeams: buildAvailableTeams()
        }
      }
    }

    await renderHomePage()

    await testAppMainLayoutForHcp(appMainLayoutParams)
  })

  it('should be able to manage patients when scoped on the private practice team', async () => {
    localStorage.setItem('selectedTeamId', PRIVATE_TEAM_ID)
    jest.spyOn(PatientApi, 'getPatientsForHcp').mockResolvedValue([{
      ...patient1,
      invitationStatus: UserInvitationStatus.accepted
    }])

    await renderHomePage()

    await testPatientManagementPrivateTeam()
  })

  it('should be able to manage the patient list when scoped on the private practice team', async () => {
    localStorage.setItem('selectedTeamId', PRIVATE_TEAM_ID)
    jest.spyOn(PatientApi, 'getPatientsForHcp').mockResolvedValue([{
      ...patient1,
      invitationStatus: UserInvitationStatus.accepted
    }])

    await renderHomePage()

    await testPatientListForHcpPrivateTeam()
  })

  it('should render correct layout when scoped on a medical team', async () => {
    localStorage.setItem('selectedTeamId', myThirdTeamId)

    const appMainLayoutParams: AppMainLayoutHcpParams = {
      footerHasLanguageSelector: false,
      headerInfo: {
        loggedInUserFullName: `${firstName} ${lastName}`,
        teamMenuInfo: {
          selectedTeamName: myThirdTeamName,
          isSelectedTeamPrivate: false,
          availableTeams: buildAvailableTeams()
        }
      }
    }

    await renderHomePage()

    await testAppMainLayoutForHcp(appMainLayoutParams)
  })

  it('should be able to manage patients when scoped on a medical team', async () => {
    localStorage.setItem('selectedTeamId', myThirdTeamId)

    await renderHomePage()

    await testPatientManagementMedicalTeam()
  })

  it('should be able to manage the patient list when scoped on a medical team', async () => {
    localStorage.setItem('selectedTeamId', myThirdTeamId)

    const router = await renderHomePage()

    await testPatientListForHcp(router)
  })

  it('should be able to create a team when on the home page', async () => {
    localStorage.setItem('selectedTeamId', myThirdTeamId)

    await renderHomePage()

    await testTeamCreation()
  })

  it('should show correct alerts tooltips when logged in with a user with units in mmol/L', async () => {
    localStorage.setItem('selectedTeamId', myThirdTeamId)
    mockUserApi().mockUserDataFetch({
      firstName,
      lastName,
      preferences: { patientsStarred: [flaggedPatientId] },
      settings: { units: { bg: Unit.MmolPerLiter } }
    })

    await renderHomePage()

    await testPatientListForHcpWithMmolL()
  })
})
