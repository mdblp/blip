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
import { CancelInvitationPayload, INotification, NotificationType } from './models'
import bows from 'bows'
import HttpService, { ErrorMessageStatus } from '../../services/http.service'
import { INotificationAPI } from '../../models/notification-api.model'
import { notificationConversion } from './utils'

const log = bows('Notification API')

export default class NotificationApi {
  static async acceptInvitation(userId: string, notification: INotification): Promise<void> {
    let url: string
    switch (notification.type) {
      case NotificationType.directInvitation:
        url = `/confirm/accept/invite/${userId}/${notification.creatorId}`
        break
      case NotificationType.careTeamProInvitation:
      case NotificationType.careTeamPatientInvitation:
        url = '/confirm/accept/team/invite'
        break
      case NotificationType.careTeamMonitoringInvitation:
        url = `/confirm/accept/team/monitoring/${notification.target?.id}/${userId}`
        break
      default:
        log.info('Unknown notification', notification)
        throw Error('Unknown notification')
    }
    return await NotificationApi.updateInvitation(url, notification.id)
  }

  static async cancelInvitation(notificationId: string, teamId?: string, inviteeEmail?: string): Promise<void> {
    const payload: CancelInvitationPayload = {
      email: inviteeEmail,
      key: notificationId,
      target: { id: teamId }
    }

    await HttpService.post<string, CancelInvitationPayload>({
      url: '/confirm/cancel/invite',
      payload
    })
  }

  static async declineInvitation(userId: string, notification: INotification): Promise<void> {
    let url: string
    switch (notification.type) {
      case NotificationType.directInvitation:
        url = `/confirm/dismiss/invite/${userId}/${notification.creatorId}`
        break
      case NotificationType.careTeamProInvitation:
      case NotificationType.careTeamPatientInvitation: {
        if (!notification.target) {
          throw Error('Invalid target team id')
        }
        url = `/confirm/dismiss/team/invite/${notification.target?.id}`
        break
      }
      case NotificationType.careTeamMonitoringInvitation:
        if (!notification.target) {
          throw Error('Cannot decline notification as team id is not specified')
        }
        return await NotificationApi.cancelRemoteMonitoringInvite(notification.target?.id, userId)
      default:
        log.info('Unknown notification', notification)
        throw Error('Unknown notification')
    }
    return await NotificationApi.updateInvitation(url, notification.id)
  }

  static async cancelRemoteMonitoringInvite(teamId: string, userId: string): Promise<void> {
    await HttpService.put({ url: `/confirm/dismiss/team/monitoring/${teamId}/${userId}` })
  }

  static async getReceivedInvitations(userId: string): Promise<INotification[]> {
    return await NotificationApi.getInvitations(`/confirm/invitations/${userId}`)
  }

  static async getSentInvitations(userId: string): Promise<INotification[]> {
    return await NotificationApi.getInvitations(`/confirm/invite/${userId}`)
  }

  static async inviteToRemoteMonitoring(teamId: string, userId: string, monitoringEnd: Date, referringDoctor?: string): Promise<void> {
    await HttpService.post<void, { monitoringEnd: string, referringDoctor?: string }>({
      url: `/confirm/send/team/monitoring/${teamId}/${userId}`,
      payload: { monitoringEnd: monitoringEnd.toJSON(), referringDoctor }
    })
  }

  private static async updateInvitation(url: string, key: string): Promise<void> {
    await HttpService.put<string, { key: string }>({ url, payload: { key } })
  }

  private static async getInvitations(url: string): Promise<INotification[]> {
    try {
      const { data } = await HttpService.get<INotificationAPI[]>({ url })
      return NotificationApi.convertNotifications(data)
    } catch (err) {
      const error = err as Error
      if (error.message === ErrorMessageStatus.NotFound) {
        log.info('No new notification for the current user')
        return []
      }
      throw err
    }
  }

  private static convertNotifications(notificationsFromApi: INotificationAPI[]): INotification[] {
    const convertedNotifications: INotification[] = []
    notificationsFromApi.forEach((notificationFromApi) => {
      const notification = notificationConversion(notificationFromApi)
      if (notification) {
        convertedNotifications.push(notification)
      }
    })
    return convertedNotifications
  }
}
