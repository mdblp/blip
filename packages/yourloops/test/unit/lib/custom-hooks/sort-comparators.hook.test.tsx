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
import { useSortComparatorsHook } from '../../../../lib/custom-hooks/sort-comparators.hook'
import { type Patient } from '../../../../lib/patient/models/patient.model'

describe('useSortComparatorsHook', () => {
  describe('sortByUserName', () => {
    const smallerPatientName = 'aaron'
    const biggerPatientName = 'zacchaeus'

    it('should return negative number when first patient has a smaller fullname', () => {
      const patient1 = { profile: { fullName: smallerPatientName } } as Patient
      const patient2 = { profile: { fullName: biggerPatientName } } as Patient

      const { result: { current: { sortByUserName } } } = renderHook(() => useSortComparatorsHook())
      const res = sortByUserName(patient1, patient2)

      expect(res).toBeLessThan(0)
    })

    it('should return positive number when second patient has a bigger fullname', () => {
      const patient1 = { profile: { fullName: biggerPatientName } } as Patient
      const patient2 = { profile: { fullName: smallerPatientName } } as Patient

      const { result: { current: { sortByUserName } } } = renderHook(() => useSortComparatorsHook())
      const res = sortByUserName(patient1, patient2)

      expect(res).toBeGreaterThan(0)
    })

    it('should return 0 when patients have same fullname', () => {
      const patient1 = { profile: { fullName: biggerPatientName } } as Patient
      const patient2 = { profile: { fullName: biggerPatientName } } as Patient

      const { result: { current: { sortByUserName } } } = renderHook(() => useSortComparatorsHook())
      const res = sortByUserName(patient1, patient2)

      expect(res).toBe(0)
    })
  })
})
