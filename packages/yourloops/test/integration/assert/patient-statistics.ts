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

import { screen, within } from '@testing-library/react'
import { checkTooltip } from './stats'

export const checkPatientStatistics = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  checkTooltip(patientStatistics, 'Time In Range')
  checkTooltip(patientStatistics, 'Standard Deviation')
  checkTooltip(patientStatistics, 'Avg. Glucose (CGM)')
  checkTooltip(patientStatistics, 'Avg. Daily Insulin')
  checkTooltip(patientStatistics, 'Avg. Daily Time In Loop Mode')
  checkTooltip(patientStatistics, 'Avg. Daily Carbs')
  checkTooltip(patientStatistics, 'CV (CGM)')

  expect(patientStatistics.getByTestId('cbg-percentage-bar-chart')).toHaveTextContent('Time In Range2h8%10h42%6h25%4h17%2h8%<5454-7070-180180-250>250mg/dL')
  expect(patientStatistics.getByTestId('cbg-standard-deviation-stat')).toHaveTextContent('Standard Deviation (61-209)mg/dL74')
  expect(patientStatistics.getByTestId('cbg-mean-stat')).toHaveTextContent('Avg. Glucose (CGM)mg/dL135')
  expect(patientStatistics.getByTestId('stat-averageDailyDose')).toHaveTextContent('Avg. Daily Insulin1.3UWeight72kgDaily Dose ÷ Weight0.02U/kg')
  expect(patientStatistics.getByTestId('loop-mode-stat')).toHaveTextContent('Avg. Daily Time In Loop ModeONOFF91%21h 49m9%2h 11m')
  expect(patientStatistics.getByTestId('total-carbs-stat')).toHaveTextContent('Avg. Daily Carbs55gRescue carbs10g')
  expect(patientStatistics.getByTestId('sensor-usage-stat')).toHaveTextContent('Sensor Usage1%')
}

export const checkPatientStatisticsNoData = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  checkTooltip(patientStatistics, 'Time In Range')
  checkTooltip(patientStatistics, 'Standard Deviation')
  checkTooltip(patientStatistics, 'Avg. Glucose (CGM)')
  checkTooltip(patientStatistics, 'Avg. Daily Insulin')
  checkTooltip(patientStatistics, 'Avg. Daily Time In Loop Mode')
  checkTooltip(patientStatistics, 'Avg. Daily Carbs')
  checkTooltip(patientStatistics, 'CV (CGM)')

  expect(patientStatistics.getByTestId('cbg-percentage-bar-chart')).toHaveTextContent('Time In Range0m--0m--0m--0m--0m--<5454-7070-180180-250>250mg/dL')
  expect(patientStatistics.getByTestId('cbg-standard-deviation-stat')).toHaveTextContent('Standard Deviationmg/dL--')
  expect(patientStatistics.getByTestId('cbg-mean-stat')).toHaveTextContent('Avg. Glucose (CGM)mg/dL--')
  expect(patientStatistics.getByTestId('stat-averageDailyDose')).toHaveTextContent('Avg. Daily Insulin0.0UWeight72kgDaily Dose ÷ Weight--U/kg')
  expect(patientStatistics.getByTestId('loop-mode-stat')).toHaveTextContent('Avg. Daily Time In Loop ModeONOFFN/AN/A')
  expect(patientStatistics.getByTestId('total-carbs-stat')).toHaveTextContent('Avg. Daily Carbs0gRescue carbs0g')
  expect(patientStatistics.getByTestId('sensor-usage-stat')).toHaveTextContent('Sensor Usage0%')
}
