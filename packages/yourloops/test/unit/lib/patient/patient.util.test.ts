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

import { createPatient, createPatientTeam } from '../../common/utils'
import PatientUtils from '../../../../lib/patient/patient.util'
import { type Monitoring } from '../../../../lib/team/models/monitoring.model'
import { type Patient } from '../../../../lib/patient/models/patient.model'
import { UserInvitationStatus } from '../../../../lib/team/models/enums/user-invitation-status.enum'
import { MonitoringStatus } from '../../../../lib/team/models/enums/monitoring-status.enum'
import { Unit } from 'medical-domain'

const defaultAlarms = {
  timeSpentAwayFromTargetRate: 10,
  timeSpentAwayFromTargetActive: false,
  frequencyOfSevereHypoglycemiaRate: 20,
  frequencyOfSevereHypoglycemiaActive: false,
  nonDataTransmissionRate: 30,
  nonDataTransmissionActive: false
}

const defaultPatientFilters = {
  pendingEnabled: false,
  manualFlagEnabled: false,
  telemonitoredEnabled: false,
  timeOutOfTargetEnabled: false,
  hypoglycemiaEnabled: false,
  dataNotTransferredEnabled: false,
  messagesEnabled: false
}

const acceptedPatientTeam = createPatientTeam('patientTeamAccepted', UserInvitationStatus.accepted)
const pendingPatientTeam = createPatientTeam('patientTeamPending', UserInvitationStatus.pending)

const patientWithTimeOutOfTargetAlert = createPatient('outOfTarget', [acceptedPatientTeam], undefined, undefined, undefined, undefined, {
  ...defaultAlarms,
  timeSpentAwayFromTargetActive: true
})
const patientWithHypoglycemiaAlert = createPatient('hypoglycemia', [acceptedPatientTeam], undefined, undefined, undefined, undefined, {
  ...defaultAlarms,
  frequencyOfSevereHypoglycemiaActive: true
})
const patientWithNoDataAlert = createPatient('noData', [acceptedPatientTeam], undefined, undefined, undefined, undefined, {
  ...defaultAlarms,
  nonDataTransmissionActive: true
})
const noAlersPatient = createPatient('nothing', [acceptedPatientTeam], undefined, undefined, undefined, undefined, defaultAlarms)

