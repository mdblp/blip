/*
 * Copyright (c) 2022-2023, Diabeloop
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
import React, { type FunctionComponent, memo, useMemo } from 'react'
import styles from './insulin-stat.css'
import Box from '@mui/material/Box'
import { t } from 'i18next'
import { formatDecimalNumber } from '../../../utils/format/format.util'
import { StatTooltip } from '../../tooltips/stat-tooltip/stat-tooltip'
import { useLocation } from 'react-router-dom'
import { EMPTY_DATA_PLACEHOLDER } from '../../../models/stats.model'

interface TotalInsulinPropsData {
  id: string
  title: string
  units: string
  value: number
  valueString: string
}

export interface TotalInsulinStatProps {
  data: TotalInsulinPropsData[]
  totalInsulin: number
  weight: number
  dailyDose: number
}

const InsulinStat: FunctionComponent<TotalInsulinStatProps> = (props) => {
  const {
    data,
    totalInsulin,
    dailyDose,
    weight
  } = props
  const location = useLocation()
  const isDailyPage = location.pathname.includes('daily')
  const isDashboardPage = location.pathname.includes('dashboard')
  const isTrendsPage = location.pathname.includes('trends')
  const annotations = [t(isDailyPage ? 'total-insulin-days-tooltip' : 'average-daily-insulin-tooltip'), t('total-insulin-how-calculate-tooltip')]
  const isEmptyWeight = weight === null

  if (data.length === 0) {
    annotations.push(t('tooltip-empty-stat'))
  }

  const dailyDosePerWeight = useMemo(() => {
    if (isEmptyWeight) {
      return EMPTY_DATA_PLACEHOLDER
    }
    const value = dailyDose / weight
    return value > 0 && Number.isFinite(value) ? formatDecimalNumber(value, 2) : EMPTY_DATA_PLACEHOLDER
  }, [dailyDose, isEmptyWeight, weight])

  const outputValueClasses = (): string => {
    const isDisabled = dailyDosePerWeight === EMPTY_DATA_PLACEHOLDER
    return `${isDisabled ? `${styles.outputValueDisabled}` : `${styles.dailyDoseValue}`}`
  }

  const percent = (value: number): string => {
    const res = Math.round(100 * value / totalInsulin)
    return res > 0 ? res.toString(10) : '--'
  }

  return (
    <div data-testid="container-insulin-stats">
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="4px">
          <Box>
            {isDailyPage ? t('total-insulin') : t('average-daily-total-insulin')}
            <StatTooltip
              annotations={annotations}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <span className={styles.titleTotal}>
              {totalInsulin}
            </span>
            <span className={styles.titleSuffix}>
              U
            </span>
          </Box>
        </Box>
          {data.map(entry => {
            return (
              <React.Fragment key={entry.id}>
                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="4px">
                  <span>
                    {entry.title}
                  </span>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <span className={`${styles.rowValue} ${styles[`rowsTotalInsulin-${entry.id}`]}`}>
                      {`${entry.value > 0 ? entry.valueString : '0'} ${entry.units}`}
                    </span>
                    <Box className={`${styles.rowPercent} ${styles[`rowsTotalInsulin-${entry.id}`]}`}>
                      <span className={styles.rowPercentValue}>{percent(Math.max(entry.value, 0))}</span>
                      <span className={styles.rowPercentUnits}>%</span>
                    </Box>
                  </Box>
                </Box>
              </React.Fragment>
            )
          })}
        {(isTrendsPage || isDashboardPage) && <>
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="4px">
            {t('ratio-dose')}
            <Box>
              <div className={styles.weightPerUnit}>
                <span className={outputValueClasses()}>{dailyDosePerWeight}</span>
                &nbsp;
                <span className={styles.dailyDoseUnits}>{t('U/kg')}</span>
              </div>
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
              <span>
                {t('weight')}
              </span>
            {!!weight && <>
                <span className={outputValueClasses()}>
                  {weight}
                  &nbsp;
                  <span className={styles.dailyDoseUnits}>
                    {t('kg')}
                  </span>
                </span>
            </>}
          </Box>
        </>}
      </Box>
    </div>

  )
}

export const InsulinStatMemoized = memo(InsulinStat)
