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
import { type Monitoring } from '../../lib/team/models/monitoring.model'
import type React from 'react'
import { useMemo, useState } from 'react'
import PatientUtils from '../../lib/patient/patient.util'
import { type Patient } from '../../lib/patient/models/patient.model'
import { useTranslation } from 'react-i18next'
import {
  buildThresholds,
  getConvertedValue,
  isInvalidPercentage,
  REGEX_VALUE_BG
} from './alarm-content-configuration.util'
import { type Thresholds } from '../../lib/patient/models/alarms.model'
import { DEFAULT_BG_VALUES } from './alarms.default'
import { useAuth } from '../../lib/auth'
import { type BgUnit, Unit } from 'medical-domain'

export interface AlarmsContentConfigurationHookProps {
  monitoring: Monitoring
  saveInProgress?: boolean
  patient?: Patient
  onSave?: (monitoring: Monitoring) => void
}

interface AlarmsContentConfigurationHookReturn {
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

const useAlarmsContentConfiguration = ({ monitoring, saveInProgress, onSave, patient }: AlarmsContentConfigurationHookProps): AlarmsContentConfigurationHookReturn => {
  const { user } = useAuth()

  const userBgUnit = user.settings?.units?.bg ?? DEFAULT_BG_UNIT
  const monitoringBgUnit = monitoring.parameters?.bgUnit ?? DEFAULT_BG_UNIT

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

  if (!monitoring.parameters) {
    monitoring.parameters = {
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

  const highBgValue = getConvertedValue(monitoring.parameters.highBg, monitoringBgUnit, userBgUnit)
  const [highBg, setHighBg] = useState<ValueErrorMessagePair>(() => {
    return {
      value: highBgValue,
      errorMessage: getErrorMessage(highBgValue, thresholds.minHighBg, thresholds.maxHighBg)
    }
  })

  const veryLowBgValue = getConvertedValue(monitoring.parameters.veryLowBg, monitoringBgUnit, userBgUnit)
  const [veryLowBg, setVeryLowBg] = useState<ValueErrorMessagePair>(() => {
    return {
      value: veryLowBgValue,
      errorMessage: getErrorMessage(veryLowBgValue, thresholds.minVeryLowBg, thresholds.maxVeryLowBg)
    }
  })

  const lowBgValue = getConvertedValue(monitoring.parameters.lowBg, monitoringBgUnit, userBgUnit)
  const [lowBg, setLowBg] = useState<ValueErrorMessagePair>(() => {
    return {
      value: lowBgValue,
      errorMessage: getErrorMessage(lowBgValue, thresholds.minLowBg, thresholds.maxLowBg)
    }
  })

  const [nonDataTxThreshold, setNonDataTxThreshold] = useState<ValueErrorPair>(() => {
    return {
      value: monitoring.parameters.nonDataTxThreshold,
      error: isInvalidPercentage(monitoring.parameters.nonDataTxThreshold)
    }
  })

  const [outOfRangeThreshold, setOutOfRangeThreshold] = useState<ValueErrorPair>(() => {
    return {
      value: monitoring.parameters.outOfRangeThreshold,
      error: isInvalidPercentage(monitoring.parameters.outOfRangeThreshold)
    }
  })

  const [hypoThreshold, setHypoThreshold] = useState<ValueErrorPair>(() => {
    return {
      value: monitoring.parameters.hypoThreshold,
      error: isInvalidPercentage(monitoring.parameters.hypoThreshold)
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

    const monitoredTeam = PatientUtils.getRemoteMonitoringTeam(patient)

    const team = teamHook.getTeam(monitoredTeam.teamId)
    if (!team) {
      throw Error(`Cannot find team with id ${monitoredTeam.teamId}`)
    }

    const defaultMonitoring = team.monitoring
    if (!defaultMonitoring?.parameters) {
      throw Error('The given team has no monitoring values')
    }

    const defaultParameters = defaultMonitoring.parameters
    const teamBgUnit = defaultParameters.bgUnit

    const defaultHighBgValue = getConvertedValue(defaultParameters.highBg, teamBgUnit, userBgUnit)
    setHighBg({ ...highBg, value: defaultHighBgValue })

    const defaultVeryLowBgValue = getConvertedValue(defaultParameters.veryLowBg, teamBgUnit, userBgUnit)
    setVeryLowBg({ ...veryLowBg, value: defaultVeryLowBgValue })

    const defaultLowBgValue = getConvertedValue(defaultParameters.lowBg, teamBgUnit, userBgUnit)
    setLowBg({ ...lowBg, value: defaultLowBgValue })

    setNonDataTxThreshold({ ...nonDataTxThreshold, value: defaultMonitoring.parameters.nonDataTxThreshold })
    setOutOfRangeThreshold({ ...outOfRangeThreshold, value: defaultMonitoring.parameters.outOfRangeThreshold })
    setHypoThreshold({ ...hypoThreshold, value: defaultMonitoring.parameters.hypoThreshold })
  }

  const save = (): void => {
    const reportingPeriod = (monitoring.parameters.reportingPeriod && monitoring.parameters.reportingPeriod > 0) ? monitoring.parameters.reportingPeriod : 55
    const monitoringUpdated: Monitoring = {
      enabled: monitoring.enabled,
      status: monitoring.status,
      monitoringEnd: monitoring.monitoringEnd,
      parameters: {
        bgUnit: userBgUnit,
        lowBg: lowBg.value,
        highBg: highBg.value,
        outOfRangeThreshold: outOfRangeThreshold.value,
        veryLowBg: veryLowBg.value,
        hypoThreshold: hypoThreshold.value,
        nonDataTxThreshold: nonDataTxThreshold.value,
        reportingPeriod
      }
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
    bgUnit: userBgUnit
  }
}
export default useAlarmsContentConfiguration
