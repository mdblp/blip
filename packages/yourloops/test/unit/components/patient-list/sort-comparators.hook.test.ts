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

import { renderHook } from '@testing-library/react-hooks'
import { useSortComparatorsHook } from '../../../../components/patient-list/sort-comparators.hook'
import { type Patient } from '../../../../lib/patient/models/patient.model'
import { UserInvitationStatus } from '../../../../lib/team/models/enums/user-invitation-status.enum'

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

  describe('sortByFlag', () => {
    it('should sort the patients by whether they are flagged', () => {
      const patientA = {
        id: 'idA',
        profile: { fullName: 'A Patient', email: undefined, sex: undefined },
        monitoringAlerts: undefined,
        settings: undefined,
        metadata: { flagged: false, hasSentUnreadMessages: undefined },
        invitationStatus: UserInvitationStatus.accepted,
        userid: ''
      } as Patient

      const patientB = {
        id: 'idB',
        profile: { fullName: 'B Patient', email: undefined, sex: undefined },
        monitoringAlerts: undefined,
        settings: undefined,
        metadata: { flagged: true, hasSentUnreadMessages: undefined },
        invitationStatus: UserInvitationStatus.accepted,
        userid: ''
      } as Patient

      const patientC = {
        id: 'idC',
        profile: { fullName: 'C Patient', email: undefined, sex: undefined },
        monitoringAlerts: undefined,
        settings: undefined,
        metadata: { flagged: true, hasSentUnreadMessages: undefined },
        invitationStatus: UserInvitationStatus.accepted,
        userid: ''
      } as Patient

      const { result } = renderHook(() => useSortComparatorsHook())

      expect(result.current.sortByFlag(patientA, patientB)).toEqual(1)
      expect(result.current.sortByFlag(patientB, patientA)).toEqual(-1)
      expect(result.current.sortByFlag(patientB, patientC)).toEqual(0)
      expect(result.current.sortByFlag(patientC, patientB)).toEqual(0)
    })
  })
})
