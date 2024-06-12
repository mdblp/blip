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
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { CarbsStatItem } from 'dumb'

export interface CarbsStatProps {
  totalCarbsPerDay: number
  rescueCarbsPerDay: number
  mealCarbsPerDay: number
  totalMealCarbsWithRescueCarbsEntries: number
}

export const CarbsStat: FunctionComponent<CarbsStatProps> = (props) => {
  const {
    totalCarbsPerDay,
    totalMealCarbsWithRescueCarbsEntries,
    rescueCarbsPerDay,
    mealCarbsPerDay,
  } = props
  const { t } = useTranslation('main')
  const location = useLocation()
  const isDailyPage = location.pathname.includes('daily')
  const declaredCarbsAnnotation = [t(isDailyPage ? 'tooltip-per-day-carbs' : 'tooltip-avg-daily-week-carbs'), t('tooltip-declared-derived-carbs', { total: totalMealCarbsWithRescueCarbsEntries })]

  return (
    <div data-testid="total-carbs-stat">
      <CarbsStatItem
        title={t(isDailyPage ? 'total-declared-carbs' : 'avg-daily-declared-carbs')}
        annotations={declaredCarbsAnnotation}
        value={totalCarbsPerDay}
        isTitleBold={true}
      />
      <CarbsStatItem
        title={t('meal-carbs')}
        value={mealCarbsPerDay}
      />
      <CarbsStatItem
        title={t('rescue-carbs')}
        value={rescueCarbsPerDay}
      />
    </div>
  )
}
