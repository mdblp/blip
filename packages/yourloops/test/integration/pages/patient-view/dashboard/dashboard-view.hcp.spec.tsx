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

import { act, waitFor } from '@testing-library/react'
import { logoutMock, mockAuth0Hook } from '../../../mock/auth0.hook.mock'
import { buildAvailableTeams, mockTeamAPI, myThirdTeamId, myThirdTeamName } from '../../../mock/team.api.mock'
import {
  completeDashboardData,
  dataSetsWithZeroValues,
  mockDataAPI,
  sixteenDaysOldDashboardData,
  twoWeeksOldDashboardData
} from '../../../mock/data.api.mock'
import { mockNotificationAPI } from '../../../mock/notification.api.mock'
import { noDataTransferredPatientId, patient1Id, patient1Info, patient1Metrics } from '../../../data/patient.api.data'
import { mockChatAPI } from '../../../mock/chat.api.mock'
import { mockMedicalFilesAPI, mockMedicalFilesApiEmptyResult } from '../../../mock/medical-files.api.mock'
import { mockDirectShareApi } from '../../../mock/direct-share.api.mock'
import { type PatientDashboardLayoutParams } from '../../../assert/layout.assert'
import { renderPage } from '../../../utils/render'
import { mockUserApi } from '../../../mock/user.api.mock'
import PatientApi from '../../../../../lib/patient/patient.api'
import { Unit } from 'medical-domain'
import { mockPatientApiForHcp } from '../../../mock/patient.api.mock'
import { type Settings } from '../../../../../lib/auth/models/settings.model'
import { UserInviteStatus } from '../../../../../lib/team/models/enums/user-invite-status.enum'
import {
  type AppMainLayoutHcpParams,
  testAppMainLayoutForHcp,
  testPatientNavBarLayoutForHcp,
  testPatientNavBarLayoutForHcpInPrivateTeam
} from '../../../use-cases/app-main-layout-visualisation'
import {
  testDashboardDataVisualisationForHcp,
  testDashboardDataVisualisationNoDataForHcp,
  testDashboardDataVisualisationPrivateTeamNoData,
  testDashboardDataVisualisationSixteenDaysOldData,
  testDashboardDataVisualisationTwoWeeksOldData,
  testEmptyMedicalFilesWidgetForHcp,
  testPatientNavBarForHcp,
  testSwitchPatientCorrectDataDisplay
} from '../../../use-cases/patient-data-visualisation'
import { testMedicalWidgetForHcp } from '../../../use-cases/medical-reports-management'
import { type MedicalFilesWidgetParams } from '../../../assert/medical-widget.assert'
import {
  testMonitoringAlertsCardLinkToMonitoringAlertsConfiguration
} from '../../../use-cases/monitoring-alerts-parameters-management'
import { testChatWidgetForHcp } from '../../../use-cases/communication-system'
import { ConfigService } from '../../../../../lib/config/config.service'
import { AppUserRoute } from '../../../../../models/enums/routes.enum'
import { PRIVATE_TEAM_ID } from '../../../../../lib/team/team.util'

