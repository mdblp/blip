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

import { mockPatientLogin } from '../../mock/auth'
import { unMonitoredPatient } from '../../mock/mockPatientAPI'
import {
  checkDailyStatsWidgetsTooltips,
  checkDailyTidelineContainerTooltips,
  checkDailyTimeInRangeStatsWidgets, checkSMBGDailyStatsWidgetsTooltips
} from '../../assert/daily'
import { mockDataAPI, smbgData } from '../../mock/mockDataAPI'
import { renderPage } from '../../utils/render'
import {
  checkReadingsInRangeStatsWidgets,
  checkAverageGlucoseStatWidget,
  checkStandardDeviationStatWidget,
  checkTimeInRangeStatsTitle
} from '../../assert/stats'
import { screen } from '@testing-library/react'

jest.setTimeout(20000)

describe('Daily view for anyone', () => {
  beforeAll(() => {
    mockPatientLogin(unMonitoredPatient)
  })

  describe('with all kind of data', () => {
    it('should render correct tooltips and values', async () => {
      mockDataAPI()
      renderPage('/daily')

      // Check the tooltips
      await checkDailyTidelineContainerTooltips()
      await checkDailyStatsWidgetsTooltips()

      // Check the time in range stats widgets
      checkDailyTimeInRangeStatsWidgets()
      checkTimeInRangeStatsTitle()

      checkAverageGlucoseStatWidget('Avg. Glucose (CGM)mg/dL101')
      checkStandardDeviationStatWidget('Standard Deviation ( 22 - 180 )mg/dL79')
    })
  })

  describe('with smbg data', () => {
    it('should display correct stats widgets', async () => {
      mockDataAPI(smbgData)
      renderPage('/daily')

      await checkReadingsInRangeStatsWidgets()

      checkAverageGlucoseStatWidget('Avg. Glucose (BGM)mg/dL101')
      expect(screen.queryByTestId('cbg-standard-deviation-stat')).not.toBeInTheDocument()

      await checkSMBGDailyStatsWidgetsTooltips()
    })
  })
})
