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
    changeDate: '2022-10-07T05:05:59.441Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2022-10-07T05:05:59.441Z',
        level: 1,
        name: 'PATIENT_GLY_HYPO_LIMIT',
        unit: 'mg/dL',
        previousUnit: 'mg/dL',
        previousValue: '80.0',
        value: '75.0'
      }
    ]
  },
  {
    changeDate: '2023-01-17T18:31:22.12Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2023-01-17T18:31:22.12Z',
        level: 1,
        name: 'MEAL_RATIO_DINNER_FACTOR',
        unit: '%',
        previousUnit: '%',
        previousValue: '100',
        value: '80'
      }
    ]
  },
  {
    changeDate: '2023-05-02T08:23:45.463Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2023-05-02T08:23:45.463Z',
        level: 1,
        name: 'MEAL_RATIO_DINNER_FACTOR',
        unit: '%',
        previousUnit: '%',
        previousValue: '80',
        value: '100'
      }
    ]
  },
  {
    changeDate: '2023-05-11T17:26:22.444Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2023-05-11T17:26:22.444Z',
        level: 1,
        name: 'MEAL_RATIO_DINNER_FACTOR',
        unit: '%',
        previousUnit: '%',
        previousValue: '100',
        value: '90'
      }
    ]
  },
  {
    changeDate: '2021-08-16T08:54:37.353Z',
    parameters: [
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:54:37.271Z',
        level: 1,
        name: 'BOLUS_AGGRESSIVENESS_FACTOR',
        unit: '%',
        value: '100'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.515Z',
        level: 1,
        name: 'LARGE_MEAL_BREAKFAST',
        unit: 'g',
        value: '63.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.557Z',
        level: 1,
        name: 'LARGE_MEAL_DINNER',
        unit: 'g',
        value: '144.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.534Z',
        level: 1,
        name: 'LARGE_MEAL_LUNCH',
        unit: 'g',
        value: '144.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.452Z',
        level: 1,
        name: 'MEAL_RATIO_BREAKFAST_FACTOR',
        unit: '%',
        value: '100'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.481Z',
        level: 1,
        name: 'MEAL_RATIO_DINNER_FACTOR',
        unit: '%',
        value: '100'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.468Z',
        level: 1,
        name: 'MEAL_RATIO_LUNCH_FACTOR',
        unit: '%',
        value: '100'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.507Z',
        level: 1,
        name: 'MEDIUM_MEAL_BREAKFAST',
        unit: 'g',
        value: '42.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.552Z',
        level: 1,
        name: 'MEDIUM_MEAL_DINNER',
        unit: 'g',
        value: '96.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.528Z',
        level: 1,
        name: 'MEDIUM_MEAL_LUNCH',
        unit: 'g',
        value: '96.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:54:37.236Z',
        level: 1,
        name: 'PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA',
        unit: '%',
        value: '100'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:54:37.339Z',
        level: 1,
        name: 'PATIENT_GLYCEMIA_TARGET',
        unit: 'mg/dL',
        value: '110.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:54:37.353Z',
        level: 1,
        name: 'PATIENT_GLY_HYPER_LIMIT',
        unit: 'mg/dL',
        value: '180.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:54:37.138Z',
        level: 1,
        name: 'PATIENT_GLY_HYPO_LIMIT',
        unit: 'mg/dL',
        value: '70.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.501Z',
        level: 1,
        name: 'SMALL_MEAL_BREAKFAST',
        unit: 'g',
        value: '21.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.547Z',
        level: 1,
        name: 'SMALL_MEAL_DINNER',
        unit: 'g',
        value: '48.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.521Z',
        level: 1,
        name: 'SMALL_MEAL_LUNCH',
        unit: 'g',
        value: '48.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.438Z',
        level: 1,
        name: 'TOTAL_INSULIN_FOR_24H',
        unit: 'IE',
        value: '40.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.496Z',
        level: 1,
        name: 'WEIGHT',
        unit: 'kg',
        value: '90.0'
      }
    ]
  },
  {
    changeDate: '2021-08-16T09:50:44.945Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2021-08-16T09:50:44.945Z',
        level: 2,
        name: 'IOB_TAU_S',
        unit: 'min',
        previousUnit: 'min',
        previousValue: '1',
        value: '2'
      },
      {
        changeType: 'updated',
        effectiveDate: '2021-08-16T09:50:44.945Z',
        level: 1,
        name: 'MEDIUM_MEAL_BREAKFAST',
        unit: 'g',
        previousUnit: 'g',
        previousValue: '42.0',
        value: '36.0'
      }
    ]
  },
  {
    changeDate: '2023-05-14T07:14:51.609Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2023-05-14T07:14:51.609Z',
        level: 1,
        name: 'MEDIUM_MEAL_BREAKFAST',
        unit: 'g',
        previousUnit: 'g',
        previousValue: '36.0',
        value: '48.0'
      }
    ]
  },
  {
    changeDate: '2023-06-25T08:18:31.744Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2023-06-25T08:18:31.744Z',
        level: 1,
        name: 'MEDIUM_MEAL_BREAKFAST',
        unit: 'g',
        previousUnit: 'g',
        previousValue: '48.0',
        value: '36.0'
      }
    ]
  },
  {
    changeDate: '2023-06-05T16:47:20.719Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2023-06-05T16:47:20.719Z',
        level: 1,
        name: 'MEAL_RATIO_DINNER_FACTOR',
        unit: '%',
        previousUnit: '%',
        previousValue: '90',
        value: '80'
      }
    ]
  }
] as ParametersChange[]

