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

import { act, waitFor } from '@testing-library/react'
import { logoutMock, mockAuth0Hook } from '../../mock/auth0.hook.mock'
import { buildAvailableTeams, mockTeamAPI, myThirdTeamId, myThirdTeamName } from '../../mock/team.api.mock'
import { completeDashboardData, mockDataAPI } from '../../mock/data.api.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import { monitoredPatient, monitoredPatientId, monitoredPatientWithMmolId } from '../../data/patient.api.data'
import { mockChatAPI } from '../../mock/chat.api.mock'
import { mockMedicalFilesAPI } from '../../mock/medical-files.api.mock'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'
import { type PatientDashboardLayoutParams } from '../../assert/layout'
import { renderPage } from '../../utils/render'
import { mockUserApi } from '../../mock/user.api.mock'
import PatientApi from '../../../../lib/patient/patient.api'
import { Unit } from 'medical-domain'
import { mockPatientApiForHcp } from '../../mock/patient.api.mock'
import { type Settings } from '../../../../lib/auth/models/settings.model'
import { PRIVATE_TEAM_ID } from '../../../../lib/team/team.hook'
import { UserInvitationStatus } from '../../../../lib/team/models/enums/user-invitation-status.enum'
import { type AppMainLayoutHcpParams, testAppMainLayoutForHcp } from '../../use-cases/app-main-layout-visualisation'
import {
  testDashboardDataVisualisation,
  testDashboardDataVisualisationPrivateTeamNoData,
  testPatientNavBarForHcp
} from '../../use-cases/patient-data-visualisation'
import { testMedicalWidgetForHcp } from '../../use-cases/medical-reports-management'
import { type MedicalFilesWidgetParams } from '../../assert/medical-widget'
import {
  testMonitoringAlertsParametersConfigurationDialogMgdl,
  testMonitoringAlertsParametersConfigurationDialogMmol
} from '../../use-cases/monitoring-alerts-parameters-management'
import { testChatWidgetForHcp } from '../../use-cases/communication-system'
import { ConfigService } from '../../../../lib/config/config.service'

describe('Patient dashboard for HCP', () => {
  const monitoredPatientDashboardRoute = `/patient/${monitoredPatientId}/dashboard`
  const monitoredPatientDashboardRouteMmoL = `/patient/${monitoredPatientWithMmolId}/dashboard`
  const firstName = 'HCP firstName'
  const lastName = 'HCP lastName'
  const mgdlSettings: Settings = { units: { bg: Unit.MilligramPerDeciliter } }
  const mmolSettings: Settings = { units: { bg: Unit.MmolPerLiter } }

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
    localStorage.setItem('selectedTeamId', myThirdTeamId)
  })

  it('should render correct components when navigating to a patient not scoped on the private team', async () => {
    const selectedTeamName = myThirdTeamName
    mockDataAPI(completeDashboardData)

    const appMainLayoutParams: AppMainLayoutHcpParams = {
      footerHasLanguageSelector: false,
      headerInfo: {
        loggedInUserFullName: `${firstName} ${lastName}`,
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

    const medicalFilesWidgetParams: MedicalFilesWidgetParams = {
      selectedPatientId: monitoredPatientId,
      loggedInUserFirstName: firstName,
      loggedInUserLastName: lastName,
      selectedTeamId: myThirdTeamId,
      selectedTeamName
    }

    await act(async () => {
      renderPage(monitoredPatientDashboardRoute)
    })

    await testAppMainLayoutForHcp(appMainLayoutParams)
    await testDashboardDataVisualisation(patientDashboardLayoutParams)
    await testPatientNavBarForHcp()
    await testMedicalWidgetForHcp(medicalFilesWidgetParams)
    await testMonitoringAlertsParametersConfigurationDialogMgdl()
    await testChatWidgetForHcp()
  })

  it('should render correct components when navigating to a patient scoped on the private team', async () => {
    localStorage.setItem('selectedTeamId', PRIVATE_TEAM_ID)
    jest.spyOn(PatientApi, 'getPatientsForHcp').mockResolvedValue([{
      ...monitoredPatient,
      invitationStatus: UserInvitationStatus.accepted
    }])

    const appMainLayoutParams: AppMainLayoutHcpParams = {
      footerHasLanguageSelector: false,
      headerInfo: {
        loggedInUserFullName: `${firstName} ${lastName}`,
        teamMenuInfo: {
          selectedTeamName: PRIVATE_TEAM_ID,
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
      renderPage(monitoredPatientDashboardRoute)
    })

    await testAppMainLayoutForHcp(appMainLayoutParams)
    await testDashboardDataVisualisationPrivateTeamNoData(patientDashboardLayoutParams)
  })

  it('should be possible to edit monitoring alerts parameters in mmol/L', async () => {
    mockUserApi().mockUserDataFetch({ firstName, lastName, settings: mmolSettings })

    await act(async () => {
      renderPage(monitoredPatientDashboardRouteMmoL)
    })

    await testMonitoringAlertsParametersConfigurationDialogMmol()
  })

  it('should automatically log out an idle user', async () => {
    jest.spyOn(ConfigService, 'getIdleTimeout').mockReturnValue(1000)

    renderPage(`/patient/${monitoredPatientId}/dashboard`)

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledWith({ logoutParams: { returnTo: 'http://localhost/login?idle=true' } })
    }, { timeout: 3000 })
  })
})
