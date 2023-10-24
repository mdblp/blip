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
import type React from 'react'
import { useMemo, useState } from 'react'
import { type Patient } from '../../lib/patient/models/patient.model'
import { useTranslation } from 'react-i18next'
import {
  buildThresholds,
  getConvertedValue,
  isInvalidPercentage,
  REGEX_VALUE_BG
} from './monitoring-alert-content-configuration.util'
import { type Thresholds } from '../../lib/patient/models/monitoring-alerts.model'
import { type BgUnit, Unit } from 'medical-domain'
import { useSelectedTeamContext } from '../../lib/selected-team/selected-team.provider'
import { type MonitoringAlertsParameters } from '../../lib/team/models/monitoring-alerts-parameters.model'

export interface MonitoringAlertsContentConfigurationHookProps {
  monitoringAlertsParameters: MonitoringAlertsParameters
  patient?: Patient
  saveInProgress?: boolean
  userBgUnit: Unit.MilligramPerDeciliter | Unit.MmolPerLiter
  onSave?: (monitoringAlertsParameters: MonitoringAlertsParameters) => void
}

interface MonitoringAlertsContentConfigurationHookReturn {
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
  discardChanges: () => void
  save: () => void
  resetToTeamDefaultValues: () => void
  onChange: (value: number, lowValue: number, highValue: number, setValue: React.Dispatch<ValueErrorPair>) => void
  bgUnit: BgUnit
}

interface ValueErrorMessagePair {
  value?: number
  errorMessage?: string
}

interface ValueErrorPair {
  value?: number
  error?: boolean
}

const DEFAULT_BG_UNIT = Unit.MilligramPerDeciliter
const DEFAULT_REPORTING_PERIOD = 55

export const useMonitoringAlertsContentConfiguration = ({
  monitoringAlertsParameters,
  saveInProgress,
  userBgUnit,
  onSave,
  patient
}: MonitoringAlertsContentConfigurationHookProps): MonitoringAlertsContentConfigurationHookReturn => {
  const { selectedTeam } = useSelectedTeamContext()

  const monitoringBgUnit = monitoringAlertsParameters?.bgUnit ?? DEFAULT_BG_UNIT

  const { t } = useTranslation('yourloops')

  const thresholds = useMemo<Thresholds>(() => buildThresholds(userBgUnit), [userBgUnit])

  const getErrorMessage = (value: number, lowValue: number, highValue: number): string => {
    if (userBgUnit === Unit.MilligramPerDeciliter && !(Number.isInteger(value))) {
      return t('mandatory-integer')
    }

    if (value < lowValue || value > highValue) {
      return t('mandatory-range', { lowValue, highValue })
    }

    if (userBgUnit === Unit.MmolPerLiter && !REGEX_VALUE_BG.test(value.toString())) {
      return t('mandatory-float-number')
    }

    return null
  }

  const getHighBgInitialState = (): ValueErrorMessagePair => {
    const highBgValue = getConvertedValue(monitoringAlertsParameters.highBg, monitoringBgUnit, userBgUnit)
    return {
      value: highBgValue,
      errorMessage: getErrorMessage(highBgValue, thresholds.minHighBg, thresholds.maxHighBg)
    }
  }

  const getVeryLowBgInitialState = (): ValueErrorMessagePair => {
    const veryLowBgValue = getConvertedValue(monitoringAlertsParameters.veryLowBg, monitoringBgUnit, userBgUnit)
    return {
      value: veryLowBgValue,
      errorMessage: getErrorMessage(veryLowBgValue, thresholds.minVeryLowBg, thresholds.maxVeryLowBg)
    }
  }

  const getLowBgInitialState = (): ValueErrorMessagePair => {
    const lowBgValue = getConvertedValue(monitoringAlertsParameters.lowBg, monitoringBgUnit, userBgUnit)
    return {
      value: lowBgValue,
      errorMessage: getErrorMessage(lowBgValue, thresholds.minLowBg, thresholds.maxLowBg)
    }
  }

  const getNonDataTxThresholdInitialState = (): ValueErrorPair => {
    return {
      value: monitoringAlertsParameters.nonDataTxThreshold,
      error: isInvalidPercentage(monitoringAlertsParameters.nonDataTxThreshold)
    }
  }

  const getOutOfRangeThresholdInitialState = (): ValueErrorPair => {
    return {
      value: monitoringAlertsParameters.outOfRangeThreshold,
      error: isInvalidPercentage(monitoringAlertsParameters.outOfRangeThreshold)
    }
  }

  const getHypoThresholdInitialState = (): ValueErrorPair => {
    return {
      value: monitoringAlertsParameters.hypoThreshold,
      error: isInvalidPercentage(monitoringAlertsParameters.hypoThreshold)
    }
  }

  const [highBg, setHighBg] = useState<ValueErrorMessagePair>(() => getHighBgInitialState())
  const [veryLowBg, setVeryLowBg] = useState<ValueErrorMessagePair>(() => getVeryLowBgInitialState())
  const [lowBg, setLowBg] = useState<ValueErrorMessagePair>(() => getLowBgInitialState())
  const [nonDataTxThreshold, setNonDataTxThreshold] = useState<ValueErrorPair>(() => getNonDataTxThresholdInitialState())
  const [outOfRangeThreshold, setOutOfRangeThreshold] = useState<ValueErrorPair>(() => getOutOfRangeThresholdInitialState())
  const [hypoThreshold, setHypoThreshold] = useState<ValueErrorPair>(() => getHypoThresholdInitialState())

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

    const defaultMonitoringAlertsParameters = selectedTeam.monitoringAlertsParameters
    const teamBgUnit = defaultMonitoringAlertsParameters.bgUnit

    const defaultHighBgValue = getConvertedValue(defaultMonitoringAlertsParameters.highBg, teamBgUnit, userBgUnit)
    setHighBg({ ...highBg, value: defaultHighBgValue })

    const defaultVeryLowBgValue = getConvertedValue(defaultMonitoringAlertsParameters.veryLowBg, teamBgUnit, userBgUnit)
    setVeryLowBg({ ...veryLowBg, value: defaultVeryLowBgValue })

    const defaultLowBgValue = getConvertedValue(defaultMonitoringAlertsParameters.lowBg, teamBgUnit, userBgUnit)
    setLowBg({ ...lowBg, value: defaultLowBgValue })

    setNonDataTxThreshold({ ...nonDataTxThreshold, value: defaultMonitoringAlertsParameters.nonDataTxThreshold })
    setOutOfRangeThreshold({ ...outOfRangeThreshold, value: defaultMonitoringAlertsParameters.outOfRangeThreshold })
    setHypoThreshold({ ...hypoThreshold, value: defaultMonitoringAlertsParameters.hypoThreshold })
  }

  const discardChanges = (): void => {
    setHighBg(getHighBgInitialState())
    setVeryLowBg(getVeryLowBgInitialState())
    setLowBg(getLowBgInitialState())
    setNonDataTxThreshold(getNonDataTxThresholdInitialState())
    setOutOfRangeThreshold(getOutOfRangeThresholdInitialState())
    setHypoThreshold(getHypoThresholdInitialState())
  }


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
    discardChanges,
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
    bgUnit: userBgUnit
  }
}
