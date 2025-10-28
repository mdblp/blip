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

import { mockPatientLogin } from '../../../mock/patient-login.mock'
import {
  checkDaysSelection,
  checkRangeSelection,
  checkSMBGTrendsStatsWidgetsTooltips,
  checkTrendsBolusAndCarbsAverage,
  checkTrendsLayout,
  checkTrendsTidelineContainerTooltips,
  checkTrendsTimeInRangeStatsWidgets,
  GMI_TOOLTIP
} from '../../../assert/trends-view.assert'
import { mockDataAPI, smbgData, timeInRangeStatsTrendViewData } from '../../../mock/data.api.mock'
import { renderPage } from '../../../utils/render'
import {
  checkAverageGlucoseStatWidget,
  checkCoefficientOfVariationStatWidget,
  checkGlucoseManagementIndicator,
  checkReadingsInRangeStats,
  checkReadingsInRangeStatsWidgets,
  checkStandardDeviationStatWidget,
  checkStatTooltip,
  checkTimeInRangeStatsTitle
} from '../../../assert/stats.assert'
import userEvent from '@testing-library/user-event'
import { screen, waitFor, within } from '@testing-library/react'
import { patient2Info } from '../../../data/patient.api.data'
import { buildHba1cData } from '../../../data/data-api.data'
import { mockWindowResizer } from '../../../mock/window-resizer.mock'
import { mockPatientApiForPatients } from '../../../mock/patient.api.mock'
import {
  testTrendsDataVisualisationForHCP,
  testTrendsWeekDayFilter
} from '../../../use-cases/patient-data-visualisation'
import { AppUserRoute } from '../../../../../models/enums/routes.enum'
import { getMinimalTrendViewData } from '../../../mock/minimal-trend-view-data'

describe('Trends view for anyone', () => {
  const trendsRoute = AppUserRoute.Trends

  beforeEach(() => {
    mockWindowResizer()
    mockPatientLogin(patient2Info)
    mockPatientApiForPatients()
  })

  describe('with all kind of data', () => {
    it('should render trend page and statistics correctly', async () => {
      mockDataAPI(getMinimalTrendViewData())
      const router = renderPage(trendsRoute)
      await waitFor(() => {
        expect(router.state.location.pathname).toEqual(trendsRoute)
      })

      await testTrendsDataVisualisationForHCP()
      await checkTrendsTidelineContainerTooltips()

      // Check days filtering
      await testTrendsWeekDayFilter()

      // Check the widget
      await checkRangeSelection()
      await checkDaysSelection()

      // Check Layout
      checkTrendsLayout()
      await checkTrendsBolusAndCarbsAverage()

      // Check an information message is provided when there is not data
      await userEvent.click(screen.getByTestId('button-nav-back'))
      expect(await screen.findByText('There is no CGM data for this time period :(')).toBeVisible()

    })
  })

  describe('with cbgs to calculate GMI', () => {
    it('should render correct tooltip and values GMI', async () => {
      mockDataAPI(buildHba1cData())
      renderPage(trendsRoute)

      const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
      await checkGlucoseManagementIndicator('GMI (estimated HbA1c)7.7%')
      await checkStatTooltip(patientStatistics, 'GMI (estimated HbA1c)', GMI_TOOLTIP)
    })
  })

  describe('with time in range data', () => {
    it('should display correct readings in range stats info', async () => {
      mockDataAPI(timeInRangeStatsTrendViewData)
      renderPage(trendsRoute)

      await checkTrendsTimeInRangeStatsWidgets()
      await checkTimeInRangeStatsTitle()
    })
  })

  describe('with smbg data', () => {
    it('should display correct readings in range stats info', async () => {
      mockDataAPI(smbgData)
      renderPage(trendsRoute)

      await checkReadingsInRangeStats()
      await checkSMBGTrendsStatsWidgetsTooltips()

      await checkReadingsInRangeStatsWidgets()
      await checkAverageGlucoseStatWidget('Avg. Glucose (BGM)mg/dL101')
      await checkStandardDeviationStatWidget('Standard Deviation (22-180)mg/dL79')
      await checkCoefficientOfVariationStatWidget('CV (BGM)78%')
    })
  })
})