describe('Patient utils', () => {
  describe('computeFlaggedPatients', () => {
    it('should return patients with the correct flagged attribute', () => {
      const patientFlaggedId = 'flaggedPatient'
      const patients: Patient[] = [createPatient(patientFlaggedId, []), createPatient('fakePatient1', []), createPatient('fakePatient2', [])]
      const flaggedPatientIds = [patientFlaggedId]
      const patientsUpdated = PatientUtils.computeFlaggedPatients(patients, flaggedPatientIds)
      patientsUpdated.forEach(patient => {
        expect(patient.metadata.flagged).toBe(flaggedPatientIds.includes(patient.userid))
      })
    })
  })

  describe('getPatientRemoteMonitoringTeam', () => {
    const patientTeam1 = createPatientTeam('team1Id', UserInvitationStatus.accepted, MonitoringStatus.accepted)
    const unknownPatient = createPatient('nigma')
    const monitoredPatient1 = createPatient('memberPatientAccepted1', [patientTeam1], {} as Monitoring)
    it('should throw an error if patient is not monitored', () => {
      expect(() => PatientUtils.getRemoteMonitoringTeam(unknownPatient)).toThrowError(`Could not find a monitored team for patient ${unknownPatient.userid}`)
    })

    it('should return the patient monitored team', () => {
      const team = PatientUtils.getRemoteMonitoringTeam(monitoredPatient1)
      expect(team).toEqual(patientTeam1)
    })
  })

  describe('removeDuplicates', () => {
    const monitoring: Monitoring = {
      enabled: true,
      status: MonitoringStatus.pending,
      monitoringEnd: new Date(),
      parameters: {
        bgUnit: Unit.MilligramPerDeciliter,
        lowBg: 1,
        highBg: 2,
        outOfRangeThreshold: 3,
        veryLowBg: 4,
        hypoThreshold: 5,
        nonDataTxThreshold: 6,
        reportingPeriod: 7
      }
    }

    it('should return correct patient list', () => {
      const patientTeamAccepted = createPatientTeam('patientTeamAccepted', UserInvitationStatus.accepted)
      const patientTeamPending = createPatientTeam('patientTeamPending', UserInvitationStatus.pending)
      const patientTeamMonitoringAccepted = createPatientTeam('patientTeamMonitoringAccepted', UserInvitationStatus.accepted, MonitoringStatus.accepted)
      const firstPatient1 = createPatient('patient1', [])
      const firstPatient2 = createPatient(firstPatient1.userid, [patientTeamAccepted])
      const secondPatient1 = createPatient('patient2', [patientTeamPending])
      const secondPatient2 = createPatient(secondPatient1.userid, [patientTeamAccepted])
      const secondPatient3 = createPatient(secondPatient1.userid, [])
      const thirdPatient1 = createPatient('patient3', [patientTeamPending])
      const thirdPatient2 = createPatient(thirdPatient1.userid, [patientTeamMonitoringAccepted], monitoring)
      const patientWithNoDuplicates = createPatient('patientWithNoDuplicates', [patientTeamAccepted])
      const allPatients = [firstPatient1, firstPatient2, secondPatient1, secondPatient2, secondPatient3, thirdPatient1, thirdPatient2, patientWithNoDuplicates]

      const firstPatientExpected = createPatient(firstPatient1.userid, [patientTeamAccepted])
      firstPatientExpected.profile.birthdate = firstPatient1.profile.birthdate
      firstPatientExpected.settings.a1c = firstPatient1.settings.a1c
      const secondPatientExpected = createPatient(secondPatient1.userid, [patientTeamPending, patientTeamAccepted])
      secondPatientExpected.profile.birthdate = secondPatient1.profile.birthdate
      secondPatientExpected.settings.a1c = secondPatient1.settings.a1c
      const thirdPatientExpected = createPatient(thirdPatient1.userid, [patientTeamPending, patientTeamMonitoringAccepted], monitoring)
      thirdPatientExpected.profile.birthdate = thirdPatient1.profile.birthdate
      thirdPatientExpected.settings.a1c = thirdPatient1.settings.a1c
      const patientWithNoDuplicatesExpected = createPatient(patientWithNoDuplicates.userid, [patientTeamAccepted])
      patientWithNoDuplicatesExpected.profile.birthdate = patientWithNoDuplicates.profile.birthdate
      patientWithNoDuplicatesExpected.settings.a1c = patientWithNoDuplicates.settings.a1c
      const expected = [firstPatientExpected, secondPatientExpected, thirdPatientExpected, patientWithNoDuplicatesExpected]

      const actual = PatientUtils.removeDuplicates(allPatients)

      expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected))
    })

    it('should keep the monitoring value when a patient is monitored in a team and not in another', () => {
      const patientTeamAccepted = createPatientTeam('patientTeamAccepted', UserInvitationStatus.accepted)
      const patientTeamMonitoringAccepted = createPatientTeam('patientTeamMonitoringAccepted', UserInvitationStatus.accepted, MonitoringStatus.accepted)

      const firstPatient1 = createPatient('patient1', [patientTeamAccepted])
      const firstPatient2 = createPatient(firstPatient1.userid, [patientTeamMonitoringAccepted], monitoring)

      const allPatients = [firstPatient1, firstPatient2]

      const firstPatientExpected = createPatient(firstPatient1.userid, [patientTeamAccepted, patientTeamMonitoringAccepted], monitoring)
      firstPatientExpected.profile.birthdate = firstPatient1.profile.birthdate
      firstPatientExpected.settings.a1c = firstPatient1.settings.a1c

      const expected = [firstPatientExpected]

      const actual = PatientUtils.removeDuplicates(allPatients)

      expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected))
    })
  })

  describe('getAllPatients and getPendingPatients', () => {
    const acceptedPatientTeam = createPatientTeam('patientTeamAccepted', UserInvitationStatus.accepted)
    const pendingPatientTeam = createPatientTeam('patientTeamAPending', UserInvitationStatus.pending)

    const acceptedPatient1 = createPatient('acceptedPatient1', [acceptedPatientTeam])
    const acceptedPatient2 = createPatient('acceptedPatient2', [acceptedPatientTeam])
    const pendingPatient = createPatient('pendingPatient', [pendingPatientTeam])

    it('should return all the patients of the selected team without pending patients', () => {
      const result = PatientUtils.getNonPendingPatients([acceptedPatient1, acceptedPatient2, pendingPatient], 'patientTeamAccepted')
      expect(result).toEqual([acceptedPatient1, acceptedPatient2])
    })

    it('should return pending patients of the selected team without other accepted patients', () => {
      const result = PatientUtils.getPendingPatients([acceptedPatient1, acceptedPatient2, pendingPatient], 'patientTeamAPending')
      expect(result).toEqual([pendingPatient])
    })
  })

  describe('isInvitationPending', () => {
    const patient = createPatient('fakePatientId', [pendingPatientTeam, acceptedPatientTeam])

    it('should return true when patient has a pending invitation for the selected team', () => {
      const result = PatientUtils.isInvitationPending(patient, pendingPatientTeam.teamId)
      expect(result).toBeTruthy()
    })

    it('should return false when patient has a pending invitation for another team than the one selected', () => {
      const result = PatientUtils.isInvitationPending(patient, acceptedPatientTeam.teamId)
      expect(result).toBeFalsy()
    })

    it('should return false when patient has no pending invitation for the team selected', () => {
      const result = PatientUtils.isInvitationPending(patient, acceptedPatientTeam.teamId)
      expect(result).toBeFalsy()
    })
  })

  describe('filterPatientsOnMonitoringAlerts', () => {
    const patients = [patientWithTimeOutOfTargetAlert, patientWithHypoglycemiaAlert, patientWithNoDataAlert, noAlersPatient]

    it('should return all patient when no filter is selected', () => {
      const result = PatientUtils.filterPatientsOnMonitoringAlerts(patients, defaultPatientFilters)
      expect(result).toEqual(patients)
    })

    it('should return only patients with alerts when all alerts are selected', () => {
      const result = PatientUtils.filterPatientsOnMonitoringAlerts(patients, {
        ...defaultPatientFilters,
        dataNotTransferredEnabled: true,
        timeOutOfTargetEnabled: true,
        hypoglycemiaEnabled: true
      })
      expect(result).toEqual([patientWithTimeOutOfTargetAlert, patientWithHypoglycemiaAlert, patientWithNoDataAlert])
    })

    it('should return only patients with target and hypo alert when target and hypo are the filters selected', () => {
      const result = PatientUtils.filterPatientsOnMonitoringAlerts(patients, {
        ...defaultPatientFilters,
        timeOutOfTargetEnabled: true,
        hypoglycemiaEnabled: true
      })
      expect(result).toEqual([patientWithTimeOutOfTargetAlert, patientWithHypoglycemiaAlert])
    })

    it('should return only patients with no data and hypo alert when no data and hypo are the filters selected', () => {
      const result = PatientUtils.filterPatientsOnMonitoringAlerts(patients, {
        ...defaultPatientFilters,
        dataNotTransferredEnabled: true,
        hypoglycemiaEnabled: true
      })
      expect(result).toEqual([patientWithHypoglycemiaAlert, patientWithNoDataAlert])
    })

    it('should return only patients with target and no data alert when target and no data are the filters selected', () => {
      const result = PatientUtils.filterPatientsOnMonitoringAlerts(patients, {
        ...defaultPatientFilters,
        timeOutOfTargetEnabled: true,
        dataNotTransferredEnabled: true
      })
      expect(result).toEqual([patientWithTimeOutOfTargetAlert, patientWithNoDataAlert])
    })

    it('should return patient with target alert when target filter is selected', () => {
      const result = PatientUtils.filterPatientsOnMonitoringAlerts(patients, {
        ...defaultPatientFilters,
        timeOutOfTargetEnabled: true
      })
      expect(result).toEqual([patientWithTimeOutOfTargetAlert])
    })

    it('should return patient with hypo alert when hypo filter is selected', () => {
      const result = PatientUtils.filterPatientsOnMonitoringAlerts(patients, {
        ...defaultPatientFilters,
        hypoglycemiaEnabled: true
      })
      expect(result).toEqual([patientWithHypoglycemiaAlert])
    })

    it('should return patient with no data alert when no data filter is selected', () => {
      const result = PatientUtils.filterPatientsOnMonitoringAlerts(patients, {
        ...defaultPatientFilters,
        dataNotTransferredEnabled: true
      })
      expect(result).toEqual([patientWithNoDataAlert])
    })
  })

  describe('extractPatients', () => {
    const patientTeamPending = createPatientTeam(acceptedPatientTeam.teamId, UserInvitationStatus.pending)
    const pendingPatient = createPatient('pendingPatient', [patientTeamPending], undefined, undefined, undefined, undefined, undefined)
    const monitoredPatient = createPatient('monitoredPatient', [acceptedPatientTeam], { enabled: true }, undefined, undefined, undefined, undefined)
    const flaggedPatient = createPatient('flaggedPatient', [acceptedPatientTeam], null, undefined, undefined, undefined, undefined)
    const unreadMessagesPatient = createPatient('unreadMessagesPatient', [acceptedPatientTeam], null, undefined, undefined, { hasSentUnreadMessages: true }, undefined)
    const patients = [noAlersPatient, pendingPatient, monitoredPatient, unreadMessagesPatient, patientWithTimeOutOfTargetAlert, patientWithHypoglycemiaAlert, patientWithNoDataAlert, noAlersPatient, flaggedPatient]
    const flaggedPatientsIds = [flaggedPatient.userid]

    it('should return only patients with alerts when only alerts filters are selected', () => {
      const result = PatientUtils.extractPatients(
        patients,
        {
          ...defaultPatientFilters,
          dataNotTransferredEnabled: true,
          timeOutOfTargetEnabled: true,
          hypoglycemiaEnabled: true
        },
        flaggedPatientsIds,
        acceptedPatientTeam.teamId
      )

      expect(result).toEqual([patientWithTimeOutOfTargetAlert, patientWithHypoglycemiaAlert, patientWithNoDataAlert])
    })

    it('should return all patients except the pending one when no filters are selected', () => {
      const result = PatientUtils.extractPatients(patients, defaultPatientFilters, flaggedPatientsIds, acceptedPatientTeam.teamId)

      expect(result).toEqual([noAlersPatient, monitoredPatient, unreadMessagesPatient, patientWithTimeOutOfTargetAlert, patientWithHypoglycemiaAlert, patientWithNoDataAlert, noAlersPatient, flaggedPatient])
    })

    it('should return only monitored patient when only monitored filter is selected', () => {
      const result = PatientUtils.extractPatients(
        patients,
        {
          ...defaultPatientFilters,
          telemonitoredEnabled: true
        },
        flaggedPatientsIds,
        acceptedPatientTeam.teamId
      )

      expect(result).toEqual([monitoredPatient])
    })

    it('should return only flagged patient when only flagged filter is selected', () => {
      const result = PatientUtils.extractPatients(
        patients,
        {
          ...defaultPatientFilters,
          manualFlagEnabled: true
        },
        flaggedPatientsIds,
        acceptedPatientTeam.teamId
      )

      expect(result).toEqual([flaggedPatient])
    })

    it('should return only patient with unread messaged sent when only messages filter is selected', () => {
      const result = PatientUtils.extractPatients(
        patients,
        {
          ...defaultPatientFilters,
          messagesEnabled: true
        },
        flaggedPatientsIds,
        acceptedPatientTeam.teamId
      )

      expect(result).toEqual([unreadMessagesPatient])
    })

    it('should return only pending patient when only pending filter is selected', () => {
      const result = PatientUtils.extractPatients(
        patients,
        {
          ...defaultPatientFilters,
          pendingEnabled: true
        },
        flaggedPatientsIds,
        acceptedPatientTeam.teamId
      )

      expect(result).toEqual([pendingPatient])
    })
  })
})
