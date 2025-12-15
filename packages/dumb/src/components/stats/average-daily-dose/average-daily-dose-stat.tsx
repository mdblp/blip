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
import styles from './average-daily-dose-stat.css'
import commonStyles from '../../../styles/stat-common.css'
import { formatDecimalNumber } from '../../../utils/format/format.util'
import { useTranslation } from 'react-i18next'
import { SimpleValue } from '../common/simple-value'
import { EMPTY_DATA_PLACEHOLDER } from '../../../models/stats.model'
import { StatTooltip } from '../../tooltips/stat-tooltip/stat-tooltip'
import Box from '@mui/material/Box'

interface AverageDailyDoseStatProps {
  annotations: string[]
  dailyDose: number
  footerLabel: string
  title: string
  weight: number
  weightSuffix: string
}

const AverageDailyDoseStat: FunctionComponent<AverageDailyDoseStatProps> = (props) => {
  const {
    annotations,
    dailyDose,
    footerLabel,
    title,
    weight,
    weightSuffix
  } = props

  const { t } = useTranslation('main')

  const computedOutputValue = useMemo(() => {
    const value = dailyDose / weight
    return value > 0 && Number.isFinite(value) ? formatDecimalNumber(value, 2) : EMPTY_DATA_PLACEHOLDER
  }, [dailyDose, weight])

  const outputValueClasses = useMemo(() => {
    const isDisabled = computedOutputValue === EMPTY_DATA_PLACEHOLDER
    return `${styles.outputValue}${isDisabled ? ` ${styles.outputValueDisabled}` : ''}`
  }, [computedOutputValue])

  return (
    <div className={commonStyles.statWrapper}>
      <div className={`${commonStyles.stat} ${styles.isOpen}`}>
        <div className={commonStyles.statHeader}>
          <Box className={commonStyles.chartTitle} sx={{ display: "flex" }}>
            {title}
            <StatTooltip annotations={annotations} />
          </Box>
          <SimpleValue
            className={styles.insulinTitle}
            suffix='U'
            value={formatDecimalNumber(dailyDose, 1)}
          />
        </div>
        <div className={`${styles.commonDisplay} ${styles.inputWrapper}`}>
          <div className={styles.inputLabel}>
            {t('Weight')}
          </div>
          <div>
            <span className={styles.inputValue}>
              {weight}
            </span>
            <span className={styles.units}>
              {weightSuffix}
            </span>
          </div>
        </div>
        <div className={`${styles.commonDisplay} ${styles.statFooter}`}>
          <div className={`${styles.commonDisplay} ${styles.outputWrapper}`}>
            {footerLabel && <div className={styles.outputLabel}>{footerLabel}</div>}
            <div>
              <span className={outputValueClasses}>
                {computedOutputValue}
              </span>
              <span className={styles.outputSuffix}>
              {t('U/kg')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const AverageDailyDoseStatMemoized = memo(AverageDailyDoseStat)
