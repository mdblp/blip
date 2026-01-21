/*
 * Copyright (c) 2023-2025, Diabeloop
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

import React, { type FunctionComponent } from 'react'
import commonStyles from '../../../../styles/tooltip-common.css'
import styles from './tooltip-line.css'
import { TooltipColor } from '../../../../models/enums/tooltip-color.enum'
import Box from '@mui/material/Box'

interface TooltipLineProps {
  label: string
  value?: number | string | null
  units?: string | null
  isBold?: boolean
  customColor?: TooltipColor
}

export const TooltipLine: FunctionComponent<TooltipLineProps> = (props) => {
  const { customColor, isBold, label, value, units } = props
  const isValueDefined = value !== undefined && value !== null

  const getClassByTooltipColor = (tooltipColor: TooltipColor): string => {
    switch (tooltipColor) {
      case TooltipColor.DarkGray:
        return styles.colorDarkGray
      case TooltipColor.Undelivered:
        return styles.colorUndelivered
    }
  }

  const getGlobalClasses = (): string => {
    const textClass = isBold ? commonStyles.rowBold : commonStyles.row
    const colorClass = customColor ? getClassByTooltipColor(customColor) : undefined

    return colorClass ? `${textClass} ${colorClass}` : textClass
  }

  return (
    <div className={getGlobalClasses()}>
      <span>{label}</span>
      {isValueDefined &&
        <Box
          sx={{
            flexDirection: "row",
            ml: 1
          }}>
          <span>{value}</span>
          {units && <span className={styles.units}>{units}</span>}
        </Box>
      }
    </div>
  )
}
