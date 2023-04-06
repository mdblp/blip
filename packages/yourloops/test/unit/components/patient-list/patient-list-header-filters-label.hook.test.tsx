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

import { renderHook } from '@testing-library/react-hooks'
import {
  usePatientListHeaderFiltersLabelHook
} from '../../../../components/patient-list/patient-list-header-filters-label.hook'

describe('usePatientListHeaderFiltersLabelHook', () => {
  describe('filtersLabel', () => {
    it('should return correct filter when there is a pending filter enabled', () => {
      const allPatientsForSelectedTeamCount = 0
      const pendingFilterEnabled = true
      const hasAnyNonPendingFiltersEnabled = true
      const numberOfPatientsDisplayed = 10

      const { result } = renderHook(() => usePatientListHeaderFiltersLabelHook({
        allPatientsForSelectedTeamCount,
        pendingFilterEnabled,
        hasAnyNonPendingFiltersEnabled,
        numberOfPatientsDisplayed
      }))

      expect(result.current.filtersLabel).toEqual('filter-pending')
    })

    it('should return correct filter when there are other filter than the pending one', () => {
      const allPatientsForSelectedTeamCount = 0
      const pendingFilterEnabled = false
      const hasAnyNonPendingFiltersEnabled = true
      const numberOfPatientsDisplayed = 10

      const { result } = renderHook(() => usePatientListHeaderFiltersLabelHook({
        allPatientsForSelectedTeamCount,
        pendingFilterEnabled,
        hasAnyNonPendingFiltersEnabled,
        numberOfPatientsDisplayed
      }))

      expect(result.current.filtersLabel).toEqual('filters-activated')
    })

    it('should return null when no filter', () => {
      const allPatientsForSelectedTeamCount = 0
      const pendingFilterEnabled = false
      const hasAnyNonPendingFiltersEnabled = false
      const numberOfPatientsDisplayed = 10

      const { result } = renderHook(() => usePatientListHeaderFiltersLabelHook({
        allPatientsForSelectedTeamCount,
        pendingFilterEnabled,
        hasAnyNonPendingFiltersEnabled,
        numberOfPatientsDisplayed
      }))

      expect(result.current.filtersLabel).toBeNull()
    })
  })
})
