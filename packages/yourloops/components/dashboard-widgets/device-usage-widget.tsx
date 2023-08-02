/*
 * Copyright (c) 2022-2023, Diabeloop
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
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import PhonelinkSetupOutlinedIcon from '@mui/icons-material/PhonelinkSetupOutlined'
import { BasicsChart } from 'tideline'
import MedicalDataService, { GlycemiaStatisticsService, type DateFilter, type PumpSettings, type TimePrefs } from 'medical-domain'
import metrics from '../../lib/metrics'
import GenericDashboardCard from './generic-dashboard-card'
import { SensorUsageStat } from '../statistics/sensor-usage-stat'
import {
  flattenParametersChange,
  formatParameterValue,
  sortHistoryParametersByDate,
  sortPumpSettingsParametersByDate,
  sortPumpSettingsParametersByLevel
} from '../device/utils/device.utils'
import { type Patient } from '../../lib/patient/models/patient.model'
import { type BgPrefs } from 'dumb'
import { formatDateWithMomentLongFormat } from '../../lib/utils'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'

interface DeviceUsageWidgetProps {
  bgPrefs: BgPrefs
  dateFilter: DateFilter
  medicalDataService: MedicalDataService
  patient: Patient
  timePrefs: TimePrefs
}

const useStyles = makeStyles()((theme) => ({
  arrowIcon: {
    position: 'relative',
    top: '6px',
    marginInline: '2px'
  },
  sectionTitles: {
    fontSize: 'var(--section-title-font-size)',
    fontWeight: 'var(--section-title-font-weight)',
    lineHeight: 'var(--section-title-line-height)',
    margin: 'var(--section-title-margin)',
    color: 'var(--section-title-color)'
  },
  sectionContent: {
    fontSize: '13px',
    fontWeight: 300,
    lineHeight: '15px',
    color: '#444444'
  },
  tableRows: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.grey[100]
    }
  },
  tableCell: {
    height: '30px',
    padding: theme.spacing(0.2, 0.5)
  },
  divider: {
    margin: theme.spacing(1, 0)
  },
  parameterChangesTable: {
    maxHeight: 200
  }
}))

export const DeviceUsageWidget: FC<DeviceUsageWidgetProps> = (props) => {
  const { bgPrefs, timePrefs, patient, medicalDataService, dateFilter } = props
  const { t } = useTranslation()
  const { classes } = useStyles()
  const trackMetric = metrics.send
  const pumpSettings = [...medicalDataService.grouped.pumpSettings].pop() as PumpSettings
  const { device, pump, cgm, history } = pumpSettings.payload
  const {
    total,
    sensorUsage
  } = GlycemiaStatisticsService.getSensorUsage(medicalDataService.medicalData.cbg, dateFilter)

  const deviceData = {
    cgm: {
      label: `${t('CGM')}:`,
      value: cgm.manufacturer && cgm.name ? `${cgm.manufacturer} ${cgm.name}` : ''
    },
    device: {
      label: `${t('dbl')}:`,
      value: device.manufacturer ?? ''
    },
    pump: {
      label: `${t('Pump')}:`,
      value: pump.manufacturer ?? ''
    }
  }

  sortHistoryParametersByDate(history)
  sortPumpSettingsParametersByDate(history)
  sortPumpSettingsParametersByLevel(history)
  const pumpSettingsParameters = flattenParametersChange(history)

  return (
    <GenericDashboardCard
      avatar={<PhonelinkSetupOutlinedIcon />}
      title={t('device-usage')}
      data-testid="device-usage-card"
    >
      <CardContent>
        <Box data-testid="device-usage-device-list">
          <Typography className={classes.sectionTitles}>{t('devices')}</Typography>
          <Grid className={classes.sectionContent} container spacing={1}>
            {Object.keys(deviceData).map(
              (key) =>
                <React.Fragment key={key}>
                  <Grid item xs={6}>
                    <Box paddingLeft={2}>
                      {deviceData[key].label}
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    {deviceData[key].value}
                  </Grid>
                </React.Fragment>
            )}
          </Grid>
        </Box>

        <Divider variant="fullWidth" className={classes.divider} />

        <Box data-testid="device-usage-updates">
          <Typography className={classes.sectionTitles}>
            {t('last-updates')}
          </Typography>
          <TableContainer
            data-testid="device-usage-updates-list"
            className={classes.parameterChangesTable}
          >
            <Table>
              <TableBody className={classes.sectionContent}>
                {pumpSettingsParameters.map((parameter) => (
                  <TableRow
                    key={`${parameter.name}-${parameter.effectiveDate}-${parameter.previousValue}`}
                    data-param={parameter.name}
                    data-testid={parameter.name}
                    data-changetype={parameter.changeType}
                    data-isodate={parameter.effectiveDate}
                    className={`${classes.tableRows} parameter-update`}
                  >
                    <TableCell className={`${classes.sectionContent} ${classes.tableCell}`}>
                      {formatDateWithMomentLongFormat(new Date(parameter.effectiveDate), 'llll', pumpSettings.timezone)}
                    </TableCell>
                    <TableCell className={`${classes.sectionContent} ${classes.tableCell}`}>
                      {t(`params|${parameter.name}`)} (
                      {parameter.previousValue &&
                        <>
                          {formatParameterValue(parameter.previousValue, parameter.previousUnit)}{parameter.previousUnit}
                          <TrendingFlatIcon fontSize="small" className={classes.arrowIcon} />
                        </>
                      }
                      {formatParameterValue(parameter.value, parameter.unit)}{parameter.unit})
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Divider variant="fullWidth" className={classes.divider} />
        <SensorUsageStat total={total} usage={sensorUsage} />
        <Divider variant="fullWidth" className={classes.divider} />
        <BasicsChart
          bgClasses={bgPrefs.bgClasses}
          bgUnits={bgPrefs.bgUnits}
          onSelectDay={() => null}
          patient={patient}
          tidelineData={medicalDataService}
          timePrefs={timePrefs}
          trackMetric={trackMetric}
        />
      </CardContent>
    </GenericDashboardCard>)
}
