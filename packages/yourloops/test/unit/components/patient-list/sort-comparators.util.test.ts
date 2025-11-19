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

import { type Patient } from '../../../../lib/patient/models/patient.model'
import { UserInviteStatus } from '../../../../lib/team/models/enums/user-invite-status.enum'
import {
  sortByDateOfBirth,
  sortByFlag,
  sortByLastDataUpdate,
  sortByMonitoringAlertsCount,
  sortByUserName
} from '../../../../components/patient-list/utils/sort-comparators.util'
import moment from 'moment-timezone'

describe('useSortComparatorsHook', () => {
  describe('sortByUserName', () => {
    const smallerPatientName = 'aaron'
    const biggerPatientName = 'zacchaeus'

    it('should return negative number when first patient has a smaller fullname', () => {
      const patient1 = { profile: { fullName: smallerPatientName } } as Patient
      const patient2 = { profile: { fullName: biggerPatientName } } as Patient

      const res = sortByUserName(patient1, patient2)

      expect(res).toBeLessThan(0)
    })

    it('should return positive number when second patient has a bigger fullname', () => {
      const patient1 = { profile: { fullName: biggerPatientName } } as Patient
      const patient2 = { profile: { fullName: smallerPatientName } } as Patient

      const res = sortByUserName(patient1, patient2)

      expect(res).toBeGreaterThan(0)
    })

    it('should return 0 when patients have same fullname', () => {
      const patient1 = { profile: { fullName: biggerPatientName } } as Patient
      const patient2 = { profile: { fullName: biggerPatientName } } as Patient

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
        flagged: false,
        hasSentUnreadMessages: undefined,
        invitationStatus: UserInviteStatus.Accepted,
        userid: ''
      }

      const patientB = {
        id: 'idB',
        profile: { fullName: 'B Patient', email: undefined, sex: undefined },
        monitoringAlerts: undefined,
        settings: undefined,
        flagged: true,
        hasSentUnreadMessages: undefined,
        invitationStatus: UserInviteStatus.Accepted,
        userid: ''
      }

      const patientC = {
        id: 'idC',
        profile: { fullName: 'C Patient', email: undefined, sex: undefined },
        monitoringAlerts: undefined,
        settings: undefined,
        flagged: true,
        hasSentUnreadMessages: undefined,
        invitationStatus: UserInviteStatus.Accepted,
        userid: ''
      }

      expect(sortByFlag(patientA, patientB)).toEqual(1)
      expect(sortByFlag(patientB, patientA)).toEqual(-1)
      expect(sortByFlag(patientB, patientC)).toEqual(0)
      expect(sortByFlag(patientC, patientB)).toEqual(0)
    })
  })

  describe('sortByDateOfBirth', () => {
    it('should sort the patients by date of birth', () => {
      const patientA = {
        id: 'idA',
        profile: { fullName: 'A Patient', email: undefined, sex: undefined, birthdate: '2000-03-12T10:44:34+01:00' },
        monitoringAlerts: undefined,
        settings: undefined,
        hasSentUnreadMessages: undefined,
        invitationStatus: UserInviteStatus.Accepted,
        userid: ''
      }

      const patientB = {
        id: 'idB',
        profile: { fullName: 'B Patient', email: undefined, sex: undefined, birthdate: '1980-01-01T10:44:34+01:00' },
        monitoringAlerts: undefined,
        settings: undefined,
        hasSentUnreadMessages: undefined,
        invitationStatus: UserInviteStatus.Accepted,
        userid: ''
      }

      const patientC = {
        id: 'idC',
        profile: { fullName: 'C Patient', email: undefined, sex: undefined, birthdate: '1980-01-01T10:44:34+01:00' },
        monitoringAlerts: undefined,
        settings: undefined,
        hasSentUnreadMessages: undefined,
        invitationStatus: UserInviteStatus.Accepted,
        userid: ''
      }

      expect(sortByDateOfBirth(patientA, patientB)).toEqual(1)
      expect(sortByDateOfBirth(patientB, patientA)).toEqual(-1)
      expect(sortByDateOfBirth(patientB, patientC)).toEqual(0)
      expect(sortByDateOfBirth(patientC, patientB)).toEqual(0)
    })
  })

  describe('sortByLastDataUpdate', () => {
    it('should sort the patients by last data update', () => {
      const browserTimezone = new Intl.DateTimeFormat().resolvedOptions().timeZone
      const oldestDate = moment.tz('Sep 14, 2023 1:50 AM', browserTimezone)
      const mostRecentDate = moment.tz('Sep 20, 2023 1:50 AM', browserTimezone)

      expect(sortByLastDataUpdate(null, null)).toEqual(1)
      expect(sortByLastDataUpdate(null, oldestDate)).toEqual(-1)
      expect(sortByLastDataUpdate(oldestDate, null)).toEqual(1)
      expect(sortByLastDataUpdate(oldestDate, mostRecentDate)).toBeLessThanOrEqual(-1)
      expect(sortByLastDataUpdate(mostRecentDate, oldestDate)).toBeGreaterThanOrEqual(1)
      expect(sortByLastDataUpdate(oldestDate, oldestDate)).toEqual(0)
    })
  })

  describe('sortByMonitoringAlertsCount', () => {
    it('should sort the patients by their number of active monitoring alerts', () => {
      const patientA = {
        id: 'idA',
        profile: { fullName: 'A Patient', email: undefined, sex: undefined },
        monitoringAlerts: {
          timeSpentAwayFromTargetActive: true,
          timeSpentAwayFromTargetRate: undefined,
          frequencyOfSevereHypoglycemiaActive: true,
          frequencyOfSevereHypoglycemiaRate: undefined,
          nonDataTransmissionActive: false,
          nonDataTransmissionRate: undefined
        },
        settings: undefined,
        hasSentUnreadMessages: undefined,
        invitationStatus: UserInviteStatus.Accepted,
        userid: ''
      }

      const patientB = {
        id: 'idB',
        profile: { fullName: 'B Patient', email: undefined, sex: undefined },
        monitoringAlerts: {
          timeSpentAwayFromTargetActive: true,
          timeSpentAwayFromTargetRate: undefined,
          frequencyOfSevereHypoglycemiaActive: true,
          frequencyOfSevereHypoglycemiaRate: undefined,
          nonDataTransmissionActive: true,
          nonDataTransmissionRate: undefined
        },
        settings: undefined,
        hasSentUnreadMessages: undefined,
        invitationStatus: UserInviteStatus.Accepted,
        userid: ''
      }

      const patientC = {
        id: 'idC',
        profile: { fullName: 'C Patient', email: undefined, sex: undefined },
        monitoringAlerts: {
          timeSpentAwayFromTargetActive: true,
          timeSpentAwayFromTargetRate: undefined,
          frequencyOfSevereHypoglycemiaActive: true,
          frequencyOfSevereHypoglycemiaRate: undefined,
          nonDataTransmissionActive: true,
          nonDataTransmissionRate: undefined
        },
        settings: undefined,
        hasSentUnreadMessages: undefined,
        invitationStatus: UserInviteStatus.Accepted,
        userid: ''
      }

      const patientD = {
        id: 'idD',
        profile: { fullName: 'D Patient', email: undefined, sex: undefined },
        monitoringAlerts: {
          timeSpentAwayFromTargetActive: false,
          timeSpentAwayFromTargetRate: undefined,
          frequencyOfSevereHypoglycemiaActive: false,
          frequencyOfSevereHypoglycemiaRate: undefined,
          nonDataTransmissionActive: false,
          nonDataTransmissionRate: undefined
        },
        settings: undefined,
        hasSentUnreadMessages: undefined,
        invitationStatus: UserInviteStatus.Accepted,
        userid: ''
      }

      expect(sortByMonitoringAlertsCount(patientA, patientB)).toEqual(1)
      expect(sortByMonitoringAlertsCount(patientB, patientA)).toEqual(-1)
      expect(sortByMonitoringAlertsCount(patientB, patientC)).toEqual(0)
      expect(sortByMonitoringAlertsCount(patientC, patientB)).toEqual(0)
      expect(sortByMonitoringAlertsCount(patientA, patientD)).toEqual(-1)
      expect(sortByMonitoringAlertsCount(patientD, patientA)).toEqual(1)
    })
  })
})
