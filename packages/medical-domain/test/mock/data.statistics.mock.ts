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

import type DateFilter from '../../src/domains/models/time/date-filter.model'
import { createMealData, createWizardData } from '../data-generator'
import { type Meal, type Wizard } from '../../src'

const abbottDevice = 'AbbottFreeStyleLibre-XXX-XXXX'
const dexcomDevice = 'Dexcom-XXX-XXXX'

export const bgDataSourceOneDay: Array<[Date, string]> = [
  // data for one day and two days tests
  [new Date('2018-02-01T00:00:00.000Z'), abbottDevice],
  [new Date('2018-02-01T00:15:00.000Z'), abbottDevice],
  [new Date('2018-02-01T00:30:00.000Z'), abbottDevice],
  [new Date('2018-02-01T00:45:00.000Z'), dexcomDevice],
  [new Date('2018-02-01T00:50:00.000Z'), dexcomDevice]
]

export const bgDataSourceTwoDays: Array<[Date, string]> = [
  // data for two days tests
  [new Date('2018-02-01T00:50:00.000Z'), dexcomDevice],
  [new Date('2018-02-02T00:50:00.000Z'), dexcomDevice]
]

export const dateFilterOneDay: DateFilter = {
  start: new Date('2018-02-01T00:00:00.000Z').valueOf(),
  end: new Date('2018-02-02T00:00:00.000Z').valueOf()
}
export const dateFilterTwoDays: DateFilter = {
  start: new Date('2018-02-01T00:00:00.000Z').valueOf(),
  end: new Date('2018-02-03T00:00:00.000Z').valueOf()
}
export const dateFilterThreeDays: DateFilter = {
  start: new Date('2018-02-01T00:00:00.000Z').valueOf(),
  end: new Date('2018-02-04T00:00:00.000Z').valueOf()
}
export const dateFilterThreeDays2020: DateFilter = {
  start: new Date('2020-02-01T00:00:00.000Z').valueOf(),
  end: new Date('2020-02-04T00:00:00.000Z').valueOf()
}
export const dateFilterTwoWeeks: DateFilter = {
  start: new Date('2018-02-01T00:00:00.000Z').valueOf(),
  end: new Date('2018-02-15T00:00:00.000Z').valueOf()
}

export const buildMealData = (data: Array<[Date, string]>): Meal[] => (
  data.map((mealData) => (
    {
      ...createMealData(mealData[0]),
      deviceName: mealData[1]
    }
  ))
)

export const buildWizardData = (data: Array<[Date, string]>): Wizard[] => (
  data.map((wizardData) => (
    {
      ...createWizardData(wizardData[0]),
      deviceName: wizardData[1]
    }
  ))
)