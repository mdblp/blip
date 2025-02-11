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
import { checkSMBGDailyStatsWidgetsTooltips } from '../../../assert/daily-view.assert'
import { mockDataAPI, smbgData, twoWeeksOfCbg } from '../../../mock/data.api.mock'
import { renderPage } from '../../../utils/render'
import {
  checkAverageGlucoseStatWidget,
  checkReadingsInRangeStatsWidgets,
  checkStandardDeviationStatWidget
} from '../../../assert/stats.assert'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import dayjs from 'dayjs'
import { weekArrayPlugin, weekdaysPlugin } from '../../../../../lib/dayjs'
import * as constants from '../../../../../../viz/src/modules/print/utils/constants'
import DataApi from '../../../../../lib/data/data.api'
import { User } from '../../../../../lib/auth'
import { when } from 'jest-when'
import { patient2AsTeamMember } from '../../../data/patient.api.data'
import { mockWindowResizer } from '../../../mock/window-resizer.mock'
import { AppUserRoute } from '../../../../../models/enums/routes.enum'
import {
  testDailyViewTooltipsAndValuesMgdl,
  testDailyViewTooltipsForDBLG2OrRecentSoftware
} from '../../../use-cases/patient-data-visualisation'
import { getCompleteDailyViewData } from '../../../mock/complete-daily-view-data'
import { t } from '../../../../../lib/language'
import { checkReportDialogPresets } from '../../../assert/report-dialog.assert'

