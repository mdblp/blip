/**
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

import { UserInvitationStatus } from '../../../../models/generic'
import { createPatient, createPatientTeam } from '../../common/utils'
import { Patient } from '../../../../lib/data/patient'
import PatientUtils from '../../../../lib/patient/utils'
import { Monitoring, MonitoringStatus } from '../../../../models/monitoring'
import { UNITS_TYPE } from '../../../../lib/units/utils'

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

  describe('isInAtLeastATeam', () => {
    it('should return false when team user does not have an accepted status in any team', () => {
      const teams = [
        createPatientTeam('team1Id', UserInvitationStatus.pending),
        createPatientTeam('team2Id', UserInvitationStatus.pending)
      ]
      const teamUser = createPatient('id1', teams)
      const res = PatientUtils.isInAtLeastATeam(teamUser)
      expect(res).toBe(false)
    })

    it('should return true when team user does has an accepted status in a team', () => {
      const teams = [
        createPatientTeam('team1Id', UserInvitationStatus.pending),
        createPatientTeam('team2Id', UserInvitationStatus.accepted)
      ]
      const teamUser = createPatient('id1', teams)

      const res = PatientUtils.isInAtLeastATeam(teamUser)
      expect(res).toBe(true)
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
    it('should return correct patient list', () => {
      const monitoring: Monitoring = {
        enabled: true,
        status: MonitoringStatus.pending,
        monitoringEnd: new Date(),
        parameters: {
          bgUnit: UNITS_TYPE.MGDL,
          lowBg: 1,
          highBg: 2,
          outOfRangeThreshold: 3,
          veryLowBg: 4,
          hypoThreshold: 5,
          nonDataTxThreshold: 6,
          reportingPeriod: 7
        }
      }
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
  })
})
