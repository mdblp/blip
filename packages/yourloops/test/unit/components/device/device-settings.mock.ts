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

import { type ParametersChange, type PumpSettingsParameter } from 'medical-domain'

export const history = [
  {
    changeDate: '2022-08-16T15:31:41.611Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2022-08-16T15:25:23.488Z',
        level: 1,
        name: 'LARGE_MEAL_BREAKFAST',
        unit: 'g',
        previousUnit: 'g',
        previousValue: '63.0',
        value: '54.0'
      },
      {
        changeType: 'updated',
        effectiveDate: '2022-08-16T15:25:23.472Z',
        level: 1,
        name: 'WEIGHT',
        unit: 'kg',
        previousUnit: 'kg',
        previousValue: '90.0',
        value: '87.0'
      }
    ]
  },
  {
    changeDate: '2021-08-15T08:50:51.611Z',
    parameters: [
      {
        changeType: 'added',
        effectiveDate: '2021-08-15T08:50:51.452Z',
        level: 1,
        name: 'MEAL_RATIO_BREAKFAST_FACTOR',
        unit: '%',
        value: '100'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-15T08:50:51.438Z',
        level: 1,
        name: 'TOTAL_INSULIN_FOR_24H',
        unit: 'IE',
        value: '40.0'
      }
    ]
  },
  {
    changeDate: '2022-10-03T14:29:21.835Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2022-10-03T14:29:21.835Z',
        level: 1,
        name: 'PATIENT_GLY_HYPO_LIMIT',
        unit: 'mg/dL',
        previousUnit: 'mg/dL',
        previousValue: '70.0',
        value: '80.0'
      }
    ]
  },
  {
    changeDate: '2023-01-16T09:50:44.945Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2023-01-16T09:50:44.945Z',
        level: 2,
        name: 'IOB_TAU_S',
        unit: 'min',
        previousUnit: 'min',
        previousValue: '1',
        value: '2'
      },
      {
        changeType: 'updated',
        effectiveDate: '2021-01-16T09:50:44.945Z',
        level: 1,
        name: 'MEDIUM_MEAL_BREAKFAST',
        unit: 'g',
        previousUnit: 'g',
        previousValue: '42.0',
        value: '36.0'
      }
    ]
  }
] as ParametersChange[]

export const expectedSortedHistory = [
  {
    changeDate: '2023-01-16T09:50:44.945Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2021-01-16T09:50:44.945Z',
        level: 1,
        name: 'MEDIUM_MEAL_BREAKFAST',
        unit: 'g',
        previousUnit: 'g',
        previousValue: '42.0',
        value: '36.0'
      },
      {
        changeType: 'updated',
        effectiveDate: '2023-01-16T09:50:44.945Z',
        level: 2,
        name: 'IOB_TAU_S',
        unit: 'min',
        previousUnit: 'min',
        previousValue: '1',
        value: '2'
      }
    ]
  },
  {
    changeDate: '2022-10-03T14:29:21.835Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2022-10-03T14:29:21.835Z',
        level: 1,
        name: 'PATIENT_GLY_HYPO_LIMIT',
        unit: 'mg/dL',
        previousUnit: 'mg/dL',
        previousValue: '70.0',
        value: '80.0'
      }
    ]
  },
  {
    changeDate: '2022-08-16T15:31:41.611Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2022-08-16T15:25:23.488Z',
        level: 1,
        name: 'LARGE_MEAL_BREAKFAST',
        unit: 'g',
        previousUnit: 'g',
        previousValue: '63.0',
        value: '54.0'
      },
      {
        changeType: 'updated',
        effectiveDate: '2022-08-16T15:25:23.472Z',
        level: 1,
        name: 'WEIGHT',
        unit: 'kg',
        previousUnit: 'kg',
        previousValue: '90.0',
        value: '87.0'
      }
    ]
  },
  {
    changeDate: '2021-08-15T08:50:51.611Z',
    parameters: [
      {
        changeType: 'added',
        effectiveDate: '2021-08-15T08:50:51.452Z',
        level: 1,
        name: 'MEAL_RATIO_BREAKFAST_FACTOR',
        unit: '%',
        value: '100'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-15T08:50:51.438Z',
        level: 1,
        name: 'TOTAL_INSULIN_FOR_24H',
        unit: 'IE',
        value: '40.0'
      }
    ]
  }
] as ParametersChange[]

export const expectedPumpSettingsParameterList = [
  {
    changeType: 'updated',
    effectiveDate: '2021-01-16T09:50:44.945Z',
    level: 1,
    name: 'MEDIUM_MEAL_BREAKFAST',
    unit: 'g',
    previousUnit: 'g',
    previousValue: '42.0',
    value: '36.0'
  },
  {
    changeType: 'updated',
    effectiveDate: '2023-01-16T09:50:44.945Z',
    level: 2,
    name: 'IOB_TAU_S',
    unit: 'min',
    previousUnit: 'min',
    previousValue: '1',
    value: '2'
  },
  {
    changeType: 'updated',
    effectiveDate: '2022-10-03T14:29:21.835Z',
    level: 1,
    name: 'PATIENT_GLY_HYPO_LIMIT',
    unit: 'mg/dL',
    previousUnit: 'mg/dL',
    previousValue: '70.0',
    value: '80.0'
  },
  {
    changeType: 'updated',
    effectiveDate: '2022-08-16T15:25:23.488Z',
    level: 1,
    name: 'LARGE_MEAL_BREAKFAST',
    unit: 'g',
    previousUnit: 'g',
    previousValue: '63.0',
    value: '54.0'
  },
  {
    changeType: 'updated',
    effectiveDate: '2022-08-16T15:25:23.472Z',
    level: 1,
    name: 'WEIGHT',
    unit: 'kg',
    previousUnit: 'kg',
    previousValue: '90.0',
    value: '87.0'
  },
  {
    changeType: 'added',
    effectiveDate: '2021-08-15T08:50:51.452Z',
    level: 1,
    name: 'MEAL_RATIO_BREAKFAST_FACTOR',
    unit: '%',
    value: '100'
  },
  {
    changeType: 'added',
    effectiveDate: '2021-08-15T08:50:51.438Z',
    level: 1,
    name: 'TOTAL_INSULIN_FOR_24H',
    unit: 'IE',
    value: '40.0'
  }
] as PumpSettingsParameter[]
