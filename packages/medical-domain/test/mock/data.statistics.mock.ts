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

import type DateFilter from '../../src/domains/models/time/date-filter.model'
import {
  createRandomBasal,
  createRandomBolus,
  createRescueCarbsData,
  createRescueCarbsNonModifiedData,
  createWizardData
} from '../data-generator'
import {
  type Basal,
  type Bolus,
  BolusSubtype,
  DatumType,
  type Meal,
  Prescriptor,
  Source,
  type Wizard,
  WizardInputMealFat,
  WizardInputMealSource
} from '../../src'
import WeekDays from '../../src/domains/models/time/enum/weekdays.enum'

type BgDataRange = Array<[Date, string, number?]>
type BolusDataRange = Array<[Date, number, Prescriptor?, BolusSubtype?, string?]>
type BasalDataRange = Array<[Date, number, number, string]>
const abbottDevice = 'AbbottFreeStyleLibre-XXX-XXXX'
const dexcomDevice = 'Dexcom-XXX-XXXX'
export const MS_IN_HOUR = 864e5 / 24

export const bgDataSourceOneDay: BgDataRange = [
  // data for one day and two days tests
  [new Date('2018-02-01T00:00:00.000Z'), abbottDevice],
  [new Date('2018-02-01T00:15:00.000Z'), abbottDevice],
  [new Date('2018-02-01T00:30:00.000Z'), abbottDevice],
  [new Date('2018-02-01T00:45:00.000Z'), dexcomDevice],
  [new Date('2018-02-01T00:50:00.000Z'), dexcomDevice]
]

export const bgDataSourceTwoDays: BgDataRange = [
  // data for two days tests
  [new Date('2018-02-01T00:50:00.000Z'), dexcomDevice],
  [new Date('2018-02-03T00:50:00.000Z'), dexcomDevice]
]

export const bgDataSourceTwoWeeks: BgDataRange = [
  [new Date('2018-02-01T00:33:00.000Z'), dexcomDevice, 5],
  [new Date('2018-02-01T04:33:00.000Z'), dexcomDevice, 10],
  [new Date('2018-02-01T11:33:00.000Z'), dexcomDevice],
  [new Date('2018-02-01T17:33:00.000Z'), dexcomDevice],
  [new Date('2018-02-01T21:33:00.000Z'), dexcomDevice, 20],
  [new Date('2018-02-03T00:33:00.000Z'), dexcomDevice],
  [new Date('2018-02-03T04:33:00.000Z'), dexcomDevice, 15.5],
  [new Date('2018-02-03T11:33:00.000Z'), dexcomDevice],
  [new Date('2018-02-03T17:33:00.000Z'), dexcomDevice, 10],
  [new Date('2018-02-03T21:33:00.000Z'), dexcomDevice],
  [new Date('2018-02-11T00:33:00.000Z'), dexcomDevice],
  [new Date('2018-02-11T04:33:00.000Z'), dexcomDevice],
  [new Date('2018-02-11T11:33:00.000Z'), dexcomDevice, 12],
  [new Date('2018-02-11T17:33:00.000Z'), dexcomDevice, 5],
  [new Date('2018-02-11T21:33:00.000Z'), dexcomDevice, 7],
  [new Date('2018-02-15T00:33:00.000Z'), dexcomDevice, 10],
  [new Date('2018-02-15T04:33:00.000Z'), dexcomDevice],
  [new Date('2018-02-15T11:33:00.000Z'), dexcomDevice],
  [new Date('2018-02-15T17:33:00.000Z'), dexcomDevice, 8],
  [new Date('2018-02-15T21:33:00.000Z'), dexcomDevice]
]

export const basalsData: BasalDataRange = [
  [new Date('2018-02-01T01:00:00Z'), 0.25, MS_IN_HOUR, 'automated'],
  [new Date('2018-02-01T02:00:00Z'), 0.75, MS_IN_HOUR, 'scheduled'],
  [new Date('2018-02-01T03:00:00Z'), 0.5, MS_IN_HOUR, 'scheduled'],
  [new Date('2018-02-02T00:00:00Z'), 0.5, MS_IN_HOUR, 'scheduled'],
  [new Date('2018-02-02T00:00:00Z'), 0.5, MS_IN_HOUR, 'temp']
]

export const bolusData: BolusDataRange = [
  [new Date('2018-02-01T03:00:00Z'), 1, Prescriptor.Auto, BolusSubtype.Normal],
  [new Date('2018-02-01T04:00:00Z'), 0.5, Prescriptor.Auto, BolusSubtype.Biphasic, "biphasic1"],
  [new Date('2018-02-01T04:30:00Z'), 0.5, Prescriptor.Auto, BolusSubtype.Biphasic, "biphasic1"],
  [new Date('2018-02-01T01:00:00Z'), 4, undefined, BolusSubtype.Pen],
  [new Date('2018-02-01T02:00:00Z'), 5, undefined, BolusSubtype.Normal],
  [new Date('2018-02-01T03:00:00Z'), 6, undefined, BolusSubtype.Biphasic],
  [new Date('2018-02-03T03:00:00Z'), 4, undefined, BolusSubtype.Normal]
]

