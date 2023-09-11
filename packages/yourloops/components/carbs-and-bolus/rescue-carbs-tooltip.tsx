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
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { RESCUE_CARBS_COLOR, useCarbsAndBolusStyles } from './carbs-and-bolus-styles'
import { useTranslation } from 'react-i18next'
import { RescueCarbsAveragePerRange } from 'medical-domain/dist/src/domains/models/statistics/carbs-statistics.model'

export const RescueCarbsTooltip: FC<{ rescueCarbs: RescueCarbsAveragePerRange }> = ({ rescueCarbs }) => {
  const { classes } = useCarbsAndBolusStyles()
  const { t } = useTranslation()

  return (
    <Box
      className={classes.hoverTooltip}
      sx={{ border: `2px solid ${RESCUE_CARBS_COLOR}` }}
    >
      <div className={`${classes.tooltipTail} rescue-carbs`} />
      <Typography
        variant="subtitle2"
        className="header"
      >
        {t('rescue-carbs')}
      </Typography>
      <Box className="content">
        <div className="flex-justify-between-align-center">
          <Typography variant="body2">{t('intakes-average')}</Typography>
          <Typography variant="body2">{rescueCarbs.numberOfIntakes}</Typography>
        </div>
        <div className="flex-justify-between-align-center">
          <Typography variant="body2">{t('confirmed-carbs')}</Typography>
          <Typography variant="body2">{rescueCarbs.confirmedCarbs}g</Typography>
        </div>
        <div className="flex-justify-between-align-center">
          <Typography variant="body2">{t('recommended-carbs')}</Typography>
          <Typography variant="body2">{rescueCarbs.recommendedCarbs}g</Typography>
        </div>
      </Box>
    </Box>
  )
}
