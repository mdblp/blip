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
import styles from './total-carbs-stat.css'
import { StatTooltip } from '../../tooltips/stat-tooltip/stat-tooltip'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import { Unit } from 'medical-domain'

export interface TotalInsulinStatProps {
  annotations: []
  foodCarbs: number
  hideTooltip: boolean
  title: string
  totalCarbs: number
}

const TotalCarbsStat: FunctionComponent<TotalInsulinStatProps> = (props) => {
  const { annotations, hideTooltip, title, totalCarbs, foodCarbs } = props
  const { t } = useTranslation('main')

  return (
    <div data-testid="total-carbs-stat">
      <Box className={`${styles.title} ${styles.row}`}>
        {title}
        {!hideTooltip &&
          <StatTooltip annotations={annotations} />
        }
        <div className={styles.total}>
          <span className={styles.value}>
            {totalCarbs}
          </span>
          <span className={styles.suffix}>
            {Unit.Gram}
          </span>
        </div>
      </Box>
      <Box className={`${styles.rescueCarb} ${styles.row}`}>
        {t('Rescuecarbs')}
        <div className={styles.total}>
          <span className={styles.value}>
            {foodCarbs}
          </span>
          <span className={styles.suffix}>
            {Unit.Gram}
          </span>
        </div>
      </Box>
    </div>
  )
}

export const TotalCarbsStatMemoized = memo(TotalCarbsStat)
