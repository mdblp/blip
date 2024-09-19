/*
 * Copyright (c) 2021-2024, Diabeloop
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

import { type MonitoringAlerts } from '../../lib/patient/models/monitoring-alerts.model'
import { type Patient } from '../../lib/patient/models/patient.model'
import { type ITeamMember } from '../../lib/team/models/i-team-member.model'
import { Gender } from '../../lib/auth/models/enums/gender.enum'

export const mapITeamMemberToPatient = (iTeamMember: ITeamMember): Patient => {
  const birthdate = iTeamMember.profile?.patient?.birthday
  return {
    monitoringAlerts: iTeamMember.alarms ?? {} as MonitoringAlerts,
    glycemiaIndicators: iTeamMember.glycemiaIndicators,
    profile: {
      birthdate,
      sex: iTeamMember.profile?.patient?.sex ? iTeamMember.profile?.patient?.sex : Gender.NotDefined,
      firstName: iTeamMember.profile?.firstName,
      fullName: iTeamMember.profile?.fullName ?? iTeamMember.email,
      lastName: iTeamMember.profile?.lastName,
      email: iTeamMember.email
    },
    settings: {
      a1c: iTeamMember.settings?.a1c,
      system: iTeamMember.settings?.system
    },
    flagged: undefined,
    medicalData: iTeamMember.medicalData,
    hasSentUnreadMessages: iTeamMember.unreadMessages > 0,
    invitationStatus: iTeamMember.invitationStatus,
    userid: iTeamMember.userId
  }
}
