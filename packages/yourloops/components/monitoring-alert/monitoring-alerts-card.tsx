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

import React from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from 'tss-react/mui'
import { Box, IconButton, Skeleton } from '@mui/material'
import { type Patient } from '../../lib/patient/models/patient.model'
import Typography from '@mui/material/Typography'
import { useAuth } from '../../lib/auth'
import { useTheme } from '@mui/material/styles'
import { MonitoringAlertsCardSkeletonValue } from './monitoring-alerts-card-skeleton-value'
import { useNavigate } from 'react-router-dom'
import { AppUserRoute } from '../../models/enums/routes.enum'
import { MONITORING_ALERTS_SECTION_ID } from '../../pages/patient-view/target-and-alerts/target-and-alerts-view'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { DataCard } from '../data-card/data-card'
import { buildSimpleValueProps } from 'dumb/dist/src/components/stats/simple/simple-stat.util'
import { SimpleValue, StatFormats } from 'dumb'

const monitoringAlertsCardStyles = makeStyles()((theme) => {
  return {
    alertColor: {
      color: theme.palette.warning.main
    }
  }
})

export interface MonitoringAlertsCardProps {
  patient: Patient
}

const SKELETON_TITLE_HEIGHT = 15
const SKELETON_TITLE_WIDTH = 200

function MonitoringAlertsCard(props: MonitoringAlertsCardProps): JSX.Element {
  const { t } = useTranslation('yourloops')
  const { patient } = props
  const { user } = useAuth()
  const theme = useTheme()
  const { classes } = monitoringAlertsCardStyles()
  const navigate = useNavigate()

  const monitoringAlerts = patient.monitoringAlerts
  const timeSpentAwayFromTargetActive = monitoringAlerts?.timeSpentAwayFromTargetActive
  const frequencyOfSevereHypoglycemiaActive = monitoringAlerts?.frequencyOfSevereHypoglycemiaActive
  const nonDataTransmissionActive = monitoringAlerts?.nonDataTransmissionActive
  const noActiveMonitoringAlert = !timeSpentAwayFromTargetActive && !frequencyOfSevereHypoglycemiaActive && !nonDataTransmissionActive

  const buildNumberOfMonitoringAlertsLabel = (): string => {
    if (noActiveMonitoringAlert) {
      return ''
    }
    const number = [timeSpentAwayFromTargetActive, frequencyOfSevereHypoglycemiaActive, nonDataTransmissionActive].filter(value => value).length
    return ` (+${number})`
  }

  const numberOfMonitoringAlertsLabel = buildNumberOfMonitoringAlertsLabel()

  const timeSpentAwayFromTargetRateProps = buildSimpleValueProps(StatFormats.Percentage, 100, patient.monitoringAlerts.timeSpentAwayFromTargetRate)
  const frequencyOfSevereHypoglycemiaRateProps = buildSimpleValueProps(StatFormats.Percentage, 100, patient.monitoringAlerts.frequencyOfSevereHypoglycemiaRate)
  const nonDataTransmissionRateProps = buildSimpleValueProps(StatFormats.Percentage, 100, patient.monitoringAlerts.nonDataTransmissionRate)

  return (
    <DataCard data-testid="monitoring-alerts-card">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ paddingBottom: theme.spacing(1) }}
      >
        <Typography sx={{ fontWeight: 'bold' }}>
          {`${t('monitoring-alerts')}${numberOfMonitoringAlertsLabel}`}
        </Typography>
        {user.isUserHcp() &&
          <IconButton
            id="configure-icon-button-id"
            aria-label={t('configure-monitoring-alerts')}
            data-testid="monitoring-alert-card-configure-button"
            data-stonlyid="monitoring-alerts-card-configure-button"
            onClick={() => {
              navigate(`..${AppUserRoute.PatientProfile}#${MONITORING_ALERTS_SECTION_ID}`, { relative: 'path' })
            }}
            size="small"
          >
            <SettingsOutlinedIcon />
          </IconButton>
        }
      </Box>

      {patient.monitoringAlerts
        ? <>
          <Box
            id="time-away-target-monitoring-alert-id"
            display="flex"
            justifyContent="space-between"
            className={timeSpentAwayFromTargetActive ? classes.alertColor : ''}
          >
            {t('time-out-of-range-target')}
            {patient.monitoringAlerts.timeSpentAwayFromTargetRate
              ? <SimpleValue {...timeSpentAwayFromTargetRateProps} />
              : <Typography sx={{ fontWeight: 'bold' }}>
                {t('N/A')}
              </Typography>
            }
          </Box>
          <Box
            id="severe-hypo-monitoring-alert-id"
            display="flex"
            justifyContent="space-between"
            className={frequencyOfSevereHypoglycemiaActive ? classes.alertColor : ''}
          >
            {t('alert-hypoglycemic')}
            {patient.monitoringAlerts.frequencyOfSevereHypoglycemiaRate
              ? <SimpleValue {...frequencyOfSevereHypoglycemiaRateProps} />
              : <Typography sx={{ fontWeight: 'bold' }}>
                {t('N/A')}
              </Typography>
            }
          </Box>
          <Box
            id="non-data-transmission-monitoring-alert-id"
            display="flex"
            justifyContent="space-between"
            className={nonDataTransmissionActive ? classes.alertColor : ''}
          >
            {t('data-not-transmitted')}
            {patient.monitoringAlerts.nonDataTransmissionRate
              ? <SimpleValue {...nonDataTransmissionRateProps} />
              : <Typography sx={{ fontWeight: 'bold' }}>
                {t('N/A')}
              </Typography>
            }
          </Box>
        </>
        : <Box>
          <Box sx={{ paddingTop: theme.spacing(1) }}>
            <Skeleton variant="rounded"
                      width={SKELETON_TITLE_WIDTH}
                      height={SKELETON_TITLE_HEIGHT} />
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            sx={{ paddingTop: theme.spacing(1) }}
          >
            <MonitoringAlertsCardSkeletonValue />
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            sx={{ paddingTop: theme.spacing(1) }}
          >
            <MonitoringAlertsCardSkeletonValue />
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            sx={{ paddingTop: theme.spacing(1) }}
          >
            <MonitoringAlertsCardSkeletonValue />
          </Box>
        </Box>
      }
    </DataCard>
  )
}

export default MonitoringAlertsCard
