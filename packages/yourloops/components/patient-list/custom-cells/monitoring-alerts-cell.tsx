/*
 * Copyright (c) 2023-2026, Diabeloop
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

import React, { type FunctionComponent, useState } from 'react'
import Box from '@mui/material/Box'
import { useAuth } from '../../../lib/auth'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { type Patient } from '../../../lib/patient/models/patient.model'
import { TimeSpentOufOfRangeIcon } from '../../icons/diabeloop/time-spent-ouf-of-range-icon'
import { HypoglycemiaIcon } from '../../icons/diabeloop/hypoglycemia-icon'
import { HyperglycemiaIcon } from '../../icons/diabeloop/hyperglycemia-icon'
import { convertBG } from '../../../lib/units/units.util'
import { Unit } from 'medical-domain'
import PatientUtils from '../../../lib/patient/patient.util'
import {
  AcknowledgeMonitoringAlertDialog,
  MonitoringAlertType
} from '../ack-monitoring-alert-dialog/ack-monitoring-alert-dialog'
import AnalyticsApi, { ElementType } from '../../../lib/analytics/analytics.api'
import useMediaQuery from '@mui/material/useMediaQuery'
import { makeStyles } from 'tss-react/mui'
import { AlertIcon } from "./alerts-icons"
import { NoDataIcon } from '../../icons/diabeloop/no-data-icon'

interface MonitoringAlertsCellProps {
  patient: Patient
}

interface MonitoringAlertsTooltips {
  timeSpentAwayFromTargetRate: string
  frequencyOfSevereHypoglycemiaRate: string
  frequencyOfHyperglycemiaRate: string
  nonDataTransmissionRate: string
  min: number
  max: number
  veryLowBg: number
  veryHighBg: number
}

const useStyles = makeStyles()((theme) => {
  return {
    marginLeftIcon: {
      marginLeft: theme.spacing(1)
    }
  }
})

export const MonitoringAlertsCell: FunctionComponent<MonitoringAlertsCellProps> = ({ patient }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { user } = useAuth()
  const { classes } = useStyles()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const { monitoringAlerts, monitoringAlertsParameters } = patient
  const unit = user.settings?.units?.bg ?? Unit.MilligramPerDeciliter

  const roundUpToOneDecimal = (value: number): number => Math.round(value * 10) / 10

  const buildTooltipValues = (): MonitoringAlertsTooltips => {
    const bgUnit = monitoringAlertsParameters.bgUnit
    const isBgUnit = unit === bgUnit
    return {
      timeSpentAwayFromTargetRate: PatientUtils.formatPercentageValue(monitoringAlerts.timeSpentAwayFromTargetRate),
      frequencyOfSevereHypoglycemiaRate: PatientUtils.formatPercentageValue(monitoringAlerts.frequencyOfSevereHypoglycemiaRate),
      frequencyOfHyperglycemiaRate: PatientUtils.formatPercentageValue(monitoringAlerts.frequencyOfSevereHyperglycemiaRate),
      nonDataTransmissionRate: PatientUtils.formatPercentageValue(monitoringAlerts.nonDataTransmissionRate),
      min: isBgUnit ? roundUpToOneDecimal(monitoringAlertsParameters.lowBg) : convertBG(monitoringAlertsParameters.lowBg, bgUnit),
      max: isBgUnit ? roundUpToOneDecimal(monitoringAlertsParameters.highBg) : convertBG(monitoringAlertsParameters.highBg, bgUnit),
      veryLowBg: isBgUnit ? roundUpToOneDecimal(monitoringAlertsParameters.veryLowBg) : convertBG(monitoringAlertsParameters.veryLowBg, bgUnit),
      veryHighBg: isBgUnit ? roundUpToOneDecimal(monitoringAlertsParameters.veryHighBg) : convertBG(monitoringAlertsParameters.veryHighBg, bgUnit)
    }
  }

  const {
    timeSpentAwayFromTargetRate,
    frequencyOfSevereHypoglycemiaRate,
    frequencyOfHyperglycemiaRate,
    nonDataTransmissionRate,
    min,
    max,
    veryLowBg,
    veryHighBg
  } = buildTooltipValues()

  const isTimeSpentAwayFromTargetAlertActive = monitoringAlerts.timeSpentAwayFromTargetActive
  const isFrequencyOfSevereHypoglycemiaAlertActive = monitoringAlerts.frequencyOfSevereHypoglycemiaActive
  const isFrequencyOfHyperglycemiaAlertActive = monitoringAlerts.frequencyOfSevereHyperglycemiaActive
  const isNonDataTransmissionAlertActive = monitoringAlerts.nonDataTransmissionActive
  const sharedTooltip = t('monitoring-alerts-shared-tooltip')

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentAlertType, setCurrentAlertType] = useState<MonitoringAlertType>(MonitoringAlertType.Hyperglycemia)

  const conditions = [
    isTimeSpentAwayFromTargetAlertActive,
    isFrequencyOfHyperglycemiaAlertActive,
    isFrequencyOfSevereHypoglycemiaAlertActive,
    isNonDataTransmissionAlertActive
  ]
  const noConditionsMet = conditions.every(condition => !condition)

  const handleAlertIconClick = (event: React.MouseEvent, alertType: MonitoringAlertType): void => {
    event.stopPropagation()
    setCurrentAlertType(alertType)
    setIsDialogOpen(true)
    AnalyticsApi.trackClick(`monitoring-alerts-ack-${alertType}`, ElementType.Button)
  }

  const buildAlertClickHandler = (alertType: MonitoringAlertType, isActive: boolean): ((e: React.MouseEvent) => void) | undefined => {
    if (!isActive) {
      return undefined
    }
    return (e: React.MouseEvent) => {
      handleAlertIconClick(e, alertType)
    }
  }

  const handleDialogClose = (): void => {
    setIsDialogOpen(false)
  }

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      flexWrap: 'wrap'
    }}>
      {(!isMobile || conditions[0]) &&
        <AlertIcon
          Icon={TimeSpentOufOfRangeIcon}
          isActive={conditions[0]}
          testId="time-spent-out-of-range-icon"
          onClick={buildAlertClickHandler(MonitoringAlertType.TimeSpentOutOfRange, conditions[0])}
          sharedTooltip={sharedTooltip}
          messages={[
            {
              id: 'time-out-of-range-target-tooltip1',
              content: t('time-out-of-range-target-tooltip1', { percentage: timeSpentAwayFromTargetRate }),
            },
            {
              id: 'time-out-of-range-target-tooltip2',
              content: t('time-out-of-range-target-tooltip2', {
                min,
                max,
                threshold: monitoringAlertsParameters.outOfRangeThreshold,
                unit
              }),
            },
          ]}
        />
      }
      {
        (!isMobile || conditions[1]) &&
        <AlertIcon
          Icon={HyperglycemiaIcon}
          isActive={conditions[0]}
          testId="hyperglycemia-icon"
          className={classes.marginLeftIcon}
          onClick={buildAlertClickHandler(MonitoringAlertType.Hyperglycemia, conditions[1])}
          sharedTooltip={sharedTooltip}
          messages={[
            {
              id: 'hyperglycemia-tooltip1',
              content: t('hyperglycemia-tooltip1', { percentage: frequencyOfHyperglycemiaRate }),
            },
            {
              id: 'hyperglycemia-tooltip2',
              content: t('hyperglycemia-tooltip2', {
                veryHighBg,
                threshold: monitoringAlertsParameters.hyperThreshold,
                unit
              }),
            },
          ]}
        />
      }

      {
        (!isMobile || conditions[2]) &&
        <AlertIcon
          Icon={HypoglycemiaIcon}
          isActive={conditions[0]}
          testId="hypoglycemia-icon"
          className={classes.marginLeftIcon}
          onClick={buildAlertClickHandler(MonitoringAlertType.Hypoglycemia, conditions[2])}
          sharedTooltip={sharedTooltip}
          messages={[
            {
              id: 'hypoglycemia-tooltip1',
              content: t('hypoglycemia-tooltip1', { percentage: frequencyOfSevereHypoglycemiaRate }),
            },
            {
              id: 'hypoglycemia-tooltip2',
              content: t('hypoglycemia-tooltip2', {
                veryLowBg,
                threshold: monitoringAlertsParameters.hypoThreshold,
                unit
              }),
            },
          ]}
        />
      }

      {
        (!isMobile || conditions[3]) &&
        <AlertIcon
          Icon={NoDataIcon}
          isActive={conditions[3]}
          testId="no-data-icon"
          className={classes.marginLeftIcon}
          onClick={buildAlertClickHandler(MonitoringAlertType.DataNotTransmitted, conditions[3])}
          sharedTooltip={sharedTooltip}
          messages={[
            {
              id: 'data-not-transmitted-tooltip1',
              content: t('data-not-transmitted-tooltip1', { percentage: nonDataTransmissionRate }),
            },
            {
              id: 'data-not-transmitted-tooltip2',
              content: t('data-not-transmitted-tooltip2', { threshold: monitoringAlertsParameters.nonDataTxThreshold }),
            },
          ]}
        />
      }

      {
        isMobile && noConditionsMet ? (
          <span>{t('no-alerts')}</span>
        ) : null
      }

      <AcknowledgeMonitoringAlertDialog
        open={isDialogOpen}
        patient={patient}
        alertType={currentAlertType}
        onClose={handleDialogClose}
      />
    </Box>
  )
}

