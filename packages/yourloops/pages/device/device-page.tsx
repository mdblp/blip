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

import React, { type FC } from 'react'
import { type TimePrefs } from 'medical-domain'
import type MedicalDataService from 'medical-domain'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import { useTheme } from '@mui/material/styles'
import { useDevice } from '../../components/device/use-device.hook'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { CgmTable, type ChangeDateParameterGroup, HistoryParameterTable, PumpTable, Table } from 'dumb'
import { sortHistoryParametersByDate } from '../../components/device/device.utils'
import { makeStyles } from 'tss-react/mui'
import { DeviceInfo } from '../../components/device/device-info'

interface DevicePageProps {
  goToDailySpecificDate: (date: number) => void
  medicalData: MedicalDataService
  timePrefs: TimePrefs
}

const useStyles = makeStyles()(() => ({
  cardHeaderAction: {
    marginTop: 0
  }
}))

export const DevicePage: FC<DevicePageProps> = ({ medicalData, timePrefs, goToDailySpecificDate }) => {
  const theme = useTheme()
  const { classes } = useStyles()
  const { t } = useTranslation()
  const {
    copySettingsToClipboard,
    lastUploadDate,
    device,
    pump,
    parameters,
    history,
    cgm
  } = useDevice(medicalData)

  return (
    <Container data-testid="device-settings-container">
      <Card variant="outlined" sx={{ padding: theme.spacing(2) }}>
        <CardHeader
          title={t('device')}
          subheader={`${t('last-upload:')} ${lastUploadDate}`}
          action={
            <Button
              variant="contained"
              disableElevation
              startIcon={<FileCopyIcon />}
              onClick={copySettingsToClipboard}
            >
              {t('text-copy')}
            </Button>
          }
          classes={{
            action: classes.cardHeaderAction
          }}
        />
        <CardContent>
          <Grid
            container
            spacing={4}
            rowSpacing={4}
          >
            <Grid item xs={12} sm={6}>
              <DeviceInfo device={device} />
              <PumpTable pump={pump} timePrefs={timePrefs} />
              <CgmTable cgm={cgm} timePrefs={timePrefs} />
            </Grid>
            <Grid item xs={12} sm={6} data-testid="parameters-container">
              <Typography color="text.secondary">{t('Parameters')}</Typography>
              <Table
                title={t('Parameters')}
                rows={parameters}
              />
            </Grid>
          </Grid>
          <HistoryParameterTable
            rows={sortHistoryParametersByDate(history) as ChangeDateParameterGroup[]}
            onSwitchToDaily={goToDailySpecificDate}
            timePrefs={timePrefs}
          />
        </CardContent>
      </Card>
    </Container>
  )
}
