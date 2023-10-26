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
import { Unit } from 'medical-domain'
import { type MonitoringAlertsParameters } from '../../lib/team/models/monitoring-alerts-parameters.model'
import {
  useMonitoringAlertsContentConfiguration,
  ValueErrorMessagePair,
  ValueErrorPair
} from './monitoring-alerts-content-configuration.hook'
import React from 'react'

export interface MonitoringAlertsTeamConfigurationHookProps {
  monitoringAlertsParameters: MonitoringAlertsParameters
  saveInProgress?: boolean
  userBgUnit: Unit.MilligramPerDeciliter | Unit.MmolPerLiter
  onSave?: (monitoringAlertsParameters: MonitoringAlertsParameters) => void
}

interface MonitoringAlertsTeamConfigurationHookReturn {
  lowBg: ValueErrorMessagePair
  setLowBg: React.Dispatch<ValueErrorMessagePair>
  veryLowBg: ValueErrorMessagePair
  setVeryLowBg: React.Dispatch<ValueErrorMessagePair>
  highBg: ValueErrorMessagePair
  setHighBg: React.Dispatch<ValueErrorMessagePair>
  nonDataTxThreshold: ValueErrorPair
  setNonDataTxThreshold: React.Dispatch<ValueErrorPair>
  outOfRangeThreshold: ValueErrorPair
  setOutOfRangeThreshold: React.Dispatch<ValueErrorPair>
  hypoThreshold: ValueErrorPair
  setHypoThreshold: React.Dispatch<ValueErrorPair>
  saveButtonDisabled: boolean
  onChange: (value: number, lowValue: number, highValue: number, setValue: React.Dispatch<ValueErrorPair>) => void
  save: () => void
}

const DEFAULT_REPORTING_PERIOD = 55

export const useMonitoringAlertsTeamConfiguration = (
  {
    monitoringAlertsParameters,
    saveInProgress,
    userBgUnit,
    onSave
  }: MonitoringAlertsTeamConfigurationHookProps
): MonitoringAlertsTeamConfigurationHookReturn => {

  const {
    lowBg,
    saveButtonDisabled,
    onChange,
    veryLowBg,
    highBg,
    hypoThreshold,
    nonDataTxThreshold,
    outOfRangeThreshold,
    setLowBg,
    setHighBg,
    setOutOfRangeThreshold,
    setHypoThreshold,
    setVeryLowBg,
    setNonDataTxThreshold
  } = useMonitoringAlertsContentConfiguration({ monitoringAlertsParameters, saveInProgress, userBgUnit })


  const save = (): void => {
    const reportingPeriod = (monitoringAlertsParameters.reportingPeriod && monitoringAlertsParameters.reportingPeriod > 0) ? monitoringAlertsParameters.reportingPeriod : DEFAULT_REPORTING_PERIOD
    const monitoringAlertsParametersUpdated: MonitoringAlertsParameters = {
      bgUnit: userBgUnit,
      lowBg: lowBg.value,
      highBg: highBg.value,
      outOfRangeThreshold: outOfRangeThreshold.value,
      veryLowBg: veryLowBg.value,
      hypoThreshold: hypoThreshold.value,
      nonDataTxThreshold: nonDataTxThreshold.value,
      reportingPeriod
    }
    onSave(monitoringAlertsParametersUpdated)
  }

  return {
    lowBg,
    saveButtonDisabled,
    save,
    onChange,
    veryLowBg,
    highBg,
    hypoThreshold,
    nonDataTxThreshold,
    outOfRangeThreshold,
    setLowBg,
    setHighBg,
    setOutOfRangeThreshold,
    setHypoThreshold,
    setVeryLowBg,
    setNonDataTxThreshold
  }
}
