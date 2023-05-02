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

import { TotalInsulinStat } from 'dumb'
import React, { type FunctionComponent } from 'react'
import { t } from 'i18next'
import { useLocation } from 'react-router-dom'

interface TotalInsulinStatWrapperProps {
  basal: number
  bolus: number
  total: number
}

export const TotalInsulinStatWrapper: FunctionComponent<TotalInsulinStatWrapperProps> = (props) => {
  const { bolus, basal, total } = props
  const location = useLocation()
  const isDailyPage = location.pathname.includes('daily')
  const title = isDailyPage ? t('total-insulin') : t('average-daily-insulin')

  const data = [
    {
      id: 'bolus',
      value: Math.round(bolus * 10) / 10,
      valueString: String(Math.round(bolus * 10) / 10),
      units: t('U'),
      title: t('Bolus')
    },
    {
      id: 'basal',
      value: Math.round(basal * 10) / 10,
      valueString: String(Math.round(basal * 10) / 10),
      units: t('U'),
      title: t('Basal')
    }
  ]

  const annotations = (): string[] => {
    if (!data && isDailyPage) {
      return [t('total-insulin-days-tooltip'), t('total-insulin-how-calculate-tooltip'), t('tooltip-empty-stat')]
    }
    if (isDailyPage) {
      return [t('total-insulin-days-tooltip'), t('total-insulin-how-calculate-tooltip')]
    }
    if (!data) {
      return [t('total-insulin-tooltip'), t('total-insulin-how-calculate-tooltip'), t('tooltip-empty-stat')]
    }
    return [t('average-daily-insulin-tooltip'), t('total-insulin-how-calculate-tooltip')]
  }

  return (
    <TotalInsulinStat
      annotations={annotations()}
      data={data}
      title={title}
      total={Math.round(total * 10) / 10}
    />
  )
}
