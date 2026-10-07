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

import { type InAppNotification } from './models/notification.model'
import { Centrifuge } from 'centrifuge'
import appConfig from '../config/config'

export default class RealTimeNotificationManager {
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
}
