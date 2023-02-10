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

import { type Notification } from './models/notification.model'
import { NotificationType } from './models/enums/notification-type.enum'
import { INotificationType } from './models/enums/i-notification-type.enum'
import { type INotification } from './models/i-notification.model'

/**
 * Convert an API notification to our model
 * @param apin API Notification
 */
export function notificationConversion(apin: INotification): Notification | null {
  let type: NotificationType
  let metricsType: 'share_data' | 'join_team' = 'join_team'
  switch (apin.type) {
    case INotificationType.careTeamInvitation:
      type = NotificationType.directInvitation
      metricsType = 'share_data'
      break
    case INotificationType.medicalTeamPatientInvitation:
      type = NotificationType.careTeamPatientInvitation
      break
    case INotificationType.medicalTeamProInvitation:
      type = NotificationType.careTeamProInvitation
      break
    case INotificationType.medicalTeamMonitoringInvitation:
      type = NotificationType.careTeamMonitoringInvitation
      break
    case INotificationType.medicalTeamDoAdmin:
    case INotificationType.medicalTeamRemoveMember:
      return null
    default:
      throw new Error('Invalid notification type')
  }
  return {
    id: apin.key,
    creatorId: apin.creatorId,
    date: apin.created,
    email: apin.email,
    type,
    metricsType,
    creator: apin.creator,
    role: apin.role,
    target: apin.target
  }
}
