/**
 * Copyright (c) 2022 - 2023, Diabeloop
 * Device Usage widget component
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

import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import _ from 'lodash'
import { makeStyles } from 'tss-react/mui'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import SettingsDialog from './settingsDialog'
import PhonelinkSetupOutlinedIcon from '@mui/icons-material/PhonelinkSetupOutlined'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import { BasicsChart } from 'tideline'
import { getParametersChanges, getLongDayHourFormat, formatParameterValue } from 'tidepool-viz'
import GenericDashboardCard from 'yourloops/components/dashboard-widgets/generic-dashboard-card'
import { SensorUsageStat } from 'yourloops/components/statistics/sensor-usage-stat'
import {
  GlycemiaStatisticsService
} from 'medical-domain/dist/src/domains/repositories/statistics/glycemia-statistics.service'
import { TimeService } from 'medical-domain'

const useStyles = makeStyles()((theme) => ({
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
  deviceLabels: {
    paddingLeft: theme.spacing(2)
  },
  tableRows: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.grey[100]
    }
  },
  tableCell: {
    padding: theme.spacing(0.2, 0.5)
  },
  divider: {
    margin: theme.spacing(1, 0)
  },
  parameterChangesTable: {
    maxHeight: 200
  }
}))

const getLabel = (row, t) => {
  const fCurrentValue = `${formatParameterValue(row.value, row.unit)} ${row.unit}`
  const currentLabel = t(`params|${row.name}`)
  switch (row.changeType) {
    case 'added':
      return `${currentLabel} (${fCurrentValue})`
    case 'deleted':
      return `${currentLabel} (${fCurrentValue} -> ${t('deleted')})`
    case 'updated':
      return `${currentLabel} (${formatParameterValue(row.previousValue, row.previousUnit)} ${row.unit} -> ${fCurrentValue})`
    default:
      return `${currentLabel} X (${fCurrentValue})`
  }
}

const DeviceUsage = (props) => {
  //eslint-disable-next-line
  const {
    // eslint-disable-next-line react/prop-types
    bgPrefs,
    // eslint-disable-next-line react/prop-types
    timePrefs,
    // eslint-disable-next-line react/prop-types
    patient,
    // eslint-disable-next-line react/prop-types
    dataUtil,
    // eslint-disable-next-line react/prop-types
    tidelineData,
    // eslint-disable-next-line react/prop-types
    medicalData,
    // eslint-disable-next-line react/prop-types
    dateFilter,
    // eslint-disable-next-line react/prop-types
    trackMetric,
    // eslint-disable-next-line react/prop-types
    onSwitchToDaily
  } = props
  const [dialogOpened, setDialogOpened] = React.useState(false)
  const { t } = useTranslation()
  const { classes } = useStyles()
  //eslint-disable-next-line
  const mostRecentSettings = tidelineData.grouped.pumpSettings.slice(-1)[0]
  // eslint-disable-next-line react/prop-types
  const cbgSelected = dataUtil.bgSources.cbg
  const device = mostRecentSettings?.payload?.device ?? {}
  const pump = mostRecentSettings?.payload?.pump ?? {}
  const cgm = mostRecentSettings?.payload?.cgm ?? {}
  const history = _.sortBy(_.cloneDeep(mostRecentSettings?.payload?.history), ['changeDate'])
  const dateFormat = getLongDayHourFormat()
  const paramChanges = getParametersChanges(history, timePrefs, dateFormat, false)
  // eslint-disable-next-line react/prop-types
  const numberOfDays = TimeService.getNumberOfDays(dateFilter.start, dateFilter.end, dateFilter.weekDays)
  const {
    total: SensorUsageTotal,
    sensorUsage
    // eslint-disable-next-line react/prop-types
  } = GlycemiaStatisticsService.getSensorUsage(medicalData.cbg, numberOfDays, dateFilter)

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

  return <>
    <GenericDashboardCard
      avatar={<PhonelinkSetupOutlinedIcon />}
      title={t('device-usage')}
      data-testid="device-usage-card"
      action={
        <IconButton
          data-testid="settings-button"
          aria-label="settings"
          onClick={() => setDialogOpened(true)}
          size="small"
        >
          <MoreHorizOutlinedIcon />
        </IconButton>
      }
    >
      <CardContent>
        <Box data-testid="device-usage-device-list">
          <Typography className={classes.sectionTitles}>{t('devices')}</Typography>
          <Grid className={classes.sectionContent} container spacing={1}>
            {Object.keys(deviceData).map(
              (key) =>
                <React.Fragment key={key}>
                  <Grid item xs={6}>
                    <div className={`${classes.deviceLabels} device-label`}>
                      {deviceData[key].label}
                    </div>
                  </Grid>
                  <Grid item xs={6} className="device-value">
                    {deviceData[key].value}
                  </Grid>
                </React.Fragment>
            )}
          </Grid>
        </Box>
        <Divider variant="fullWidth" className={classes.divider} />
        <Box data-testid="device-usage-updates">
          <Typography className={classes.sectionTitles}>{t('last-updates')}</Typography>
          <TableContainer data-testid="device-usage-updates-list" className={classes.parameterChangesTable}>
            <Table>
              <TableBody className={classes.sectionContent}>
                {paramChanges.map((row, index) =>
                  (
                    <TableRow
                      key={row.key + index}
                      data-param={row.name}
                      data-testid={row.name}
                      data-changetype={row.changeType}
                      data-isodate={row.effectiveDate}
                      className={`${classes.tableRows} parameter-update`}
                    >
                      {['date', 'value'].map((column) => {
                        return (
                          <TableCell
                            className={`${classes.sectionContent} ${classes.tableCell} parameter-${column}`}
                            key={`${column}-${row.key}-${index}`}
                          >
                            {column === 'date' ? row.parameterDate : getLabel(row, t)}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Divider variant="fullWidth" className={classes.divider} />
        {cbgSelected &&
          <>
            <SensorUsageStat sensorUsageTotal={SensorUsageTotal} usage={sensorUsage} />
            <Divider variant="fullWidth" className={classes.divider} />
          </>
        }
        <BasicsChart
          //eslint-disable-next-line
          bgClasses={bgPrefs.bgClasses}
          //eslint-disable-next-line
          bgUnits={bgPrefs.bgUnits}
          onSelectDay={() => null}
          patient={patient}
          tidelineData={tidelineData}
          timePrefs={timePrefs}
          trackMetric={trackMetric}
        />
      </CardContent>
    </GenericDashboardCard>
    {dialogOpened &&
      <SettingsDialog
        bgPrefs={bgPrefs}
        timePrefs={timePrefs}
        patientData={tidelineData}
        onSwitchToDaily={onSwitchToDaily}
        trackMetric={trackMetric}
        setOpen={setDialogOpened}
      />
    }
  </>
}

DeviceUsage.propType = {
  bgPrefs: PropTypes.object.isRequired,
  timePrefs: PropTypes.object.isRequired,
  patient: PropTypes.object.isRequired,
  dataUtil: PropTypes.object.isRequired,
  tidelineData: PropTypes.object.isRequired,
  medicalData: PropTypes.object.isRequired,
  dateFilter: PropTypes.object.isRequired,
  trackMetric: PropTypes.func.isRequired,
  onSwitchToDaily: PropTypes.func.isRequired
}
export default DeviceUsage
