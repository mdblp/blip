/*
 * Copyright (c) 2022-2025, Diabeloop
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
import { renderPage } from '../../../utils/render'
import {
  oneDayDashboardData,
  smallDataSet,
  mockDataAPI,
  sixteenDaysOldDashboardData,
  twoWeeksOldDashboardData
} from '../../../mock/data.api.mock'
import { mockPatientLogin } from '../../../mock/patient-login.mock'
import { type MedicalFilesWidgetParams } from '../../../assert/medical-widget.assert'
import { mockMedicalFilesAPI, mockMedicalFilesApiEmptyResult } from '../../../mock/medical-files.api.mock'
import TeamAPI from '../../../../../lib/team/team.api'
import {
  buildPrivateTeam,
  buildTeamOne,
  buildTeamTwo,
  iTeamOne,
  mySecondTeamId,
  mySecondTeamName
} from '../../../mock/team.api.mock'
import { patient1Id, patient1Info } from '../../../data/patient.api.data'
import { mockChatAPI } from '../../../mock/chat.api.mock'
import { type AppMainLayoutParams, testAppMainLayoutForPatient } from '../../../use-cases/app-main-layout-visualisation'
import { type PatientDashboardLayoutParams } from '../../../assert/layout.assert'
import {
  testDashboardDataVisualisationForPatientOrPrivateTeam,
  testDashboardDataVisualisationPrivateTeamNoData,
  testDashboardDataVisualisationSixteenDaysOldData,
  testDashboardDataVisualisationTwoWeeksOldData,
  testEmptyMedicalFilesWidgetForPatient,
  testPatientNavBarForPatientAndCaregiver
} from '../../../use-cases/patient-data-visualisation'
import { testMedicalWidgetForPatient } from '../../../use-cases/medical-reports-management'
import { testChatWidgetForPatient } from '../../../use-cases/communication-system'
import { testJoinTeam } from '../../../use-cases/teams-management'
import { AppUserRoute } from '../../../../../models/enums/routes.enum'
import ErrorApi from '../../../../../lib/error/error.api'

describe('Dashboard view for patient', () => {
  const patientDashboardRoute = AppUserRoute.Dashboard
  const firstName = patient1Info.profile.firstName
  const lastName = patient1Info.profile.lastName

  beforeEach(() => {
    mockPatientLogin(patient1Info)
    mockMedicalFilesAPI(mySecondTeamId, mySecondTeamName)
    mockChatAPI()
    jest.spyOn(TeamAPI, 'getTeams').mockResolvedValue([buildTeamOne(), buildTeamTwo()])
    jest.spyOn(TeamAPI, 'joinTeam').mockResolvedValue()
    jest.spyOn(TeamAPI, 'getTeamFromCode').mockResolvedValue(iTeamOne)
  })

  it('should display correct components when patient is in some medical teams', async () => {
    mockDataAPI(oneDayDashboardData)
    const appMainLayoutParams: AppMainLayoutParams = {
      footerHasLanguageSelector: false,
      loggedInUserFullName: `${lastName} ${firstName}`
    }

    const patientDashboardLayoutParams: PatientDashboardLayoutParams = {
      isChatCardVisible: true,
      isMedicalFilesCardVisible: true,
      isMonitoringAlertCardVisible: false
    }

    const router = renderPage(patientDashboardRoute)

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(patientDashboardRoute)
    })

    await testAppMainLayoutForPatient(appMainLayoutParams)
    await testDashboardDataVisualisationForPatientOrPrivateTeam(patientDashboardLayoutParams)
    await testPatientNavBarForPatientAndCaregiver()
  })

  it('should display medical reports', async () => {
    mockDataAPI()
    const medicalFilesWidgetParams: MedicalFilesWidgetParams = {
      selectedPatientId: patient1Id,
      loggedInUserFirstName: patient1Info.profile.firstName,
      loggedInUserLastName: patient1Info.profile.lastName,
      selectedTeamId: mySecondTeamId,
      selectedTeamName: mySecondTeamName
    }

    const router = renderPage(patientDashboardRoute)

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(patientDashboardRoute)
    })

    await testMedicalWidgetForPatient(medicalFilesWidgetParams)
  })

  it('should be able to use the chat widget', async () => {
    mockDataAPI()
    const router = renderPage(patientDashboardRoute)

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(patientDashboardRoute)
    })

    await testChatWidgetForPatient()
  })

  it('should be able to join a team', async () => {
    jest.spyOn(ErrorApi, 'sendError').mockResolvedValue(null)
    const router = renderPage(patientDashboardRoute)

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(patientDashboardRoute)
    })

    await testJoinTeam()
  })

  it('should render correct components when patient is in no medical teams', async () => {
    mockDataAPI(smallDataSet)
    jest.spyOn(TeamAPI, 'getTeams').mockResolvedValue([buildPrivateTeam()])

    const patientDashboardLayoutParams: PatientDashboardLayoutParams = {
      isChatCardVisible: false,
      isMedicalFilesCardVisible: false,
      isMonitoringAlertCardVisible: false
    }

    await act(async () => {
      renderPage(patientDashboardRoute)
    })

    await testDashboardDataVisualisationPrivateTeamNoData(patientDashboardLayoutParams)
  })

  it('should render correct statistic when data is two weeks old', async () => {
    mockDataAPI(twoWeeksOldDashboardData)

    await act(async () => {
      renderPage(patientDashboardRoute)
    })

    await testDashboardDataVisualisationTwoWeeksOldData()
  })

  it('should produce statistics for fourteen days, whereas the data are sixteen days old', async () => {
    mockDataAPI(sixteenDaysOldDashboardData)

    await act(async () => {
      renderPage(patientDashboardRoute)
    })

    await testDashboardDataVisualisationSixteenDaysOldData()
  })

  it('should display the fallback message when no medical files are returned by the API', async () => {
    mockMedicalFilesApiEmptyResult()

    await act(async () => {
      renderPage(patientDashboardRoute)
    })

    await testEmptyMedicalFilesWidgetForPatient()
  })
})
