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

import React from 'react'
import { act } from 'react-dom/test-utils'
import { BrowserRouter } from 'react-router-dom'
import * as authHookMock from '../../../../lib/auth/auth.hook'
import * as auth0Mock from '@auth0/auth0-react'
import { NotificationContextProvider, useNotification } from '../../../../lib/notifications/notification.hook'
import { loggedInUsers } from '../../common'
import NotificationApi from '../../../../lib/notifications/notification.api'
import { render, waitFor } from '@testing-library/react'
import { type NotificationContext } from '../../../../lib/notifications/models/notification-context.model'
import { type InAppNotification } from '../../../../lib/notifications/models/notification.model'
import { INotificationType } from '../../../../lib/notifications/models/enums/i-notification-type.enum'

jest.mock('../../../../lib/auth/auth.hook')
jest.mock('@auth0/auth0-react')

describe('Notification hook', () => {
  let notifications: NotificationContext | null = null
  const hcp = loggedInUsers.getHcp()

  jest.spyOn(NotificationApi, 'getReceivedInvitations').mockResolvedValue([])
  jest.spyOn(NotificationApi, 'getSentInvitations').mockResolvedValue([])
  jest.spyOn(NotificationApi, 'declineInvitation').mockResolvedValue()
  jest.spyOn(NotificationApi, 'acceptInvitation').mockResolvedValue()
  jest.spyOn(NotificationApi, 'connectToRealTimeServer').mockReturnValue(jest.fn())

  const buildNotification = (): InAppNotification => ({
    id: 'fakeId',
    type: INotificationType.careTeamProInvitation,
    userEmail: hcp.username,
    payload: { careTeamId: 'fakeTeamId' },
    status: 'pending',
    deliveredAt: new Date().toISOString()
  })

  const initNotificationContext = async () => {
    const DummyComponent = (): JSX.Element => {
      notifications = useNotification()
      return (<div />)
    }
    await act(async () => {
      render(
        <BrowserRouter>
          <NotificationContextProvider>
            <DummyComponent />
          </NotificationContextProvider>
        </BrowserRouter>
      )
    })
    await waitFor(() => { expect(notifications.initialized).toBeTruthy() })
    expect(NotificationApi.getReceivedInvitations).toHaveBeenCalledTimes(1)
    expect(NotificationApi.getSentInvitations).toHaveBeenCalledTimes(1)
  }

  beforeAll(() => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { id: hcp.id } }
    });
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      getAccessTokenSilently: jest.fn().mockResolvedValue('fake-token')
    })
  })

  describe('Update', () => {
    it('should re-fetch invites from the api', async () => {
      await initNotificationContext()
      expect(NotificationApi.getReceivedInvitations).toHaveBeenCalledTimes(1)
      expect(NotificationApi.getSentInvitations).toHaveBeenCalledTimes(1)
      act(() => {
        notifications.update()
      })
      await waitFor(() => { expect(NotificationApi.getReceivedInvitations).toHaveBeenCalledTimes(2) })
      expect(NotificationApi.getSentInvitations).toHaveBeenCalledTimes(2)
    })
  })

  describe('Accept', () => {
    it('should call the api to accept the invite and remove it from the received invitations', async () => {
      const notification = buildNotification()
      jest.spyOn(NotificationApi, 'getReceivedInvitations').mockResolvedValueOnce([notification])

      await initNotificationContext()
      expect(notifications.receivedInvitations).toEqual([notification])

      await act(async () => {
        await notifications.accept(notification)
      })

      expect(NotificationApi.acceptInvitation).toHaveBeenCalledWith(hcp.id, notification)
      expect(NotificationApi.getReceivedInvitations).toHaveBeenCalledTimes(1)
      expect(NotificationApi.getSentInvitations).toHaveBeenCalledTimes(1)
      expect(notifications.receivedInvitations).toEqual([])
    })
  })

  describe('Decline', () => {
    it('should call the api to decline the invite and remove it from the received invitations', async () => {
      const notification = buildNotification()
      jest.spyOn(NotificationApi, 'getReceivedInvitations').mockResolvedValueOnce([notification])

      await initNotificationContext()
      expect(notifications.receivedInvitations).toEqual([notification])

      await act(async () => {
        await notifications.decline(notification)
      })

      expect(NotificationApi.declineInvitation).toHaveBeenCalledWith(hcp.id, notification)
      expect(NotificationApi.getReceivedInvitations).toHaveBeenCalledTimes(1)
      expect(NotificationApi.getSentInvitations).toHaveBeenCalledTimes(1)
      expect(notifications.receivedInvitations).toEqual([])
    })
  })
})
