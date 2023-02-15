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
import { useTeam } from '../../lib/team'
import { type MonitoringAlertsParams } from '../../lib/team/models/monitoring-alerts.model'
import type React from 'react'
import { useMemo, useState } from 'react'
import { type Patient } from '../../lib/patient/models/patient.model'
import { useTranslation } from 'react-i18next'
import { buildThresholds, isInvalidPercentage, REGEX_VALUE_BG } from './monitoring-alerts-params-content-configuration.utils'
import { UnitsType } from 'dumb'
import { type MonitoringAlertsThresholds } from '../../lib/patient/models/monitoring-alerts.model'
import { DEFAULT_BG_VALUES } from './monitoring-alerts-params.default'

export interface MonitoringAlertsParamsContentConfigurationHookProps {
  monitoringAlertsParams: MonitoringAlertsParams
  saveInProgress?: boolean
  patient?: Patient
  onSave?: (monitoringAlertsParams: MonitoringAlertsParams) => void
}

interface MonitoringAlertsParamsContentConfigurationHookReturn {
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
  save: () => void
  resetToTeamDefaultValues: () => void
  onChange: (value: number, lowValue: number, highValue: number, setValue: React.Dispatch<ValueErrorPair>) => void
  bgUnit: UnitsType
}

interface ValueErrorMessagePair {
  value?: number
  errorMessage?: string
}

interface ValueErrorPair {
  value?: number
  error?: boolean
}

const useMonitoringAlertsParamsContentConfiguration = ({ monitoringAlertsParams, saveInProgress, onSave, patient }: MonitoringAlertsParamsContentConfigurationHookProps): MonitoringAlertsParamsContentConfigurationHookReturn => {
  const bgUnit = monitoringAlertsParams.bgUnit ?? UnitsType.MGDL

  const {
    highBgDefault,
    hypoThresholdDefault,
    nonDataTxThresholdDefault,
    outOfRangeThresholdDefault,
    lowBgDefault,
    veryLowBgDefault,
    reportingPeriodDefault,
    bgUnitDefault
  } = DEFAULT_BG_VALUES

  /* TODO : remove if ? because every team should have default alerts ? */
  if (!monitoringAlertsParams) {
    monitoringAlertsParams = {
      bgUnit: bgUnitDefault,
      lowBg: lowBgDefault,
      highBg: highBgDefault,
      outOfRangeThreshold: outOfRangeThresholdDefault,
      veryLowBg: veryLowBgDefault,
      hypoThreshold: hypoThresholdDefault,
      nonDataTxThreshold: nonDataTxThresholdDefault,
      reportingPeriod: reportingPeriodDefault
    }
  }

  const { t } = useTranslation('yourloops')

  const teamHook = useTeam()

  const thresholds = useMemo<MonitoringAlertsThresholds>(() => buildThresholds(bgUnit), [bgUnit])

  const getErrorMessage = (value: number, lowValue: number, highValue: number): string => {
    if (bgUnit === UnitsType.MGDL && !(Number.isInteger(value))) {
      return t('mandatory-integer')
    }
    if (value < lowValue || value > highValue) {
      return t('mandatory-range', { lowValue, highValue })
    }
    if (bgUnit === UnitsType.MMOLL && !REGEX_VALUE_BG.test(value.toString())) {
      return t('mandatory-float-number')
    }
    return null
  }

  const [highBg, setHighBg] = useState<ValueErrorMessagePair>(() => {
    return {
      value: monitoringAlertsParams.highBg,
      errorMessage: getErrorMessage(monitoringAlertsParams.highBg, thresholds.minHighBg, thresholds.maxHighBg)
    }
  })
  const [veryLowBg, setVeryLowBg] = useState<ValueErrorMessagePair>(() => {
    return {
      value: monitoringAlertsParams.veryLowBg,
      errorMessage: getErrorMessage(monitoringAlertsParams.veryLowBg, thresholds.minVeryLowBg, thresholds.maxVeryLowBg)
    }
  })
  const [lowBg, setLowBg] = useState<ValueErrorMessagePair>(() => {
    return {
      value: monitoringAlertsParams.lowBg,
      errorMessage: getErrorMessage(monitoringAlertsParams.lowBg, thresholds.minLowBg, thresholds.maxLowBg)
    }
  })
  const [nonDataTxThreshold, setNonDataTxThreshold] = useState<ValueErrorPair>(() => {
    return {
      value: monitoringAlertsParams.nonDataTxThreshold,
      error: isInvalidPercentage(monitoringAlertsParams.nonDataTxThreshold)
    }
  })
  const [outOfRangeThreshold, setOutOfRangeThreshold] = useState<ValueErrorPair>(() => {
    return {
      value: monitoringAlertsParams.outOfRangeThreshold,
      error: isInvalidPercentage(monitoringAlertsParams.outOfRangeThreshold)
    }
  })
  const [hypoThreshold, setHypoThreshold] = useState<ValueErrorPair>(() => {
    return {
      value: monitoringAlertsParams.hypoThreshold,
      error: isInvalidPercentage(monitoringAlertsParams.hypoThreshold)
    }
  })

  const saveButtonDisabled = useMemo(() => {
    return !!lowBg.errorMessage ||
      !!highBg.errorMessage ||
      !!veryLowBg.errorMessage ||
      outOfRangeThreshold.error ||
      hypoThreshold.error ||
      nonDataTxThreshold.error ||
      saveInProgress
  }, [highBg.errorMessage, hypoThreshold.error, lowBg.errorMessage, nonDataTxThreshold.error, outOfRangeThreshold.error, saveInProgress, veryLowBg.errorMessage])

  const onChange = (
    value: number,
    lowValue: number,
    highValue: number,
    setValue: React.Dispatch<ValueErrorMessagePair>
  ): void => {
    setValue({
      value,
      errorMessage: getErrorMessage(value, lowValue, highValue)
    })
  }

  const resetToTeamDefaultValues = (): void => {
    if (!patient) {
      throw Error('This action cannot be done if the patient is undefined')
    }

    /* TODO : get the actual team selected by the drop down */
    const team = teamHook.getTeam('test')
    const defaultMonitoring = team.monitoringAlertsParams

    setHighBg({ ...highBg, value: defaultMonitoring.highBg })
    setVeryLowBg({ ...veryLowBg, value: defaultMonitoring.veryLowBg })
    setLowBg({ ...lowBg, value: defaultMonitoring.lowBg })
    setNonDataTxThreshold({ ...nonDataTxThreshold, value: defaultMonitoring.nonDataTxThreshold })
    setOutOfRangeThreshold({ ...outOfRangeThreshold, value: defaultMonitoring.outOfRangeThreshold })
    setHypoThreshold({ ...hypoThreshold, value: defaultMonitoring.hypoThreshold })
  }

  const save = (): void => {
    const reportingPeriod = (monitoringAlertsParams.reportingPeriod && monitoringAlertsParams.reportingPeriod > 0) ? monitoringAlertsParams.reportingPeriod : 55
    const monitoringUpdated: MonitoringAlertsParams = {
      bgUnit,
      lowBg: lowBg.value,
      highBg: highBg.value,
      outOfRangeThreshold: outOfRangeThreshold.value,
      veryLowBg: veryLowBg.value,
      hypoThreshold: hypoThreshold.value,
      nonDataTxThreshold: nonDataTxThreshold.value,
      reportingPeriod
    }
    onSave(monitoringUpdated)
  }
  return {
    lowBg,
    saveButtonDisabled,
    save,
    resetToTeamDefaultValues,
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
    setNonDataTxThreshold,
    bgUnit
  }
}
export default useMonitoringAlertsParamsContentConfiguration
