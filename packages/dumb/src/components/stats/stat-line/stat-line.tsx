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
import styles from '../insulin/insulin-stat.css'
import commonStyles from '../../../styles/stat-common.css'
import { StatTooltip } from '../../tooltips/stat-tooltip/stat-tooltip'

interface StatLineProps {
  title: string
  value: string | number
  units: string
  valueClasses: string
  isBold?: boolean
  annotations?: string[]
}

export const StatLine: FC<StatLineProps> = (props) => {
  const { title, value, units, valueClasses, annotations, isBold } = props

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box className={isBold ? commonStyles.title : ''}>
        {title}
        {annotations && <StatTooltip annotations={annotations} />}
      </Box>
      {value ?
        <Box
          display="flex"
          alignItems="baseline"
          className={styles.boldValue}
        >
        <span className={valueClasses}>
          {value}
        </span>
          <span className={styles.rowUnits}>
          {units}
        </span>
        </Box>
        : <Box className={styles.disabledLabel} fontSize="24px" marginLeft="auto">
            --
          </Box>
      }
    </Box>
  )
}
