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
import * as patientProviderMock from '../../../../lib/patient/patient.provider'
import * as patientListProviderMock from '../../../../lib/providers/patient-list.provider'
import { act, renderHook } from '@testing-library/react-hooks'
import { usePatientListHook } from '../../../../components/patient-list/patient-list.hook'
import { PatientListTabs } from '../../../../components/patient-list/models/enums/patient-list.enum'
import type { Patient } from '../../../../lib/patient/models/patient.model'
import PatientUtils from '../../../../lib/patient/patient.util'

jest.mock('../../../../lib/auth')
jest.mock('../../../../lib/patient/patient.provider')
jest.mock('../../../../lib/providers/patient-list.provider')
describe('Patient list hook', () => {
  const patients: Patient[] = [
    { profile: { firstName: 'rob', lastName: 'otique', fullName: 'rob otique' } } as Patient,
    { profile: { firstName: 'laurent', lastName: 'gina', fullName: 'laurent gina' } } as Patient
  ]
  const getFlagPatientsMock = jest.fn().mockReturnValue([])
  const searchPatientsMock = jest.fn().mockReturnValue([])
  const updatePendingFilterMock = jest.fn()
  const computePatientsMock = jest.spyOn(PatientUtils, 'computeFlaggedPatients').mockReturnValue(patients)

  beforeAll(() => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
      getFlagPatients: getFlagPatientsMock
    }));
    (patientProviderMock.usePatientContext as jest.Mock).mockImplementation(() => ({
      searchPatients: searchPatientsMock
    }));
    (patientListProviderMock.usePatientListContext as jest.Mock).mockImplementation(() => ({
      updatePendingFilter: updatePendingFilterMock,
      filters: { pendingEnabled: false }
    }))
  })

  describe('patients useMemo', () => {
    it('should return a list of patients according to user search', () => {
      const { result } = renderHook(() => usePatientListHook())
      expect(result.current.patients).toEqual(patients)
      expect(computePatientsMock).toHaveBeenCalledTimes(1)

      // simulate that user type a patient firstname
      const filteredPatients = [patients[1]]
      jest.spyOn(PatientUtils, 'computeFlaggedPatients').mockReturnValueOnce(filteredPatients)
      act(() => {
        result.current.setInputSearch('laurent')
      })
      expect(searchPatientsMock).toHaveBeenCalledWith('laurent')
      expect(result.current.patients).toEqual(filteredPatients)
    })
  })

  describe('onChangingTab', () => {
    it('should enable / disable pending filter when changing tab to pending / current', () => {
      const { result } = renderHook(() => usePatientListHook())
      expect(result.current.selectedTab).toEqual(PatientListTabs.Current)

      // From Current to Pending
      act(() => {
        result.current.onChangingTab(PatientListTabs.Pending)
      })
      expect(result.current.selectedTab).toEqual(PatientListTabs.Pending)
      expect(updatePendingFilterMock).toHaveBeenCalledWith(true)

      // From Pending to Current
      act(() => {
        result.current.onChangingTab(PatientListTabs.Current)
      })
      expect(result.current.selectedTab).toEqual(PatientListTabs.Current)
      expect(updatePendingFilterMock).toHaveBeenCalledWith(false)
    })
  })

  describe('useEffect', () => {
    it('should disable pending filter if it\'s still activated when navigating to Current tab', () => {
      (patientListProviderMock.usePatientListContext as jest.Mock).mockImplementation(() => ({
        updatePendingFilter: updatePendingFilterMock,
        filters: { pendingEnabled: true }
      }))
      act(() => {
        renderHook(() => usePatientListHook())
      })
      expect(updatePendingFilterMock).toHaveBeenCalledWith(false)
    })
  })
})
