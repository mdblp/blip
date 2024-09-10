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

interface MonitoringAlertsContentConfigurationHookProps {
  monitoringAlertsParameters: MonitoringAlertsParameters
  onSave?: (monitoringAlertsParameters: MonitoringAlertsParameters) => void
  saveInProgress?: boolean
  userBgUnit: Unit.MilligramPerDeciliter | Unit.MmolPerLiter
}

interface MonitoringAlertsContentConfigurationHookReturn {
  getHighBgInitialState: () => ValueErrorMessagePair
  getHypoThresholdInitialState: () => ValueErrorPair
  getLowBgInitialState: () => ValueErrorMessagePair
  getNonDataTxThresholdInitialState: () => ValueErrorPair
  getOutOfRangeThresholdInitialState: () => ValueErrorPair
  getVeryLowBgInitialState: () => ValueErrorMessagePair
  monitoringValuesDisplayed: MonitoringValuesDisplayed
  save: () => void
  saveButtonDisabled: boolean
  setMonitoringValuesDisplayed: React.Dispatch<MonitoringValuesDisplayed>
}

export interface MonitoringValuesDisplayed {
  highBg: ValueErrorMessagePair
  hypoThreshold: ValueErrorPair
  lowBg: ValueErrorMessagePair
  nonDataTxThreshold: ValueErrorPair
  outOfRangeThreshold: ValueErrorPair
  veryLowBg: ValueErrorMessagePair
}

interface ValueErrorMessagePair {
  value: number
  errorMessage?: string
}

interface ValueErrorPair {
  value: number
  error: boolean
}

export const DEFAULT_BG_UNIT = Unit.MilligramPerDeciliter
const DEFAULT_REPORTING_PERIOD = 55

export const useMonitoringAlertsContentConfiguration = (
  {
    monitoringAlertsParameters,
    saveInProgress,
    userBgUnit,
    onSave
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

  const [monitoringValuesDisplayed, setMonitoringValuesDisplayed] = useState<MonitoringValuesDisplayed>(() => ({
    highBg: getHighBgInitialState(),
    hypoThreshold: getHypoThresholdInitialState(),
    lowBg: getLowBgInitialState(),
    nonDataTxThreshold: getNonDataTxThresholdInitialState(),
    outOfRangeThreshold: getOutOfRangeThresholdInitialState(),
    veryLowBg: getVeryLowBgInitialState()
  }))

  const hasErrorMessage = useMemo(() => {
    return !!monitoringValuesDisplayed.lowBg.errorMessage ||
      !!monitoringValuesDisplayed.highBg.errorMessage ||
      !!monitoringValuesDisplayed.veryLowBg.errorMessage ||
      monitoringValuesDisplayed.outOfRangeThreshold.error ||
      monitoringValuesDisplayed.hypoThreshold.error ||
      monitoringValuesDisplayed.nonDataTxThreshold.error
  }, [monitoringValuesDisplayed.highBg.errorMessage, monitoringValuesDisplayed.hypoThreshold.error, monitoringValuesDisplayed.lowBg.errorMessage, monitoringValuesDisplayed.nonDataTxThreshold.error, monitoringValuesDisplayed.outOfRangeThreshold.error, monitoringValuesDisplayed.veryLowBg.errorMessage])

  const haveValuesBeenUpdated = useMemo(() => {
    return highBgValue !== monitoringValuesDisplayed.highBg.value ||
      lowBgValue !== monitoringValuesDisplayed.lowBg.value ||
      veryLowBgValue !== monitoringValuesDisplayed.veryLowBg.value ||
      monitoringAlertsParameters.hypoThreshold !== monitoringValuesDisplayed.hypoThreshold.value ||
      monitoringAlertsParameters.nonDataTxThreshold !== monitoringValuesDisplayed.nonDataTxThreshold.value ||
      monitoringAlertsParameters.outOfRangeThreshold !== monitoringValuesDisplayed.outOfRangeThreshold.value
  }, [highBgValue, lowBgValue, monitoringAlertsParameters.hypoThreshold, monitoringAlertsParameters.nonDataTxThreshold, monitoringAlertsParameters.outOfRangeThreshold, monitoringValuesDisplayed.highBg.value, monitoringValuesDisplayed.hypoThreshold.value, monitoringValuesDisplayed.lowBg.value, monitoringValuesDisplayed.nonDataTxThreshold.value, monitoringValuesDisplayed.outOfRangeThreshold.value, monitoringValuesDisplayed.veryLowBg.value, veryLowBgValue])

  const saveButtonDisabled = useMemo(() => {
    return hasErrorMessage || saveInProgress || !haveValuesBeenUpdated
  }, [hasErrorMessage, haveValuesBeenUpdated, saveInProgress])


  const save = (): void => {
    const reportingPeriod = (monitoringAlertsParameters.reportingPeriod && monitoringAlertsParameters.reportingPeriod > 0) ? monitoringAlertsParameters.reportingPeriod : DEFAULT_REPORTING_PERIOD
    const monitoringAlertsParametersUpdated: MonitoringAlertsParameters = {
      bgUnit: userBgUnit,
      lowBg: monitoringValuesDisplayed.lowBg.value,
      highBg: monitoringValuesDisplayed.highBg.value,
      outOfRangeThreshold: monitoringValuesDisplayed.outOfRangeThreshold.value,
      veryLowBg: monitoringValuesDisplayed.veryLowBg.value,
      hypoThreshold: monitoringValuesDisplayed.hypoThreshold.value,
      nonDataTxThreshold: monitoringValuesDisplayed.nonDataTxThreshold.value,
      reportingPeriod
    }
    onSave(monitoringAlertsParametersUpdated)
  }

  return {
    getHighBgInitialState,
    getHypoThresholdInitialState,
    getLowBgInitialState,
    getNonDataTxThresholdInitialState,
    getOutOfRangeThresholdInitialState,
    getVeryLowBgInitialState,
    monitoringValuesDisplayed,
    save,
    saveButtonDisabled,
    setMonitoringValuesDisplayed
  }
}
