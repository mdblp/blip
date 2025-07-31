/*
 * Copyright (c) 2022-2024, Diabeloop
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
import commonStyles from '../../../styles/stat-common.css'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { t } from 'i18next'
import { formatDecimalNumber } from '../../../utils/format/format.util'
import { StatTooltip } from '../../tooltips/stat-tooltip/stat-tooltip'
import { useLocation } from 'react-router-dom'
import { EMPTY_DATA_PLACEHOLDER } from '../../../models/stats.model'
import { useTheme } from '@mui/material/styles'
import { roundToOneDecimal } from 'yourloops/components/statistics/statistics.util'

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
  const annotationsForEstimatedTotalInsulin = [t('estimated-total-insulin-tooltip'), estimatedTotalInsulinCalculationAnnotation]
  if (data.length === 0) {
    annotations.push(t('tooltip-empty-stat'))
    annotationsForEstimatedTotalInsulin.push(t('tooltip-empty-stat'))
  }

  const isDisabledWeight = weight === EMPTY_DATA_PLACEHOLDER
  const isDisabledTotalInsuline = totalInsulin === 0 ? 'center' : 'baseline'

  const getDailyDosePerWeight = (): string | number => {
    if (weight === EMPTY_DATA_PLACEHOLDER) {
      return EMPTY_DATA_PLACEHOLDER
    }
    const value = totalInsulin / +weight
    return value > 0 && Number.isFinite(value) ? formatDecimalNumber(value, 2) : EMPTY_DATA_PLACEHOLDER
  }

  const getOutputValueClasses = (): string => {
    const hasDailyDosePerWeight = getDailyDosePerWeight.toString() !== EMPTY_DATA_PLACEHOLDER
    return hasDailyDosePerWeight ? styles.dailyDoseValue : styles.outputValueDisabled
  }

  const getPercentage = (value: number): string => {
    // We multiply by ten and divide by ten for the rounding
    const res = Math.round(100 * 10 * value / roundToOneDecimal(totalInsulin)) / 10
    return res > 0 ? res.toString(10) : EMPTY_DATA_PLACEHOLDER
  }

  const estimatedTotalInsulinValue = estimatedTotalInsulin > 0 ? estimatedTotalInsulin : EMPTY_DATA_PLACEHOLDER

  return (
    <div data-testid="container-insulin-stats">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box className={commonStyles.title}>
          {isDailyPage ? t('total-insulin') : t('average-daily-total-insulin')}
          <StatTooltip
            annotations={annotations}
          />
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={isDisabledTotalInsuline}
          className={styles.boldValue}
        >
          <span className={styles.titleTotal}>
            <Chip
              label={`${roundToOneDecimal(totalInsulin)} ${t('insulin-unit-u')}`}
              variant="outlined"
              size="small"
            />
          </span>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          {isDailyPage ? t('estimated-total-insulin') : t('average-daily-estimated-total-insulin')}
          <StatTooltip
            annotations={annotationsForEstimatedTotalInsulin}
          />
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={isDisabledTotalInsuline}
          className={styles.boldValue}
        >
          <span className={styles.titleTotal}>
            <Chip
              label={`${estimatedTotalInsulinValue} ${t('insulin-unit-u')}`}
              variant="outlined"
              size="small"
            />
          </span>
        </Box>
      </Box>
      {data.map(entry => {
        return (
          <React.Fragment key={entry.id}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <div>
                {entry.title}
              </div>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Chip
                  label={`${entry.value > 0 ? entry.value : '0'} ${entry.units}`}
                  variant="outlined"
                  size="small"
                  sx={{ marginRight: theme.spacing(1) }}
                />
                <Box
                  className={styles.rowPercent}
                  width="50px"
                  alignItems={entry.value === 0 ? 'center' : 'baseline'}
                >
                  <span className={styles.rowPercentValue}>
                    {getPercentage(Math.max(entry.value, 0))}
                  </span>
                  <span className={styles.rowPercentUnits}>
                    %
                  </span>
                </Box>
              </Box>
            </Box>
          </React.Fragment>
        )
      })}
      {isDashboardPage && <>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <span>
            {t('weight')}
          </span>
          <Box
            display="flex"
            alignItems={isDisabledWeight ? 'center' : 'baseline'}
            className={styles.boldValue}
          >
            <span className={getOutputValueClasses()}>
              {weight}
            </span>
            <span className={styles.dailyDoseUnits}>
              {t('kg')}
            </span>
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {t('ratio-dose')}
          <Box
            display="flex"
            alignItems={isDisabledWeight ? 'center' : 'baseline'}
            className={styles.boldValue}
          >
            <span className={getOutputValueClasses()}>
              {getDailyDosePerWeight()}
            </span>
            <span className={styles.dailyDoseUnits}>
              {t('U/kg')}
            </span>
          </Box>
        </Box>
      </>}
    </div>
  )
}

export const InsulinStatisticPanelMemoized = memo(InsulinStatisticsPanel)
