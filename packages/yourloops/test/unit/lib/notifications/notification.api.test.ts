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

import HttpService, { ErrorMessageStatus } from '../../../../lib/http/http.service'
import { type AxiosResponse } from 'axios'
import NotificationApi from '../../../../lib/notifications/notification.api'
import { type InAppNotification } from '../../../../lib/notifications/models/notification.model'
import { INotificationType } from '../../../../lib/notifications/models/enums/i-notification-type.enum'
import { Centrifuge } from 'centrifuge'
import appConfig from '../../../../lib/config/config'

jest.mock('centrifuge')

describe('Notification API', () => {
  const userId = 'fakeUserId'
  const teamId = 'fakeTeamId'
  const email = 'fake@email.com'

  const buildNotification = (type: INotificationType, payload: Record<string, unknown> = { careTeamId: teamId }): InAppNotification => ({
    id: 'fakeNotificationId',
    type,
    userEmail: email,
    payload,
    status: 'pending',
    deliveredAt: new Date().toISOString()
  })

  describe('getReceivedInvitations', () => {
    const url = `/v2/notifications?status=pending&userId=${userId}`

    it('should return the notifications returned by the API', async () => {
      const data: InAppNotification[] = [buildNotification(INotificationType.careTeamProInvitation)]
      jest.spyOn(HttpService, 'get').mockResolvedValueOnce({ data } as AxiosResponse)

      const result = await NotificationApi.getReceivedInvitations(userId)

      expect(result).toEqual(data)
      expect(HttpService.get).toHaveBeenCalledWith({ url })
    })

    it('should return an empty array when there is no pending notification', async () => {
      jest.spyOn(HttpService, 'get').mockRejectedValueOnce(new Error(ErrorMessageStatus.NotFound))

      const result = await NotificationApi.getReceivedInvitations(userId)

      expect(result).toEqual([])
      expect(HttpService.get).toHaveBeenCalledWith({ url })
    })

    it('should throw an error if the http call fails for another reason', async () => {
      jest.spyOn(HttpService, 'get').mockRejectedValueOnce(new Error('This error was thrown by a mock on purpose'))

      await expect(async () => {
        await NotificationApi.getReceivedInvitations(userId)
      }).rejects.toThrow('This error was thrown by a mock on purpose')
    })
  })

  describe('getSentInvitations', () => {
    const url = `/v2/notifications?status=pending&senderId=${userId}`

    it('should return the notifications returned by the API', async () => {
      const data: InAppNotification[] = [buildNotification(INotificationType.careTeamProInvitation)]
      jest.spyOn(HttpService, 'get').mockResolvedValueOnce({ data } as AxiosResponse)

      const result = await NotificationApi.getSentInvitations(userId)

      expect(result).toEqual(data)
      expect(HttpService.get).toHaveBeenCalledWith({ url })
    })

    it('should return an empty array when there is no pending notification', async () => {
      jest.spyOn(HttpService, 'get').mockRejectedValueOnce(new Error(ErrorMessageStatus.NotFound))

      const result = await NotificationApi.getSentInvitations(userId)

      expect(result).toEqual([])
      expect(HttpService.get).toHaveBeenCalledWith({ url })
    })

    it('should throw an error if the http call fails for another reason', async () => {
      jest.spyOn(HttpService, 'get').mockRejectedValueOnce(new Error('This error was thrown by a mock on purpose'))

      await expect(async () => {
        await NotificationApi.getSentInvitations(userId)
      }).rejects.toThrow('This error was thrown by a mock on purpose')
    })
  })

  describe('acceptInvitation', () => {
    it('should throw an error and not call the API if the notification type is unknown', async () => {
      const httpPut = jest.spyOn(HttpService, 'put')
      const notification = {
        ...buildNotification(INotificationType.directInvitation),
        type: 'unknownType' as unknown as INotificationType
      }

      await expect(async () => {
        await NotificationApi.acceptInvitation(userId, notification)
      }).rejects.toThrow('Unknown notification')
      expect(httpPut).not.toHaveBeenCalled()
    })

    describe.each([
      { type: INotificationType.directInvitation, expectedUrl: `/crew/v1/direct-shares/${userId}` },
      { type: INotificationType.careTeamProInvitation, expectedUrl: `/crew/v1/teams/${teamId}/members` },
      { type: INotificationType.careTeamPatientInvitation, expectedUrl: `/crew/v1/teams/${teamId}/patients` }
    ])('when the notification type is $type', ({ type, expectedUrl }) => {
      it('should call the API with the correct url and payload', async () => {
        const httpPut = jest.spyOn(HttpService, 'put').mockResolvedValueOnce(undefined)
        const notification = buildNotification(type)

        await NotificationApi.acceptInvitation(userId, notification)

        expect(httpPut).toHaveBeenCalledWith({
          url: expectedUrl,
          payload: {
            userId,
            email: notification.userEmail,
            teamId,
            invitationStatus: 'accepted',
            lastStatusChangedAt: expect.any(String)
          }
        })
      })

      it('should throw an error if the API call fails', async () => {
        jest.spyOn(HttpService, 'put').mockRejectedValueOnce(new Error('This error was thrown by a mock on purpose'))
        const notification = buildNotification(type)

        await expect(async () => {
          await NotificationApi.acceptInvitation(userId, notification)
        }).rejects.toThrow('This error was thrown by a mock on purpose')
      })
    })
  })

  describe('declineInvitation', () => {
    it('should throw an error and not call the API if the notification type is unknown', async () => {
      const httpPut = jest.spyOn(HttpService, 'put')
      const notification = {
        ...buildNotification(INotificationType.directInvitation),
        type: 'unknownType' as unknown as INotificationType
      }

      await expect(async () => {
        await NotificationApi.declineInvitation(userId, notification)
      }).rejects.toThrow('Unknown notification')
      expect(httpPut).not.toHaveBeenCalled()
    })

    describe.each([
      { type: INotificationType.directInvitation, expectedUrl: `/crew/direct-shares/${userId}` },
      { type: INotificationType.careTeamProInvitation, expectedUrl: `/crew/v1/teams/${teamId}/members` },
      { type: INotificationType.careTeamPatientInvitation, expectedUrl: `/crew/v1/teams/${teamId}/patients` }
    ])('when the notification type is $type', ({ type, expectedUrl }) => {
      it('should call the API with the correct url and payload', async () => {
        const httpPut = jest.spyOn(HttpService, 'put').mockResolvedValueOnce(undefined)
        const notification = buildNotification(type)

        await NotificationApi.declineInvitation(userId, notification)

        expect(httpPut).toHaveBeenCalledWith({
          url: expectedUrl,
          payload: {
            userId,
            email: notification.userEmail,
            teamId,
            invitationStatus: 'rejected',
            lastStatusChangedAt: expect.any(String)
          }
        })
      })

      it('should throw an error if the API call fails', async () => {
        jest.spyOn(HttpService, 'put').mockRejectedValueOnce(new Error('This error was thrown by a mock on purpose'))
        const notification = buildNotification(type)

        await expect(async () => {
          await NotificationApi.declineInvitation(userId, notification)
        }).rejects.toThrow('This error was thrown by a mock on purpose')
      })
    })
  })

  describe('connectToRealTimeServer', () => {
    const MockedCentrifuge = Centrifuge as jest.MockedClass<typeof Centrifuge>

    afterEach(() => {
      MockedCentrifuge.mockReset()
    })

    it('should open a subscription, connect, forward notifications and clean up on disconnect', () => {
      const onMock = jest.fn()
      const subscribeMock = jest.fn()
      const unsubscribeMock = jest.fn()
      const newSubscriptionMock = jest.fn().mockReturnValue({
        on: onMock,
        subscribe: subscribeMock,
        unsubscribe: unsubscribeMock
      })
      const connectMock = jest.fn()
      const disconnectMock = jest.fn()

      MockedCentrifuge.mockImplementation(() => ({
        newSubscription: newSubscriptionMock,
        connect: connectMock,
        disconnect: disconnectMock
      }) as unknown as Centrifuge)

      const getToken = jest.fn().mockResolvedValue('fake-token')
      const onNotification = jest.fn()

      const disconnect = NotificationApi.connectToRealTimeServer(userId, getToken, onNotification)

      const expectedWsUrl = `${appConfig.API_HOST.replace(/^http/, 'ws')}/connection/websocket`
      expect(MockedCentrifuge).toHaveBeenCalledWith(expectedWsUrl, expect.objectContaining({ getToken: expect.any(Function) }))
      expect(newSubscriptionMock).toHaveBeenCalledWith(`notification:#auth0|${userId}`)
      expect(onMock).toHaveBeenCalledWith('publication', expect.any(Function))
      expect(subscribeMock).toHaveBeenCalledTimes(1)
      expect(connectMock).toHaveBeenCalledTimes(1)

      const notification = buildNotification(INotificationType.careTeamProInvitation)
      const publicationHandler = onMock.mock.calls[0][1] as (ctx: { data: InAppNotification }) => void
      publicationHandler({ data: notification })
      expect(onNotification).toHaveBeenCalledWith(notification)

      disconnect()
      expect(unsubscribeMock).toHaveBeenCalledTimes(1)
      expect(disconnectMock).toHaveBeenCalledTimes(1)
    })
  })
})
