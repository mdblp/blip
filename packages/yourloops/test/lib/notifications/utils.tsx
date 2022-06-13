/**
 * Copyright (c) 2022, Diabeloop
 * API Notification tests
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

import { Session } from "../../../lib/auth";
import { INotification, NotificationContext } from "../../../lib/notifications/models";

export interface NotificationAPIStub {
  getReceivedInvitations: jest.Mock<Promise<INotification[]>, [Readonly<Session>]>;
  getSentInvitations: jest.Mock<Promise<INotification[]>, [Readonly<Session>]>;
  acceptInvitation: jest.Mock<Promise<void>, [Readonly<Session>, INotification]>;
  declineInvitation: jest.Mock<Promise<void>, [Readonly<Session>, INotification]>;
  cancelInvitation: jest.Mock<Promise<void>, [Readonly<Session>, INotification]>;
}

export const notificationAPIStub: NotificationAPIStub = {
  getReceivedInvitations: jest.fn<Promise<INotification[]>, [Readonly<Session>]>().mockResolvedValue([]),
  getSentInvitations: jest.fn<Promise<INotification[]>, [Readonly<Session>]>().mockResolvedValue([]),
  acceptInvitation: jest.fn<Promise<void>, [Readonly<Session>, INotification]>().mockResolvedValue(),
  declineInvitation: jest.fn<Promise<void>, [Readonly<Session>, INotification]>().mockResolvedValue(),
  cancelInvitation: jest.fn<Promise<void>, [Readonly<Session>, INotification]>().mockResolvedValue(),
};


const stubNotificationContextValueInternal = {
  accept: jest.fn().mockReturnValue(() => Promise.resolve()),
  cancel: jest.fn().mockReturnValue(() => Promise.resolve()),
  decline: jest.fn().mockReturnValue(() => Promise.resolve()),
  update: jest.fn(),
  initialized: true,
  receivedInvitations: [] as INotification[],
  sentInvitations: [] as INotification[],
};

export const stubNotificationContextValue = stubNotificationContextValueInternal as NotificationContext;
