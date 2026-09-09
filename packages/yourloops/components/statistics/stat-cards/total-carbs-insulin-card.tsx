/*
 * Copyright (c) 2026, Diabeloop
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
  Basal,
  BasalBolusStatisticsService,
  Bolus,
  CarbsStatisticsService,
  DateFilter,
  Meal,
  MS_IN_DAY,
  PumpSettings,
  TimeService,
  Wizard
} from 'medical-domain'
import React, { FC } from 'react'
import { CardDivider } from '../../card-divider/card-divider'
import { DataCard } from '../../data-card/data-card'
import { CarbsStat } from '../carbs-stat'
import { TotalInsulinStat } from '../total-insulin-stat'

interface TotalCarbsInsulinCardProps {
  basalData: Basal[]
  bolusData: Bolus[]
  mealData: Meal[]
  pumpSettingsData: PumpSettings[]
  wizardData: Wizard[]
  dateFilter: DateFilter
}

export const TotalCarbsInsulinCard: FC<TotalCarbsInsulinCardProps> = (props) => {
const { basalData, bolusData, mealData, pumpSettingsData, wizardData, dateFilter } = props

  const numberOfDays = dateFilter.weekDays ? TimeService.getNumberOfDays(dateFilter.start, dateFilter.end, dateFilter.weekDays) : (dateFilter.end - dateFilter.start) / MS_IN_DAY

  const {
    rescueCarbsPerDay,
    totalMealCarbsWithRescueCarbsEntries,
    totalRescueCarbsEntries,
    totalCarbsPerDay,
    mealCarbsPerDay
  } = CarbsStatisticsService.getCarbsData(mealData, wizardData, numberOfDays, dateFilter)

  const {
    automatedBasalDuration,
  } = BasalBolusStatisticsService.getAutomatedAndManualBasalDuration(basalData, dateFilter)

  const {
    weight,
    totalMealBoluses,
    totalManualBoluses,
    totalPenBoluses,
    totalCorrectiveBolusesAndBasals,
    totalInsulin,
    estimatedTotalInsulin
  } = BasalBolusStatisticsService.getTotalInsulinAndWeightData(basalData, bolusData, wizardData, numberOfDays, dateFilter, pumpSettingsData, automatedBasalDuration)


  return (
    <DataCard>
      <CarbsStat
        totalMealCarbsWithRescueCarbsEntries={totalMealCarbsWithRescueCarbsEntries}
        totalRescueCarbsEntries={totalRescueCarbsEntries}
        totalCarbsPerDay={Math.round(totalCarbsPerDay * 10) / 10}
        rescueCarbsPerDay={Math.round(rescueCarbsPerDay * 10) / 10}
        mealCarbsPerDay={Math.round(mealCarbsPerDay * 10) / 10}
      />
      <CardDivider />
      <TotalInsulinStat
        totalMealBoluses={totalMealBoluses}
        totalManualBoluses={totalManualBoluses}
        totalPenBoluses={totalPenBoluses}
        totalCorrectiveBolusesAndBasals={totalCorrectiveBolusesAndBasals}
        totalInsulin={totalInsulin}
        estimatedTotalInsulin={estimatedTotalInsulin}
        weight={weight}
      />
    </DataCard>
  )
}
