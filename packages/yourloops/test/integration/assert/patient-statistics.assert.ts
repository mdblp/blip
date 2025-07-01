/*
 * Copyright (c) 2023-2024, Diabeloop
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

import { screen, within } from '@testing-library/react'
import { checkTooltip } from './stats.assert'

export const checkPatientStatistics = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  checkTooltip(patientStatistics, 'Avg. Daily Time In Range')
  checkTooltip(patientStatistics, 'Standard Deviation')
  checkTooltip(patientStatistics, 'Avg. Glucose (CGM)')
  checkTooltip(patientStatistics, 'Avg. Daily Total Insulin')
  checkTooltip(patientStatistics, 'Avg. Daily Time In Loop Mode')
  checkTooltip(patientStatistics, 'Avg. Daily declared carbs')
  checkTooltip(patientStatistics, 'CV (CGM)')

  expect(patientStatistics.getByTestId('cbg-percentage-bar-chart')).toHaveTextContent('Avg. Daily Time In Range4h 48m20%4h 48m20%4h 48m20%4h 48m20%4h 48m20%<5454-7070-180180-250>250mg/dL')
  expect(patientStatistics.getByTestId('cbg-standard-deviation-stat')).toHaveTextContent('Standard Deviation (30-218)mg/dL94')
  expect(patientStatistics.getByTestId('cbg-mean-stat')).toHaveTextContent('Avg. Glucose (CGM)mg/dL124')
  expect(patientStatistics.getByTestId('container-insulin-stats')).toHaveTextContent('Avg. Daily Total Insulin4 UAvg. Daily Estimated Total Insulin-- UMeal bolus1.9 U47.5%Basal & correction bolus2.1 U52.5%Weight72kgRatio0.06U/kg')
  expect(patientStatistics.getByTestId('loop-mode-stat')).toHaveTextContent('Avg. Daily Time In Loop ModeONOFF91%1m9%6s')
  expect(patientStatistics.getByTestId('total-carbs-stat')).toHaveTextContent('Avg. Daily declared carbs52.8gMeal carbs28.8gRescue carbs24g')
}

export const checkPatientStatisticsWithTwoWeeksOldData = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 4000 }))
  expect(patientStatistics.getByTestId('cbg-percentage-bar-chart')).toHaveTextContent('Avg. Daily Time In Range4h 48m20%4h 48m20%4h 48m20%4h 48m20%4h 48m20%<5454-7070-180180-250>250mg/dL')
  expect(patientStatistics.getByTestId('cbg-standard-deviation-stat')).toHaveTextContent('Standard Deviation (34-214)mg/dL90')
  expect(patientStatistics.getByTestId('cbg-mean-stat')).toHaveTextContent('Avg. Glucose (CGM)mg/dL124')
  expect(patientStatistics.getByTestId('container-insulin-stats')).toHaveTextContent('Avg. Daily Total Insulin4.2 UAvg. Daily Estimated Total Insulin-- UMeal bolus2 U47.6%Basal & correction bolus2.2 U52.4%Weight72kgRatio0.06U/kg')
  expect(patientStatistics.getByTestId('total-carbs-stat')).toHaveTextContent('Avg. Daily declared carbs54.8gMeal carbs29.9gRescue carbs24.9g')
}

export const checkPatientStatisticsNoData = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  checkTooltip(patientStatistics, 'Time In Range')
  checkTooltip(patientStatistics, 'Standard Deviation')
  checkTooltip(patientStatistics, 'Avg. Glucose (CGM)')
  checkTooltip(patientStatistics, 'Avg. Daily Total Insulin')
  checkTooltip(patientStatistics, 'Avg. Daily Time In Loop Mode')
  checkTooltip(patientStatistics, 'Avg. Daily declared carbs')
  checkTooltip(patientStatistics, 'CV (CGM)')

  expect(patientStatistics.getByTestId('cbg-percentage-bar-chart')).toHaveTextContent('Time In Range0m--0m--0m--0m--0m--<5454-7070-180180-250>250mg/dL')
  expect(patientStatistics.getByTestId('cbg-standard-deviation-stat')).toHaveTextContent('Standard Deviationmg/dL--')
  expect(patientStatistics.getByTestId('cbg-mean-stat')).toHaveTextContent('Avg. Glucose (CGM)mg/dL--')
  expect(patientStatistics.getByTestId('container-insulin-stats')).toHaveTextContent('Avg. Daily Total Insulin0 UAvg. Daily Estimated Total Insulin-- UMeal bolus0 U--%Basal & correction bolus0 U--%Weight--kgRatio--U/kg')
  expect(patientStatistics.getByTestId('loop-mode-stat')).toHaveTextContent('Time In Loop ModeONOFFN/AN/A')
  expect(patientStatistics.getByTestId('total-carbs-stat')).toHaveTextContent('Avg. Daily declared carbs--Meal carbs--Rescue carbs--')
}

export const checkPatientStatisticsTrendsView = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  expect(patientStatistics.getByTestId('cbg-percentage-bar-chart')).toHaveTextContent('Avg. Daily Time In Range0m0%14h 24m60%9h 36m40%0m0%0m0%<5454-7070-180180-250>250mg/dL')
  expect(patientStatistics.getByTestId('cbg-standard-deviation-stat')).toHaveTextContent('Standard Deviation (169-197)mg/dL14')
  expect(patientStatistics.getByTestId('sensor-usage-stat')).toHaveTextContent('Sensor Usage0.1%')
  expect(patientStatistics.getByTestId('cbg-mean-stat')).toHaveTextContent('Avg. Glucose (CGM)mg/dL183')
  expect(patientStatistics.getByTestId('container-insulin-stats')).toHaveTextContent('Avg. Daily Total Insulin20.3 UAvg. Daily Estimated Total Insulin-- UMeal bolus1.6 U7.9%Basal & correction bolus14.3 U70.4%Manual bolus4.1 U20.2%Pen bolus0.4 U2%')
  expect(patientStatistics.getByTestId('coefficient-of-variation-stat')).toHaveTextContent('CV (CGM)10%')
  expect(patientStatistics.getByTestId('loop-mode-stat')).toHaveTextContent('Avg. Daily Time In Loop ModeONOFF44%7h 56m56%9h 55m')
  expect(patientStatistics.getByTestId('total-carbs-stat')).toHaveTextContent('Avg. Daily declared carbs134.5gMeal carbs27.5gRescue carbs107g')
}

export const checkPatientStatisticsTrendsViewNoMonday = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  expect(patientStatistics.getByTestId('cbg-percentage-bar-chart')).toHaveTextContent('Avg. Daily Time In Range0m0%12h50%12h50%0m0%0m0%<5454-7070-180180-250>250mg/dL')
  expect(patientStatistics.getByTestId('cbg-standard-deviation-stat')).toHaveTextContent('Standard Deviation (167-199)mg/dL16')
  expect(patientStatistics.getByTestId('sensor-usage-stat')).toHaveTextContent('Sensor Usage0.1%')
  expect(patientStatistics.getByTestId('cbg-mean-stat')).toHaveTextContent('Avg. Glucose (CGM)mg/dL183')
  expect(patientStatistics.getByTestId('container-insulin-stats')).toHaveTextContent('Avg. Daily Total Insulin23.7 UAvg. Daily Estimated Total Insulin-- UMeal bolus1.9 U8%Basal & correction bolus16.7 U70.5%Manual bolus4.8 U20.3%Pen bolus0.4 U1.7%')
  expect(patientStatistics.getByTestId('coefficient-of-variation-stat')).toHaveTextContent('CV (CGM)10%')
  expect(patientStatistics.getByTestId('loop-mode-stat')).toHaveTextContent('Avg. Daily Time In Loop ModeONOFF44%7h 56m56%9h 55m')
  expect(patientStatistics.getByTestId('total-carbs-stat')).toHaveTextContent('Avg. Daily declared carbs108.8gMeal carbs32.1gRescue carbs76.7g')
}
