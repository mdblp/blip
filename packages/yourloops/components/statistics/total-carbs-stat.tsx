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

import React, { type FunctionComponent } from 'react'
import { t } from 'i18next'
import { TotalCarbsStat } from 'dumb'
import { type BgType, DatumType } from 'medical-domain'
import { ensureNumeric } from 'dumb/dist/src/components/stats/stats.util'

interface TotalCarbsStatProps {
  foodCarbs: number
  bgType: BgType
  total: number
  carbsEntries: number
}

export const TotalCarbsStatWrapper: FunctionComponent<TotalCarbsStatProps> = (props) => {
  const { foodCarbs, carbsEntries, bgType, total } = props
  const isDailay = location.pathname.includes('daily')
  const title = isDailay ? t('title-total-carbs-day') : t('title-total-carbs-week')
  const isSmbg = bgType === DatumType.Smbg ? t('tooltip-total-carbs-smbg-derived', {
    total: carbsEntries,
    smbgLabel: t('BGM')
  }) : t('tooltip-total-carbs-derived', { total: carbsEntries })

  const getAnnotations = (): string[] => {
    if (isDailay) {
      if (!foodCarbs && !total) {
        return [t('tooltip-total-carbs-day'), t('tooltip-empty-stat')]
      }
      return [t('tooltip-total-carbs-day'), isSmbg]
    }
    if (!foodCarbs && !total) {
      return [t('tooltip-total-carbs-day'), t('tooltip-empty-stat')]
    }
    return [t('tooltip-total-carbs-week'), isSmbg]
  }

  return (
    <TotalCarbsStat
      annotations={getAnnotations()}
      foodCarbs={Math.round(foodCarbs)}
      title={title}
      totalCarbs={ensureNumeric(Math.round(total))}
    />
  )
}
