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
import { useEffect, useMemo, useState } from 'react'
import {
  buildThresholds,
  getConvertedValue,
  getErrorMessage,
  isInvalidPercentage
} from './monitoring-alert-content-configuration.util'
import { type BgUnit, Unit } from 'medical-domain'
import { useSelectedTeamContext } from '../../lib/selected-team/selected-team.provider'
import { type MonitoringAlertsParameters } from '../../lib/team/models/monitoring-alerts-parameters.model'
import { useMonitoringAlertsContentConfiguration } from './monitoring-alerts-content-configuration.hook'

export interface MonitoringAlertsPatientConfigurationHookProps {
  monitoringAlertsParameters: MonitoringAlertsParameters
  isInitiallyUsingTeamAlertParameters: boolean
  saveInProgress?: boolean
  userBgUnit: Unit.MilligramPerDeciliter | Unit.MmolPerLiter
  onSave?: (monitoringAlertsParameters: MonitoringAlertsParameters) => void
}

interface MonitoringAlertsPatientConfigurationHookReturn {
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
  useTeamValues: boolean
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

export const useMonitoringAlertsPatientConfiguration = (
  {
    monitoringAlertsParameters,
    saveInProgress,
    userBgUnit,
    onSave,
    isInitiallyUsingTeamAlertParameters
  }: MonitoringAlertsPatientConfigurationHookProps
): MonitoringAlertsPatientConfigurationHookReturn => {
  const { selectedTeam } = useSelectedTeamContext()

  const {
    haveValuesBeenUpdated,
    lowBg,
    saveButtonDisabled,
    onChange,
    veryLowBg,
    highBg,
    hypoThreshold,
    nonDataTxThreshold,
    outOfRangeThreshold,
    getHighBgInitialState,
    getLowBgInitialState,
    getVeryLowBgInitialState,
    getNonDataTxThresholdInitialState,
    getOutOfRangeThresholdInitialState,
    getHypoThresholdInitialState,
    setLowBg,
    setHighBg,
    setOutOfRangeThreshold,
    setHypoThreshold,
    setVeryLowBg,
    setNonDataTxThreshold
  } = useMonitoringAlertsContentConfiguration({ monitoringAlertsParameters, saveInProgress, userBgUnit })

  const [useTeamValues, setUseTeamValues] = useState<boolean>(isInitiallyUsingTeamAlertParameters)

  const teamAlertParametersValues = useMemo(() => {
    const teamParameters = selectedTeam.monitoringAlertsParameters
    const teamParametersUnit = teamParameters?.bgUnit ?? DEFAULT_BG_UNIT
    return {
      bgUnit: teamParametersUnit,
      lowBg: getConvertedValue(teamParameters.lowBg, teamParametersUnit, userBgUnit),
      highBg: getConvertedValue(teamParameters.highBg, teamParametersUnit, userBgUnit),
      outOfRangeThreshold: teamParameters.outOfRangeThreshold,
      veryLowBg: getConvertedValue(teamParameters.veryLowBg, teamParametersUnit, userBgUnit),
      hypoThreshold: teamParameters.hypoThreshold,
      nonDataTxThreshold: teamParameters.nonDataTxThreshold,
      reportingPeriod: teamParameters.reportingPeriod
    }
  }, [selectedTeam.monitoringAlertsParameters, userBgUnit])

  const areCurrentAndTeamValuesTheSame = useMemo((): boolean => {
    return teamAlertParametersValues.highBg === highBg.value
      && teamAlertParametersValues.lowBg === lowBg.value
      && teamAlertParametersValues.veryLowBg === veryLowBg.value
      && teamAlertParametersValues.hypoThreshold === hypoThreshold.value
      && teamAlertParametersValues.nonDataTxThreshold === nonDataTxThreshold.value
      && teamAlertParametersValues.outOfRangeThreshold === outOfRangeThreshold.value
  }, [highBg.value, hypoThreshold.value, lowBg.value, nonDataTxThreshold.value, outOfRangeThreshold.value, teamAlertParametersValues, veryLowBg.value])

  useEffect(() => {
    if (haveValuesBeenUpdated || useTeamValues !== isInitiallyUsingTeamAlertParameters) {
      console.log(areCurrentAndTeamValuesTheSame)
      setUseTeamValues(areCurrentAndTeamValuesTheSame)
    }
  }, [areCurrentAndTeamValuesTheSame, haveValuesBeenUpdated, isInitiallyUsingTeamAlertParameters, useTeamValues])

  const resetToTeamDefaultValues = (): void => {
    const defaultMonitoringAlertsParameters = selectedTeam.monitoringAlertsParameters
    const teamBgUnit = defaultMonitoringAlertsParameters.bgUnit

    const defaultHighBgValue = getConvertedValue(defaultMonitoringAlertsParameters.highBg, teamBgUnit, userBgUnit)
    const defaultVeryLowBgValue = getConvertedValue(defaultMonitoringAlertsParameters.veryLowBg, teamBgUnit, userBgUnit)
    const defaultLowBgValue = getConvertedValue(defaultMonitoringAlertsParameters.lowBg, teamBgUnit, userBgUnit)

    const { minLowBg, maxLowBg, minHighBg, maxHighBg, minVeryLowBg, maxVeryLowBg } = buildThresholds(userBgUnit)

    setHighBg({
      value: defaultHighBgValue,
      errorMessage: getErrorMessage(userBgUnit, defaultHighBgValue, minHighBg, maxHighBg)
    })
    setVeryLowBg({
      value: defaultVeryLowBgValue,
      errorMessage: getErrorMessage(userBgUnit, defaultVeryLowBgValue, minVeryLowBg, maxVeryLowBg)
    })
    setLowBg({
      value: defaultLowBgValue,
      errorMessage: getErrorMessage(userBgUnit, defaultLowBgValue, minLowBg, maxLowBg)
    })
    setNonDataTxThreshold({
      value: defaultMonitoringAlertsParameters.nonDataTxThreshold,
      error: isInvalidPercentage(defaultMonitoringAlertsParameters.nonDataTxThreshold)
    })
    setOutOfRangeThreshold({
      value: defaultMonitoringAlertsParameters.outOfRangeThreshold,
      error: isInvalidPercentage(defaultMonitoringAlertsParameters.outOfRangeThreshold)
    })
    setHypoThreshold({
      value: defaultMonitoringAlertsParameters.hypoThreshold,
      error: isInvalidPercentage(defaultMonitoringAlertsParameters.hypoThreshold)
    })
    setUseTeamValues(true)
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

  const onValueChange = (value: number, lowValue: number, highValue: number, setValue: React.Dispatch<ValueErrorPair>) => {
    onChange(value, lowValue, highValue, setValue)
    setUseTeamValues(false)
  }

  const shouldSaveButtonBeDisabled = useMemo(() => {
    return isInitiallyUsingTeamAlertParameters === useTeamValues && saveButtonDisabled
  }, [isInitiallyUsingTeamAlertParameters, saveButtonDisabled, useTeamValues])

  return {
    lowBg,
    useTeamValues,
    saveButtonDisabled: shouldSaveButtonBeDisabled,
    discardChanges,
    save,
    resetToTeamDefaultValues,
    onChange: onValueChange,
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
