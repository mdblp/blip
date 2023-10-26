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
import {
  buildThresholds,
  getConvertedValue,
  getErrorMessage,
  isInvalidPercentage
} from './monitoring-alert-content-configuration.util'
import { type Thresholds } from '../../lib/patient/models/monitoring-alerts.model'
import { Unit } from 'medical-domain'
import { type MonitoringAlertsParameters } from '../../lib/team/models/monitoring-alerts-parameters.model'

export interface MonitoringAlertsContentConfigurationHookProps {
  monitoringAlertsParameters: MonitoringAlertsParameters
  saveInProgress?: boolean
  userBgUnit: Unit.MilligramPerDeciliter | Unit.MmolPerLiter
}

export interface MonitoringAlertsContentConfigurationHookReturn {
  haveValuesBeenUpdated: boolean
  highBgValue: number
  veryLowBgValue: number
  lowBgValue: number
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
  getHighBgInitialState: () => ValueErrorMessagePair
  getVeryLowBgInitialState: () => ValueErrorMessagePair
  getLowBgInitialState: () => ValueErrorMessagePair
  getNonDataTxThresholdInitialState: () => ValueErrorPair
  getOutOfRangeThresholdInitialState: () => ValueErrorPair
  getHypoThresholdInitialState: () => ValueErrorPair
}

export interface ValueErrorMessagePair {
  value?: number
  errorMessage?: string
}

export interface ValueErrorPair {
  value?: number
  error?: boolean
}

const DEFAULT_BG_UNIT = Unit.MilligramPerDeciliter

export const useMonitoringAlertsContentConfiguration = (
  {
    monitoringAlertsParameters,
    saveInProgress,
    userBgUnit
  }: MonitoringAlertsContentConfigurationHookProps
): MonitoringAlertsContentConfigurationHookReturn => {

  const monitoringBgUnit = monitoringAlertsParameters?.bgUnit ?? DEFAULT_BG_UNIT

  const thresholds = useMemo<Thresholds>(() => buildThresholds(userBgUnit), [userBgUnit])

  const highBgValue = getConvertedValue(monitoringAlertsParameters.highBg, monitoringBgUnit, userBgUnit)
  const getHighBgInitialState = (): ValueErrorMessagePair => {
    return {
      value: highBgValue,
      errorMessage: getErrorMessage(userBgUnit, highBgValue, thresholds.minHighBg, thresholds.maxHighBg)
    }
  }

  const veryLowBgValue = getConvertedValue(monitoringAlertsParameters.veryLowBg, monitoringBgUnit, userBgUnit)
  const getVeryLowBgInitialState = (): ValueErrorMessagePair => {
    return {
      value: veryLowBgValue,
      errorMessage: getErrorMessage(userBgUnit, veryLowBgValue, thresholds.minVeryLowBg, thresholds.maxVeryLowBg)
    }
  }

  const lowBgValue = getConvertedValue(monitoringAlertsParameters.lowBg, monitoringBgUnit, userBgUnit)
  const getLowBgInitialState = (): ValueErrorMessagePair => {
    return {
      value: lowBgValue,
      errorMessage: getErrorMessage(userBgUnit, lowBgValue, thresholds.minLowBg, thresholds.maxLowBg)
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

  const hasErrorMessage = useMemo(() => {
    return !!lowBg.errorMessage ||
      !!highBg.errorMessage ||
      !!veryLowBg.errorMessage ||
      outOfRangeThreshold.error ||
      hypoThreshold.error ||
      nonDataTxThreshold.error
  }, [highBg.errorMessage, hypoThreshold.error, lowBg.errorMessage, nonDataTxThreshold.error, outOfRangeThreshold.error, veryLowBg.errorMessage])

  const haveValuesBeenUpdated = useMemo(() => {
    return highBgValue !== highBg.value ||
      lowBgValue !== lowBg.value ||
      veryLowBgValue !== veryLowBg.value ||
      monitoringAlertsParameters.hypoThreshold !== hypoThreshold.value ||
      monitoringAlertsParameters.nonDataTxThreshold !== nonDataTxThreshold.value ||
      monitoringAlertsParameters.outOfRangeThreshold !== outOfRangeThreshold.value
  }, [highBg.value, highBgValue, hypoThreshold.value, lowBg.value, lowBgValue, monitoringAlertsParameters.hypoThreshold, monitoringAlertsParameters.nonDataTxThreshold, monitoringAlertsParameters.outOfRangeThreshold, nonDataTxThreshold.value, outOfRangeThreshold.value, veryLowBg.value, veryLowBgValue])

  const saveButtonDisabled = useMemo(() => {
    return hasErrorMessage || saveInProgress || !haveValuesBeenUpdated
  }, [hasErrorMessage, haveValuesBeenUpdated, saveInProgress])

  const onChange = (
    value: number,
    lowValue: number,
    highValue: number,
    setValue: React.Dispatch<ValueErrorMessagePair>
  ): void => {
    setValue({
      value,
      errorMessage: getErrorMessage(userBgUnit, value, lowValue, highValue)
    })
  }

  return {
    haveValuesBeenUpdated,
    highBgValue,
    veryLowBgValue,
    lowBgValue,
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
  }
}
