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

import { type InAppNotification } from './models/notification.model'
import { INotificationType } from './models/enums/i-notification-type.enum'
import { UserRole } from '../auth/models/enums/user-role.enum'

/** Same mapping as the notification service: the notification types a user can receive for each role */
const NOTIFICATION_TYPES_BY_ROLE: Partial<Record<UserRole, INotificationType[]>> = {
  [UserRole.Patient]: [INotificationType.CareTeamPatientInvitation],
  [UserRole.Caregiver]: [INotificationType.DirectInvitation],
  [UserRole.Hcp]: [
    INotificationType.CareTeamProInvitation,
    INotificationType.DirectInvitation,
    INotificationType.CareTeamDoAdmin,
    INotificationType.CareTeamRemoveMember
  ]
}

export function isNotificationForRole(notification: InAppNotification, role: UserRole): boolean {
  return NOTIFICATION_TYPES_BY_ROLE[role]?.includes(notification.type) ?? false
}
