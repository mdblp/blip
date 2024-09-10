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
import React, { type FunctionComponent, memo } from 'react'
import styles from './total-carbs-stat.css'
import { StatTooltip } from '../../tooltips/stat-tooltip/stat-tooltip'
import Box from '@mui/material/Box'
import { Unit } from 'medical-domain'

export interface TotalCarbsStatProps {
  title: string
  annotations?: string[]
  value: number
  isTitleBold?: boolean
}

const CarbsStatItem: FunctionComponent<TotalCarbsStatProps> = (props) => {
  const { annotations, isTitleBold, value, title } = props
  return (
    <Box
      className={`${styles.row} ${annotations ? null : styles.carbs} ${isTitleBold ? styles.titleBold : null}`}
      data-testid="estimatedCarbs"
    >
      {title}

      {annotations &&
        <StatTooltip
          annotations={annotations}
        />
      }

      {!value
        ? <>
          <div className={styles['disabled-line']} />
          <Box className={styles['disabled-label']} fontSize="24px" marginLeft="auto">
            --
          </Box>
        </>

        : <div className={styles.total}>
          <span className={styles.value}>{value}</span>
          <span className={styles.suffix}>{Unit.Gram}</span>
        </div>
      }
    </Box>
  )
}
export const CarbsStatItemMemoized = memo(CarbsStatItem)
