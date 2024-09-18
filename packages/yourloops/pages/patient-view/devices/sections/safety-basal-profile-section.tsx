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
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import { makeStyles } from 'tss-react/mui'
import moment from 'moment/moment'
import { useTranslation } from 'react-i18next'
import { DeviceSystem, SecurityBasalConfig, SecurityBasalRate } from 'medical-domain'

interface SafetyBasalProfileSectionProps {
  safetyBasalConfig: SecurityBasalConfig
  deviceSystem: DeviceSystem
}

interface SafetyBasalItem {
  rate: string,
  startTime: string,
  endTime: string
}

const useStyles = makeStyles()(() => ({
  header: {
    backgroundColor: 'var(--primary-color-background)'
  },
  tableRow: {
    "&:last-child td": {
      borderBottom: 'none'
    }
  }
}))

const MINUTES_IN_ONE_HOUR = 60
const TWENTY_FOUR_HOURS_IN_MINUTES = 24 * MINUTES_IN_ONE_HOUR

export const SafetyBasalProfileSection: FC<SafetyBasalProfileSectionProps> = ({ safetyBasalConfig, deviceSystem }) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { classes } = useStyles()

  const getRateLabel = (rateValue: number) => {
    return `${rateValue} ${t('basal-rate-unit')}`
  }

  const getDisplayTime = (startInMinutes: number) => {
    const hours = Math.floor(startInMinutes / MINUTES_IN_ONE_HOUR)
    const minutes = startInMinutes % MINUTES_IN_ONE_HOUR

    return moment().hours(hours).minutes(minutes).format('h:mm a')
  }

  const getSafetyBasalItems = (safetyBasalConfig: SecurityBasalConfig): SafetyBasalItem[] => {
    const items = safetyBasalConfig.rates.map((rate: SecurityBasalRate) => ({
      rate: getRateLabel(rate.rate),
      startTime: getDisplayTime(rate.start),
      endTime: ''
    }))

    items.forEach((item, index) => {
      if (index === items.length - 1) {
        item.endTime = getDisplayTime(TWENTY_FOUR_HOURS_IN_MINUTES)
        return
      }
      item.endTime = items[index + 1].startTime
    })

    return items
  }

  const isSafetyBasalAvailable = safetyBasalConfig.rates?.length > 1
  const safetyBasalItems = isSafetyBasalAvailable ? getSafetyBasalItems(safetyBasalConfig) : []

  const noDataMessage = deviceSystem === DeviceSystem.Dblg1 ? t('safety-basal-profile-values-not-available-update-dblg1') : t('safety-basal-profile-values-not-available')

  return (
    <Card variant="outlined" sx={{ padding: theme.spacing(2) }} data-testid="safety-basal-profile-section">
      <CardHeader title={t('safety-basal-profile')} />
      <CardContent>
        {isSafetyBasalAvailable
          ? <Card variant="outlined">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow className={classes.header}>
                    <TableCell>{t('start-time')}</TableCell>
                    <TableCell>{t('end-time')}</TableCell>
                    <TableCell>{t('basal-rate')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {safetyBasalItems.map((item: SafetyBasalItem, index: number) => (
                    <TableRow key={`${item.startTime}-${index}`} className={classes.tableRow}>
                      <TableCell>{item.startTime}</TableCell>
                      <TableCell>{item.endTime}</TableCell>
                      <TableCell>{item.rate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
          : <div>{noDataMessage}</div>
        }
      </CardContent>
    </Card>
  )
}
