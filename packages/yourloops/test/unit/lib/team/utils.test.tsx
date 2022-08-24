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
import TeamUtils from '../../../../lib/team/utils'

describe('Team utils', () => {
  describe('computeFlaggedPatients', () => {
    it('should return patients with the correct flagged attribute', () => {
      const patientFlaggedId = 'flaggedPatient'
      const patients: Patient[] = [createPatient(patientFlaggedId, []), createPatient('fakePatient1', []), createPatient('fakePatient2', [])]
      const flaggedPatientIds = [patientFlaggedId]
      const patientsUpdated = TeamUtils.computeFlaggedPatients(patients, flaggedPatientIds)
      patientsUpdated.forEach(patient => {
        expect(patient.metadata.flagged).toBe(flaggedPatientIds.includes(patient.userid))
      })
    })
  })

  describe('isInAtLeastATeam', () => {
    it('should return false when team user does not have an accepted status in any team', () => {
      const members = [
        createPatientTeam('team1Id', UserInvitationStatus.pending),
        createPatientTeam('team2Id', UserInvitationStatus.pending)
      ]
      const teamUser = createPatient('id1', members)
      const res = TeamUtils.isInAtLeastATeam(teamUser)
      expect(res).toBe(false)
    })

    it('should return true when team user does has an accepted status in a team', () => {
      const members = [
        createPatientTeam('team1Id', UserInvitationStatus.pending),
        createPatientTeam('team2Id', UserInvitationStatus.accepted)
      ]
      const teamUser = createPatient('id1', members)

      const res = TeamUtils.isInAtLeastATeam(teamUser)
      expect(res).toBe(true)
    })
  })
})
