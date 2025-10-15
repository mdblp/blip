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

import { screen, within } from '@testing-library/react'
import { checkTooltip } from './stats.assert'
import { getTranslation } from "../../utils/i18n"

export const checkPatientStatistics = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  checkTooltip(patientStatistics, 'Time In Range')
  checkTooltip(patientStatistics, 'Standard Deviation')
  checkTooltip(patientStatistics, 'Avg. Glucose (CGM)')
  checkTooltip(patientStatistics, getTranslation('average-daily-total-insulin'))
  checkTooltip(patientStatistics, getTranslation('stimated-total-insulin'))
  checkTooltip(patientStatistics, 'Time In Loop Mode')
  checkTooltip(patientStatistics, 'Total Carbs')
  checkTooltip(patientStatistics, 'CV (CGM)')

  expect(patientStatistics.getByTestId('time-in-range-chart')).toHaveTextContent('Time In Range5m20%5m20%5m20%5m20%5m20%<5454-7070-180180-250>250mg/dL')
  expect(patientStatistics.getByTestId('time-in-tight-range-chart')).toHaveTextContent('Time In Tight Range5m20%70-140mg/dL')
  expect(patientStatistics.getByTestId('cbg-standard-deviation-stat')).toHaveTextContent('Standard Deviation (24-224)mg/dL100')
  expect(patientStatistics.getByTestId('average-glucose-stat')).toHaveTextContent('Avg. Glucose (CGM)mg/dL124')
  expect(patientStatistics.getByTestId('container-insulin-stats')).toHaveTextContent('Total Delivered Insulin4.2UMeal bolus47.6 %2UBasal & correction bolus52.4 %2.2UEst. avg. daily insulin requirement--Weight72kgRatio0.06U/kg')
  expect(patientStatistics.getByTestId('loop-mode-stat')).toHaveTextContent('Time In Loop ModeONOFF91%1m9%7s')
  expect(patientStatistics.getByTestId('total-carbs-stat')).toHaveTextContent('Total Carbs55gMeal carbs30gRescue carbs25g')
}

export const checkPatientStatisticsWithTwoWeeksOldData = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 4000 }))
  expect(patientStatistics.getByTestId('time-in-range-chart')).toHaveTextContent('Time In Range4h 48m20%4h 48m20%4h 48m20%4h 48m20%4h 48m20%<5454-7070-180180-250>250mg/dL')
  expect(patientStatistics.getByTestId('time-in-tight-range-chart')).toHaveTextContent('Time In Tight Range4h 48m20%70-140mg/dL')
  expect(patientStatistics.getByTestId('cbg-standard-deviation-stat')).toHaveTextContent('Standard Deviation (34-214)mg/dL90')
  expect(patientStatistics.getByTestId('average-glucose-stat')).toHaveTextContent('Avg. Glucose (CGM)mg/dL124')
  expect(patientStatistics.getByTestId('container-insulin-stats')).toHaveTextContent('Total Delivered Insulin4.2UMeal bolus47.6 %2UBasal & correction bolus52.4 %2.2UEst. avg. daily insulin requirement--Weight72kgRatio0.06U/kg')
  expect(patientStatistics.getByTestId('total-carbs-stat')).toHaveTextContent('Total Carbs55gMeal carbs30gRescue carbs25g')
}

