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
import { CarbsAndBolusCell } from './carbs-and-bolus-cell'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'
import { LIGHT_BORDER, MANUAL_BOLUS_COLOR, RESCUE_CARBS_COLOR } from './carbs-and-bolus-styles'

const useStyles = makeStyles()(() => ({
  captionColorIndicator: {
    width: 10,
    height: 10
  }
}))

export const CarbsAndBolusAverage: FC = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { classes } = useStyles()

  return (
    <Box margin="32px 10px 32px 40px">
      <Typography sx={{ fontWeight: 500, marginBottom: theme.spacing(1) }}>
        {t('daily-rescue-carbs-and-manual-bolus')}
      </Typography>
      <Box display="flex">
        <CarbsAndBolusCell
          time="0h"
          manualBolus={undefined}
          rescueCarbs={undefined}
        />
        <CarbsAndBolusCell
          time="3h"
          manualBolus={0.5}
          rescueCarbs={0.5}
        />
        <CarbsAndBolusCell
          time="6h"
          manualBolus={undefined}
          rescueCarbs={undefined}
        />
        <CarbsAndBolusCell
          time="9h"
          manualBolus={1}
          rescueCarbs={0.5}
        />
        <CarbsAndBolusCell
          time="12h"
          manualBolus={undefined}
          rescueCarbs={undefined}
        />
        <CarbsAndBolusCell
          time="15h"
          manualBolus={undefined}
          rescueCarbs={0.5}
        />
        <CarbsAndBolusCell
          time="18h"
          manualBolus={0.5}
          rescueCarbs={0.5}
        />
        <CarbsAndBolusCell
          time="21h"
          manualBolus={0.1}
          rescueCarbs={undefined}
          sx={{ borderRight: LIGHT_BORDER }}
        />
      </Box>
      <Box
        display="flex"
        justifyContent="end"
        alignItems="baseline"
        marginTop={1}
      >
        <Box
          className={classes.captionColorIndicator}
          marginX={1}
          sx={{ backgroundColor: RESCUE_CARBS_COLOR }}
        />
        <Typography variant="caption">{t('rescue-carbs-number')}</Typography>
        <Box
          className={classes.captionColorIndicator}
          marginX={1}
          sx={{ backgroundColor: MANUAL_BOLUS_COLOR }}
        />
        <Typography variant="caption">{t('manual-bolus-number')}</Typography>
      </Box>
    </Box>
  )
}
