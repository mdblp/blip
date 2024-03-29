/*
 * Copyright (c) 2021-2023, Diabeloop
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
import { NotificationContextProvider, useNotification } from '../../../../lib/notifications/notification.hook'
import { loggedInUsers } from '../../common'
import NotificationApi from '../../../../lib/notifications/notification.api'
import { render, waitFor } from '@testing-library/react'
import { type NotificationContext } from '../../../../lib/notifications/models/notification-context.model'
import { type Notification } from '../../../../lib/notifications/models/notification.model'
import { NotificationType } from '../../../../lib/notifications/models/enums/notification-type.enum'

jest.mock('../../../../lib/auth/auth.hook')
describe('Notification hook', () => {
  let notifications: NotificationContext | null = null

  jest.spyOn(NotificationApi, 'getReceivedInvitations').mockResolvedValue([])
  jest.spyOn(NotificationApi, 'getSentInvitations').mockResolvedValue([])
  jest.spyOn(NotificationApi, 'cancelInvitation').mockResolvedValue()
  jest.spyOn(NotificationApi, 'declineInvitation').mockResolvedValue()
  jest.spyOn(NotificationApi, 'acceptInvitation').mockResolvedValue()

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
      return { user: {} }
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
    it('should call the api to accept the invite and refresh', async () => {
      await initNotificationContext()
      const currentUser = loggedInUsers.getHcp()
      const caregiver = loggedInUsers.getCaregiver()
      const notification: Notification = {
        id: 'fakeId',
        metricsType: 'join_team',
        type: NotificationType.careTeamProInvitation,
        creator: { userid: caregiver.id, profile: caregiver.profile },
        creatorId: caregiver.id,
        date: new Date().toISOString(),
        email: currentUser.username,
        target: {
          id: 'fakeTargetId',
          name: 'A team'
        }
      }
      await act(async () => {
        await notifications.accept(notification)
      })
      expect(NotificationApi.acceptInvitation).toHaveBeenCalledTimes(1)
      expect(NotificationApi.getReceivedInvitations).toHaveBeenCalledTimes(1)
      expect(NotificationApi.getSentInvitations).toHaveBeenCalledTimes(1)
    })
  })

  describe('Decline', () => {
    it('should call the api to decline the invite and refresh', async () => {
      await initNotificationContext()
      const currentUser = loggedInUsers.getHcp()
      const caregiver = loggedInUsers.getCaregiver()
      const notification: Notification = {
        id: 'fakeId',
        metricsType: 'join_team',
        type: NotificationType.careTeamProInvitation,
        creator: { userid: caregiver.id, profile: caregiver.profile },
        creatorId: caregiver.id,
        date: new Date().toISOString(),
        email: currentUser.username,
        target: {
          id: 'fakeTargetId',
          name: 'A team'
        }
      }
      await act(async () => {
        await notifications.decline(notification)
      })
      expect(NotificationApi.declineInvitation).toHaveBeenCalledTimes(1)
      expect(NotificationApi.getReceivedInvitations).toHaveBeenCalledTimes(2)
      expect(NotificationApi.getSentInvitations).toHaveBeenCalledTimes(1)
    })
  })

  describe('Cancel', () => {
    it('should call the api to decline the invite and refresh', async () => {
      await initNotificationContext()
      const currentUser = loggedInUsers.getHcp()
      const caregiver = loggedInUsers.getCaregiver()
      const notification: Notification = {
        id: 'fakeId',
        metricsType: 'join_team',
        type: NotificationType.careTeamProInvitation,
        creator: { userid: caregiver.id, profile: caregiver.profile },
        creatorId: caregiver.id,
        date: new Date().toISOString(),
        email: currentUser.username,
        target: {
          id: 'fakeTargetId',
          name: 'A team'
        }
      }
      await act(async () => {
        await notifications.cancel(notification.id)
      })
      expect(NotificationApi.cancelInvitation).toHaveBeenCalledTimes(1)
      expect(NotificationApi.getReceivedInvitations).toHaveBeenCalledTimes(1)
      expect(NotificationApi.getSentInvitations).toHaveBeenCalledTimes(2)
    })
  })
})
