/*
 * Copyright (c) 2022-2025, Diabeloop
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
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { BasicsChart } from 'tideline'
import type MedicalDataService from 'medical-domain'
import { type DateFilter, GlycemiaStatisticsService, type PumpSettings } from 'medical-domain'
import metrics from '../../lib/metrics'
import { SensorUsageStat } from '../statistics/sensor-usage-stat'
import { formatParameterValue, getPumpSettingsParameterList, sortHistory } from '../device/utils/device.utils'
import { type Patient } from '../../lib/patient/models/patient.model'
import { formatDateWithMomentLongFormat } from '../../lib/utils'
import { DataCard } from '../data-card/data-card'
import styles from 'dumb/dist/src/components/stats/common/simple-value.css'

interface DeviceUsageWidgetProps {
  dateFilter: DateFilter
  medicalDataService: MedicalDataService
  patient: Patient
}

const useStyles = makeStyles()((theme) => ({
  sectionTitles: {
    fontSize: 'var(--section-title-font-size)',
    fontWeight: 'bold',
    lineHeight: 'var(--section-title-line-height)',
    margin: 'var(--section-title-margin)',
    color: 'var(--section-title-color)'
  },
  sectionContent: {
    fontSize: '13px',
    fontWeight: 300,
    lineHeight: '15px'
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
  },
  test: {
    opacity: 1,
    display: 'inline-block',
    marginRight: '4px',
    fontWeight: 'bold',
  }
}))

export const DeviceUsageWidget: FC<DeviceUsageWidgetProps> = (props) => {
  const { patient, medicalDataService, dateFilter } = props
  const { t } = useTranslation()
  const { classes } = useStyles()
  const trackMetric = metrics.send
  const pumpSettings = medicalDataService.medicalData.pumpSettings.slice(-1)[0] as PumpSettings
  const {
    total,
    sensorUsage
  } = GlycemiaStatisticsService.getSensorUsage(medicalDataService.medicalData.cbg, dateFilter)

  const deviceData = {
    cgm: {
      label: t('CGM'),
      value: pumpSettings?.payload.cgm ? `${pumpSettings.payload.cgm.manufacturer} ${pumpSettings.payload.cgm.name}` : ''
    },
    device: {
      label: t('dbl'),
      value: pumpSettings?.payload.device.manufacturer ?? ''
    },
    pump: {
      label: t('Pump'),
      value: pumpSettings?.payload.pump.manufacturer ?? ''
    }
  }

  if (pumpSettings) {
    sortHistory(pumpSettings.payload.history)
  }

  return (
    <>
      <DataCard data-testid="device-usage-device-list">
        <Typography className={classes.sectionTitles}>{t('devices')}</Typography>
        {Object.keys(deviceData).map(
          (key) =>
            <React.Fragment key={key}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                {deviceData[key].label}
                <Box
                  display="flex"
                  alignItems="center"
                  className={styles.boldValue}
                >
                  <span className={classes.test}>
                    {deviceData[key].value}
                  </span>
                </Box>
              </Box>
            </React.Fragment>
        )}
      </DataCard>

      <DataCard data-testid="device-usage-updates">
        <Typography className={classes.sectionTitles}>
          {t('last-updates')}
        </Typography>
        <TableContainer
          data-testid="device-usage-updates-list"
          className={classes.parameterChangesTable}
        >
          <Table>
            <TableBody className={classes.sectionContent}>
              {pumpSettings && getPumpSettingsParameterList(pumpSettings.payload.history).map((parameter) => (
                <TableRow
                  key={`${parameter.name}-${parameter.effectiveDate}-${parameter.previousValue}`}
                  data-param={parameter.name}
                  data-testid={parameter.name}
                  data-changetype={parameter.changeType}
                  data-isodate={parameter.effectiveDate}
                  className={`${classes.tableRows} parameter-update`}
                >
                  <TableCell className={`${classes.sectionContent} ${classes.tableCell}`}>
                    {formatDateWithMomentLongFormat(new Date(parameter.effectiveDate), 'lll', pumpSettings.timezone)}
                  </TableCell>
                  <TableCell className={`${classes.sectionContent} ${classes.tableCell}`}>
                    {t(`params|${parameter.name}`)} (
                    {parameter.previousValue &&
                      <>
                        {formatParameterValue(parameter.previousValue, parameter.previousUnit)}{parameter.previousUnit}
                        <span> ➞ </span>
                      </>
                    }
                    {formatParameterValue(parameter.value, parameter.unit)}{parameter.unit})
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DataCard>

      <DataCard>
        <SensorUsageStat total={total} usage={sensorUsage} />
        <Divider variant="fullWidth" className={classes.divider} />
        <BasicsChart
          patient={patient}
          tidelineData={medicalDataService}
          trackMetric={trackMetric}
        />
      </DataCard>
    </>
  )
}
