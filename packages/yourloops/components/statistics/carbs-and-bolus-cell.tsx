/*
 * Copyright (c) 2023, Diabeloop
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
import Typography from '@mui/material/Typography'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'
import { SxProps } from '@mui/system'

interface CarbsAndBolusCellProps {
  manualBolus: number
  rescueCarbs: number
  sx?: SxProps<Theme>
  time: string
}

export const LIGHT_BORDER = '1px solid #e7e7e7'
export const RESCUE_CARBS_COLOR = '#E98D7C'
export const MANUAL_BOLUS_COLOR = '#8C65D6'

const useStyles = makeStyles()((theme: Theme) => ({
  cell: {
    borderRadius: theme.spacing(1),
    margin: 'auto',
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 90
  },
  cellsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    borderTop: LIGHT_BORDER,
    borderBottom: LIGHT_BORDER,
    backgroundColor: '#f8f8f8',
    gap: 10,
    paddingBlock: theme.spacing(2)
  }
}))

export const CarbsAndBolusCell: FC<CarbsAndBolusCellProps> = (props) => {
  const { time, manualBolus, rescueCarbs, sx } = props
  const { classes, theme } = useStyles()
  const carbsCellBackgroundColor = !!rescueCarbs ? RESCUE_CARBS_COLOR : theme.palette.grey[200]
  const bolusCellBackgroundColor = !!manualBolus ? MANUAL_BOLUS_COLOR : theme.palette.grey[200]

  return (
    <Box
      width="12.5%"
      sx={{ ...sx, borderLeft: LIGHT_BORDER }}
    >
      <Typography
        variant="caption"
        sx={{ marginLeft: '4px' }}
      >
        {time}
      </Typography>
      <Box className={classes.cellsWrapper}>
        <Box
          className={classes.cell}
          sx={{ backgroundColor: carbsCellBackgroundColor }}
        >
          <Typography
            variant="caption"
            sx={{ color: '#444444' }}
          >
            {rescueCarbs}
          </Typography>
        </Box>
        <Box
          className={classes.cell}
          sx={{ backgroundColor: bolusCellBackgroundColor }}
        >
          <Typography
            variant="caption"
            sx={{ color: 'white' }}
          >
            {manualBolus}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
