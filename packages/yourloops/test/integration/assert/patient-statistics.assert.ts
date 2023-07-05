/*
 * Copyright (c) 2023, Diabeloop
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

import { logDOM, screen, within } from '@testing-library/react'
import { checkTooltip } from './stats.assert'

export const checkPatientStatistics = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  checkTooltip(patientStatistics, 'Avg. Daily Time In Range')
  checkTooltip(patientStatistics, 'Standard Deviation')
  checkTooltip(patientStatistics, 'Avg. Glucose (CGM)')
  checkTooltip(patientStatistics, 'Avg. Daily Total Insulin')
  checkTooltip(patientStatistics, 'Avg. Daily Time In Loop Mode')
  checkTooltip(patientStatistics, 'Avg. Daily Carbs')
  checkTooltip(patientStatistics, 'CV (CGM)')

  expect(patientStatistics.getByTestId('cbg-percentage-bar-chart')).toHaveTextContent('Avg. Daily Time In Range4h 48m20%4h 48m20%4h 48m20%4h 48m20%4h 48m20%<5454-7070-180180-250>250mg/dL')
  expect(patientStatistics.getByTestId('cbg-standard-deviation-stat')).toHaveTextContent('Standard Deviation (24-224)mg/dL100')
  expect(patientStatistics.getByTestId('cbg-mean-stat')).toHaveTextContent('Avg. Glucose (CGM)mg/dL124')
  expect(patientStatistics.getByTestId('container-insulin-stats')).toHaveTextContent('Avg. Daily Total Insulin5.4UBolus1 U19%Basal4.4 U81%Weight72kgRatio Dose0.08U/kg')
  expect(patientStatistics.getByTestId('loop-mode-stat')).toHaveTextContent('Avg. Daily Time In Loop ModeONOFF91%2m9%14s')
  expect(patientStatistics.getByTestId('total-carbs-stat')).toHaveTextContent('Avg. Daily Carbs28gRescue carbs13g')
  expect(patientStatistics.getByTestId('sensor-usage-stat')).toHaveTextContent('Sensor Usage1%')
}

export const checkPatientStatisticsWithTwoWeeksOldData = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 4000 }))
  expect(patientStatistics.getByTestId('cbg-percentage-bar-chart')).toHaveTextContent('Avg. Daily Time In Range4h 48m20%4h 48m20%4h 48m20%4h 48m20%4h 48m20%<5454-7070-180180-250>250mg/dL')
  expect(patientStatistics.getByTestId('cbg-standard-deviation-stat')).toHaveTextContent('Standard Deviation (34-214)mg/dL90')
  expect(patientStatistics.getByTestId('cbg-mean-stat')).toHaveTextContent('Avg. Glucose (CGM)mg/dL124')
  expect(patientStatistics.getByTestId('container-insulin-stats')).toHaveTextContent('Avg. Daily Total Insulin10.8UBolus2 U19%Basal8.8 U81%Weight72kgRatio Dose0.15U/kg')
  expect(patientStatistics.getByTestId('loop-mode-stat')).toHaveTextContent('Avg. Daily Time In Loop ModeONOFF91%5m9%28s')
  expect(patientStatistics.getByTestId('total-carbs-stat')).toHaveTextContent('Avg. Daily Carbs55gRescue carbs25g')
  expect(patientStatistics.getByTestId('sensor-usage-stat')).toHaveTextContent('Sensor Usage2%')
}

export const checkPatientStatisticsNoData = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  logDOM(await screen.findByTestId('patient-statistics'), 8000000)
  checkTooltip(patientStatistics, 'Time In Range')
  checkTooltip(patientStatistics, 'Standard Deviation')
  checkTooltip(patientStatistics, 'Avg. Glucose (CGM)')
  checkTooltip(patientStatistics, 'Avg. Daily Total Insulin')
  checkTooltip(patientStatistics, 'Avg. Daily Time In Loop Mode')
  checkTooltip(patientStatistics, 'Avg. Daily Carbs')
  checkTooltip(patientStatistics, 'CV (CGM)')

  expect(patientStatistics.getByTestId('cbg-percentage-bar-chart')).toHaveTextContent('Time In Range0m--0m--0m--0m--0m--<5454-7070-180180-250>250mg/dL')
  expect(patientStatistics.getByTestId('cbg-standard-deviation-stat')).toHaveTextContent('Standard Deviationmg/dL--')
  expect(patientStatistics.getByTestId('cbg-mean-stat')).toHaveTextContent('Avg. Glucose (CGM)mg/dL--')
  expect(patientStatistics.getByTestId('container-insulin-stats')).toHaveTextContent('Avg. Daily Total Insulin0UBolus0 U--%Basal0 U--%Weight--kgRatio Dose--U/kg')
  expect(patientStatistics.getByTestId('loop-mode-stat')).toHaveTextContent('Avg. Daily Time In Loop ModeONOFFN/AN/A')
  expect(patientStatistics.getByTestId('total-carbs-stat')).toHaveTextContent('Avg. Daily Carbs--Rescue carbs--')
  expect(patientStatistics.getByTestId('sensor-usage-stat')).toHaveTextContent('Sensor Usage0%')
}
