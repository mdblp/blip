/*
 * Copyright (c) 2022-2023, Diabeloop
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
import bows from 'bows'
import HttpService, { ErrorMessageStatus } from '../http/http.service'
import { type InAppNotification } from './models/notification.model'
import { INotificationType } from './models/enums/i-notification-type.enum'
import { type IUser } from '../data/models/i-user.model'
import { InAppNotificationStatus } from './models/enums/notification-type.enum'
import { UserInviteStatus } from '../team/models/enums/user-invite-status.enum'


const log = bows('Notification API')

export default class NotificationApi {

  static async acceptInvitation(userId: string, notification: InAppNotification): Promise<void> {
    await NotificationApi.processInvitationUpdate(userId, notification, UserInviteStatus.Accepted)
  }

  static async declineInvitation(userId: string, notification: InAppNotification): Promise<void> {
    await NotificationApi.processInvitationUpdate(userId, notification, UserInviteStatus.Rejected)
  }

  static async getReceivedInvitations(userId: string): Promise<InAppNotification[]> {
    return await NotificationApi.getPendingNotifications(`/v2/notifications?status=${InAppNotificationStatus.Pending}&userId=${userId}`)
  }

  private static async processInvitationUpdate(userId: string, notification: InAppNotification, status: UserInviteStatus): Promise<void> {
    if (notification.type === INotificationType.DirectInvitation) {
      await NotificationApi.updateDirectShareInvitation(userId, notification, status)
      return
    }
    await NotificationApi.updateTeamInvitation(userId, notification, status)
  }

  private static async updateDirectShareInvitation(userId: string, notification: InAppNotification, status: UserInviteStatus): Promise<void> {
    const creator = notification.payload["creator"] as IUser | undefined
    if (!creator?.userid) {
      throw new Error('Invalid direct-share invitation: missing creator')
    }
    const patientId = creator.userid
    await HttpService.put<string, { patientId: string, viewerId: string, viewerEmail: string, invitationStatus: UserInviteStatus, lastStatusChangedAt: string }>({
      url: '/crew/v1/direct-shares',
      payload: {
        patientId,
        viewerId: userId,
        viewerEmail: notification.userEmail,
        invitationStatus: status,
        lastStatusChangedAt: new Date().toISOString()
      }
    })
  }

  private static async updateTeamInvitation(userId: string, notification: InAppNotification, status: UserInviteStatus): Promise<void> {
    const teamId = notification.payload["careTeamId"] as string | undefined
    if (!teamId) {
      throw Error('Invalid target team id')
    }
    let url: string
    switch (notification.type) {
      case INotificationType.CareTeamProInvitation:
        url = `/crew/v1/teams/${teamId}/members`
        break
      case INotificationType.CareTeamPatientInvitation:
        url = `/crew/v1/teams/${teamId}/patients`
        break
      default:
        log.info('Unknown notification', notification)
        throw Error('Unknown notification')
    }
    await HttpService.put<string, { userId: string, email: string, teamId: string, invitationStatus: UserInviteStatus, lastStatusChangedAt: string }>({
      url,
      payload: {
        userId,
        email: notification.userEmail,
        teamId,
        invitationStatus: status,
        lastStatusChangedAt: new Date().toISOString()
      }
    })
  }

  private static async getPendingNotifications(url: string): Promise<InAppNotification[]> {
    try {
      const { data } = await HttpService.get<InAppNotification[]>({ url })
      return data
    } catch (err) {
      const error = err as Error
      if (error.message === ErrorMessageStatus.NotFound) {
        log.info('No new notification for the current user')
        return []
      }
      throw err
    }
  }

}
