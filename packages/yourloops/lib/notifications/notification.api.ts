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
import { notificationConversion } from './notification.util'
import { type Notification } from './models/notification.model'
import { NotificationType } from './models/enums/notification-type.enum'
import { type CancelInvitationPayload } from './models/cancel-invitation-payload.model'
import { type INotification } from './models/i-notification.model'

const log = bows('Notification API')

export default class NotificationApi {
  static async acceptInvitation(userId: string, notification: Notification): Promise<void> {
    let url: string
    switch (notification.type) {
      case NotificationType.directInvitation:
        url = `/confirm/accept/invite/${userId}/${notification.creatorId}`
        break
      case NotificationType.careTeamProInvitation:
      case NotificationType.careTeamPatientInvitation:
        url = '/confirm/accept/team/invite'
        break
      default:
        log.info('Unknown notification', notification)
        throw Error('Unknown notification')
    }
    await NotificationApi.updateInvitation(url, notification.id)
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

  static async declineInvitation(userId: string, notification: Notification): Promise<void> {
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
      default:
        log.info('Unknown notification', notification)
        throw Error('Unknown notification')
    }
    await NotificationApi.updateInvitation(url, notification.id)
  }

  static async getReceivedInvitations(userId: string): Promise<Notification[]> {
    return await NotificationApi.getInvitations(`/confirm/invitations/${userId}`)
  }

  static async getSentInvitations(userId: string): Promise<Notification[]> {
    return await NotificationApi.getInvitations(`/confirm/invite/${userId}`)
  }

  private static async updateInvitation(url: string, key: string): Promise<void> {
    await HttpService.put<string, { key: string }>({ url, payload: { key } })
  }

  private static async getInvitations(url: string): Promise<Notification[]> {
    try {
      const { data } = await HttpService.get<INotification[]>({ url })
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

  private static convertNotifications(notificationsFromApi: INotification[]): Notification[] {
    const convertedNotifications: Notification[] = []
    notificationsFromApi.forEach((notificationFromApi) => {
      const notification = notificationConversion(notificationFromApi)
      if (notification) {
        convertedNotifications.push(notification)
      }
    })
    return convertedNotifications
  }
}
