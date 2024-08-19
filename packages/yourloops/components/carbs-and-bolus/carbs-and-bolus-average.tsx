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

import React, { FC } from 'react'
import Box from '@mui/material/Box'
import { CarbsAndBolusCell } from './carbs-and-bolus-cell'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'
import { LIGHT_BORDER, MANUAL_BOLUS_COLOR, RESCUE_CARBS_COLOR } from './carbs-and-bolus-styles'
import {
  BasalBolusStatisticsService,
  CarbsStatisticsService,
  DateFilter,
  HoursRange,
  MedicalData,
  TimeService
} from 'medical-domain'
import { CarbsAndBolusTimeRange } from './models/carbs-and-bolus.model'
import { NB_OF_DAYS_IN_A_MONTH, NB_OF_DAYS_IN_A_WEEK } from '../../constants/days'

interface CarbsAndBolusAverageProps {
  dateFilter: DateFilter
  medicalData: MedicalData
}

const useStyles = makeStyles()(() => ({
  captionColorIndicator: {
    width: 10,
    height: 10
  }
}))

export const CarbsAndBolusAverage: FC<CarbsAndBolusAverageProps> = ({ medicalData, dateFilter }) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { classes } = useStyles()
  const numberOfDays = TimeService.getNumberOfDays(dateFilter.start, dateFilter.end, dateFilter.weekDays)
  const rescueCarbsStats = CarbsStatisticsService.getRescueCarbsAverageStatistics(medicalData.meals, dateFilter)
  const manualBolusStats = BasalBolusStatisticsService.getManualBolusAverageStatistics(medicalData.bolus, dateFilter)

  const numberOfDaysSelected = (): string => {
    if (numberOfDays === NB_OF_DAYS_IN_A_WEEK) {
      return t('preset-dates-range-1week')
    }
    if (numberOfDays === NB_OF_DAYS_IN_A_WEEK * 2) {
      return t('preset-dates-range-2weeks')
    }
    if (numberOfDays === NB_OF_DAYS_IN_A_WEEK * 4) {
      return t('preset-dates-range-4weeks')
    }
    if (numberOfDays === NB_OF_DAYS_IN_A_MONTH * 3) {
      return t('preset-dates-range-3months')
    }
    return t('number-of-day-selected', { numberOfDays })
  }

  return (
    <Box
      margin="32px 10px 32px 40px"
      data-testid="rescue-carbs-and-manual-bolus-average"
    >
      <Typography sx={{ fontWeight: 500, marginBottom: theme.spacing(1) }}
                  data-testid="title-rescue-carbs-and-manual-bolus-average">
        {t('daily-rescue-carbs-and-manual-and-pen-bolus', { numberOfDays: numberOfDaysSelected() })}
      </Typography>
      <Box display="flex">
        <CarbsAndBolusCell
          time={CarbsAndBolusTimeRange.Midnight}
          rescueCarbs={rescueCarbsStats.get(HoursRange.MidnightToThree)}
          manualBolus={manualBolusStats.get(HoursRange.MidnightToThree)}
        />
        <CarbsAndBolusCell
          time={CarbsAndBolusTimeRange.Three}
          rescueCarbs={rescueCarbsStats.get(HoursRange.ThreeToSix)}
          manualBolus={manualBolusStats.get(HoursRange.ThreeToSix)}
        />
        <CarbsAndBolusCell
          time={CarbsAndBolusTimeRange.Six}
          rescueCarbs={rescueCarbsStats.get(HoursRange.SixToNine)}
          manualBolus={manualBolusStats.get(HoursRange.SixToNine)}
        />
        <CarbsAndBolusCell
          time={CarbsAndBolusTimeRange.Nine}
          rescueCarbs={rescueCarbsStats.get(HoursRange.NineToTwelve)}
          manualBolus={manualBolusStats.get(HoursRange.NineToTwelve)}
        />
        <CarbsAndBolusCell
          time={CarbsAndBolusTimeRange.Twelve}
          rescueCarbs={rescueCarbsStats.get(HoursRange.TwelveToFifteen)}
          manualBolus={manualBolusStats.get(HoursRange.TwelveToFifteen)}
        />
        <CarbsAndBolusCell
          time={CarbsAndBolusTimeRange.Fifteen}
          rescueCarbs={rescueCarbsStats.get(HoursRange.FifteenToEighteen)}
          manualBolus={manualBolusStats.get(HoursRange.FifteenToEighteen)}
        />
        <CarbsAndBolusCell
          time={CarbsAndBolusTimeRange.Eighteen}
          rescueCarbs={rescueCarbsStats.get(HoursRange.EighteenToTwentyOne)}
          manualBolus={manualBolusStats.get(HoursRange.EighteenToTwentyOne)}
        />
        <CarbsAndBolusCell
          time={CarbsAndBolusTimeRange.TwentyOne}
          rescueCarbs={rescueCarbsStats.get(HoursRange.TwentyOneToMidnight)}
          manualBolus={manualBolusStats.get(HoursRange.TwentyOneToMidnight)}
          sx={{ borderRight: LIGHT_BORDER }}
        />
      </Box>
      <Box
        display="flex"
        justifyContent="end"
        alignItems="baseline"
        marginTop={1}
        data-testid="rescue-carbs-and-manual-bolus-average-caption"
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
