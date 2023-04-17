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
import { mockDataAPI } from '../../mock/data.api.mock'
import { mockPatientApiForPatients } from '../../mock/patient.api.mock'
import { mockPatientLogin } from '../../mock/patient-login.mock'
import { checkMedicalWidgetForPatient } from '../../assert/medical-widget'
import { mockMedicalFilesAPI } from '../../mock/medical-files.api.mock'
import TeamAPI from '../../../../lib/team/team.api'
import { buildPrivateTeam, buildTeamOne, buildTeamTwo, iTeamOne, mySecondTeamId } from '../../mock/team.api.mock'
import {
  checkJoinTeamDialog,
  checkJoinTeamDialogCancel,
  checkJoinTeamDialogDisplayErrorMessage,
  checkJoinTeamDialogPrivacyCancel
} from '../../assert/join-team'
import { monitoredPatientAsTeamMember, monitoredPatientId } from '../../data/patient.api.data'
import MedicalFilesApi from '../../../../lib/medical-files/medical-files.api'
import { PRIVATE_TEAM_ID } from '../../../../lib/team/team.hook'

describe('Patient dashboard for HCP', () => {
  const monitoredPatientDashboardRoute = '/dashboard'

  beforeEach(() => {
    mockPatientLogin(monitoredPatientAsTeamMember)
    mockPatientApiForPatients()
    mockDataAPI()
    mockMedicalFilesAPI()
    jest.spyOn(TeamAPI, 'getTeams').mockResolvedValue([buildTeamOne(), buildTeamTwo()])
    jest.spyOn(TeamAPI, 'joinTeam').mockResolvedValue()
    jest.spyOn(TeamAPI, 'getTeamFromCode').mockResolvedValue(iTeamOne)
    localStorage.setItem('selectedTeamId', mySecondTeamId)
  })

  it('should display correct components when patient is in some medical teams', async () => {
    const router = renderPage(monitoredPatientDashboardRoute)
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(monitoredPatientDashboardRoute)
    })

    const secondaryHeader = await screen.findByTestId('patient-nav-bar')
    expect(MedicalFilesApi.getMedicalReports).toHaveBeenCalledWith(monitoredPatientId, undefined)
    expect(secondaryHeader).toHaveTextContent('DashboardDailyTrendsDownload report')
    await checkMedicalWidgetForPatient()
    const dashboard = within(await screen.findByTestId('patient-dashboard'))
    expect(dashboard.getByText('Data calculated on the last 7 days')).toBeVisible()
    expect(dashboard.getByText('Patient statistics')).toBeVisible()
    expect(dashboard.getByText('Device Usage')).toBeVisible()

    expect(dashboard.queryByTestId('remote-monitoring-card')).toBeVisible()
    expect(dashboard.queryByTestId('medical-files-card')).toBeVisible()
    expect(dashboard.queryByTestId('monitoring-alert-card')).toBeVisible()
    expect(dashboard.queryByTestId('chat-card')).toBeVisible()
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

    expect(dashboard.queryByTestId('remote-monitoring-card')).not.toBeInTheDocument()
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
