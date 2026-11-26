/*
 * Copyright (c) 2021-2026, Diabeloop
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

import { isNotificationForRole } from '../../../../lib/notifications/notification.util'
import { INotificationType } from '../../../../lib/notifications/models/enums/i-notification-type.enum'
import { type InAppNotification } from '../../../../lib/notifications/models/notification.model'
import { UserRole } from '../../../../lib/auth/models/enums/user-role.enum'

describe('isNotificationForRole', () => {
  const notificationOfType = (type: INotificationType): InAppNotification => ({ type } as InAppNotification)

  it.each([
    [UserRole.Patient, INotificationType.CareTeamPatientInvitation, true],
    [UserRole.Patient, INotificationType.CareTeamProInvitation, false],
    [UserRole.Patient, INotificationType.DirectInvitation, false],
    [UserRole.Caregiver, INotificationType.DirectInvitation, true],
    [UserRole.Caregiver, INotificationType.CareTeamProInvitation, false],
    [UserRole.Hcp, INotificationType.CareTeamProInvitation, true],
    [UserRole.Hcp, INotificationType.DirectInvitation, true],
    [UserRole.Hcp, INotificationType.CareTeamPatientInvitation, false],
    [UserRole.Unset, INotificationType.DirectInvitation, false]
  ])('role %s with type %s should give %s', (role, type, expected) => {
    expect(isNotificationForRole(notificationOfType(type), role)).toBe(expected)
  })
})