export const manualBolusData: BolusDataRange = [
  [new Date('2018-02-01T00:33:00.000Z'), 2, Prescriptor.Manual],
  [new Date('2018-02-01T04:33:00.000Z'), 5, Prescriptor.Manual],
  [new Date('2018-02-01T11:33:00.000Z'), 2, Prescriptor.Manual],
  [new Date('2018-02-01T17:33:00.000Z'), 3, Prescriptor.Manual],
  [new Date('2018-02-01T21:33:00.000Z'), 1.4, Prescriptor.Manual],
  [new Date('2018-02-03T00:33:00.000Z'), 5],
  [new Date('2018-02-03T04:33:00.000Z'), 5.4],
  [new Date('2018-02-03T11:33:00.000Z'), 2, Prescriptor.Manual],
  [new Date('2018-02-03T17:33:00.000Z'), 3],
  [new Date('2018-02-03T21:33:00.000Z'), 2, Prescriptor.Manual],
  [new Date('2018-02-11T00:33:00.000Z'), 3.2, Prescriptor.Manual],
  [new Date('2018-02-11T04:33:00.000Z'), 4],
  [new Date('2018-02-11T11:33:00.000Z'), 2],
  [new Date('2018-02-11T17:33:00.000Z'), 4, Prescriptor.Manual],
  [new Date('2018-02-11T21:33:00.000Z'), 1, Prescriptor.Manual],
  [new Date('2018-02-15T00:33:00.000Z'), 2],
  [new Date('2018-02-15T04:33:00.000Z'), 3, Prescriptor.Manual],
  [new Date('2018-02-15T11:33:00.000Z'), 4],
  [new Date('2018-02-15T17:33:00.000Z'), 5, Prescriptor.Manual],
  [new Date('2018-02-15T21:33:00.000Z'), 5]
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

export const buildRescueCarbsData = (data: BgDataRange): Meal[] => (
  data.map((mealData) => (
    {
      ...createRescueCarbsData(mealData[0]),
      deviceName: mealData[1],
      prescriptor: Prescriptor.Hybrid
    }
  ))
)

export const buildRescueCarbsManualData = (data: BgDataRange): Meal[] => (
  data.map((mealData) => (
    {
      ...createRescueCarbsNonModifiedData(mealData[0]),
      deviceName: mealData[1],
      prescriptor: Prescriptor.Manual
    }
  ))
)

export const buildRescueCarbsAutomatedData = (data: BgDataRange): Meal[] => (
  data.map((mealData) => (
    {
      ...createRescueCarbsNonModifiedData(mealData[0]),
      deviceName: mealData[1],
      prescriptor: Prescriptor.Auto
    }
  ))
)

export const buildWizardData = (data: BgDataRange): Wizard[] => (
  data.map((wizardData) => (
    {
      ...createWizardData(wizardData[0]),
      deviceName: wizardData[1],
      inputMeal: {
        fat: WizardInputMealFat.No,
        source: WizardInputMealSource.Umm
      }
    }
  ))
)

export const buildBasalsData = (basalsData: BasalDataRange): Basal[] => (
  basalsData.map((basals) => (
    {
      ...createRandomBasal(basals[0], basals[2]),
      rate: basals[1],
      duration: basals[2],
      subType: basals[3],
      deliveryType: basals[3]
    }
  ))
)

export const buildBolusData = (bolusData: BolusDataRange): Bolus[] => (
  bolusData.map((bolus) => (
    {
      ...createRandomBolus(bolus[0], bolus[3]),
      normal: bolus[1],
      prescriptor: bolus[2] ?? Prescriptor.Auto,
      biphasicId: bolus[4]
    }
  ))
)

export const buildSingleWizardData = (bolusId: string): Wizard => {
  return {
    id: 'wizard-id',
    type: DatumType.Wizard,
    bolusId: bolusId,
    isoWeekday: WeekDays.Friday,
    normalTime: '2018-02-01T03:00:00.000Z',
    epoch: 1517454000000,
    bolus: {
      normal: 1
    }
  } as Wizard
}

export const buildSingleEatingShortlyBolusData = (): Bolus => {
  return {
    id: 'eating-shortly-bolus-id',
    type: DatumType.Bolus,
    subType: BolusSubtype.Normal,
    normal: 0.5,
    prescriptor: Prescriptor.EatingShortlyManagement,
    epoch: 1517454000000,
    normalTime: '2018-02-01T03:00:00.000Z',
    timezone: 'Europe/Paris',
    guessedTimezone: false,
    isoWeekday: WeekDays.Friday,
    displayOffset: 60,
    source: Source.Diabeloop,
    wizard: null
  }
}
