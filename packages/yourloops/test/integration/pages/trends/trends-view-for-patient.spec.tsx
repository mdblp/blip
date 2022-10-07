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

import { screen } from '@testing-library/react'
import { mockPatientLogin } from '../../mock/auth'
import { unMonitoredPatient } from '../../mock/mockPatientAPI'
import { checkPatientNavBarAsPatient } from '../../assert/patient-nav-bar'
import {
  checkTrendsStatsWidgetsTooltips,
  checkTrendsTidelineContainerTooltips,
  checkTrendsTimeInRangeStatsWidgets
} from '../../assert/trends'
import { minimalTrendViewData, mockDataAPI, smbgData, timeInRangeStatsTrendViewData } from '../../mock/mockDataAPI'
import { renderPage } from '../../utils/render'
import { checkPatientLayout } from '../../assert/layout'
import {
  checkReadingsInRangeStatsTitle,
  checkReadingsInRangeStatsWidgets,
  checkTimeInRangeStatsTitle
} from '../../assert/stats'

jest.setTimeout(10000)

describe('Trends view for patient', () => {
  let dataToMock = minimalTrendViewData

  beforeAll(() => {
    mockPatientLogin(unMonitoredPatient)
  })

  beforeEach(() => {
    dataToMock = minimalTrendViewData
  })

  const renderTrendsView = () => {
    mockDataAPI(dataToMock)
    renderPage('/trends')
  }

  it('should render correct basic components when navigating to patient trends view', async () => {
    renderTrendsView()
    expect(await screen.findByTestId('patient-data-subnav-outer', {}, { timeout: 3000 })).toBeVisible()
    checkPatientNavBarAsPatient(false)
    checkPatientLayout(`${unMonitoredPatient.profile.firstName} ${unMonitoredPatient.profile.lastName}`)
  })

  it('should render correct tooltips', async () => {
    renderTrendsView()
    await checkTrendsTidelineContainerTooltips()
    checkTrendsStatsWidgetsTooltips()
  })

  it('should display correct time in range stats info', async () => {
    dataToMock = timeInRangeStatsTrendViewData
    renderTrendsView()
    await checkTrendsTimeInRangeStatsWidgets()
    await checkTimeInRangeStatsTitle()
  })

  it('should display correct readings in range stats info', async () => {
    dataToMock = smbgData
    renderTrendsView()
    await checkReadingsInRangeStatsWidgets()
    await checkReadingsInRangeStatsTitle('Avg. Daily Readings In Range')
  })
})
