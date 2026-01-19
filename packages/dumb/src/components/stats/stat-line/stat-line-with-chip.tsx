/*
 * Copyright (c) 2025, Diabeloop
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

import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import styles from '../insulin/insulin-stat.css'
import { useTheme } from '@mui/material/styles'
import { roundToOneDecimal } from 'yourloops/components/statistics/statistics.util'
import { EMPTY_DATA_PLACEHOLDER } from '../../../models/stats.model'

interface StatLineWithChipProps {
  title: string
  value: number
  units: string
  totalValue: number
}

export const StatLineWithChip: FC<StatLineWithChipProps> = (props) => {
  const { title, value, units, totalValue } = props
  const theme = useTheme()

  const getPercentage = (value: number): string => {
    // We multiply by ten and divide by ten for the rounding
    const res = Math.round(100 * 10 * value / roundToOneDecimal(totalValue)) / 10
    return res > 0 ? res.toString(10) : EMPTY_DATA_PLACEHOLDER
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
      <div>
        {title}
      </div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
        <Chip
          label={`${getPercentage(Math.max(value, 0))} %`}
          variant="outlined"
          size="small"
          sx={{ marginRight: theme.spacing(1) }}
        />
        <Box
          className={styles.row}
          sx={{
            display: "flex",
            width: "50px",
            alignItems: "baseline"
          }}>
          <span className={styles.rowValue}>
            {value > 0 ? value : '0'}
          </span>
          <span className={styles.rowUnits}>
           {units}
          </span>
        </Box>
      </Box>
    </Box>
  )
}
