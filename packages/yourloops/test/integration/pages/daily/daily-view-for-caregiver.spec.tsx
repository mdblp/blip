/**
 * Copyright (c) 2022, Diabeloop
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

import React from 'react'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { act, render, screen } from '@testing-library/react'
import { AuthContextProvider } from '../../../../lib/auth'
import { MainLobby } from '../../../../app/main-lobby'
import { checkCaregiverHeader } from '../../utils/assert/header'
import { checkHCPDrawer } from '../../utils/assert/drawer'
import { checkFooter } from '../../utils/assert/footer'
import { mockUserDataFetch } from '../../utils/mock/auth'
import { mockAuth0Hook } from '../../utils/mock/mockAuth0Hook'
import { mockTeamAPI } from '../../utils/mock/mockTeamAPI'
import { mockDataAPIForDailyView } from '../../utils/mock/mockDataAPI'
import { mockNotificationAPI } from '../../utils/mock/mockNotificationAPI'
import { mockPatientAPI, patientNonMonitoredId } from '../../utils/mock/mockPatientAPI'
import { mockChatAPI } from '../../utils/mock/mockChatAPI'
import { mockMedicalFilesAPI } from '../../utils/mock/mockMedicalFilesAPI'
import { mockDirectShareApi } from '../../utils/mock/mockDirectShareAPI'
import { checkPatientNavBarAsHCP } from '../../utils/assert/patient-nav-bar'
import { checkDailyStatsWidgetsTooltips, checkDailyTidelineContainerTooltips } from '../../utils/assert/daily'
import { UserRoles } from '../../../../models/user'

jest.setTimeout(10000)

describe('Daily view for caregiver', () => {
  const url = `/patient/${patientNonMonitoredId}/daily`
  const firstName = 'HCP firstName'
  const lastName = 'HCP lastName'

  beforeAll(() => {
    mockAuth0Hook(UserRoles.caregiver)
    mockNotificationAPI()
    mockDirectShareApi()
    mockTeamAPI()
    mockUserDataFetch(firstName, lastName)
    mockPatientAPI()
    mockChatAPI()
    mockMedicalFilesAPI()
    mockDataAPIForDailyView()
  })

  function getPatientDailyView(history) {
    return (
      <Router history={history}>
        <AuthContextProvider>
          <MainLobby />
        </AuthContextProvider>
      </Router>
    )
  }

  const renderDailyView = () => {
    const history = createMemoryHistory({ initialEntries: [url] })

    act(() => {
      render(getPatientDailyView(history))
    })
    expect(history.location.pathname).toBe(url)
  }

  it('should render correct basic components when navigating to patient daily view', async () => {
    renderDailyView()
    expect(await screen.findByTestId('patient-data-subnav-outer', {}, { timeout: 3000 })).toBeVisible()
    checkPatientNavBarAsHCP()
    checkCaregiverHeader(`${firstName} ${lastName}`)
    checkHCPDrawer()
    checkFooter()
  })

  it('should render correct tooltips', async () => {
    renderDailyView()
    await checkDailyTidelineContainerTooltips()
    checkDailyStatsWidgetsTooltips()
  })
})
