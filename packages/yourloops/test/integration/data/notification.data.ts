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
import { type Notification } from '../../../lib/notifications/models/notification.model'
import { NotificationType } from '../../../lib/notifications/models/enums/notification-type.enum'
import { TeamMemberRole } from '../../../lib/team/models/enums/team-member-role.enum'

export const invitationTeam: Notification = {
  id: 'invitationTeamId',
  type: NotificationType.careTeamPatientInvitation,
  metricsType: 'join_team',
  email: 'ylp.ui.test.67-patient12@diabeloop.fr',
  creatorId: 'dec0816009d32',
  date: '',
  target: { id: '63c7b7989cacc878ecce2c40', name: 'sysReq-67-team2' },
  role: TeamMemberRole.patient,
  creator: {
    userid: 'dec0816009d32',
    profile: {
      fullName: 'Backloops test SysReq 67 hcp1',
      patient: {
        birthday: '',
        diagnosisDate: ''
      },
      email: ''
    }
  }
}
export const invitationDirectShare: Notification = {
  id: 'invitationTeamId',
  type: NotificationType.directInvitation,
  metricsType: 'share_data',
  email: 'ylp.ui.test-caregiver1@diabeloop.fr',
  creatorId: 'patient1',
  date: '',
  creator: {
    userid: 'patient1',
    profile: {
      fullName: 'Backloops test Patient1',
      patient: {
        birthday: '',
        diagnosisDate: ''
      },
      email: ''
    }
  }
}
