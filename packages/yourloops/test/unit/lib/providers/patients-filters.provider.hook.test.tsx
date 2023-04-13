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

import * as authHookMock from '../../../../lib/auth'
import { act, renderHook } from '@testing-library/react-hooks'
import { usePatientListProviderHook } from '../../../../lib/providers/patient-list.provider.hook'
import { type PatientsFilters } from '../../../../lib/providers/models/patients-filters.model'
import type User from '../../../../lib/auth/models/user.model'
import { type GridColumnVisibilityModel } from '@mui/x-data-grid'
import { PatientListColumns } from '../../../../components/patient-list/enums/patient-list.enum'

jest.mock('../../../../lib/auth')
describe('usePatientListProviderHook', () => {
  const defaultFilters: PatientsFilters = {
    pendingEnabled: false,
    manualFlagEnabled: false,
    telemonitoredEnabled: false,
    timeOutOfTargetEnabled: false,
    hypoglycemiaEnabled: false,
    dataNotTransferredEnabled: false,
    messagesEnabled: false
  }

  const filtersUpdated: PatientsFilters = {
    pendingEnabled: true,
    manualFlagEnabled: true,
    telemonitoredEnabled: true,
    timeOutOfTargetEnabled: true,
    hypoglycemiaEnabled: true,
    dataNotTransferredEnabled: true,
    messagesEnabled: true
  }

  const defaultHcpColumns: GridColumnVisibilityModel = {
    [PatientListColumns.Flag]: true,
    [PatientListColumns.System]: true,
    [PatientListColumns.Patient]: true,
    [PatientListColumns.TimeOutOfRange]: true,
    [PatientListColumns.SevereHypoglycemia]: true,
    [PatientListColumns.DataNotTransferred]: true,
    [PatientListColumns.LastDataUpdate]: true,
    [PatientListColumns.Messages]: true,
    [PatientListColumns.Actions]: true
  }

  const defaultCaregiverColumns: GridColumnVisibilityModel = {
    [PatientListColumns.Flag]: true,
    [PatientListColumns.System]: true,
    [PatientListColumns.Patient]: true,
    [PatientListColumns.TimeOutOfRange]: false,
    [PatientListColumns.SevereHypoglycemia]: false,
    [PatientListColumns.DataNotTransferred]: false,
    [PatientListColumns.LastDataUpdate]: true,
    [PatientListColumns.Messages]: false,
    [PatientListColumns.Actions]: true
  }

  beforeAll(() => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { isUserHcp: () => true } as User }
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

  describe('displayedColumns', () => {
    it('should have the correct list of columns for hcp', () => {
      const { result } = renderHook(() => usePatientListProviderHook())
      expect(result.current.displayedColumns).toEqual(defaultHcpColumns)
    })

    it('should have the correct list of columns for caregivers', () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
        return { user: { isUserHcp: () => false } as User }
      })
      const { result } = renderHook(() => usePatientListProviderHook())
      expect(result.current.displayedColumns).toEqual(defaultCaregiverColumns)
    })
  })
})
