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

import { act, screen, waitFor, within } from '@testing-library/react'
import { renderPage } from '../../utils/render'
import { completeDashboardData, mockDataAPI } from '../../mock/data.api.mock'
import { mockPatientApiForPatients } from '../../mock/patient.api.mock'
import { mockPatientLogin } from '../../mock/patient-login.mock'
import { checkMedicalWidgetForPatient, type MedicalFileWidgetParams } from '../../assert/medical-widget'
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
import {
  checkJoinTeamDialog,
  checkJoinTeamDialogCancel,
  checkJoinTeamDialogDisplayErrorMessage,
  checkJoinTeamDialogPrivacyCancel
} from '../../assert/join-team'
import { monitoredPatient, monitoredPatientAsTeamMember, monitoredPatientId } from '../../data/patient.api.data'
import MedicalFilesApi from '../../../../lib/medical-files/medical-files.api'
import { PRIVATE_TEAM_ID } from '../../../../lib/team/team.hook'
import { mockChatAPI } from '../../mock/chat.api.mock'
import ChatApi from '../../../../lib/chat/chat.api'
import { checkChatWidgetForPatient } from '../../assert/chat-widget'

describe('Patient dashboard for HCP', () => {
  const monitoredPatientDashboardRoute = '/dashboard'

  beforeEach(() => {
    mockPatientLogin(monitoredPatientAsTeamMember)
    mockPatientApiForPatients()
    mockDataAPI()
    mockMedicalFilesAPI(mySecondTeamId, mySecondTeamName)
    mockChatAPI()
    mockChatAPI()
    jest.spyOn(TeamAPI, 'getTeams').mockResolvedValue([buildTeamOne(), buildTeamTwo()])
    jest.spyOn(TeamAPI, 'joinTeam').mockResolvedValue()
    jest.spyOn(TeamAPI, 'getTeamFromCode').mockResolvedValue(iTeamOne)
    localStorage.setItem('selectedTeamId', mySecondTeamId)
  })

  it('should display correct components when patient is in some medical teams', async () => {
    mockDataAPI(completeDashboardData)
    jest.spyOn(ChatApi, 'sendChatMessage').mockResolvedValue(true)
    const router = renderPage(monitoredPatientDashboardRoute)
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(monitoredPatientDashboardRoute)
    })

    const secondaryHeader = await screen.findByTestId('patient-nav-bar')
    expect(MedicalFilesApi.getMedicalReports).toHaveBeenCalledWith(monitoredPatientId, null)
    expect(secondaryHeader).toHaveTextContent('DashboardDailyTrendsDownload report')
    const dashboard = within(await screen.findByTestId('patient-dashboard'))
    expect(dashboard.getByText('Data calculated on the last 7 days')).toBeVisible()
    expect(dashboard.getByText('Patient statistics')).toBeVisible()

    const statsWidgets = await screen.findByTestId('patient-statistics', {}, { timeout: 3000 })
    expect(statsWidgets).toBeVisible()
    expect(statsWidgets).toHaveTextContent('Time In Range2h8%10h42%6h25%4h17%2h8%<5454-7070-180180-250>250mg/dLStandard Deviation (61-209)mg/dL74Avg. Glucose (CGM)mg/dL135Sensor Usage1%CV (CGM)55%Avg. Daily Total Insulin(1.3U)Bolus1.3 U100%Basal0.0 U2%Avg. Daily Insulin1.3UWeight72kgDaily Dose ÷ Weight0.02U/kgAvg. Daily Time In Loop ModeONOFF91%21h 49m9%2h 11mAvg. Daily Carbs55gRescue carbs10g')

    const deviceUsageWidget = screen.getByTestId('device-usage-card')
    expect(deviceUsageWidget).toBeVisible()
    expect(deviceUsageWidget).toHaveTextContent('Last updatesNov 1, 2022 12:00 amBOLUS_AGGRESSIVENESS_FACTOR (143 %)Nov 1, 2022 12:00 amLARGE_MEAL_BREAKFAST (150.0 g)Nov 1, 2022 12:00 amLARGE_MEAL_DINNER (150.0 g)Nov 1, 2022 12:00 amLARGE_MEAL_LUNCH (70.0 g)Nov 2, 2022 5:00 pmMEAL_RATIO_BREAKFAST_FACTOR (100 % -> 110 %)Nov 1, 2022 12:00 amMEAL_RATIO_BREAKFAST_FACTOR (100 % -> 100 %)Nov 1, 2022 12:00 amMEAL_RATIO_BREAKFAST_FACTOR (100 %)Nov 2, 2022 5:00 pmMEAL_RATIO_DINNER_FACTOR (100 % -> 90 %)Nov 1, 2022 12:00 amMEAL_RATIO_DINNER_FACTOR (100 % -> 100 %)Nov 1, 2022 12:00 amMEAL_RATIO_DINNER_FACTOR (100 %)Nov 7, 2022 2:01 pmMEAL_RATIO_LUNCH_FACTOR (130 % -> 90 %)Nov 1, 2022 12:00 amMEAL_RATIO_LUNCH_FACTOR (130 %)Nov 1, 2022 12:00 amMEDIUM_MEAL_BREAKFAST (70.0 g)Nov 1, 2022 12:00 amMEDIUM_MEAL_DINNER (60.0 g)Nov 1, 2022 12:00 amMEDIUM_MEAL_LUNCH (50.0 g)Nov 1, 2022 12:00 amPATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA (100 %)Nov 2, 2022 7:00 amPATIENT_GLY_HYPER_LIMIT (180.1 mg/dL -> 140.0 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLY_HYPER_LIMIT (180.1 mg/dL -> 180.1 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLY_HYPER_LIMIT (180.1 mg/dL)Nov 2, 2022 7:00 amPATIENT_GLY_HYPO_LIMIT (70.0 mg/dL -> 60.0 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLY_HYPO_LIMIT (70.0 mg/dL -> 70.0 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLY_HYPO_LIMIT (70.0 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLYCEMIA_TARGET (100.0 mg/dL)Nov 1, 2022 12:00 amSMALL_MEAL_BREAKFAST (15.0 g)Nov 1, 2022 12:00 amSMALL_MEAL_DINNER (20.0 g)Nov 1, 2022 12:00 amSMALL_MEAL_LUNCH (30.0 g)Nov 1, 2022 12:00 amTOTAL_INSULIN_FOR_24H (53.0 U)Nov 1, 2022 12:00 amWEIGHT (69.0 kg)')

    const monitoringAlertCard = screen.getByTestId('monitoring-alert-card')
    expect(monitoringAlertCard).toBeVisible()
    expect(monitoringAlertCard).toHaveTextContent('EventsCurrent eventsTime spent out of the target range10%Severe hypoglycemia20%Data not transferred30%')

    const medicalWidgetParams: MedicalFileWidgetParams = {
      loggedInUserFirstName: monitoredPatient.profile.firstName,
      loggedInUserLastName: monitoredPatient.profile.lastName,
      selectedTeamId: mySecondTeamId,
      selectedTeamName: mySecondTeamName
    }
    await checkMedicalWidgetForPatient(medicalWidgetParams)
    await checkChatWidgetForPatient()
  })

  it('should render correct components when patient is in no medical teams', async () => {
    localStorage.setItem('selectedTeamId', PRIVATE_TEAM_ID)
    jest.spyOn(TeamAPI, 'getTeams').mockResolvedValue([buildPrivateTeam()])

    await act(async () => {
      renderPage(monitoredPatientDashboardRoute)
    })

    const dashboard = within(await screen.findByTestId('patient-dashboard'))
    expect(dashboard.getByText('Data calculated on the last 7 days')).toBeVisible()
    expect(dashboard.getByText('Patient statistics')).toBeVisible()
    expect(dashboard.getByText('Device Usage')).toBeVisible()

    expect(dashboard.queryByTestId('medical-files-card')).not.toBeInTheDocument()
    expect(dashboard.queryByTestId('monitoring-alert-card')).not.toBeInTheDocument()
    expect(dashboard.queryByTestId('chat-card')).not.toBeInTheDocument()
  })

  it('should close the dialog after clicking the join care team button with success message', async () => {
    await act(async () => {
      renderPage(monitoredPatientDashboardRoute)
    })

    const badgeTeamMenu = screen.getByLabelText('Open team menu')
    await checkJoinTeamDialog(badgeTeamMenu)
    await checkJoinTeamDialogCancel(badgeTeamMenu)
    await checkJoinTeamDialogPrivacyCancel(badgeTeamMenu)
    await checkJoinTeamDialogDisplayErrorMessage(badgeTeamMenu)
  })
})
