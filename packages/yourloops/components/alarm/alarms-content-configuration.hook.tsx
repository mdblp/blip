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
import { UNITS_TYPE } from '../../lib/units/utils'
import { useTeam } from '../../lib/team'
import { Monitoring } from '../../models/monitoring'
import React, { useState, useMemo, Dispatch } from 'react'
import PatientUtils from '../../lib/patient/utils'
import { Patient } from '../../lib/data/patient'

export interface AlarmsContentConfigurationHookProps {
  monitoring?: Monitoring
  saveInProgress?: boolean
  patient?: Patient
  onClose?: () => void
  onSave: (monitoring: Monitoring) => void
}

interface AlarmsContentConfigurationHookReturn {
  isError: (value: number, lowValue: number, highValue: number) => boolean
  lowBg: ValueErrorPair
  setLowBg: React.Dispatch<ValueErrorPair>
  veryLowBg: ValueErrorPair
  setVeryLowBg: React.Dispatch<ValueErrorPair>
  highBg: ValueErrorPair
  setHighBg: React.Dispatch<ValueErrorPair>
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
  MIN_HIGH_BG: number
  MAX_HIGH_BG: number
  MIN_VERY_LOW_BG: number
  MAX_VERY_LOW_BG: number
  MIN_LOW_BG: number
  MAX_LOW_BG: number
  PERCENTAGES: string[]
  bgUnit: UNITS_TYPE
}

interface ValueErrorPair {
  value?: number
  error: boolean
}

export const MIN_HIGH_BG = 140
export const MAX_HIGH_BG = 250
export const MIN_VERY_LOW_BG = 40
export const MAX_VERY_LOW_BG = 90
export const MIN_LOW_BG = 50
export const MAX_LOW_BG = 100
export const PERCENTAGES = [...new Array(21)]
  .map((_each, index) => `${index * 5}%`).slice(1, 21)

const useAlarmsContentConfiguration = ({ monitoring, saveInProgress, onSave, patient }: AlarmsContentConfigurationHookProps): AlarmsContentConfigurationHookReturn => {
  const bgUnit = monitoring?.parameters?.bgUnit ?? UNITS_TYPE.MGDL
  const isInvalidPercentage = (value: number): boolean => {
    return !PERCENTAGES.includes(`${value}%`)
  }
  const isError = (value: number, lowValue: number, highValue: number): boolean => {
    const isInRange: boolean = value >= lowValue && value <= highValue
    const isInteger: boolean = bgUnit === UNITS_TYPE.MGDL && Number.isInteger(value)
    const isFloat: boolean = bgUnit === UNITS_TYPE.MMOLL && value % 1 !== 0
    return !(isInRange && (isInteger || isFloat))
  }
  const teamHook = useTeam()
  const [highBg, setHighBg] = useState<ValueErrorPair>({
    value: monitoring?.parameters?.highBg,
    error: !monitoring?.parameters?.highBg || isError(monitoring?.parameters?.highBg, MIN_HIGH_BG, MAX_HIGH_BG)
  })
  const [veryLowBg, setVeryLowBg] = useState<ValueErrorPair>({
    value: monitoring?.parameters?.veryLowBg,
    error: !monitoring?.parameters?.veryLowBg || isError(monitoring?.parameters?.veryLowBg, MIN_VERY_LOW_BG, MAX_VERY_LOW_BG)
  })
  const [lowBg, setLowBg] = useState<ValueErrorPair>({
    value: monitoring?.parameters?.lowBg,
    error: !monitoring?.parameters?.lowBg || isError(monitoring?.parameters?.lowBg, MIN_LOW_BG, MAX_LOW_BG)
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
    return lowBg.error ||
      highBg.error ||
      veryLowBg.error ||
      outOfRangeThreshold.error ||
      hypoThreshold.error ||
      nonDataTxThreshold.error ||
      saveInProgress
  }, [highBg.error, hypoThreshold.error, lowBg.error, nonDataTxThreshold.error, outOfRangeThreshold.error, saveInProgress, veryLowBg.error])
  const onChange = (
    value: number,
    lowValue: number,
    highValue: number,
    setValue: React.Dispatch<ValueErrorPair>
  ): void => {
    setValue({
      value,
      error: isError(value, lowValue, highValue)
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
          bgUnit: monitoring?.parameters?.bgUnit ?? UNITS_TYPE.MGDL,
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

  const onBasicDropdownSelect = (value: string, setValue: React.Dispatch<{ value?: number, error: boolean }>): void => {
    const valueAsNumber = +value.slice(0, -1)
    setValue({
      value: valueAsNumber,
      error: false
    })
  }

  return {
    isError,
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
    MIN_HIGH_BG,
    MAX_HIGH_BG,
    MAX_LOW_BG,
    MAX_VERY_LOW_BG,
    MIN_VERY_LOW_BG,
    MIN_LOW_BG,
    PERCENTAGES,
    bgUnit
  }
}
export default useAlarmsContentConfiguration
