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

import { useState } from 'react'
import { type PatientsFilters } from './models/patients-filters.model'
import { type PatientListContextResult } from './models/patient-list-context-result.model'
import { PatientListColumns } from '../../components/patient-list/models/enums/patient-list.enum'
import { type GridColumnVisibilityModel } from '@mui/x-data-grid'
import { useAuth } from '../auth'

const DEFAULT_FILTERS = {
  pendingEnabled: false,
  manualFlagEnabled: false,
  timeOutOfTargetEnabled: false,
  hypoglycemiaEnabled: false,
  dataNotTransferredEnabled: false,
  messagesEnabled: false
}

const DEFAULT_COLUMNS_HCP = [
  PatientListColumns.Flag,
  PatientListColumns.Patient,
  PatientListColumns.DateOfBirth,
  PatientListColumns.MonitoringAlerts,
  PatientListColumns.Messages,
  PatientListColumns.TimeInRange,
  PatientListColumns.BelowRange,
  PatientListColumns.LastDataUpdate,
  PatientListColumns.Actions,
  PatientListColumns.PatientProfile,
]

const DEFAULT_COLUMNS_CAREGIVER = [
  PatientListColumns.Flag,
  PatientListColumns.Patient,
  PatientListColumns.DateOfBirth,
  PatientListColumns.TimeInRange,
  PatientListColumns.BelowRange,
  PatientListColumns.LastDataUpdate,
  PatientListColumns.Actions,
]

export const usePatientListProviderHook = (): PatientListContextResult => {
  const { user, updatePreferences } = useAuth()
  const isUserHcp = user.isUserHcp()

  const getColumnPreference = (columnName: PatientListColumns): boolean => {
    const userPreferredColumns = user.preferences?.patientsListSortedOptionalColumns
    const defaultColumns = isUserHcp ? DEFAULT_COLUMNS_HCP : DEFAULT_COLUMNS_CAREGIVER

    return userPreferredColumns ? userPreferredColumns.includes(columnName) : defaultColumns.includes(columnName)
  }

  const [filters, setFilters] = useState<PatientsFilters>(DEFAULT_FILTERS)
  const [displayedColumns, setDisplayedColumns] = useState<GridColumnVisibilityModel>({
    [PatientListColumns.Flag]: true,
    [PatientListColumns.System]: getColumnPreference(PatientListColumns.System),
    [PatientListColumns.Patient]: true,
    [PatientListColumns.DateOfBirth]: getColumnPreference(PatientListColumns.DateOfBirth),
    [PatientListColumns.Age]: getColumnPreference(PatientListColumns.Age),
    [PatientListColumns.Gender]: getColumnPreference(PatientListColumns.Gender),
    [PatientListColumns.MonitoringAlerts]: isUserHcp ? getColumnPreference(PatientListColumns.MonitoringAlerts) : false,
    [PatientListColumns.LastDataUpdate]: getColumnPreference(PatientListColumns.LastDataUpdate),
    [PatientListColumns.Messages]: isUserHcp ? getColumnPreference(PatientListColumns.Messages) : false,
    [PatientListColumns.TimeInRange]: getColumnPreference(PatientListColumns.TimeInRange),
    [PatientListColumns.GlucoseManagementIndicator]: getColumnPreference(PatientListColumns.GlucoseManagementIndicator),
    [PatientListColumns.BelowRange]: getColumnPreference(PatientListColumns.BelowRange),
    [PatientListColumns.Variance]: getColumnPreference(PatientListColumns.Variance),
    [PatientListColumns.Actions]: true,
    [PatientListColumns.PatientProfile]: getColumnPreference(PatientListColumns.PatientProfile)
  })

  const buildColumnsPreferencesArray = (columnsVisibilityModel: GridColumnVisibilityModel): string[] => {
    const columnsPreferences = []
    for (const columnName in columnsVisibilityModel) {
      if (columnsVisibilityModel[columnName]) {
        columnsPreferences.push(columnName)
      }
    }
    return columnsPreferences
  }

  const saveColumnsPreferences = async (updatedColumnsVisibilityModel: GridColumnVisibilityModel): Promise<void> => {
    setDisplayedColumns(updatedColumnsVisibilityModel)
    await updatePreferences({ patientsListSortedOptionalColumns: buildColumnsPreferencesArray(updatedColumnsVisibilityModel) })
  }

  const updatePatientsFilters = (filters: PatientsFilters): void => {
    setFilters(filters)
  }

  const updatePendingFilter = (pendingEnabled: boolean): void => {
    setFilters({ ...filters, pendingEnabled })
  }

  const resetFilters = (): void => {
    setFilters(DEFAULT_FILTERS)
  }

  const hasAnyNonPendingFiltersEnabled = filters.manualFlagEnabled || filters.timeOutOfTargetEnabled || filters.hypoglycemiaEnabled || filters.dataNotTransferredEnabled || filters.messagesEnabled

  return {
    filters,
    hasAnyNonPendingFiltersEnabled,
    updatePatientsFilters,
    updatePendingFilter,
    resetFilters,
    displayedColumns,
    saveColumnsPreferences
  }
}
