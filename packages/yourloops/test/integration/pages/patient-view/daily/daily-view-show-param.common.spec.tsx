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
  testDisplayEffectiveParametersBeforeHistory,
  testDisplayEffectiveParametersFromHistory,
  testDisplayEffectiveParametersWithAllData,
  testOpenParametersPopover,
  testShowParametersButtonIsDisplayed,
  testShowParametersButtonIsNotDisplayed
} from '../../../use-cases/show-parameters-visualisation'
import { ChangeType, Unit } from 'medical-domain'
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

    it('should display original parameters when date is before history change', async () => {
      const data = getCompleteDailyViewData()
      data.data.pumpSettings[0].payload.parameters = [
        { name: 'WEIGHT', value: '70', unit: Unit.Kilogram, level: 0, effectiveDate: '2024-01-01T00:00:00Z' }
      ]

      mockDataAPI(data)
      await act(async () => {
        renderPage(dailyRoute)
      })

      await testDisplayEffectiveParametersBeforeHistory()
    })

    it('should display original parameters when date is after history change', async () => {
      const data = getCompleteDailyViewData()
      data.data.pumpSettings[0].payload.history.parameters = [
        { changeDate : '2024-01-01T00:00:00Z', parameters : [{ name: 'WEIGHT', changeType: ChangeType.Updated, value: '72', unit: Unit.Kilogram, previousValue: '69', previousUnit : Unit.Kilogram, level: 0, effectiveDate: '2024-01-01T00:00:00Z' }] }
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
