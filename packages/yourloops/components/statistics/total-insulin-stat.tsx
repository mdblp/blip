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

import React, { type FunctionComponent } from 'react'
import { t } from 'i18next'
import { type ParameterConfig, Unit } from 'medical-domain'
import { InsulinStat } from 'dumb'
import { convertToPercentage } from './statistics.util'

interface TotalInsulinStatProps {
  totalMealBoluses: number
  totalManualBoluses: number
  totalPenBoluses: number
  totalCorrectiveBolusesAndBasals: number
  totalInsulin: number
  dailyDose: number
  weight?: ParameterConfig
}

export const TotalInsulinStat: FunctionComponent<TotalInsulinStatProps> = (props) => {
  const {
    totalMealBoluses,
    totalManualBoluses,
    totalPenBoluses,
    totalCorrectiveBolusesAndBasals,
    totalInsulin,
    dailyDose,
    weight
  } = props

  const data = [
    {
      id: 'meal',
      value: convertToPercentage(totalMealBoluses),
      valueString: String(convertToPercentage(totalMealBoluses)),
      units: Unit.InsulinUnit,
      title: t('meal-bolus')
    },
    {
      id: 'basal',
      value: convertToPercentage(totalCorrectiveBolusesAndBasals),
      valueString: String(convertToPercentage(totalCorrectiveBolusesAndBasals)),
      units: Unit.InsulinUnit,
      title: t('basal-and-correction-bolus')
    }
  ]
  if (totalManualBoluses > 0) {
    data.push({
      id: 'manual',
      value: convertToPercentage(totalManualBoluses),
      valueString: String(convertToPercentage(totalManualBoluses)),
      units: Unit.InsulinUnit,
      title: t('manual-bolus')
    })
  }
  if (totalPenBoluses > 0) {
    data.push({
      id: 'pen',
      value: convertToPercentage(totalPenBoluses),
      valueString: String(convertToPercentage(totalPenBoluses)),
      units: Unit.InsulinUnit,
      title: t('pen-bolus')
    })
  }
  const weightValue = !weight ? '--' : +weight.value
  return (
    <InsulinStat
      data={data}
      totalInsulin={convertToPercentage(totalInsulin)}
      weight={weightValue}
      dailyDose={dailyDose}
    />
  )
}
