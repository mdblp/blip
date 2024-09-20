/*
 * Copyright (c) 2022-2024, Diabeloop
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
import { UserInviteStatus } from '../../../../../lib/team/models/enums/user-invite-status.enum'
import { TeamMemberRole } from '../../../../../lib/team/models/enums/team-member-role.enum'
import { type ITeamMember } from '../../../../../lib/team/models/i-team-member.model'
import { type Profile } from '../../../../../lib/auth/models/profile.model'
import { Gender } from '../../../../../lib/auth/models/enums/gender.enum'

describe('Patient utils', () => {
  describe('mapITeamMemberToPatient', () => {
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
        invitationStatus: UserInviteStatus.Pending,
        role: TeamMemberRole.patient,
        teamId: 'fakeTeamId',
        userId: 'fakeTeamMember',
        email,
        profile,
        alarms: {
          timeSpentAwayFromTargetRate: 10,
          timeSpentAwayFromTargetActive: true,
          frequencyOfSevereHypoglycemiaRate: 10,
          frequencyOfSevereHypoglycemiaActive: true,
          nonDataTransmissionRate: 10,
          nonDataTransmissionActive: true
        },
        glycemiaIndicators: {
          timeInRange: 3,
          hypoglycemia: 20,
          coefficientOfVariation: 1,
          glucoseManagementIndicator: 0
        },
        unreadMessages: 5,
        medicalData: { range: { startDate: '', endDate: '' } },
        settings: { system: 'DBLG1' }
      }
      teamMember.unreadMessages = 4
      const patient: Patient = {
        monitoringAlerts: teamMember.alarms,
        glycemiaIndicators: teamMember.glycemiaIndicators,
        flagged: undefined,
        medicalData: teamMember.medicalData,
        hasSentUnreadMessages: teamMember.unreadMessages > 0,
        profile: {
          birthdate: undefined,
          firstName: profile.firstName,
          fullName: profile.fullName,
          lastName: profile.lastName,
          email: teamMember.email,
          sex: Gender.NotDefined
        },
        settings: {
          a1c: undefined,
          system: 'DBLG1'
        },
        invitationStatus: teamMember.invitationStatus,
        userid: teamMember.userId
      }
      const res = mapITeamMemberToPatient(teamMember)
      expect(res).toStrictEqual(patient)
    })
  })
})
