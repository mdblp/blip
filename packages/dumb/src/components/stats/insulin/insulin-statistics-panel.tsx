/*
 * Copyright (c) 2022-2025, Diabeloop
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
import React, { type FunctionComponent, memo } from 'react'
import styles from './insulin-stat.css'
import Box from '@mui/material/Box'
import { t } from 'i18next'
import { formatDecimalNumber } from '../../../utils/format/format.util'
import { useLocation } from 'react-router-dom'
import { EMPTY_DATA_PLACEHOLDER } from '../../../models/stats.model'
import { useTheme } from '@mui/material/styles'
import { roundToOneDecimal } from 'yourloops/components/statistics/statistics.util'
import { StatLine } from '../stat-line/stat-line'
import { StatLineWithChip } from '../stat-line/stat-line-with-chip'

interface InsulinStatistic {
  id: string
  title: string
  units: string
  value: number
}

export interface InsulinStatisticsPanelProps {
  data: InsulinStatistic[]
  totalInsulin: number
  estimatedTotalInsulin: number
  weight: number | string
}

const InsulinStatisticsPanel: FunctionComponent<InsulinStatisticsPanelProps> = (props) => {
  const {
    data,
    totalInsulin,
    estimatedTotalInsulin,
    weight
  } = props
  const theme = useTheme()
  const location = useLocation()
  const isDailyPage = location.pathname.includes('daily')
  const isDashboardPage = location.pathname.includes('dashboard')
  const insulinAnnotations = isDailyPage ? t('total-insulin-days-tooltip') : t('average-daily-insulin-tooltip')
  const annotations = [insulinAnnotations, t('total-insulin-how-calculate-tooltip')]

  const estimatedTotalInsulinCalculationAnnotation = isDailyPage ? t('estimated-total-insulin-how-calculate-tooltip') : t('estimated-total-insulin-avg-how-calculate-tooltip')
  const estimatedTotalInsulinAnnotations = [t('estimated-total-insulin-tooltip'), estimatedTotalInsulinCalculationAnnotation]
  if (data.length === 0) {
    annotations.push(t('tooltip-empty-stat'))
    estimatedTotalInsulinAnnotations.push(t('tooltip-empty-stat'))
  }

  const getDailyDosePerWeight = (): string | number => {
    if (weight === '') {
      return ''
    }
    const value = totalInsulin / +weight
    return value > 0 && Number.isFinite (value) ? formatDecimalNumber(value, 2) : ''
  }

  const getOutputValueClasses = (): string => {
    const hasDailyDosePerWeight = getDailyDosePerWeight.toString() !== EMPTY_DATA_PLACEHOLDER
    return hasDailyDosePerWeight ? styles.rowValue : styles.outputValueDisabled
  }

  const estimatedTotalInsulinValue = estimatedTotalInsulin > 0 ? estimatedTotalInsulin : ''
  const totalInsulinTitle = isDailyPage ? t('total-insulin') : t('average-daily-total-insulin')
  const estimatedTotalInsulinTitle = isDailyPage ? t('estimated-total-insulin') : t('average-daily-estimated-total-insulin')

  return (
    <div data-testid="container-insulin-stats">
      <StatLine
        title={totalInsulinTitle}
        value={roundToOneDecimal(totalInsulin)}
        units={t('insulin-unit-u')}
        valueClasses={styles.rowValue}
        isBold={true}
        annotations={annotations}
      />
      {data.map(entry => {
        return (
          <React.Fragment key={entry.id}>
            <StatLineWithChip
              title={entry.title}
              value={entry.value}
              units={entry.units}
              totalValue={totalInsulin}
            />
          </React.Fragment>
        )
      })}

      <Box sx={{ marginTop: theme.spacing(1) }}>
        <StatLine
          title={estimatedTotalInsulinTitle}
          value={estimatedTotalInsulinValue}
          units={t('insulin-unit-u')}
          valueClasses={styles.rowValue}
          annotations={estimatedTotalInsulinAnnotations}
        />
      </Box>
      {isDashboardPage && <>
        <StatLine
          title={t('weight')}
          value={weight}
          units={t('kg')}
          valueClasses={getOutputValueClasses()}
        />
        <StatLine
          title={t('ratio-dose')}
          value={getDailyDosePerWeight()}
          units={t('U/kg')}
          valueClasses={getOutputValueClasses()}
        />
      </>}
    </div>
  )
}

export const InsulinStatisticPanelMemoized = memo(InsulinStatisticsPanel)
