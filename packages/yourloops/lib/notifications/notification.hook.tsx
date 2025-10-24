/*
 * Copyright (c) 2021-2025, Diabeloop
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

import React, { useCallback, useEffect } from 'react'
import bows from 'bows'
import { useAuth } from '../auth'
import NotificationApi from './notification.api'
import { type NotificationContext } from './models/notification-context.model'
import { type Notification } from './models/notification.model'
import { type NotificationProvider } from './models/notification-provider.model'

const ReactNotificationContext = React.createContext<NotificationContext>({} as NotificationContext)
const log = bows('NotificationHook')

/** hackish way to prevent 2 or more consecutive loading */
let lock = false

function NotificationContextImpl(): NotificationContext {
  const { user } = useAuth()
  const [receivedInvitations, setReceivedInvitations] = React.useState<Notification[]>([])
  const [sentInvitations, setSentInvitations] = React.useState<Notification[]>([])
  const [initialized, setInitialized] = React.useState(false)

  if (!user) {
    throw new Error('User must be logged-in to use the Notification hook')
  }

  const update = (): void => {
    setInitialized(false)
  }

  const accept = async (notification: Notification): Promise<void> => {
    log.info('Accept invite', notification)
    await NotificationApi.acceptInvitation(user.id, notification)
  }

  const decline = async (notification: Notification): Promise<void> => {
    log.info('Decline invite', notification)
    await NotificationApi.declineInvitation(user.id, notification)
    const r = await NotificationApi.getReceivedInvitations(user.id)
    setReceivedInvitations(r)
  }

  const cancel = async (notificationId: string, teamId?: string, inviteeEmail?: string): Promise<void> => {
    await NotificationApi.cancelInvitation(notificationId, teamId, inviteeEmail)
    const invitations = await NotificationApi.getSentInvitations(user.id)
    setSentInvitations(invitations)
  }

  const refreshSentInvitations = useCallback(async (): Promise<void> => {
    try {
      const invitations = await NotificationApi.getSentInvitations(user.id)
      setSentInvitations(invitations)
    } catch (err) {
      log.error(err)
    }
  }, [user.id])

  const refreshReceivedInvitations = useCallback(async (): Promise<void> => {
    try {
      const invitations = await NotificationApi.getReceivedInvitations(user.id)
      setReceivedInvitations(invitations)
    } catch (err) {
      log.error(err)
    }
  }, [user.id])

  const initHook = (): void => {
    if (initialized || lock) {
      return
    }

    log.info('init')
    lock = true

    Promise.all([
      refreshReceivedInvitations(),
      refreshSentInvitations()
    ])
      .finally(() => {
        setInitialized(true)
        lock = false
      })
  }

  useEffect(initHook, [user, initialized, refreshReceivedInvitations, refreshSentInvitations])

  return {
    initialized,
    receivedInvitations,
    sentInvitations,
    update,
    accept,
    decline,
    cancel,
    refreshReceivedInvitations
  }
}

// Hook for child components to get the object
// and re-render when it changes.
export function useNotification(): NotificationContext {
  return React.useContext(ReactNotificationContext)
}

/**
 *
 */
export function NotificationContextProvider(props: NotificationProvider): JSX.Element {
  const { children, value } = props
  const notifValue = value ?? NotificationContextImpl() // eslint-disable-line new-cap
  return (
    <ReactNotificationContext.Provider value={notifValue}>
      {children}
    </ReactNotificationContext.Provider>
  )
}
