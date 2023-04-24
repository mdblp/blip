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
import { renderPage } from '../../utils/render'
import { completeDashboardData, mockDataAPI } from '../../mock/data.api.mock'
import { mockPatientApiForPatients } from '../../mock/patient.api.mock'
import { mockPatientLogin } from '../../mock/patient-login.mock'
import { type MedicalFilesWidgetParams } from '../../assert/medical-widget'
import { mockMedicalFilesAPI } from '../../mock/medical-files.api.mock'
import TeamAPI from '../../../../lib/team/team.api'
import {
  buildPrivateTeam,
  buildTeamOne,
  buildTeamTwo,
  iTeamOne,
  mySecondTeamId,
  mySecondTeamName
} from '../../mock/team.api.mock'
import { monitoredPatient, monitoredPatientAsTeamMember, monitoredPatientId } from '../../data/patient.api.data'
import { PRIVATE_TEAM_ID } from '../../../../lib/team/team.hook'
import { mockChatAPI } from '../../mock/chat.api.mock'
import {
  type AppMainLayoutParams,
  testAppMainLayoutForPatient
} from '../../use-cases/app-main-layout-visualisation'
import { type PatientDashboardLayoutParams } from '../../assert/layout'
import {
  testDashboardDataVisualisation,
  testDashboardDataVisualisationPrivateTeamNoData,
  testPatientNavBarForPatient
} from '../../use-cases/patient-data-visualisation'
import { testMedicalWidgetForPatient } from '../../use-cases/medical-reports-management'
import { testChatWidgetForPatient } from '../../use-cases/communication-system'
import { testJoinTeamDialog } from '../../use-cases/teams-management'

describe('Patient dashboard for HCP', () => {
  const monitoredPatientDashboardRoute = '/dashboard'
  const firstName = 'Monitored'
  const lastName = 'Patient'

  beforeEach(() => {
    mockPatientLogin(monitoredPatientAsTeamMember)
    mockPatientApiForPatients()
    mockDataAPI()
    mockMedicalFilesAPI(mySecondTeamId, mySecondTeamName)
    mockChatAPI()
    jest.spyOn(TeamAPI, 'getTeams').mockResolvedValue([buildTeamOne(), buildTeamTwo()])
    jest.spyOn(TeamAPI, 'joinTeam').mockResolvedValue()
    jest.spyOn(TeamAPI, 'getTeamFromCode').mockResolvedValue(iTeamOne)
    localStorage.setItem('selectedTeamId', mySecondTeamId)
  })

  it('should display correct components when patient is in some medical teams', async () => {
    mockDataAPI(completeDashboardData)

    const appMainLayoutParams: AppMainLayoutParams = {
      footerHasLanguageSelector: false,
      loggedInUserFullName: `${firstName} ${lastName}`
    }

    const patientDashboardLayoutParams: PatientDashboardLayoutParams = {
      isChartCardVisible: true,
      isMedicalFilesCardVisible: true,
      isMonitoringAlertCardVisible: true
    }

    const medicalFilesWidgetParams: MedicalFilesWidgetParams = {
      selectedPatientId: monitoredPatientId,
      loggedInUserFirstName: monitoredPatient.profile.firstName,
      loggedInUserLastName: monitoredPatient.profile.lastName,
      selectedTeamId: mySecondTeamId,
      selectedTeamName: mySecondTeamName
    }

    const router = renderPage(monitoredPatientDashboardRoute)

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(monitoredPatientDashboardRoute)
    })

    await testAppMainLayoutForPatient(appMainLayoutParams)
    await testDashboardDataVisualisation(patientDashboardLayoutParams)
    await testPatientNavBarForPatient()
    await testMedicalWidgetForPatient(medicalFilesWidgetParams)
    await testChatWidgetForPatient()
    await testJoinTeamDialog()
  })

  it('should render correct components when patient is in no medical teams', async () => {
    localStorage.setItem('selectedTeamId', PRIVATE_TEAM_ID)
    jest.spyOn(TeamAPI, 'getTeams').mockResolvedValue([buildPrivateTeam()])

    const patientDashboardLayoutParams: PatientDashboardLayoutParams = {
      isChartCardVisible: false,
      isMedicalFilesCardVisible: false,
      isMonitoringAlertCardVisible: false
    }

    await act(async () => {
      renderPage(monitoredPatientDashboardRoute)
    })

    await testDashboardDataVisualisationPrivateTeamNoData(patientDashboardLayoutParams)
  })
})
