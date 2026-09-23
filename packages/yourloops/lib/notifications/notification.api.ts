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
import { InAppNotification } from './models/notification.model'
import { INotificationType } from './models/enums/i-notification-type.enum'
import { Centrifuge } from 'centrifuge'
import appConfig from '../config/config'
import { type IUser } from '../data/models/i-user.model'


const log = bows('Notification API')

export default class NotificationApi {

  static connectToRealTimeServer(userId: string, getToken: () => Promise<string>, onNotification: (notification: InAppNotification) => void): () => void {
    const wsUrl = appConfig.API_HOST.replace(/^http/, 'ws') + '/connection/websocket'
    const centrifuge = new Centrifuge(wsUrl, {
      getToken: async () => await getToken()
    })

    const sub = centrifuge.newSubscription(`notification:#auth0|${userId}`)
    sub.on('publication', (ctx) => {
      const notif = ctx.data as InAppNotification
      onNotification(notif)
    })

    sub.subscribe()
    centrifuge.connect()

    // Return a cleanup/disconnect function
    return () => {
      sub.unsubscribe()
      centrifuge.disconnect()
    }
  }

  static async acceptInvitation(userId: string, notification: InAppNotification): Promise<void> {
    notification.status = "accepted"
    await NotificationApi.processInvitationUpdate(userId, notification)
  }

  static async declineInvitation(userId: string, notification: InAppNotification): Promise<void> {
    notification.status = "rejected"
    await NotificationApi.processInvitationUpdate(userId, notification)
  }

  static async getReceivedInvitations(userId: string): Promise<InAppNotification[]> {
    return await NotificationApi.getPendingNotifications(`/v2/notifications?status=pending&userId=${userId}`)
  }

  static async getSentInvitations(userId: string): Promise<InAppNotification[]> {
    return await NotificationApi.getPendingNotifications(`/v2/notifications?status=pending&senderId=${userId}`)
  }

  private static async processInvitationUpdate(userId: string, notification: InAppNotification): Promise<void> {
    if (notification.type === INotificationType.directInvitation) {
      await NotificationApi.updateDirectShareInvitation(userId, notification)
      return
    }
    await NotificationApi.updateTeamInvitation(userId, notification)
  }

  private static async updateDirectShareInvitation(userId: string, notification: InAppNotification): Promise<void> {
    const patientId = (notification.payload["creator"] as IUser).userid
    await HttpService.put<string, { patientId: string, viewerId: string, viewerEmail: string, invitationStatus: string, lastStatusChangedAt: string }>({
      url: `/crew/v1/direct-shares`,
      payload: {
        patientId,
        viewerId: userId,
        viewerEmail: notification.userEmail,
        invitationStatus: notification.status,
        lastStatusChangedAt: new Date().toISOString()
      }
    })
  }

  private static async updateTeamInvitation(userId: string, notification: InAppNotification): Promise<void> {
    const teamId = notification.payload["careTeamId"] as string
    let url: string
    switch (notification.type) {
      case INotificationType.careTeamProInvitation:
        url = `/crew/v1/teams/${teamId}/members`
        break
      case INotificationType.careTeamPatientInvitation:
        url = `/crew/v1/teams/${teamId}/patients`
        break
      default:
        log.info('Unknown notification', notification)
        throw Error('Unknown notification')
    }
    await HttpService.put<string, { userId: string, email: string, teamId: string, invitationStatus: string, lastStatusChangedAt: string }>({
      url,
      payload: {
        userId,
        email: notification.userEmail,
        teamId,
        invitationStatus: notification.status,
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
