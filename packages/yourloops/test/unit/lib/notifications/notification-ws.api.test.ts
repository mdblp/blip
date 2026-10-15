/*
 * Copyright (c) 2026, Diabeloop
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
import { type InAppNotification } from '../../../../lib/notifications/models/notification.model'
import { INotificationType } from '../../../../lib/notifications/models/enums/i-notification-type.enum'
import { Centrifuge } from 'centrifuge'
import appConfig from '../../../../lib/config/config'
import RealTimeNotificationManager from '../../../../lib/notifications/notification-ws.api'
import { InAppNotificationStatus } from '../../../../lib/notifications/models/enums/notification-type.enum'

jest.mock('centrifuge')


describe('RealTimeNotificationManager', ()=> {
  const userId = 'fakeUserId'
  const teamId = 'fakeTeamId'

  const buildNotification = (type: INotificationType, payload: Record<string, unknown> = { careTeamId: teamId }): InAppNotification => ({
    id: 'fakeNotificationId',
    type,
    userEmail: 'fake@email.com',
    payload,
    status: InAppNotificationStatus.Pending,
    deliveredAt: new Date().toISOString()
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

      const disconnect = RealTimeNotificationManager.connectToRealTimeServer(userId, getToken, onNotification)

      const expectedWsUrl = `${appConfig.API_HOST.replace(/^http/, 'ws')}/connection/websocket`
      expect(MockedCentrifuge).toHaveBeenCalledWith(expectedWsUrl, expect.objectContaining({ getToken: expect.any(Function) }))
      expect(newSubscriptionMock).toHaveBeenCalledWith(`notification:#auth0|${userId}`)
      expect(onMock).toHaveBeenCalledWith('publication', expect.any(Function))
      expect(subscribeMock).toHaveBeenCalledTimes(1)
      expect(connectMock).toHaveBeenCalledTimes(1)

      const notification = buildNotification(INotificationType.CareTeamProInvitation)
      const publicationHandler = onMock.mock.calls[0][1] as (ctx: { data: InAppNotification }) => void
      publicationHandler({ data: notification })
      expect(onNotification).toHaveBeenCalledWith(notification)

      disconnect()
      expect(unsubscribeMock).toHaveBeenCalledTimes(1)
      expect(disconnectMock).toHaveBeenCalledTimes(1)
    })
  })
})
