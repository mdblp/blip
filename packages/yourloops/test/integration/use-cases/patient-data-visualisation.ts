/*
 * Copyright (c) 2023-2025, Diabeloop
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

import {
  checkPatientStatistics,
  checkPatientStatisticsNoData,
  checkPatientStatisticsTrendsView,
  checkPatientStatisticsTrendsViewNoMonday,
  checkPatientStatisticsWithTwoWeeksOldData
} from '../assert/patient-statistics.assert'
import { checkPatientDashboardLayout, type PatientDashboardLayoutParams } from '../assert/layout.assert'
import {
  checkDeviceUsageWidget,
  checkDeviceUsageWidgetNoData,
  checkDeviceUsageWidgetWithTwoWeeksOldData
} from '../assert/device-usage.assert'
import {
  checkPatientNavBarForPatientAndCaregiver
} from '../assert/patient-nav-bar.assert'
import {
  checkEmptyMedicalFilesWidgetForHcp,
  checkEmptyMedicalFilesWidgetForPatient
} from '../assert/medical-widget.assert'
import { checkMonitoringAlertsCard, checkMonitoringAlertsCardNoData } from '../assert/monitoring-alerts.assert'
import { checkTrendsStatsWidgetsTooltips } from '../assert/trends-view.assert'
import {
  checkDailyStatsWidgetsTooltips,
  checkDailyTidelineContainerTooltipsDblg2,
  checkDailyTidelineContainerTooltipsDBLG2OrRecentSoftware,
  checkDailyTidelineContainerTooltipsMgdl,
  checkDailyTidelineContainerTooltipsMmolL,
  checkDailyTimeInRangeStatsWidgetsMgdl,
  checkDailyTimeInRangeStatsWidgetsMmolL,
  checkDailyViewChartsDblg1,
  checkDailyViewChartsDblg2,
  checkEventsSuperposition,
  checkTotalCarbsStatContent
} from '../assert/daily-view.assert'
import {
  checkAverageGlucoseStatWidget,
  checkStandardDeviationStatWidget,
  checkTimeInRangeStatsTitle,
  checkTotalInsulinStatWidget
} from '../assert/stats.assert'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'

export const testDashboardDataVisualisationForHcp = async (patientDashboardLayoutParams: PatientDashboardLayoutParams) => {
  await checkPatientDashboardLayout(patientDashboardLayoutParams)
  await checkPatientStatistics()
  await checkDeviceUsageWidget()
  await checkMonitoringAlertsCard()
}

export const testDashboardDataVisualisationNoDataForHcp = async () => {
  await checkMonitoringAlertsCardNoData()
}

export const testDashboardDataVisualisationForPatientOrPrivateTeam = async (patientDashboardLayoutParams: PatientDashboardLayoutParams): Promise<void> => {
  await checkPatientDashboardLayout(patientDashboardLayoutParams)
  await checkPatientStatistics()
  await checkDeviceUsageWidget()
}

export const testDashboardDataVisualisationSixteenDaysOldData = async () => {
  await checkPatientStatisticsWithTwoWeeksOldData()
}

export const testDashboardDataVisualisationTwoWeeksOldData = async () => {
  await checkPatientStatisticsWithTwoWeeksOldData()
  await checkDeviceUsageWidgetWithTwoWeeksOldData()
}

export const testDashboardDataVisualisationPrivateTeamNoData = async (patientDashboardLayoutParams: PatientDashboardLayoutParams) => {
  await checkPatientDashboardLayout(patientDashboardLayoutParams)
  await checkPatientStatisticsNoData()
  await checkDeviceUsageWidgetNoData()
}

export const testTrendsDataVisualisationForHCP = async () => {
  await checkPatientStatisticsTrendsView()
  await checkTrendsStatsWidgetsTooltips()
}

export const testPatientNavBarForPatientAndCaregiver = async () => {
  await checkPatientNavBarForPatientAndCaregiver()
}

export const testEmptyMedicalFilesWidgetForPatient = async () => {
  await checkEmptyMedicalFilesWidgetForPatient()
}

export const testEmptyMedicalFilesWidgetForHcp = async () => {
  await checkEmptyMedicalFilesWidgetForHcp()
}

export const testDailyViewTooltipsAndValuesMgdl = async () => {
  await checkTotalCarbsStatContent()

  // Check the tooltips and data on the chart
  await checkDailyTidelineContainerTooltipsMgdl()
  await checkDailyStatsWidgetsTooltips()
  await checkEventsSuperposition()

  // Check the time in range stats widgets
  await checkDailyTimeInRangeStatsWidgetsMgdl()
  await checkTimeInRangeStatsTitle()

  await checkAverageGlucoseStatWidget('Avg. Glucose (CGM)mg/dL101')
  await checkStandardDeviationStatWidget('Standard Deviation (22-180)mg/dL79')
  await checkTotalInsulinStatWidget('Total Delivered Insulin71.2UMeal bolus85.4 %60.8UBasal & correction bolus1.8 %1.3UManual bolus7.2 %5.1UPen bolus5.8 %4.1U')
}

export const testDailyViewChartsDblg1 = () => {
  checkDailyViewChartsDblg1()
}

export const testDailyViewChartsDblg2 = () => {
  checkDailyViewChartsDblg2()
}

export const testDailyViewTooltipsForDblg2 = async () => {
  await checkDailyTidelineContainerTooltipsDBLG2OrRecentSoftware()
  await checkDailyTidelineContainerTooltipsDblg2()
}

export const testDailyViewTooltipsForRecentSoftware = async () => {
  await checkDailyTidelineContainerTooltipsDBLG2OrRecentSoftware()
}

export const testDailyViewTooltipsAndValuesMmolL = async () => {
  await checkTotalCarbsStatContent()

  // Check the tooltips
  await checkDailyTidelineContainerTooltipsMmolL()
  await checkDailyStatsWidgetsTooltips()

  // Check the time in range stats widgets
  await checkDailyTimeInRangeStatsWidgetsMmolL()
  await checkTimeInRangeStatsTitle()

  await checkAverageGlucoseStatWidget('Avg. Glucose (CGM)mmol/L6')
  await checkStandardDeviationStatWidget('(2-10)mmol/L4')
}


export const testTrendsWeekDayFilter = async () => {
  // Start by asserting data before removing Mondays from the stats
  await checkPatientStatisticsTrendsView()
  // Deactivate Monday
  await userEvent.click(screen.getByTestId('day-filter-monday'))
  await checkPatientStatisticsTrendsViewNoMonday()
  // Reactivate Monday
  await userEvent.click(screen.getByTestId('day-filter-monday'))
}