describe('Dashboard view for HCP', () => {
  const patientDashboardRoute = `/teams/${myThirdTeamId}/patients/${patient1Id}${AppUserRoute.Dashboard}`
  const firstName = 'HCP firstName'
  const lastName = 'HCP lastName'
  const mgdlSettings: Settings = { units: { bg: Unit.MilligramPerDeciliter } }

  beforeEach(() => {
    mockAuth0Hook()
    mockNotificationAPI()
    mockDirectShareApi()
    mockTeamAPI()
    mockUserApi().mockUserDataFetch({ firstName, lastName, settings: mgdlSettings })
    mockPatientApiForHcp()
    mockChatAPI()
    mockMedicalFilesAPI(myThirdTeamId, myThirdTeamName)
    mockDataAPI()
  })

  it('should render correct components when navigating to a patient not scoped on the private team', async () => {
    const selectedTeamName = myThirdTeamName
    mockDataAPI(completeDashboardData)

    const appMainLayoutParams: AppMainLayoutHcpParams = {
      footerHasLanguageSelector: false,
      headerInfo: {
        loggedInUserFullName: `${lastName} ${firstName}`,
        teamMenuInfo: {
          selectedTeamName,
          isSelectedTeamPrivate: false,
          availableTeams: buildAvailableTeams()
        }
      }
    }
    const patientDashboardLayoutParams: PatientDashboardLayoutParams = {
      isChatCardVisible: true,
      isMedicalFilesCardVisible: true,
      isMonitoringAlertCardVisible: true
    }

    const router = renderPage(patientDashboardRoute)
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(patientDashboardRoute)
    })


    await testAppMainLayoutForHcp(appMainLayoutParams)
    testPatientNavBarLayoutForHcp()
    await testDashboardDataVisualisationForHcp(patientDashboardLayoutParams)
  })

  it('should render components with correct display when the patient has no data', async () => {
    const patientWithNoDataDashboardRoute = `/teams/${myThirdTeamId}/patients/${noDataTransferredPatientId}${AppUserRoute.Dashboard}`
    mockDataAPI(completeDashboardData)

    await act(async () => {
      renderPage(patientWithNoDataDashboardRoute)
    })

    await testDashboardDataVisualisationNoDataForHcp()
  })

  it('should be able to switch from patient to patient', async () => {
    mockDataAPI(completeDashboardData)

    await act(async () => {
      renderPage(patientDashboardRoute)
    })

    await testPatientNavBarForHcp()
  })

  it('should be able to manage medical reports', async () => {
    const selectedTeamName = myThirdTeamName
    mockDataAPI(completeDashboardData)

    const medicalFilesWidgetParams: MedicalFilesWidgetParams = {
      selectedPatientId: patient1Id,
      loggedInUserFirstName: firstName,
      loggedInUserLastName: lastName,
      selectedTeamId: myThirdTeamId,
      selectedTeamName
    }

    await act(async () => {
      renderPage(patientDashboardRoute)
    })

    await testMedicalWidgetForHcp(medicalFilesWidgetParams)
  })

  it('should be able to manage monitoring alerts parameters', async () => {
    await act(async () => {
      renderPage(patientDashboardRoute)
    })

    await testMonitoringAlertsCardLinkToMonitoringAlertsConfiguration()
  })

  it('should be able to use chat widget', async () => {
    await act(async () => {
      renderPage(patientDashboardRoute)
    })

    await testChatWidgetForHcp()
  })

  it('should return correct statistics when data is sixteen days old', async () => {
    mockDataAPI(sixteenDaysOldDashboardData)

    await act(async () => {
      renderPage(patientDashboardRoute)
    })

    await testDashboardDataVisualisationSixteenDaysOldData()
  })

  it('should produce fourteen days old statistics when data is two weeks old', async () => {
    mockDataAPI(twoWeeksOldDashboardData)

    await act(async () => {
      renderPage(patientDashboardRoute)
    })

    await testDashboardDataVisualisationTwoWeeksOldData()
  })

  it('should render correct components when patient is in no medical teams', async () => {
    mockDataAPI(dataSetsWithZeroValues)
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

    const patientDashboardLayoutParams: PatientDashboardLayoutParams = {
      isChatCardVisible: false,
      isMedicalFilesCardVisible: false,
      isMonitoringAlertCardVisible: false
    }

    await act(async () => {
      renderPage(`/teams/${PRIVATE_TEAM_ID}/patients/${patient1Id}${AppUserRoute.Dashboard}`)
    })

    await testAppMainLayoutForHcp(appMainLayoutParams)
    testPatientNavBarLayoutForHcpInPrivateTeam()
    await testDashboardDataVisualisationPrivateTeamNoData(patientDashboardLayoutParams)
  })

  it('should automatically log out an idle user', async () => {
    jest.spyOn(ConfigService, 'getIdleTimeout').mockReturnValue(1000)

    renderPage(`/teams/${myThirdTeamId}/patients/${patient1Id}${AppUserRoute.Dashboard}`)

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledWith({ logoutParams: { returnTo: 'http://localhost/login?idle=true' } })
    }, { timeout: 3000 })
  })

  it('should display the fallback message when no medical files are returned by the API', async () => {
    mockMedicalFilesApiEmptyResult()

    await act(async () => {
      renderPage(patientDashboardRoute)
    })

    await testEmptyMedicalFilesWidgetForHcp()
  })

  it('should render correct patient data when changing patient in the header dropdown', async () => {
    await act(async () => {
      renderPage(patientDashboardRoute)
    })
    await testSwitchPatientCorrectDataDisplay()
  })
})
