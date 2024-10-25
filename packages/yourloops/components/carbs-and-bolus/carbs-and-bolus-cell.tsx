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

import React, { FC, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Theme } from '@mui/material/styles'
import { SxProps } from '@mui/system'
import { TypeOfCell } from './carbs-and-bolus.model'
import { LIGHT_BORDER, MANUAL_BOLUS_COLOR, RESCUE_CARBS_COLOR, useCarbsAndBolusStyles } from './carbs-and-bolus-styles'
import { RescueCarbsTooltip } from './rescue-carbs-tooltip'
import { ManualBolusTooltip } from './manual-bolus-tooltip'
import { ManualBolusAveragePerRange, RescueCarbsAveragePerRange } from 'medical-domain'
import { formatClocktimeFromMsPer24, getSimpleHourFormatSpace } from 'dumb'

interface CarbsAndBolusCellProps {
  manualBolus: ManualBolusAveragePerRange
  rescueCarbs: RescueCarbsAveragePerRange
  sx?: SxProps<Theme>
  time: number
}

export const CarbsAndBolusCell: FC<CarbsAndBolusCellProps> = (props) => {
  const { time, manualBolus, rescueCarbs, sx } = props
  const { classes, theme } = useCarbsAndBolusStyles()
  const { numberOfRescueCarbs } = rescueCarbs
  const { numberOfInjections } = manualBolus
  const carbsCellBackgroundColor = numberOfRescueCarbs > 0 ? RESCUE_CARBS_COLOR : theme.palette.grey[200]
  const bolusCellBackgroundColor = numberOfInjections > 0 ? MANUAL_BOLUS_COLOR : theme.palette.grey[200]
  const [cellOnHover, setCellOnHover] = useState<TypeOfCell>(undefined)

  const openPopover = (cellOnHover: TypeOfCell): void => {
    setCellOnHover(cellOnHover)
  }

  const closePopover = (): void => {
    setCellOnHover(undefined)
  }

  const displayTime = formatClocktimeFromMsPer24(time, getSimpleHourFormatSpace())
  const displayTimeWithoutSpaces = displayTime.replace(/\s+/g, '')

  return (
    <Box
      width="12.5%"
      sx={{ ...sx, borderLeft: LIGHT_BORDER }}
      data-testid="carbs-and-bolus-cell"
    >
      <Typography
        variant="caption"
        sx={{ marginLeft: theme.spacing(0.5) }}
      >
        {displayTime}
      </Typography>
      <Box className={classes.cellsWrapper}>
        <Box
          className={classes.cell}
          sx={{ backgroundColor: carbsCellBackgroundColor }}
          onMouseEnter={() => openPopover(TypeOfCell.RescueCarbs)}
          onMouseLeave={closePopover}
          data-testid={`rescue-carbs-cell-${displayTimeWithoutSpaces}`}
        >
          <Typography
            variant="caption"
            sx={{ color: theme.palette.common.white }}
          >
            {numberOfRescueCarbs > 0 ? numberOfRescueCarbs : ''}
          </Typography>
          {numberOfRescueCarbs > 0 && cellOnHover === TypeOfCell.RescueCarbs &&
            <RescueCarbsTooltip rescueCarbs={rescueCarbs} />
          }
        </Box>

        <Box
          className={classes.cell}
          sx={{ backgroundColor: bolusCellBackgroundColor }}
          onMouseEnter={() => openPopover(TypeOfCell.ManualBolus)}
          onMouseLeave={closePopover}
        >
          <Typography
            variant="caption"
            sx={{ color: theme.palette.common.white }}
            data-testid={`manual-bolus-cell-${displayTimeWithoutSpaces}`}
          >
            {numberOfInjections > 0 ? numberOfInjections : ''}
          </Typography>
          {numberOfInjections > 0 && cellOnHover === TypeOfCell.ManualBolus &&
            <ManualBolusTooltip manualBolus={manualBolus} />
          }
        </Box>
      </Box>
    </Box>
  )
}
