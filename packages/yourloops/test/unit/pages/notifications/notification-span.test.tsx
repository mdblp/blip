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

import React from 'react'
import { NotificationSpan, type NotificationSpanProps } from '../../../../pages/notifications/notification'
import { render, screen } from '@testing-library/react'
import { type Notification } from '../../../../lib/notifications/models/notification.model'
import { type Profile } from '../../../../lib/auth/models/profile.model'
import { NotificationType } from '../../../../lib/notifications/models/enums/notification-type.enum'

describe('NotificationSpan', () => {
  const careTeamMonitoringNotification: Notification = {
    id: 'fakeId',
    metricsType: 'share_data',
    date: '2021-02-18T10:00:00',
    creator: {
      userid: '1',
      profile: {
        fullName: 'Yvan Tendu'
      } as Profile
    },
    creatorId: 'fakeCreatorId',
    email: 'fake@email.com',
    type: NotificationType.careTeamMonitoringInvitation
  }

  const getNotificationSpan = (notificationSpanProps: NotificationSpanProps): JSX.Element => (
    <NotificationSpan {...notificationSpanProps} />
  )

  it('should display the correct label when given a care team monitoring invite', () => {
    render(getNotificationSpan({ notification: careTeamMonitoringNotification, id: 'fakeId1' }))
    expect(screen.getByText(/invite-join-monitoring-team/)).toBeInTheDocument()
  })
})