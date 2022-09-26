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
import { screen } from '@testing-library/react'
import { checkHCPHeader } from '../../assert/header'
import { checkHCPDrawer } from '../../assert/drawer'
import { checkFooter } from '../../assert/footer'
import { mockUserDataFetch } from '../../mock/auth'
import { mockAuth0Hook } from '../../mock/mockAuth0Hook'
import { mockTeamAPI } from '../../mock/mockTeamAPI'
import { mockDataAPIForTrendsView } from '../../mock/mockDataAPI'
import { mockNotificationAPI } from '../../mock/mockNotificationAPI'
import { mockPatientAPI, patientNonMonitoredId } from '../../mock/mockPatientAPI'
import { mockChatAPI } from '../../mock/mockChatAPI'
import { mockMedicalFilesAPI } from '../../mock/mockMedicalFilesAPI'
import { mockDirectShareApi } from '../../mock/mockDirectShareAPI'
import { checkPatientNavBarAsHCP } from '../../assert/patient-nav-bar'
import { checkTrendsStatsWidgetsTooltips, checkTrendsTidelineContainerTooltips } from '../../assert/trends'
import { renderPage } from '../../utils/render'

jest.setTimeout(10000)

describe('Trends view for HCP', () => {
  const firstName = 'HCP firstName'
  const lastName = 'HCP lastName'

  beforeAll(() => {
    mockAuth0Hook()
    mockNotificationAPI()
    mockDirectShareApi()
    mockTeamAPI()
    mockUserDataFetch(firstName, lastName)
    mockPatientAPI()
    mockChatAPI()
    mockMedicalFilesAPI()
    mockDataAPIForTrendsView()
  })

  const renderTrendView = () => {
    renderPage(`/patient/${patientNonMonitoredId}/trends`)
  }

  it('should render correct basic components when navigating to patient trends view', async () => {
    renderTrendView()
    expect(await screen.findByTestId('patient-data-subnav-outer', {}, { timeout: 3000 })).toBeVisible()
    checkPatientNavBarAsHCP(false)
    checkHCPHeader(`${firstName} ${lastName}`)
    checkHCPDrawer()
    checkFooter()
  })

  it('should render correct tooltips', async () => {
    renderTrendView()
    await checkTrendsTidelineContainerTooltips()
    checkTrendsStatsWidgetsTooltips()
  })
})