export const expectedSortedHistory = [
  {
    changeDate: '2023-06-25T08:18:31.744Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2023-06-25T08:18:31.744Z',
        level: 1,
        name: 'MEDIUM_MEAL_BREAKFAST',
        unit: 'g',
        previousUnit: 'g',
        previousValue: '48.0',
        value: '36.0'
      }
    ]
  },
  {
    changeDate: '2023-06-05T16:47:20.719Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2023-06-05T16:47:20.719Z',
        level: 1,
        name: 'MEAL_RATIO_DINNER_FACTOR',
        unit: '%',
        previousUnit: '%',
        previousValue: '90',
        value: '80'
      }
    ]
  },
  {
    changeDate: '2023-05-14T07:14:51.609Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2023-05-14T07:14:51.609Z',
        level: 1,
        name: 'MEDIUM_MEAL_BREAKFAST',
        unit: 'g',
        previousUnit: 'g',
        previousValue: '36.0',
        value: '48.0'
      }
    ]
  },
  {
    changeDate: '2023-05-11T17:26:22.444Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2023-05-11T17:26:22.444Z',
        level: 1,
        name: 'MEAL_RATIO_DINNER_FACTOR',
        unit: '%',
        previousUnit: '%',
        previousValue: '100',
        value: '90'
      }
    ]
  },
  {
    changeDate: '2023-05-02T08:23:45.463Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2023-05-02T08:23:45.463Z',
        level: 1,
        name: 'MEAL_RATIO_DINNER_FACTOR',
        unit: '%',
        previousUnit: '%',
        previousValue: '80',
        value: '100'
      }
    ]
  },
  {
    changeDate: '2023-01-17T18:31:22.12Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2023-01-17T18:31:22.12Z',
        level: 1,
        name: 'MEAL_RATIO_DINNER_FACTOR',
        unit: '%',
        previousUnit: '%',
        previousValue: '100',
        value: '80'
      }
    ]
  },
  {
    changeDate: '2022-10-07T05:05:59.441Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2022-10-07T05:05:59.441Z',
        level: 1,
        name: 'PATIENT_GLY_HYPO_LIMIT',
        unit: 'mg/dL',
        previousUnit: 'mg/dL',
        previousValue: '80.0',
        value: '75.0'
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
        effectiveDate: '2022-08-16T15:25:23.478Z',
        level: 1,
        name: 'SMALL_MEAL_BREAKFAST',
        unit: 'g',
        previousUnit: 'g',
        previousValue: '21.0',
        value: '18.0'
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
        changeType: 'updated',
        effectiveDate: '2022-08-16T15:25:23.428Z',
        level: 1,
        name: 'TOTAL_INSULIN_FOR_24H',
        unit: 'U',
        previousUnit: 'IE',
        previousValue: '40.0',
        value: '40.0'
      }
    ]
  },
  {
    changeDate: '2021-08-16T09:50:44.945Z',
    parameters: [
      {
        changeType: 'updated',
        effectiveDate: '2021-08-16T09:50:44.945Z',
        level: 1,
        name: 'MEDIUM_MEAL_BREAKFAST',
        unit: 'g',
        previousUnit: 'g',
        previousValue: '42.0',
        value: '36.0'
      },
      {
        changeType: 'updated',
        effectiveDate: '2021-08-16T09:50:44.945Z',
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
    changeDate: '2021-08-16T08:54:37.353Z',
    parameters: [
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:54:37.353Z',
        level: 1,
        name: 'PATIENT_GLY_HYPER_LIMIT',
        unit: 'mg/dL',
        value: '180.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:54:37.339Z',
        level: 1,
        name: 'PATIENT_GLYCEMIA_TARGET',
        unit: 'mg/dL',
        value: '110.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:54:37.271Z',
        level: 1,
        name: 'BOLUS_AGGRESSIVENESS_FACTOR',
        unit: '%',
        value: '100'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:54:37.236Z',
        level: 1,
        name: 'PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA',
        unit: '%',
        value: '100'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:54:37.138Z',
        level: 1,
        name: 'PATIENT_GLY_HYPO_LIMIT',
        unit: 'mg/dL',
        value: '70.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.557Z',
        level: 1,
        name: 'LARGE_MEAL_DINNER',
        unit: 'g',
        value: '144.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.552Z',
        level: 1,
        name: 'MEDIUM_MEAL_DINNER',
        unit: 'g',
        value: '96.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.547Z',
        level: 1,
        name: 'SMALL_MEAL_DINNER',
        unit: 'g',
        value: '48.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.534Z',
        level: 1,
        name: 'LARGE_MEAL_LUNCH',
        unit: 'g',
        value: '144.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.528Z',
        level: 1,
        name: 'MEDIUM_MEAL_LUNCH',
        unit: 'g',
        value: '96.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.521Z',
        level: 1,
        name: 'SMALL_MEAL_LUNCH',
        unit: 'g',
        value: '48.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.515Z',
        level: 1,
        name: 'LARGE_MEAL_BREAKFAST',
        unit: 'g',
        value: '63.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.507Z',
        level: 1,
        name: 'MEDIUM_MEAL_BREAKFAST',
        unit: 'g',
        value: '42.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.501Z',
        level: 1,
        name: 'SMALL_MEAL_BREAKFAST',
        unit: 'g',
        value: '21.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.496Z',
        level: 1,
        name: 'WEIGHT',
        unit: 'kg',
        value: '90.0'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.481Z',
        level: 1,
        name: 'MEAL_RATIO_DINNER_FACTOR',
        unit: '%',
        value: '100'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.468Z',
        level: 1,
        name: 'MEAL_RATIO_LUNCH_FACTOR',
        unit: '%',
        value: '100'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.452Z',
        level: 1,
        name: 'MEAL_RATIO_BREAKFAST_FACTOR',
        unit: '%',
        value: '100'
      },
      {
        changeType: 'added',
        effectiveDate: '2021-08-16T08:50:51.438Z',
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
    effectiveDate: '2023-06-25T08:18:31.744Z',
    level: 1,
    name: 'MEDIUM_MEAL_BREAKFAST',
    unit: 'g',
    previousUnit: 'g',
    previousValue: '48.0',
    value: '36.0'
  },
  {
    changeType: 'updated',
    effectiveDate: '2023-06-05T16:47:20.719Z',
    level: 1,
    name: 'MEAL_RATIO_DINNER_FACTOR',
    unit: '%',
    previousUnit: '%',
    previousValue: '90',
    value: '80'
  },
  {
    changeType: 'updated',
    effectiveDate: '2023-05-14T07:14:51.609Z',
    level: 1,
    name: 'MEDIUM_MEAL_BREAKFAST',
    unit: 'g',
    previousUnit: 'g',
    previousValue: '36.0',
    value: '48.0'
  },
  {
    changeType: 'updated',
    effectiveDate: '2023-05-11T17:26:22.444Z',
    level: 1,
    name: 'MEAL_RATIO_DINNER_FACTOR',
    unit: '%',
    previousUnit: '%',
    previousValue: '100',
    value: '90'
  },
  {
    changeType: 'updated',
    effectiveDate: '2023-05-02T08:23:45.463Z',
    level: 1,
    name: 'MEAL_RATIO_DINNER_FACTOR',
    unit: '%',
    previousUnit: '%',
    previousValue: '80',
    value: '100'
  },
  {
    changeType: 'updated',
    effectiveDate: '2023-01-17T18:31:22.12Z',
    level: 1,
    name: 'MEAL_RATIO_DINNER_FACTOR',
    unit: '%',
    previousUnit: '%',
    previousValue: '100',
    value: '80'
  },
  {
    changeType: 'updated',
    effectiveDate: '2022-10-07T05:05:59.441Z',
    level: 1,
    name: 'PATIENT_GLY_HYPO_LIMIT',
    unit: 'mg/dL',
    previousUnit: 'mg/dL',
    previousValue: '80.0',
    value: '75.0'
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
    effectiveDate: '2022-08-16T15:25:23.478Z',
    level: 1,
    name: 'SMALL_MEAL_BREAKFAST',
    unit: 'g',
    previousUnit: 'g',
    previousValue: '21.0',
    value: '18.0'
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
    changeType: 'updated',
    effectiveDate: '2022-08-16T15:25:23.428Z',
    level: 1,
    name: 'TOTAL_INSULIN_FOR_24H',
    unit: 'U',
    previousUnit: 'IE',
    previousValue: '40.0',
    value: '40.0'
  },
  {
    changeType: 'updated',
    effectiveDate: '2021-08-16T09:50:44.945Z',
    level: 1,
    name: 'MEDIUM_MEAL_BREAKFAST',
    unit: 'g',
    previousUnit: 'g',
    previousValue: '42.0',
    value: '36.0'
  },
  {
    changeType: 'updated',
    effectiveDate: '2021-08-16T09:50:44.945Z',
    level: 2,
    name: 'IOB_TAU_S',
    unit: 'min',
    previousUnit: 'min',
    previousValue: '1',
    value: '2'
  },
  {
    changeType: 'added',
    effectiveDate: '2021-08-16T08:54:37.353Z',
    level: 1,
    name: 'PATIENT_GLY_HYPER_LIMIT',
    unit: 'mg/dL',
    value: '180.0'
  },
  {
    changeType: 'added',
    effectiveDate: '2021-08-16T08:54:37.339Z',
    level: 1,
    name: 'PATIENT_GLYCEMIA_TARGET',
    unit: 'mg/dL',
    value: '110.0'
  },
  {
    changeType: 'added',
    effectiveDate: '2021-08-16T08:54:37.271Z',
    level: 1,
    name: 'BOLUS_AGGRESSIVENESS_FACTOR',
    unit: '%',
    value: '100'
  },
  {
    changeType: 'added',
    effectiveDate: '2021-08-16T08:54:37.236Z',
    level: 1,
    name: 'PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA',
    unit: '%',
    value: '100'
  },
  {
    changeType: 'added',
    effectiveDate: '2021-08-16T08:54:37.138Z',
    level: 1,
    name: 'PATIENT_GLY_HYPO_LIMIT',
    unit: 'mg/dL',
    value: '70.0'
  },
  {
    changeType: 'added',
    effectiveDate: '2021-08-16T08:50:51.557Z',
    level: 1,
    name: 'LARGE_MEAL_DINNER',
    unit: 'g',
    value: '144.0'
  },
  {
    changeType: 'added',
    effectiveDate: '2021-08-16T08:50:51.552Z',
    level: 1,
    name: 'MEDIUM_MEAL_DINNER',
    unit: 'g',
    value: '96.0'
  },
  {
    changeType: 'added',
    effectiveDate: '2021-08-16T08:50:51.547Z',
    level: 1,
    name: 'SMALL_MEAL_DINNER',
    unit: 'g',
    value: '48.0'
  },
  {
    changeType: 'added',
    effectiveDate: '2021-08-16T08:50:51.534Z',
    level: 1,
    name: 'LARGE_MEAL_LUNCH',
    unit: 'g',
    value: '144.0'
  },
  {
    changeType: 'added',
    effectiveDate: '2021-08-16T08:50:51.528Z',
    level: 1,
    name: 'MEDIUM_MEAL_LUNCH',
    unit: 'g',
    value: '96.0'
  },
  {
    changeType: 'added',
    effectiveDate: '2021-08-16T08:50:51.521Z',
    level: 1,
    name: 'SMALL_MEAL_LUNCH',
    unit: 'g',
    value: '48.0'
  },
  {
    changeType: 'added',
    effectiveDate: '2021-08-16T08:50:51.515Z',
    level: 1,
    name: 'LARGE_MEAL_BREAKFAST',
    unit: 'g',
    value: '63.0'
  },
  {
    changeType: 'added',
    effectiveDate: '2021-08-16T08:50:51.507Z',
    level: 1,
    name: 'MEDIUM_MEAL_BREAKFAST',
    unit: 'g',
    value: '42.0'
  },
  {
    changeType: 'added',
    effectiveDate: '2021-08-16T08:50:51.501Z',
    level: 1,
    name: 'SMALL_MEAL_BREAKFAST',
    unit: 'g',
    value: '21.0'
  },
  {
    changeType: 'added',
    effectiveDate: '2021-08-16T08:50:51.496Z',
    level: 1,
    name: 'WEIGHT',
    unit: 'kg',
    value: '90.0'
  },
  {
    changeType: 'added',
    effectiveDate: '2021-08-16T08:50:51.481Z',
    level: 1,
    name: 'MEAL_RATIO_DINNER_FACTOR',
    unit: '%',
    value: '100'
  },
  {
    changeType: 'added',
    effectiveDate: '2021-08-16T08:50:51.468Z',
    level: 1,
    name: 'MEAL_RATIO_LUNCH_FACTOR',
    unit: '%',
    value: '100'
  },
  {
    changeType: 'added',
    effectiveDate: '2021-08-16T08:50:51.452Z',
    level: 1,
    name: 'MEAL_RATIO_BREAKFAST_FACTOR',
    unit: '%',
    value: '100'
  },
  {
    changeType: 'added',
    effectiveDate: '2021-08-16T08:50:51.438Z',
    level: 1,
    name: 'TOTAL_INSULIN_FOR_24H',
    unit: 'IE',
    value: '40.0'
  }
] as PumpSettingsParameter[]
