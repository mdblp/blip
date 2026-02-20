/*
 * Copyright (c) 2026, Diabeloop
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

import { act } from '@testing-library/react'
import { mockPatientLogin } from '../../../mock/patient-login.mock'
import { mockDataAPI } from '../../../mock/data.api.mock'
import { renderPage } from '../../../utils/render'
import { mockWindowResizer } from '../../../mock/window-resizer.mock'
import { AppUserRoute } from '../../../../../models/enums/routes.enum'
import { patient2Info } from '../../../data/patient.api.data'
import { getCompleteDailyViewData } from '../../../mock/complete-daily-view-data'
import {
  testDisplayEffectiveParametersFromHistory,
  testDisplayEffectiveParametersWithAllData,
  testOpenParametersPopover,
  testShowParametersButtonIsDisplayed,
  testShowParametersButtonIsNotDisplayed
} from '../../../use-cases/show-parameters-visualisation'
import { ChangeType, DblParameter, Unit } from 'medical-domain'
// TODO: ask in Review if we should split daily-view-common test file into several independent files
describe('Daily view for anyone - Show Parameters At', () => {
  const dailyRoute = AppUserRoute.Daily

  beforeEach(() => {
    mockWindowResizer()
    mockPatientLogin(patient2Info)
  })

  afterEach(() => {
    window.ResizeObserver = ResizeObserver
    jest.restoreAllMocks()
  })

  describe('when settings are available', () => {
    it('should display Device settings button', async () => {
      mockDataAPI(getCompleteDailyViewData())
      await act(async () => {
        renderPage(dailyRoute)
      })

      await testShowParametersButtonIsDisplayed()
    })

    it('should open device settings popover on button click', async () => {
      mockDataAPI(getCompleteDailyViewData())
      await act(async () => {
        renderPage(dailyRoute)
      })

      await testOpenParametersPopover()
    })

    it('should display all parameters with correct values', async () => {
      const data = getCompleteDailyViewData()
      mockDataAPI(data)
      await act(async () => {
        renderPage(dailyRoute)
      })

      await testDisplayEffectiveParametersWithAllData()
    })

    it('should display current parameters when the target date is after history change', async () => {
      // due to the data build the displayed date is after the history change,
      // but the injected changeDate is 2024-01-01 because the parameters are for 2024 while getCompleteDailyViewData() has a range for 2022 (see dataRange in the fixture).
      // and not the least, the current parameters is at: 2020-01-17T08:00:00.000Z
      // Bref this mismatch makes this test intent unclear however, these dates are everywhere in the test suite. which makes it difficult
      // to fix all the date's data
      // for info the target date is : 2022-08-08T10:00:00.000Z
      const data = getCompleteDailyViewData()
      data.data.pumpSettings[0].payload.history.parameters = [
        { changeDate : '2022-08-07T00:00:00Z', parameters : [{ name: DblParameter.Weight, changeType: ChangeType.Updated, value: '68', unit: Unit.Kilogram, previousValue: '69', previousUnit : Unit.Kilogram, level: 0, effectiveDate: '2022-08-07T00:00:00Z' }] }
      ]

      mockDataAPI(data)
      await act(async () => {
        renderPage(dailyRoute)
      })

      await testDisplayEffectiveParametersFromHistory()
    })
  })

  describe('when settings are missing', () => {
    it('should not display button', async () => {
      const data = getCompleteDailyViewData()
      data.data.pumpSettings[0].payload.parameters = []
      mockDataAPI(data)
      await act(async () => {
        renderPage(dailyRoute)
      })

      await testShowParametersButtonIsNotDisplayed()
    })
  })
})
