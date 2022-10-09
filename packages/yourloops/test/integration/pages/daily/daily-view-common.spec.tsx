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
  checkDailyTimeInRangeStatsWidgets
} from '../../assert/daily'
import { mockDataAPI, smbgData } from '../../mock/mockDataAPI'
import { renderPage } from '../../utils/render'
import {
  checkReadingsInRangeStatsTitle,
  checkReadingsInRangeStatsWidgets,
  checkTimeInRangeStatsTitle
} from '../../assert/stats'

jest.setTimeout(10000)

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
      checkDailyStatsWidgetsTooltips()

      // Check the time in range stats widgets
      checkDailyTimeInRangeStatsWidgets()
      checkTimeInRangeStatsTitle()
    })
  })

  describe('with smbg data', () => {
    it('should display correct readings in range stats info', async () => {
      mockDataAPI(smbgData)
      renderPage('/daily')

      await checkReadingsInRangeStatsWidgets()
      checkReadingsInRangeStatsTitle()
    })
  })
})
