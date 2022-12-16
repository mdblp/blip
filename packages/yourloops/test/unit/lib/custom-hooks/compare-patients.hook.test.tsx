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

import { createAlarm, createPatient } from '../../common/utils'
import { PatientTableSortFields } from '../../../../components/patient/models/enums/patient-table-sort-fields.enum'
import { Monitoring } from '../../../../lib/team/models/monitoring.model'
import { renderHook } from '@testing-library/react-hooks'
import { useComparePatients } from '../../../../lib/custom-hooks/compare-patients.hook'
import { useUserName as useUserNameMock } from '../../../../lib/custom-hooks/user-name.hook'

jest.mock('../../../../lib/custom-hooks/user-name.hook')
describe('Compare patients hook', () => {
  const getUserNameMock = jest.fn().mockImplementation((firstName: string, lastName: string, fullName: string) => fullName)

  beforeAll(() => {
    (useUserNameMock as jest.Mock).mockImplementation(() => ({ getUserName: getUserNameMock }))
  })

  describe('comparePatients', () => {
    describe('alertTimeTarget', () => {
      const smallerAlarm = createAlarm(10, 0)
      const biggerAlarm = createAlarm(11, 0)

      it('should return negative number when first patient has a smaller alarm value', () => {
        const patient1 = createPatient('fakePatient1Id', [], undefined, undefined, undefined, { alarm: smallerAlarm })
        const patient2 = createPatient('fakePatient2Id', [], undefined, undefined, undefined, { alarm: biggerAlarm })

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.alertTimeTarget)

        expect(res).toBeLessThan(0)
      })

      it('should return positive number when second patient has a smaller alarm value', () => {
        const patient1 = createPatient('fakePatient1Id', [], undefined, undefined, undefined, { alarm: biggerAlarm })
        const patient2 = createPatient('fakePatient2Id', [], undefined, undefined, undefined, { alarm: smallerAlarm })

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.alertTimeTarget)

        expect(res).toBeGreaterThan(0)
      })

      it('should return 0 when patients have same alarm value', () => {
        const patient1 = createPatient('fakePatient1Id', [], undefined, undefined, undefined, { alarm: smallerAlarm })
        const patient2 = createPatient('fakePatient2Id', [], undefined, undefined, undefined, { alarm: smallerAlarm })

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.alertTimeTarget)

        expect(res).toBe(0)
      })

      it('should return positive number when first patient has smaller alarm', () => {
        const patient1 = createPatient('fakePatient1Id', [], undefined, undefined, undefined, { alarm: smallerAlarm })
        const patient2 = createPatient('fakePatient2Id', [], undefined, undefined, undefined, { alarm: biggerAlarm })

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.alertTimeTarget)

        expect(res).toBeLessThan(0)
      })

      it('should return negative number when second patient has bigger alarm', () => {
        const patient1 = createPatient('fakePatient1Id', [], undefined, undefined, undefined, { alarm: biggerAlarm })
        const patient2 = createPatient('fakePatient2Id', [], undefined, undefined, undefined, { alarm: smallerAlarm })

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.alertTimeTarget)

        expect(res).toBeGreaterThan(0)
      })

      it('should return 0 when both patient have same alarm', () => {
        const patient1 = createPatient('fakePatient1Id', [])
        const patient2 = createPatient('fakePatient2Id', [])

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.alertTimeTarget)

        expect(res).toBe(0)
      })
    })

    describe('alertHypoglycemic', () => {
      const smallerAlarm = createAlarm(0, 10)
      const biggerAlarm = createAlarm(0, 11)

      it('should return negative number when first patient has a smaller alarm', () => {
        const patient1 = createPatient('fakePatient1Id', [], undefined, undefined, undefined, { alarm: smallerAlarm })
        const patient2 = createPatient('fakePatient2Id', [], undefined, undefined, undefined, { alarm: biggerAlarm })

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.alertHypoglycemic)

        expect(res).toBeLessThan(0)
      })

      it('should return positive number when second patient has a smaller alarm value', () => {
        const patient1 = createPatient('fakePatient1Id', [], undefined, undefined, undefined, { alarm: biggerAlarm })
        const patient2 = createPatient('fakePatient2Id', [], undefined, undefined, undefined, { alarm: smallerAlarm })

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.alertHypoglycemic)

        expect(res).toBeGreaterThan(0)
      })

      it('should return 0 when patients have same alarm value', () => {
        const patient1 = createPatient('fakePatient1Id', [], undefined, undefined, undefined, { alarm: smallerAlarm })
        const patient2 = createPatient('fakePatient2Id', [], undefined, undefined, undefined, { alarm: smallerAlarm })

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.alertHypoglycemic)

        expect(res).toBe(0)
      })

      it('should return positive number when first patient has smaller alarm', () => {
        const patient1 = createPatient('fakePatient1Id', [], undefined, undefined, undefined, { alarm: smallerAlarm })
        const patient2 = createPatient('fakePatient2Id', [], undefined, undefined, undefined, { alarm: biggerAlarm })

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.alertHypoglycemic)

        expect(res).toBeLessThan(0)
      })

      it('should return positive number when second patient has smaller alarm', () => {
        const patient1 = createPatient('fakePatient1Id', [], undefined, undefined, undefined, { alarm: biggerAlarm })
        const patient2 = createPatient('fakePatient2Id', [], undefined, undefined, undefined, { alarm: smallerAlarm })

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.alertHypoglycemic)

        expect(res).toBeGreaterThan(0)
      })

      it('should return 0 when both patient have same alarm', () => {
        const patient1 = createPatient('fakePatient1Id', [])
        const patient2 = createPatient('fakePatient2Id', [])

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.alertHypoglycemic)

        expect(res).toBe(0)
      })
    })

    describe('remoteMonitoring', () => {
      const smallerDate = new Date()
      const biggerDate = new Date(smallerDate.getUTCFullYear(), smallerDate.getMonth() + 1)
      const firstRemoteMonitoringEnding = { monitoringEnd: smallerDate } as Monitoring
      const lastRemoteMonitoringEnding = { monitoringEnd: biggerDate } as Monitoring

      it('should return negative number when first patient has a more recent date', () => {
        const patient1 = createPatient('fakePatient1Id', [], firstRemoteMonitoringEnding)
        const patient2 = createPatient('fakePatient2Id', [], lastRemoteMonitoringEnding)

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.remoteMonitoring)

        expect(res).toBeLessThan(0)
      })

      it('should return positive number when second patient has a more recent date', () => {
        const patient1 = createPatient('fakePatient1Id', [], lastRemoteMonitoringEnding)
        const patient2 = createPatient('fakePatient2Id', [], firstRemoteMonitoringEnding)

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.remoteMonitoring)

        expect(res).toBeGreaterThan(0)
      })

      it('should return 0 when patients have same date', () => {
        const patient1 = createPatient('fakePatient1Id', [], firstRemoteMonitoringEnding)
        const patient2 = createPatient('fakePatient2Id', [], firstRemoteMonitoringEnding)

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.remoteMonitoring)

        expect(res).toBe(0)
      })

      it('should return positive number when first patient has no remote monitoring', () => {
        const patient1 = createPatient('fakePatient1Id')
        const patient2 = createPatient('fakePatient2Id', [], firstRemoteMonitoringEnding)

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.remoteMonitoring)

        expect(res).toBeGreaterThan(0)
      })

      it('should return negative number when second patient has no remote monitoring', () => {
        const patient1 = createPatient('fakePatient1Id', [], firstRemoteMonitoringEnding)
        const patient2 = createPatient('fakePatient2Id')

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.remoteMonitoring)

        expect(res).toBeLessThan(0)
      })

      it('should return 0 when both patient have no remote monitoring', () => {
        const patient1 = createPatient('fakePatient1Id')
        const patient2 = createPatient('fakePatient2Id')

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.remoteMonitoring)

        expect(res).toBe(0)
      })
    })

    describe('system', () => {
      const smallerSystemName = 'DBLG1'
      const biggerSystemName = 'DBLG2'

      it('should return negative number when first patient has a smaller system name', () => {
        const patient1 = createPatient('fakePatient1Id', [], undefined, undefined, { system: smallerSystemName })
        const patient2 = createPatient('fakePatient2Id', [], undefined, undefined, { system: biggerSystemName })

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.system)

        expect(res).toBeLessThan(0)
      })

      it('should return positive number when second patient has a smaller system name', () => {
        const patient1 = createPatient('fakePatient1Id', [], undefined, undefined, { system: biggerSystemName })
        const patient2 = createPatient('fakePatient2Id', [], undefined, undefined, { system: smallerSystemName })

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.system)

        expect(res).toBeGreaterThan(0)
      })

      it('should return 0 when patients have same system name', () => {
        const patient1 = createPatient('fakePatient1Id', [], undefined, undefined, { system: smallerSystemName })
        const patient2 = createPatient('fakePatient2Id', [], undefined, undefined, { system: smallerSystemName })

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.system)

        expect(res).toBe(0)
      })

      it('should return positive number when first patient has no system name', () => {
        const patient1 = createPatient('fakePatient1Id')
        const patient2 = createPatient('fakePatient2Id', [], undefined, undefined, { system: smallerSystemName })

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.system)

        expect(res).toBeGreaterThan(0)
      })

      it('should return negative number when second patient has no system name', () => {
        const patient1 = createPatient('fakePatient1Id', [], undefined, undefined, { system: smallerSystemName })
        const patient2 = createPatient('fakePatient2Id')

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.system)

        expect(res).toBeLessThan(0)
      })

      it('should return 0 when both patient have no system name', () => {
        const patient1 = createPatient('fakePatient1Id')
        const patient2 = createPatient('fakePatient2Id')

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.system)

        expect(res).toBe(0)
      })
    })

    describe('patientFullName', () => {
      const smallerPatientName = 'aaron'
      const biggerPatientName = 'zacchaeus'

      it('should return negative number when first patient has a smaller fullname', () => {
        const patient1 = createPatient('fakePatient1Id', [], undefined, {
          fullName: smallerPatientName,
          firstName: '',
          lastName: ''
        })
        const patient2 = createPatient('fakePatient2Id', [], undefined, {
          fullName: biggerPatientName,
          firstName: '',
          lastName: ''
        })

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.patientFullName)

        expect(res).toBeLessThan(0)
      })

      it('should return positive number when second patient has a smaller fullname', () => {
        const patient1 = createPatient('fakePatient1Id', [], undefined, { fullName: biggerPatientName })
        const patient2 = createPatient('fakePatient2Id', [], undefined, { fullName: smallerPatientName })

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.patientFullName)

        expect(res).toBeGreaterThan(0)
      })

      it('should return 0 when patients have same fullname', () => {
        const patient1 = createPatient('fakePatient1Id', [], undefined, { fullName: smallerPatientName })
        const patient2 = createPatient('fakePatient2Id', [], undefined, { fullName: smallerPatientName })

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.patientFullName)

        expect(res).toBe(0)
      })
    })

    describe('flag', () => {
      it('should return negative number when first patient is flagged', () => {
        const patient1 = createPatient('fakePatient1Id', [], undefined, undefined, undefined, { flagged: true })
        const patient2 = createPatient('fakePatient2Id')

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.flag)

        expect(res).toBeLessThan(0)
      })

      it('should return positive number when second patient is flagged', () => {
        const patient1 = createPatient('fakePatient1Id')
        const patient2 = createPatient('fakePatient2Id', [], undefined, undefined, undefined, { flagged: true })

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.flag)

        expect(res).toBeGreaterThan(0)
      })

      it('should return 0 when patients are flagged', () => {
        const patient1 = createPatient('fakePatient1Id', [], undefined, undefined, undefined, { flagged: true })
        const patient2 = createPatient('fakePatient2Id', [], undefined, undefined, undefined, { flagged: true })

        const { result } = renderHook(() => useComparePatients())
        const res = result.current.comparePatients(patient1, patient2, PatientTableSortFields.flag)

        expect(res).toBe(0)
      })
    })
  })
})
