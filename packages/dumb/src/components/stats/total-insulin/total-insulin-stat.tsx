/*
 * Copyright (c) 2022, Diabeloop
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
import styles from './total-insulin-stat.css'
import { StatTooltip } from '../../tooltips/stat-tooltip/stat-tooltip'
import Box from '@mui/material/Box'
// import { formatDecimalNumber } from '../../../utils/format/format.util'
// import { EMPTY_DATA_PLACEHOLDER } from '../../../models/stats.model'
// import { t } from 'i18next'

interface TotalInsulinPropsData {
  id: string
  title: string
  units: string
  value: number
  valueString: string
}

export interface TotalInsulinStatProps {
  annotations: string[]
  data: TotalInsulinPropsData[]
  title: string
  total: number
  // dailyDose: number
  // weight: number
  // footerLabel: string
}

const TotalInsulinStat: FunctionComponent<TotalInsulinStatProps> = (props) => {
  const { annotations, data, title, total } = props

  const percent = (value: number): string => {
    const res = Math.round(100 * value / total)
    return res > 0 ? res.toString(10) : '--'
  }

  // const computedOutputValue = useMemo(() => {
  //   const value = dailyDose / weight
  //   return value > 0 && Number.isFinite(value) ? formatDecimalNumber(value, 2) : EMPTY_DATA_PLACEHOLDER
  // }, [dailyDose, weight])
  //
  // const outputValueClasses = useMemo(() => {
  //   const isDisabled = computedOutputValue === EMPTY_DATA_PLACEHOLDER
  //   return `${styles.outputValue}${isDisabled ? ` ${styles.outputValueDisabled}` : ''}`
  // }, [computedOutputValue])

  return (
    <div data-testid="total-insulin-stat">
      <Box className={styles.title}>
        {title}
        <span className={styles.titleData}>
          <span className={styles.titleTotal}>
            {total}
          </span>
          <span className={styles.titleSuffix}>
            U
          </span>
        </span>
        <StatTooltip annotations={annotations} />
      </Box>
      <div className={`${styles.rows} ${styles.rowsTotalInsulin}`}>
        {data.map(entry => {
          return (
            <React.Fragment key={entry.id}>
              <span className={`${styles.rowTitle} ${styles[`rowsTotalInsulin-${entry.id}`]}`}>
                {entry.title}
              </span>
              <span className={`${styles.rowValue} ${styles[`rowsTotalInsulin-${entry.id}`]}`}>
                {`${entry.value > 0 ? entry.valueString : '0'} ${entry.units}`}
              </span>
              <div className={`${styles.rowPercent} ${styles[`rowsTotalInsulin-${entry.id}`]}`}>
                <span className={styles.rowPercentValue}>{percent(Math.max(entry.value, 0))}</span>
                <span className={styles.rowPercentUnits}>%</span>
              </div>
            </React.Fragment>
          )
        })}
        {/*<div className={`${styles.commonDisplay} ${styles.outputWrapper}`}>*/}
        {/*  {footerLabel && <div className={styles.outputLabel}>{footerLabel}</div>}*/}
        {/*  <div>*/}
        {/*  <span className={outputValueClasses}>*/}
        {/*  {computedOutputValue}*/}
        {/*  </span>*/}
        {/*    <span className={styles.outputSuffix}>*/}
        {/*       {t('U/kg')}*/}
        {/*      </span>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  )
}

export const TotalInsulinStatMemoized = memo(TotalInsulinStat)
