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

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import React, { FC } from 'react'
import { DateFilter, DurationUnit, ReservoirChange } from 'medical-domain'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import { formatDateWithMomentLongFormat, formatDurationToBiggestUnit } from '../../lib/utils'
import Button from '@mui/material/Button'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { SimpleValue } from 'dumb'

interface CartridgeChangesStatProps {
  dateFilter: DateFilter
  goToDailySpecificDate: (date: Date) => void
  reservoirChanges: ReservoirChange[]
}

const useStyles = makeStyles()(() => ({
  deviceValue: {
    fontWeight: 'bold'
  }
}))

export const CartridgeChangesStat: FC<CartridgeChangesStatProps> = (props) => {
  const { dateFilter, goToDailySpecificDate, reservoirChanges } = props
  const { t } = useTranslation()
  const theme = useTheme()
  const { classes } = useStyles()

  const sortedReservoirChanges = reservoirChanges.sort((a, b) => new Date(a.normalTime).getTime() - new Date(b.normalTime).getTime())

  const getDurationSinceLastChange = (currentChange: ReservoirChange): { duration: number, unit: DurationUnit } => {
    const currentIndex = sortedReservoirChanges.findIndex(change => change.id === currentChange.id)
    if (currentIndex === 0) {
      return null
    }

    const previousChange = reservoirChanges[currentIndex - 1]
    const currentTime = new Date(currentChange.normalTime)
    const previousTime = new Date(previousChange.normalTime)
    const timeDifference = currentTime.getTime() - previousTime.getTime()

    return formatDurationToBiggestUnit(timeDifference)
  }

  const getDurationUnitTranslation = (durationUnit: DurationUnit, isPlural: boolean): string => {
    switch (durationUnit) {
      case DurationUnit.Days:
        return isPlural ? t('days') : t('day')
      case DurationUnit.Hours:
        return isPlural ? t('hours') : t('hour')
      case DurationUnit.Minutes:
        return isPlural ? t('minutes') : t('minute')
      case DurationUnit.Seconds:
        return isPlural ? t('seconds') : t('second')
      case DurationUnit.Milliseconds:
        return isPlural ? t('milliseconds') : t('millisecond')
    }
  }


  const changesToDisplay = sortedReservoirChanges
    .filter((reservoirChange) => {
      const changeDate = new Date(reservoirChange.normalTime).getTime()
      return changeDate >= dateFilter.start && changeDate <= dateFilter.end
    })
    .map((reservoirChange) => {
      const timeAsDate = new Date(reservoirChange.normalTime)
      const timezone = reservoirChange.timezone
      const timeToDisplay = formatDateWithMomentLongFormat(timeAsDate, 'lll', timezone)

      const durationSinceLastChange = getDurationSinceLastChange(reservoirChange)
      const duration = durationSinceLastChange?.duration
      const durationAsString = durationSinceLastChange ? duration.toString() : t('--')
      const durationUnit = durationSinceLastChange ? getDurationUnitTranslation(durationSinceLastChange.unit, duration !== 1) : ''

      return {
        id: reservoirChange.id,
        timeToDisplay,
        timeAsDate,
        duration: durationAsString,
        durationUnit
      }
    })

  return (
    <>
      <Typography sx={{ fontWeight: 'bold', paddingBottom: theme.spacing(1) }}>
        {t('Infusion site changes')}
      </Typography>
      {changesToDisplay.length > 0 ?
        changesToDisplay.map(
          (changeItem) =>
            <React.Fragment key={changeItem.id}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Button
                  variant="text"
                  size="medium"
                  startIcon={<OpenInNewIcon />}
                  onClick={() => goToDailySpecificDate(changeItem.timeAsDate)}
                >
                  {changeItem.timeToDisplay}
                </Button>

                <Box
                  display="flex"
                  alignItems="center"
                  className={classes.deviceValue}
                >
                  <SimpleValue suffix={changeItem.durationUnit} value={changeItem.duration} />
                </Box>
              </Box>
            </React.Fragment>
        ) :
        <Typography color="text.secondary">{t('no-cartridge-changes')}</Typography>}
    </>
  )
}