export const checkPatientStatisticsNoData = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  checkTooltip(patientStatistics, 'Time In Range')
  checkTooltip(patientStatistics, 'Standard Deviation')
  checkTooltip(patientStatistics, 'Avg. Glucose (CGM)')
  checkTooltip(patientStatistics, getTranslation('total-insulin'))
  checkTooltip(patientStatistics, getTranslation('estimated-total-insulin'))
  checkTooltip(patientStatistics, 'Time In Loop Mode')
  checkTooltip(patientStatistics, 'Total Carbs')
  checkTooltip(patientStatistics, 'CV (CGM)')

  expect(patientStatistics.getByTestId('time-in-range-chart')).toHaveTextContent('Time In Range0m--0m--0m--0m--0m--<5454-7070-180180-250>250mg/dL')
  expect(patientStatistics.getByTestId('time-in-tight-range-chart')).toHaveTextContent('Time In Tight Range0m--70-140mg/dL')
  expect(patientStatistics.getByTestId('cbg-standard-deviation-stat')).toHaveTextContent('Standard Deviationmg/dL--')
  expect(patientStatistics.getByTestId('average-glucose-stat')).toHaveTextContent('Avg. Glucose (CGM)mg/dL--')
  expect(patientStatistics.getByTestId('container-insulin-stats')).toHaveTextContent('Total Delivered Insulin--Meal bolus-- %0UBasal & correction bolus-- %0UEst. avg. daily insulin requirement--Weight--Ratio--')
  expect(patientStatistics.getByTestId('loop-mode-stat')).toHaveTextContent('Time In Loop ModeONOFFN/AN/A')
  expect(patientStatistics.getByTestId('total-carbs-stat')).toHaveTextContent('Total Carbs--Meal carbs--Rescue carbs--')
}

export const checkPatientStatisticsTrendsView = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  expect(patientStatistics.getByTestId('time-in-range-chart')).toHaveTextContent('Time In Range0m0%14h 24m60%9h 36m40%0m0%0m0%<5454-7070-180180-250>250mg/dL')
  expect(patientStatistics.getByTestId('time-in-tight-range-chart')).toHaveTextContent('Time In Tight Range0m0%70-140mg/dL')
  expect(patientStatistics.getByTestId('cbg-standard-deviation-stat')).toHaveTextContent('Standard Deviation (169-197)mg/dL14')
  expect(patientStatistics.getByTestId('sensor-usage-stat')).toHaveTextContent('Sensor Usage0.1%')
  expect(patientStatistics.getByTestId('average-glucose-stat')).toHaveTextContent('Avg. Glucose (CGM)mg/dL183')
  expect(patientStatistics.getByTestId('container-insulin-stats')).toHaveTextContent('Total Delivered Insulin20.3UMeal bolus7.9 %1.6UBasal & correction bolus70.4 %14.3UManual bolus20.2 %4.1UPen bolus2 %0.4UEst. avg. daily insulin requirement--')
  expect(patientStatistics.getByTestId('coefficient-of-variation-stat')).toHaveTextContent('CV (CGM)10%')
  expect(patientStatistics.getByTestId('loop-mode-stat')).toHaveTextContent('Time In Loop ModeONOFF44%7h 56m56%9h 55m')
  expect(patientStatistics.getByTestId('total-carbs-stat')).toHaveTextContent('Total Carbs134.5gMeal carbs27.5gRescue carbs107g')
}

export const checkPatientStatisticsTrendsViewNoMonday = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  expect(patientStatistics.getByTestId('time-in-range-chart')).toHaveTextContent('Time In Range0m0%12h50%12h50%0m0%0m0%<5454-7070-180180-250>250mg/dL')
  expect(patientStatistics.getByTestId('time-in-tight-range-chart')).toHaveTextContent('Time In Tight Range0m0%70-140mg/dL')
  expect(patientStatistics.getByTestId('cbg-standard-deviation-stat')).toHaveTextContent('Standard Deviation (167-199)mg/dL16')
  expect(patientStatistics.getByTestId('sensor-usage-stat')).toHaveTextContent('Sensor Usage0.1%')
  expect(patientStatistics.getByTestId('average-glucose-stat')).toHaveTextContent('Avg. Glucose (CGM)mg/dL183')
  expect(patientStatistics.getByTestId('container-insulin-stats')).toHaveTextContent('Total Delivered Insulin23.7UMeal bolus8 %1.9UBasal & correction bolus70.5 %16.7UManual bolus20.3 %4.8UPen bolus1.7 %0.4UEst. avg. daily insulin requirement--')
  expect(patientStatistics.getByTestId('coefficient-of-variation-stat')).toHaveTextContent('CV (CGM)10%')
  expect(patientStatistics.getByTestId('loop-mode-stat')).toHaveTextContent('Time In Loop ModeONOFF44%7h 56m56%9h 55m')
  expect(patientStatistics.getByTestId('total-carbs-stat')).toHaveTextContent('Total Carbs108.8gMeal carbs32.1gRescue carbs76.7g')
}
