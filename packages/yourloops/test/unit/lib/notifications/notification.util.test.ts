/*
 * Copyright (c) 2021-2022, Diabeloop
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

import { notificationConversion } from '../../../../lib/notifications/notification.util'
import { type INotification } from '../../../../lib/notifications/models/i-notification.model'
import { INotificationType } from '../../../../lib/notifications/models/enums/i-notification-type.enum'
import { TeamMemberRole } from '../../../../lib/team/models/enums/team-member-role.enum'
import { type Notification } from '../../../../lib/notifications/models/notification.model'
import { NotificationType } from '../../../../lib/notifications/models/enums/notification-type.enum'

describe('Notification utils', () => {
  describe('notificationConversion', () => {
    const email = 'user2@diabeloop.com'
    const baseAPINotification: INotification = {
      key: 'abcd',
      type: INotificationType.careTeamInvitation,
      created: new Date().toISOString(),
      email,
      creator: {
        userid: 'abcdef',
        profile: { email, fullName: 'The user Two' }
      },
      creatorId: 'abcdef',
      shortKey: '0123456',
      role: TeamMemberRole.member,
      target: {
        id: 'team-id',
        name: 'The team'
      }
    }
    const expectedNotification: Notification = {
      id: 'abcd',
      metricsType: 'join_team',
      type: NotificationType.careTeamProInvitation,
      creator: {
        userid: 'abcdef',
        profile: { email, fullName: 'The user Two' }
      },
      creatorId: 'abcdef',
      date: baseAPINotification.created,
      email,
      role: TeamMemberRole.member,
      target: {
        id: 'team-id',
        name: 'The team'
      }
    }
    it('should throw if the notification type is invalid', () => {
      const apiNotification = {
        type: 'toto'
      } as unknown as INotification

      let error: Error | null = null
      try {
        notificationConversion(apiNotification)
      } catch (reason) {
        error = reason as Error
      }
      expect(error).not.toBeNull()
      expect(error.message).toBe('Invalid notification type')
    })

    it("should transform 'careteam_invitation' to 'directInvitation'", () => {
      baseAPINotification.type = INotificationType.careTeamInvitation
      expectedNotification.type = NotificationType.directInvitation
      expectedNotification.metricsType = 'share_data'
      const actualNotification = notificationConversion(baseAPINotification)
      expect(actualNotification).toEqual(expectedNotification)
    })

    it("should transform 'medicalteam_patient_invitation' to 'careTeamPatientInvitation'", () => {
      baseAPINotification.type = INotificationType.medicalTeamPatientInvitation
      expectedNotification.type = NotificationType.careTeamPatientInvitation
      expectedNotification.metricsType = 'join_team'
      const actualNotification = notificationConversion(baseAPINotification)
      expect(actualNotification).toEqual(expectedNotification)
    })

    it("should transform 'medicalteam_invitation' to 'careTeamProInvitation'", () => {
      baseAPINotification.type = INotificationType.medicalTeamProInvitation
      expectedNotification.type = NotificationType.careTeamProInvitation
      expectedNotification.metricsType = 'join_team'
      const actualNotification = notificationConversion(baseAPINotification)
      expect(actualNotification).toEqual(expectedNotification)
    })

    it("should transform 'medicalteam_monitoring_invitation' to 'careTeamProInvitation'", () => {
      baseAPINotification.type = INotificationType.medicalTeamMonitoringInvitation
      expectedNotification.type = NotificationType.careTeamMonitoringInvitation
      expectedNotification.metricsType = 'join_team'
      const actualNotification = notificationConversion(baseAPINotification)
      expect(actualNotification).toEqual(expectedNotification)
    })
  })
})
