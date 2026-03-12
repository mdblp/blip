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
import Tooltip from '@mui/material/Tooltip'
import { useAuth } from '../../../lib/auth'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { type Patient } from '../../../lib/patient/models/patient.model'
import { TimeSpentOufOfRangeIcon } from '../../icons/diabeloop/time-spent-ouf-of-range-icon'
import { NoDataIcon } from '../../icons/diabeloop/no-data-icon'
import { HypoglycemiaIcon } from '../../icons/diabeloop/hypoglycemia-icon'
import { HyperglycemiaIcon } from '../../icons/diabeloop/hyperglycemia-icon'
import { convertBG } from '../../../lib/units/units.util'
import { Unit } from 'medical-domain'
import PatientUtils from '../../../lib/patient/patient.util'
import { AcknowledgeMonitoringAlertDialog, MonitoringAlertType } from '../ack-monitoring-alert-dialog/ack-monitoring-alert-dialog'

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

export const MonitoringAlertsCell: FunctionComponent<MonitoringAlertsCellProps> = ({ patient }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { user } = useAuth()

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

  const { timeSpentAwayFromTargetRate, frequencyOfSevereHypoglycemiaRate, frequencyOfHyperglycemiaRate, nonDataTransmissionRate, min, max, veryLowBg, veryHighBg } = buildTooltipValues()

  const isTimeSpentAwayFromTargetAlertActive = monitoringAlerts.timeSpentAwayFromTargetActive
  const isFrequencyOfSevereHypoglycemiaAlertActive = monitoringAlerts.frequencyOfSevereHypoglycemiaActive
  const isFrequencyOfHyperglycemiaAlertActive = monitoringAlerts.frequencyOfSevereHyperglycemiaActive
  const isNonDataTransmissionAlertActive = monitoringAlerts.nonDataTransmissionActive
  const sharedTooltip = t('monitoring-alerts-shared-tooltip')

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentAlertType, setCurrentAlertType] = useState<MonitoringAlertType>(MonitoringAlertType.Hyperglycemia)

  const handleAlertIconClick = (event: React.MouseEvent, alertType: MonitoringAlertType): void => {
    event.stopPropagation()
    setCurrentAlertType(alertType)
    setIsDialogOpen(true)
  }

  const buildAlertClickHandler = (alertType: MonitoringAlertType, isActive: boolean): ((e: React.MouseEvent) => void) | undefined => {
    if (!isActive) {
      return undefined
    }
    return (e: React.MouseEvent) => { handleAlertIconClick(e, alertType) }
  }

  const handleDialogClose = (): void => {
    setIsDialogOpen(false)
  }

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center', flexWrap: 'wrap' }}>
      <Tooltip
        title={
          <>
            <Box>{t('time-out-of-range-target-tooltip1', { percentage: timeSpentAwayFromTargetRate })}</Box>
            <Box>{t('time-out-of-range-target-tooltip2', { min, max, threshold: monitoringAlertsParameters.outOfRangeThreshold, unit })}</Box>
            <Box>{sharedTooltip}</Box>
          </>
        }
        data-testid="time-spent-out-of-range-icon-tooltip"
      >
        <TimeSpentOufOfRangeIcon
          sx={{ cursor: isTimeSpentAwayFromTargetAlertActive ? 'pointer' : 'default' }}
          color={isTimeSpentAwayFromTargetAlertActive ? 'inherit' : 'disabled'}
          data-testid="time-spent-out-of-range-icon"
          onClick={buildAlertClickHandler(MonitoringAlertType.TimeSpentOutOfRange, isTimeSpentAwayFromTargetAlertActive)}
        />
      </Tooltip>

      <Tooltip
        title={
          <>
            <Box>{t('hyperglycemia-tooltip1', { percentage: frequencyOfHyperglycemiaRate })}</Box>
            <Box>{t('hyperglycemia-tooltip2', { veryHighBg, threshold: monitoringAlertsParameters.hyperThreshold, unit })}</Box>
            <Box>{sharedTooltip}</Box>
          </>
        }
      >
        <HyperglycemiaIcon
          sx={{ marginLeft: theme.spacing(1), cursor: isFrequencyOfHyperglycemiaAlertActive ? 'pointer' : 'default' }}
          color={isFrequencyOfHyperglycemiaAlertActive ? 'error' : 'disabled'}
          data-testid="hyperglycemia-icon"
          onClick={buildAlertClickHandler(MonitoringAlertType.Hyperglycemia, isFrequencyOfHyperglycemiaAlertActive)}
        />
      </Tooltip>

      <Tooltip
        title={
          <>
            <Box>{t('hypoglycemia-tooltip1', { percentage: frequencyOfSevereHypoglycemiaRate })}</Box>
            <Box>{t('hypoglycemia-tooltip2', { veryLowBg, threshold: monitoringAlertsParameters.hypoThreshold, unit })}</Box>
            <Box>{sharedTooltip}</Box>
          </>
        }
      >
        <HypoglycemiaIcon
          sx={{ marginLeft: theme.spacing(1), cursor: isFrequencyOfSevereHypoglycemiaAlertActive ? 'pointer' : 'default' }}
          color={isFrequencyOfSevereHypoglycemiaAlertActive ? 'error' : 'disabled'}
          data-testid="hypoglycemia-icon"
          onClick={buildAlertClickHandler(MonitoringAlertType.Hypoglycemia, isFrequencyOfSevereHypoglycemiaAlertActive)}
        />
      </Tooltip>

      <Tooltip
        title={
          <>
            <Box>{t('data-not-transmitted-tooltip1', { percentage: nonDataTransmissionRate })}</Box>
            <Box>{t('data-not-transmitted-tooltip2', { threshold: monitoringAlertsParameters.nonDataTxThreshold })}</Box>
            <Box>{sharedTooltip}</Box>
          </>
        }
      >
        <NoDataIcon
          sx={{ marginLeft: theme.spacing(1), cursor: isNonDataTransmissionAlertActive ? 'pointer' : 'default' }}
          color={isNonDataTransmissionAlertActive ? 'inherit' : 'disabled'}
          data-testid="no-data-icon"
          onClick={buildAlertClickHandler(MonitoringAlertType.DataNotTransmitted, isNonDataTransmissionAlertActive)}
        />
      </Tooltip>

      <AcknowledgeMonitoringAlertDialog
        open={isDialogOpen}
        patient={patient}
        alertType={currentAlertType}
        onClose={handleDialogClose}
      />
    </Box>
  )
}

