/*
 * Copyright (c) 2023, Diabeloop
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
import { Unit } from 'medical-domain'
import { useTeam } from '../../lib/team/team.hook'
import { type MonitoringAlertsParameters } from '../../lib/team/models/monitoring-alerts-parameters.model'
import {
  DEFAULT_BG_UNIT,
  MonitoringValuesDisplayed,
  useMonitoringAlertsContentConfiguration
} from './monitoring-alerts-content-configuration.hook'
import { useParams } from 'react-router-dom'

interface MonitoringAlertsPatientConfigurationHookProps {
  monitoringAlertsParameters: MonitoringAlertsParameters
  onSave?: (monitoringAlertsParameters: MonitoringAlertsParameters) => void
  wasInitiallyUsingTeamAlertParameters: boolean
  saveInProgress?: boolean
  userBgUnit: Unit.MilligramPerDeciliter | Unit.MmolPerLiter
  onUnsavedChangesChange?: (hasChanges: boolean) => void
}

interface MonitoringAlertsPatientConfigurationHookReturn {
  discardChanges: () => void
  monitoringValuesDisplayed: MonitoringValuesDisplayed
  resetToTeamDefaultValues: () => void
  save: () => void
  saveButtonDisabled: boolean
  setMonitoringValuesDisplayed: React.Dispatch<MonitoringValuesDisplayed>
  useTeamValues: boolean
  onValueChange: (newMonitoringParametersValuesToDisplay: MonitoringValuesDisplayed) => void
}

export const useMonitoringAlertsPatientConfiguration = (
  {
    monitoringAlertsParameters,
    saveInProgress,
    userBgUnit,
    onSave,
    wasInitiallyUsingTeamAlertParameters,
    onUnsavedChangesChange
  }: MonitoringAlertsPatientConfigurationHookProps
): MonitoringAlertsPatientConfigurationHookReturn => {
  const { teamId } = useParams()
  const { getTeam } = useTeam()

  const selectedTeam = getTeam(teamId)

  const {
    monitoringValuesDisplayed,
    getHighBgInitialState,
    getLowBgInitialState,
    getVeryLowBgInitialState,
    getNonDataTxThresholdInitialState,
    getOutOfRangeThresholdInitialState,
    getHypoThresholdInitialState,
    save,
    saveButtonDisabled,
    setMonitoringValuesDisplayed
  } = useMonitoringAlertsContentConfiguration({ monitoringAlertsParameters, saveInProgress, userBgUnit, onSave })

  const [useTeamValues, setUseTeamValues] = useState<boolean>(wasInitiallyUsingTeamAlertParameters)

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

  const areTeamValuesAndGivenValuesTheSame = (values: MonitoringValuesDisplayed): boolean => {
    return teamAlertParametersValues.highBg === values.highBg.value
      && teamAlertParametersValues.lowBg === values.lowBg.value
      && teamAlertParametersValues.veryLowBg === values.veryLowBg.value
      && teamAlertParametersValues.hypoThreshold === values.hypoThreshold.value
      && teamAlertParametersValues.nonDataTxThreshold === values.nonDataTxThreshold.value
      && teamAlertParametersValues.outOfRangeThreshold === values.outOfRangeThreshold.value
  }

  const resetToTeamDefaultValues = (): void => {
    const defaultMonitoringAlertsParameters = selectedTeam.monitoringAlertsParameters
    const teamBgUnit = defaultMonitoringAlertsParameters.bgUnit

    const defaultHighBgValue = getConvertedValue(defaultMonitoringAlertsParameters.highBg, teamBgUnit, userBgUnit)
    const defaultVeryLowBgValue = getConvertedValue(defaultMonitoringAlertsParameters.veryLowBg, teamBgUnit, userBgUnit)
    const defaultLowBgValue = getConvertedValue(defaultMonitoringAlertsParameters.lowBg, teamBgUnit, userBgUnit)

    const { minLowBg, maxLowBg, minHighBg, maxHighBg, minVeryLowBg, maxVeryLowBg } = buildThresholds(userBgUnit)

    setMonitoringValuesDisplayed({
      highBg: {
        value: defaultHighBgValue,
        errorMessage: getErrorMessage(userBgUnit, defaultHighBgValue, minHighBg, maxHighBg)
      },
      hypoThreshold: {
        value: defaultMonitoringAlertsParameters.hypoThreshold,
        error: isInvalidPercentage(defaultMonitoringAlertsParameters.hypoThreshold)
      },
      lowBg: {
        value: defaultLowBgValue,
        errorMessage: getErrorMessage(userBgUnit, defaultLowBgValue, minLowBg, maxLowBg)
      },
      nonDataTxThreshold: {
        value: defaultMonitoringAlertsParameters.nonDataTxThreshold,
        error: isInvalidPercentage(defaultMonitoringAlertsParameters.nonDataTxThreshold)
      },
      outOfRangeThreshold: {
        value: defaultMonitoringAlertsParameters.outOfRangeThreshold,
        error: isInvalidPercentage(defaultMonitoringAlertsParameters.outOfRangeThreshold)
      },
      veryLowBg: {
        value: defaultVeryLowBgValue,
        errorMessage: getErrorMessage(userBgUnit, defaultVeryLowBgValue, minVeryLowBg, maxVeryLowBg)
      }
    })
    setUseTeamValues(true)
  }

  const discardChanges = (): void => {
    const newMonitoringParametersValuesToDisplay = {
      highBg: getHighBgInitialState(),
      hypoThreshold: getHypoThresholdInitialState(),
      lowBg: getLowBgInitialState(),
      nonDataTxThreshold: getNonDataTxThresholdInitialState(),
      outOfRangeThreshold: getOutOfRangeThresholdInitialState(),
      veryLowBg: getVeryLowBgInitialState()
    }
    setMonitoringValuesDisplayed(newMonitoringParametersValuesToDisplay)
    setUseTeamValues(areTeamValuesAndGivenValuesTheSame(newMonitoringParametersValuesToDisplay))
  }

  const shouldSaveButtonBeDisabled = useMemo(() => {
    return wasInitiallyUsingTeamAlertParameters === useTeamValues && saveButtonDisabled
  }, [wasInitiallyUsingTeamAlertParameters, saveButtonDisabled, useTeamValues])

  const onValueChange = (newMonitoringParametersValuesToDisplay: MonitoringValuesDisplayed) => {
    setUseTeamValues(areTeamValuesAndGivenValuesTheSame(newMonitoringParametersValuesToDisplay))
    // TODO: check the !saveButtonDisabled part, not sure it's needed here to indicate save in progress
    const hasChanges = !areTeamValuesAndGivenValuesTheSame(newMonitoringParametersValuesToDisplay) || !saveButtonDisabled
    if (onUnsavedChangesChange) {
      onUnsavedChangesChange(hasChanges)
    }
  }

  return {
    discardChanges,
    monitoringValuesDisplayed,
    onValueChange,
    resetToTeamDefaultValues,
    save,
    saveButtonDisabled: shouldSaveButtonBeDisabled,
    setMonitoringValuesDisplayed,
    useTeamValues
  }
}
