/*
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
import { unmonitoredPatient, unmonitoredPatientId } from '../../mock/mockPatientAPI'
import {
  checkDailyStatsWidgetsTooltips,
  checkDailyTidelineContainerTooltips,
  checkDailyTimeInRangeStatsWidgets,
  checkSMBGDailyStatsWidgetsTooltips
} from '../../assert/daily'
import { mockDataAPI, smbgData, twoWeeksOfCbg } from '../../mock/mockDataAPI'
import { renderPage } from '../../utils/render'
import {
  checkAverageGlucoseStatWidget,
  checkReadingsInRangeStatsWidgets,
  checkStandardDeviationStatWidget,
  checkTimeInRangeStatsTitle
} from '../../assert/stats'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import dayjs from 'dayjs'
import { weekArrayPlugin, weekdaysPlugin } from '../../../../lib/dayjs'
import * as constants from '../../../../../viz/src/modules/print/utils/constants'
import DataApi from '../../../../lib/data/data.api'
import { User } from '../../../../lib/auth'

describe('Daily view for anyone', () => {
  beforeAll(() => {
    mockPatientLogin(unmonitoredPatient)
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
      await checkTimeInRangeStatsTitle()

      checkAverageGlucoseStatWidget('Avg. Glucose (CGM)mg/dL101')
      checkStandardDeviationStatWidget('Standard Deviation (22-180)mg/dL79')
    })
  })

  describe('with 2 weeks of data', () => {
    it('should generate CSV or PDF properly', async () => {
      dayjs.extend(weekArrayPlugin)
      dayjs.extend(weekdaysPlugin)

      // This is a base64 encoded image
      constants.Images.logo = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA='
      constants.Images.siteChangeCannulaImage = 'fakeImage'
      constants.Images.siteChangeReservoirImage = 'fakeImage'
      constants.Images.siteChangeTubingImage = 'fakeImage'
      constants.Images.siteChangeReservoirDiabeloopImage = 'fakeImage'

      mockDataAPI(twoWeeksOfCbg)
      const windowOpenMock = jest.fn().mockReturnValue(null)
      window.open = windowOpenMock
      const httpGetSpy = jest.spyOn(DataApi, 'exportData').mockResolvedValue('')

      renderPage('/daily')

      const generateReportButton = await screen.findByText('Generate report')
      expect(generateReportButton).toBeVisible()

      await userEvent.click(screen.getByText('Generate report'))

      const generateReportDialogFirstPdf = within(screen.getByRole('dialog'))
      expect(generateReportDialogFirstPdf.getByText('Generate report')).toBeVisible()
      expect(generateReportDialogFirstPdf.getByText('Choose a fixed period')).toBeVisible()
      expect(generateReportDialogFirstPdf.getByRole('button', { name: '1 week' })).toHaveAttribute('aria-selected', 'true')
      expect(generateReportDialogFirstPdf.getByRole('button', { name: '2 weeks' })).toHaveAttribute('aria-selected', 'false')
      expect(generateReportDialogFirstPdf.getByRole('button', { name: '4 weeks' })).toHaveAttribute('aria-selected', 'false')
      expect(generateReportDialogFirstPdf.getByRole('button', { name: '3 months' })).toHaveAttribute('aria-selected', 'false')
      expect(generateReportDialogFirstPdf.getByText('or a customized period')).toBeVisible()
      expect(generateReportDialogFirstPdf.getByTestId('button-calendar-day-2020-01-15')).toHaveAttribute('aria-selected', 'true')
      expect(generateReportDialogFirstPdf.getByTestId('button-calendar-day-2020-01-09')).toHaveAttribute('aria-selected', 'true')
      expect(generateReportDialogFirstPdf.getByTestId('button-calendar-day-2020-01-08')).toHaveAttribute('aria-selected', 'false')
      expect(generateReportDialogFirstPdf.getByText('Choose an output format')).toBeVisible()
      expect(generateReportDialogFirstPdf.getByRole('radio', { name: 'PDF' })).toBeChecked()
      expect(generateReportDialogFirstPdf.getByRole('radio', { name: 'CSV' })).not.toBeChecked()
      expect(generateReportDialogFirstPdf.getByText('Cancel')).toBeVisible()

      await userEvent.click(generateReportDialogFirstPdf.getByText('Generate'))
      // This checks that we tried to generate a pdf
      await waitFor(() => expect(windowOpenMock).toBeCalled())

      await userEvent.click(screen.getByText('Generate report'))
      const generateReportDialogFirstCsv = within(screen.getByRole('dialog'))
      await userEvent.click(generateReportDialogFirstCsv.getByRole('radio', { name: 'CSV' }))
      await userEvent.click(generateReportDialogFirstCsv.getByRole('button', { name: '2 weeks' }))
      expect(generateReportDialogFirstCsv.getByTestId('button-calendar-day-2020-01-01')).toHaveAttribute('aria-selected', 'false')
      expect(generateReportDialogFirstCsv.getByTestId('button-calendar-day-2020-01-02')).toHaveAttribute('aria-selected', 'true')
      expect(generateReportDialogFirstCsv.getByTestId('button-calendar-day-2020-01-15')).toHaveAttribute('aria-selected', 'true')

      await userEvent.click(generateReportDialogFirstCsv.getByText('Generate'))
      // This checks for CSV generation
      expect(httpGetSpy).toHaveBeenCalledWith(expect.any(User), unmonitoredPatientId, '2020-01-02T00:00:00.000Z', '2020-01-15T23:59:59.999Z')
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
