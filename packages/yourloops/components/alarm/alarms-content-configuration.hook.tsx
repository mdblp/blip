/*
 * Copyright (c) 2022, Diabeloop
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
import { convertBG } from '../../lib/units/units.util'
import { useTeam } from '../../lib/team'
import { Monitoring } from '../../lib/team/models/monitoring.model'
import React, { useMemo, useState } from 'react'
import PatientUtils from '../../lib/patient/patient.util'
import { Patient } from '../../lib/patient/models/patient.model'
import { useTranslation } from 'react-i18next'
import { isInvalidPercentage, onBasicDropdownSelect } from './alarm-content-configuration.utils'
import { UnitsType } from '../../lib/units/models/enums/units-type.enum'
export interface AlarmsContentConfigurationHookProps {
  monitoring?: Monitoring
  saveInProgress?: boolean
  patient?: Patient
  onClose?: () => void
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
  onBasicDropdownSelect: (value: string, setValue: React.Dispatch<{ value?: number, error: boolean }>) => void
  save: () => void
  resetToTeamDefaultValues: () => void
  onChange: (value: number, lowValue: number, highValue: number, setValue: React.Dispatch<ValueErrorPair>) => void
  bgUnit: UnitsType
  thresholds: Record<string, number>
}

interface ValueErrorMessagePair {
  value?: number
  errorMessage?: string
}

interface ValueErrorPair {
  value?: number
  error?: boolean
}

export const DEFAULT_THRESHOLDS_IN_MGDL = {
  MIN_HIGH_BG: 140,
  MAX_HIGH_BG: 250,
  MIN_VERY_LOW_BG: 40,
  MAX_VERY_LOW_BG: 90,
  MIN_LOW_BG: 50,
  MAX_LOW_BG: 100
}
export const PERCENTAGES = [...new Array(21)]
  .map((_each, index) => `${index * 5}%`).slice(1, 21)

const useAlarmsContentConfiguration = ({ monitoring, saveInProgress, onSave, patient }: AlarmsContentConfigurationHookProps): AlarmsContentConfigurationHookReturn => {
  const bgUnit = monitoring?.parameters?.bgUnit ?? UnitsType.MGDL
  const thresholds = { ...DEFAULT_THRESHOLDS_IN_MGDL }
  const { t } = useTranslation('yourloops')
  const convertThresholdsToMmol = (): void => {
    if (monitoring?.parameters && monitoring?.parameters?.bgUnit === UnitsType.MMOLL) {
      thresholds.MIN_HIGH_BG = Math.round(convertBG(thresholds.MIN_HIGH_BG, UnitsType.MGDL) * 10) / 10
      thresholds.MAX_HIGH_BG = Math.round(convertBG(thresholds.MAX_HIGH_BG, UnitsType.MGDL) * 10) / 10
      thresholds.MIN_VERY_LOW_BG = Math.round(convertBG(thresholds.MIN_VERY_LOW_BG, UnitsType.MGDL) * 10) / 10
      thresholds.MAX_VERY_LOW_BG = Math.round(convertBG(thresholds.MAX_VERY_LOW_BG, UnitsType.MGDL) * 10) / 10
      thresholds.MIN_LOW_BG = Math.round(convertBG(thresholds.MIN_LOW_BG, UnitsType.MGDL) * 10) / 10
      thresholds.MAX_LOW_BG = Math.round(convertBG(thresholds.MAX_LOW_BG, UnitsType.MGDL) * 10) / 10
    }
  }
  convertThresholdsToMmol()

  const getIsErrorMessage = (value: number, lowValue: number, highValue: number): string => {
    if (bgUnit === UnitsType.MGDL && !(Number.isInteger(value))) {
      return t('mandatory-integer')
    }
    if (value < lowValue || value > highValue) {
      return t('mandatory-range', { bgUnit, lowValue, highValue })
    }
    if (bgUnit === UnitsType.MMOLL && !(value % 1 !== 0)) {
      return t('mandatory-float')
    }
    return null
  }
  const teamHook = useTeam()
  const [highBg, setHighBg] = useState<ValueErrorMessagePair>({
    value: monitoring?.parameters?.highBg,
    errorMessage: getIsErrorMessage(monitoring?.parameters?.highBg, thresholds.MIN_HIGH_BG, thresholds.MAX_HIGH_BG)
  })
  const [veryLowBg, setVeryLowBg] = useState<ValueErrorMessagePair>({
    value: monitoring?.parameters?.veryLowBg,
    errorMessage: getIsErrorMessage(monitoring?.parameters?.veryLowBg, thresholds.MIN_VERY_LOW_BG, thresholds.MAX_VERY_LOW_BG)
  })
  const [lowBg, setLowBg] = useState<ValueErrorMessagePair>({
    value: monitoring?.parameters?.lowBg,
    errorMessage: getIsErrorMessage(monitoring?.parameters?.lowBg, thresholds.MIN_LOW_BG, thresholds.MAX_LOW_BG)
  })
  const [nonDataTxThreshold, setNonDataTxThreshold] = useState<ValueErrorPair>(
    {
      value: monitoring?.parameters?.nonDataTxThreshold,
      error: monitoring?.parameters?.nonDataTxThreshold === undefined || isInvalidPercentage(monitoring.parameters.nonDataTxThreshold)
    })
  const [outOfRangeThreshold, setOutOfRangeThreshold] = useState<ValueErrorPair>(
    {
      value: monitoring?.parameters?.outOfRangeThreshold,
      error: monitoring?.parameters?.outOfRangeThreshold === undefined || isInvalidPercentage(monitoring.parameters.outOfRangeThreshold)
    })
  const [hypoThreshold, setHypoThreshold] = useState<ValueErrorPair>(
    {
      value: monitoring?.parameters?.hypoThreshold,
      error: monitoring?.parameters?.hypoThreshold === undefined || isInvalidPercentage(monitoring.parameters.hypoThreshold)
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
      errorMessage: getIsErrorMessage(value, lowValue, highValue)
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
    setHighBg({ ...highBg, value: defaultMonitoring.parameters.highBg })
    setVeryLowBg({ ...veryLowBg, value: defaultMonitoring.parameters.veryLowBg })
    setLowBg({ ...lowBg, value: defaultMonitoring.parameters.lowBg })
    setNonDataTxThreshold({ ...nonDataTxThreshold, value: defaultMonitoring.parameters.nonDataTxThreshold })
    setOutOfRangeThreshold({ ...outOfRangeThreshold, value: defaultMonitoring.parameters.outOfRangeThreshold })
    setHypoThreshold({ ...hypoThreshold, value: defaultMonitoring.parameters.hypoThreshold })
  }

  const save = (): void => {
    if (
      lowBg.value !== undefined &&
      highBg.value !== undefined &&
      veryLowBg.value !== undefined &&
      outOfRangeThreshold.value !== undefined &&
      nonDataTxThreshold.value !== undefined &&
      hypoThreshold.value !== undefined
    ) {
      const reportingPeriod = (monitoring?.parameters?.reportingPeriod && monitoring?.parameters?.reportingPeriod > 0) ? monitoring?.parameters?.reportingPeriod : 55
      const monitoringUpdated: Monitoring = {
        enabled: monitoring?.enabled ?? true,
        status: monitoring?.status,
        monitoringEnd: monitoring?.monitoringEnd,
        parameters: {
          bgUnit: monitoring?.parameters?.bgUnit ?? UnitsType.MGDL,
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
    } else {
      throw Error('Cannot update team monitoring as some values are not defined')
    }
  }
  return {
    lowBg,
    saveButtonDisabled,
    onBasicDropdownSelect,
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
    bgUnit,
    thresholds
  }
}
export default useAlarmsContentConfiguration