describe('Daily view for anyone', () => {
  const dailyRoute = AppUserRoute.Daily

  beforeEach(() => {
    mockWindowResizer()
    mockPatientLogin(patient2AsTeamMember)
  })

  afterEach(() => {
    window.ResizeObserver = ResizeObserver
    jest.restoreAllMocks()
  })

  describe('with all kind of data', () => {
    it('should render correct tooltips and values', async () => {
      mockDataAPI()
      const router = renderPage(dailyRoute)
      await waitFor(() => {
        expect(router.state.location.pathname).toEqual(dailyRoute)
      })

      await testDailyViewTooltipsAndValuesMgdl()
    })
  })

  describe('with DBLG2 device', () => {
    it('should render correct tooltips and values', async () => {
      mockDataAPI(getCompleteDailyViewData("DBLG2", "1.1.0"))
      const router = renderPage(dailyRoute)
      await waitFor(() => {
        expect(router.state.location.pathname).toEqual(dailyRoute)
      })

      await testDailyViewTooltipsForDBLG2OrRecentSoftware()
    })
  })

  describe('with recent software version device (>1.17)', () => {
    it('should render correct tooltips and values', async () => {
      mockDataAPI(getCompleteDailyViewData("DBLG1", "1.17"))
      const router = renderPage(dailyRoute)
      await waitFor(() => {
        expect(router.state.location.pathname).toEqual(dailyRoute)
      })

      await testDailyViewTooltipsForDBLG2OrRecentSoftware()
    })
  })

  describe('with 2 weeks of data', () => {
    it('should generate CSV or PDF properly', async () => {
      dayjs.extend(weekArrayPlugin)
      dayjs.extend(weekdaysPlugin)

      const downloadLinkElement = {
        click: jest.fn(),
        remove: jest.fn(),
        download: '',
        href: ''
      }

      // This is a base64 encoded image
      constants.Images.logo = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA='
      constants.Images.siteChangeCannulaImage = 'fakeImage'
      constants.Images.siteChangeReservoirImage = 'fakeImage'
      constants.Images.siteChangeTubingImage = 'fakeImage'
      constants.Images.siteChangeReservoirDiabeloopImage = 'fakeImage'

      mockDataAPI(twoWeeksOfCbg)

      const httpGetSpy = jest.spyOn(DataApi, 'exportData').mockResolvedValue({ Data : {} as Blob, Name : 'report.zip' })
      renderPage(dailyRoute)

      const generateReportButton = await screen.findByText('Download report')
      expect(generateReportButton).toBeVisible()

      await userEvent.click(screen.getByText('Download report'))

      checkReportDialogPresets()

      const createElementSpy = jest.spyOn(document, 'createElement')
      const appendChildSpy = jest.spyOn(document.body, 'appendChild')

      when(createElementSpy).calledWith('a').mockReturnValueOnce(downloadLinkElement as unknown as HTMLElement)
      when(appendChildSpy).calledWith(downloadLinkElement).mockReturnValueOnce(null)
      const generateReportDialogFirstPdf = within(screen.getByRole('dialog'))
      await userEvent.click(generateReportDialogFirstPdf.getByText('Download'))

      // This checks that we tried to generate a pdf
      expect(downloadLinkElement.download).toEqual(`yourloops-report-${patient2AsTeamMember.userId}.pdf`)
      expect(downloadLinkElement.href.length).toBeGreaterThan(17480)
      expect(downloadLinkElement.href.length).toBeLessThan(18000)
      expect(downloadLinkElement.click).toHaveBeenCalledTimes(1)

      await userEvent.click(screen.getByText('Download report'))
      const generateReportDialogFirstCsv = within(screen.getByRole('dialog'))
      await userEvent.click(generateReportDialogFirstCsv.getByRole('radio', { name: 'CSV' }))
      await userEvent.click(generateReportDialogFirstCsv.getByRole('button', { name: '2 weeks' }))
      expect(generateReportDialogFirstCsv.getByTestId('button-calendar-day-2020-01-01')).toHaveAttribute('aria-selected', 'false')
      expect(generateReportDialogFirstCsv.getByTestId('button-calendar-day-2020-01-02')).toHaveAttribute('aria-selected', 'true')
      expect(generateReportDialogFirstCsv.getByTestId('button-calendar-day-2020-01-15')).toHaveAttribute('aria-selected', 'true')

      when(createElementSpy).calledWith('a').mockReturnValueOnce(downloadLinkElement as unknown as HTMLElement)
      when(appendChildSpy).calledWith(downloadLinkElement).mockReturnValueOnce(null)

      await userEvent.click(generateReportDialogFirstCsv.getByText('Download'))

      // This checks for CSV generation
      expect(downloadLinkElement.download).toEqual(`report.zip`)
      expect(downloadLinkElement.click).toHaveBeenCalledTimes(2)
      expect(httpGetSpy).toHaveBeenCalledWith(expect.any(User), patient2AsTeamMember.userId, '2020-01-02T00:00:00.000Z', '2020-01-15T23:59:59.999Z')
    })

    it('should display an alert when CSV report generation failed', async () => {
      dayjs.extend(weekArrayPlugin)
      dayjs.extend(weekdaysPlugin)

      const downloadLinkElement = {
        click: jest.fn(),
        remove: jest.fn(),
        download: '',
        href: ''
      }

      mockDataAPI(twoWeeksOfCbg)

      const httpGetSpy = jest.spyOn(DataApi, 'exportData').mockRejectedValue(new Error(t('error-http-40x')))
      renderPage(dailyRoute)

      const generateReportButton = await screen.findByText('Download report')
      expect(generateReportButton).toBeVisible()

      await userEvent.click(screen.getByText('Download report'))

      checkReportDialogPresets()

      const createElementSpy = jest.spyOn(document, 'createElement')
      const appendChildSpy = jest.spyOn(document.body, 'appendChild')

      when(createElementSpy).calledWith('a').mockReturnValueOnce(downloadLinkElement as unknown as HTMLElement)
      when(appendChildSpy).calledWith(downloadLinkElement).mockReturnValueOnce(null)

      const generateReportDialog = within(screen.getByRole('dialog'))
      await userEvent.click(generateReportDialog.getByRole('radio', { name: 'CSV' }))
      await userEvent.click(generateReportDialog.getByRole('button', { name: '2 weeks' }))

      expect(generateReportDialog.getByTestId('button-calendar-day-2020-01-01')).toHaveAttribute('aria-selected', 'false')
      expect(generateReportDialog.getByTestId('button-calendar-day-2020-01-02')).toHaveAttribute('aria-selected', 'true')
      expect(generateReportDialog.getByTestId('button-calendar-day-2020-01-15')).toHaveAttribute('aria-selected', 'true')

      when(createElementSpy).calledWith('a').mockReturnValueOnce(downloadLinkElement as unknown as HTMLElement)
      when(appendChildSpy).calledWith(downloadLinkElement).mockReturnValueOnce(null)

      await userEvent.click(generateReportDialog.getByText('Download'))

      // This checks for CSV generation
      expect(httpGetSpy).toHaveBeenCalledWith(expect.any(User), patient2AsTeamMember.userId, '2020-01-02T00:00:00.000Z', '2020-01-15T23:59:59.999Z')
      expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('An error occurred. Please contact support for assistance')

    })
  })

  describe('with smbg data', () => {
    it('should display correct stats widgets', async () => {
      mockDataAPI(smbgData)
      renderPage(dailyRoute)

      await checkReadingsInRangeStatsWidgets()

      await checkAverageGlucoseStatWidget('Avg. Glucose (BGM)mg/dL101')
      await checkStandardDeviationStatWidget('Standard Deviation (22-180)mg/dL79')

      await checkSMBGDailyStatsWidgetsTooltips()
    })
  })
})
