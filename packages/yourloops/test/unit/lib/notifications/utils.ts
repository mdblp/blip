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

import { Notification } from '../../../../lib/notifications/models/notification.model'
import { NotificationContext } from '../../../../lib/notifications/models/notification-context.model'

export interface NotificationAPIStub {
  getReceivedInvitations: jest.Mock<Promise<Notification[]>, []>
  getSentInvitations: jest.Mock<Promise<Notification[]>, []>
  acceptInvitation: jest.Mock<Promise<void>, [Notification]>
  declineInvitation: jest.Mock<Promise<void>, [Notification]>
  cancelInvitation: jest.Mock<Promise<void>, [Notification]>
}

export const notificationAPIStub: NotificationAPIStub = {
  getReceivedInvitations: jest.fn<Promise<Notification[]>, []>().mockResolvedValue([]),
  getSentInvitations: jest.fn<Promise<Notification[]>, []>().mockResolvedValue([]),
  acceptInvitation: jest.fn<Promise<void>, [Notification]>().mockResolvedValue(),
  declineInvitation: jest.fn<Promise<void>, [Notification]>().mockResolvedValue(),
  cancelInvitation: jest.fn<Promise<void>, [Notification]>().mockResolvedValue()
}

const stubNotificationContextValueInternal = {
  accept: jest.fn().mockReturnValue(() => Promise.resolve()),
  cancel: jest.fn().mockReturnValue(() => Promise.resolve()),
  decline: jest.fn().mockReturnValue(() => Promise.resolve()),
  update: jest.fn(),
  initialized: true,
  receivedInvitations: [] as Notification[],
  sentInvitations: [] as Notification[]
}

export const stubNotificationContextValue = stubNotificationContextValueInternal as unknown as NotificationContext
