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

import { mapITeamMemberToPatient } from '../../../../../components/patient/utils'
import { type Patient } from '../../../../../lib/patient/models/patient.model'
import { UserInvitationStatus } from '../../../../../lib/team/models/enums/user-invitation-status.enum'
import { TeamMemberRole } from '../../../../../lib/team/models/enums/team-member-role.enum'
import { type ITeamMember } from '../../../../../lib/team/models/i-team-member.model'
import { type Profile } from '../../../../../lib/auth/models/profile.model'

describe('Patient utils', () => {
  describe('mapTeamUserToPatient', () => {
    it('should map correctly', () => {
      const email = 'fake@email.com'
      const profile: Profile = {
        email,
        fullName: 'fake full name',
        firstName: 'fake full',
        lastName: 'name'
      }
      const teamMember: ITeamMember = {
        idVerified: false,
        invitationStatus: UserInvitationStatus.pending,
        role: TeamMemberRole.patient,
        teamId: 'fakeTeamId',
        userId: 'fakeTeamMember',
        email,
        profile,
        monitoringAlerts: {
          timeSpentAwayFromTargetRate: 10,
          timeSpentAwayFromTargetActive: true,
          frequencyOfSevereHypoglycemiaRate: 10,
          frequencyOfSevereHypoglycemiaActive: true,
          nonDataTransmissionRate: 10,
          nonDataTransmissionActive: true
        },
        unreadMessages: 5
      }
      teamMember.unreadMessages = 4
      const patient: Patient = {
        monitoringAlerts: teamMember.monitoringAlerts,
        metadata: {
          flagged: undefined,
          medicalData: null,
          hasSentUnreadMessages: teamMember.unreadMessages > 0
        },
        monitoring: undefined,
        profile: {
          birthdate: undefined,
          firstName: profile.firstName,
          fullName: profile.fullName,
          lastName: profile.lastName,
          email: teamMember.email,
          referringDoctor: undefined,
          sex: ''
        },
        settings: {
          a1c: undefined,
          system: 'DBLG1'
        },
        teams: [{
          teamId: teamMember.teamId,
          status: teamMember.invitationStatus,
          monitoringStatus: teamMember.monitoring?.status
        }],
        userid: teamMember.userId
      }
      const res = mapITeamMemberToPatient(teamMember)
      patient.monitoring = res.monitoring
      expect(res).toStrictEqual(patient)
    })
  })
})
