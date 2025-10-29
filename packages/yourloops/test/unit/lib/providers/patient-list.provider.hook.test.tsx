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

import * as authHookMock from '../../../../lib/auth'
import { act, renderHook } from '@testing-library/react'
import { usePatientListProviderHook } from '../../../../lib/providers/patient-list.provider.hook'
import { type PatientsFilters } from '../../../../lib/providers/models/patients-filters.model'
import type User from '../../../../lib/auth/models/user.model'
import { type GridColumnVisibilityModel } from '@mui/x-data-grid'
import { PatientListColumns } from '../../../../components/patient-list/models/enums/patient-list.enum'

jest.mock('../../../../lib/auth')
describe('usePatientListProviderHook', () => {
  const updatePreferencesMock = jest.fn()
  const defaultFilters: PatientsFilters = {
    pendingEnabled: false,
    manualFlagEnabled: false,
    timeOutOfTargetEnabled: false,
    hypoglycemiaEnabled: false,
    dataNotTransferredEnabled: false,
    messagesEnabled: false
  }

  const filtersUpdated: PatientsFilters = {
    pendingEnabled: true,
    manualFlagEnabled: true,
    timeOutOfTargetEnabled: true,
    hypoglycemiaEnabled: true,
    dataNotTransferredEnabled: true,
    messagesEnabled: true
  }

  beforeAll(() => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          isUserHcp: () => true,
          preferences: { patientsListSortedOptionalColumns: [PatientListColumns.System, PatientListColumns.LastDataUpdate, PatientListColumns.Messages] }
        } as User,
        updatePreferences: updatePreferencesMock
      }
    })
  })

  describe('filters', () => {
    it('should all be initialized at false', () => {
      const { result } = renderHook(() => usePatientListProviderHook())

      expect(result.current.filters).toEqual(defaultFilters)
    })
  })

  describe('updatePatientsFilters', () => {
    it('should update filters accordingly', () => {
      const { result } = renderHook(() => usePatientListProviderHook())
      expect(result.current.filters).toEqual(defaultFilters)

      act(() => {
        result.current.updatePatientsFilters(filtersUpdated)
      })

      expect(result.current.filters).toBe(filtersUpdated)
    })
  })

  describe('updatePendingFilter', () => {
    it('should update the pending filter', () => {
      const { result } = renderHook(() => usePatientListProviderHook())
      expect(result.current.filters.pendingEnabled).toBeFalsy()

      act(() => {
        result.current.updatePendingFilter(true)
      })

      expect(result.current.filters.pendingEnabled).toBeTruthy()
    })
  })

  describe('resetFilters', () => {
    it('should reset all filters', () => {
      const { result } = renderHook(() => usePatientListProviderHook())
      expect(result.current.filters).toEqual(defaultFilters)

      act(() => {
        result.current.updatePatientsFilters(filtersUpdated)
      })

      expect(result.current.filters).toBe(filtersUpdated)

      act(() => {
        result.current.resetFilters()
      })

      expect(result.current.filters).toEqual(defaultFilters)
    })
  })

  describe('saveColumnsPreferences', () => {
    it('should save the column choice into user preferences', () => {
      const { result } = renderHook(() => usePatientListProviderHook())
      const updatedColumnsVisibilityModel: GridColumnVisibilityModel = {
        [PatientListColumns.Flag]: true,
        [PatientListColumns.System]: true,
        [PatientListColumns.Patient]: true,
        [PatientListColumns.MonitoringAlerts]: false,
        [PatientListColumns.LastDataUpdate]: false,
        [PatientListColumns.Messages]: false,
        [PatientListColumns.Actions]: true
      }
      const patientsListSortedOptionalColumns = [PatientListColumns.Flag, PatientListColumns.System, PatientListColumns.Patient, PatientListColumns.Actions]

      act(() => {
        result.current.saveColumnsPreferences(updatedColumnsVisibilityModel)
      })
      expect(result.current.displayedColumns).toEqual(updatedColumnsVisibilityModel)
      expect(updatePreferencesMock).toHaveBeenCalledWith({ patientsListSortedOptionalColumns })
    })
  })

  describe('displayedColumns', () => {
    it('should have the correct list of columns for hcp based on his preference', () => {
      const { result } = renderHook(() => usePatientListProviderHook())
      const expectedColumns: GridColumnVisibilityModel = {
        [PatientListColumns.Flag]: true,
        [PatientListColumns.Patient]: true,
        [PatientListColumns.PatientProfile]: false,
        [PatientListColumns.Age]: false,
        [PatientListColumns.DateOfBirth]: false,
        [PatientListColumns.Gender]: false,
        [PatientListColumns.GlucoseManagementIndicator]: false,
        [PatientListColumns.BelowRange]: false,
        [PatientListColumns.System]: true,
        [PatientListColumns.TimeInRange]: false,
        [PatientListColumns.Variance]: false,
        [PatientListColumns.MonitoringAlerts]: false,
        [PatientListColumns.Messages]: true,
        [PatientListColumns.LastDataUpdate]: true,
        [PatientListColumns.Actions]: true
      }

      expect(result.current.displayedColumns).toEqual(expectedColumns)
    })

    it('should have the correct list of columns for caregivers based on his preference', () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
        return {
          user: {
            isUserHcp: () => false,
            preferences: { patientsListSortedOptionalColumns: [PatientListColumns.System, PatientListColumns.LastDataUpdate] }
          } as User
        }
      })
      const { result } = renderHook(() => usePatientListProviderHook())
      const expectedColumns: GridColumnVisibilityModel = {
        [PatientListColumns.Flag]: true,
        [PatientListColumns.Patient]: true,
        [PatientListColumns.PatientProfile]: false,
        [PatientListColumns.Age]: false,
        [PatientListColumns.DateOfBirth]: false,
        [PatientListColumns.Gender]: false,
        [PatientListColumns.GlucoseManagementIndicator]: false,
        [PatientListColumns.BelowRange]: false,
        [PatientListColumns.System]: true,
        [PatientListColumns.TimeInRange]: false,
        [PatientListColumns.Variance]: false,
        [PatientListColumns.MonitoringAlerts]: false,
        [PatientListColumns.Messages]: false,
        [PatientListColumns.LastDataUpdate]: true,
        [PatientListColumns.Actions]: true
      }
      expect(result.current.displayedColumns).toEqual(expectedColumns)
    })

    it('should render the default columns if the HCP user has no preferences set yet', () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
        return {
          user: {
            isUserHcp: () => true,
            preferences: {}
          } as User
        }
      })
      const { result } = renderHook(() => usePatientListProviderHook())
      const expectedColumns: GridColumnVisibilityModel = {
        [PatientListColumns.Flag]: true,
        [PatientListColumns.Patient]: true,
        [PatientListColumns.PatientProfile]: true,
        [PatientListColumns.Age]: false,
        [PatientListColumns.DateOfBirth]: true,
        [PatientListColumns.Gender]: false,
        [PatientListColumns.GlucoseManagementIndicator]: false,
        [PatientListColumns.BelowRange]: true,
        [PatientListColumns.System]: false,
        [PatientListColumns.TimeInRange]: true,
        [PatientListColumns.Variance]: false,
        [PatientListColumns.MonitoringAlerts]: true,
        [PatientListColumns.Messages]: true,
        [PatientListColumns.LastDataUpdate]: true,
        [PatientListColumns.Actions]: true
      }
      expect(result.current.displayedColumns).toEqual(expectedColumns)
    })

    it('should render the default columns if the caregiver user has no preferences set yet', () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
        return {
          user: {
            isUserHcp: () => false,
            preferences: {}
          } as User
        }
      })
      const { result } = renderHook(() => usePatientListProviderHook())
      const expectedColumns: GridColumnVisibilityModel = {
        [PatientListColumns.Flag]: true,
        [PatientListColumns.Patient]: true,
        [PatientListColumns.PatientProfile]: false,
        [PatientListColumns.Age]: false,
        [PatientListColumns.DateOfBirth]: true,
        [PatientListColumns.Gender]: false,
        [PatientListColumns.GlucoseManagementIndicator]: false,
        [PatientListColumns.BelowRange]: true,
        [PatientListColumns.System]: false,
        [PatientListColumns.TimeInRange]: true,
        [PatientListColumns.Variance]: false,
        [PatientListColumns.MonitoringAlerts]: false,
        [PatientListColumns.Messages]: false,
        [PatientListColumns.LastDataUpdate]: true,
        [PatientListColumns.Actions]: true
      }
      expect(result.current.displayedColumns).toEqual(expectedColumns)
    })
  })
})
