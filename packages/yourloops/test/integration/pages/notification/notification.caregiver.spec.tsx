/*
 * Copyright (c) 2023-2025, Diabeloop
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

import { renderPage } from '../../utils/render'
import { waitFor } from '@testing-library/react'
import { mockAuth0Hook } from '../../mock/auth0.hook.mock'
import { UserRole } from '../../../../lib/auth/models/enums/user-role.enum'
import NotificationApi from '../../../../lib/notifications/notification.api'
import { mockUserApi } from '../../mock/user.api.mock'
import DirectShareApi from '../../../../lib/share/direct-share.api'
import { UserInviteStatus } from '../../../../lib/team/models/enums/user-invite-status.enum'
import { type ShareUser } from '../../../../lib/share/models/share-user.model'
import { type IUser } from '../../../../lib/data/models/i-user.model'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import { mockTeamAPI } from '../../mock/team.api.mock'
import { mockPatientApiForCaregivers } from '../../mock/patient.api.mock'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'
import { invitationDirectShare } from '../../data/notification.data'
import { testNotificationManagementForCaregiver } from '../../use-cases/notification-management'
import { mockDblCommunicationApi } from '../../mock/dbl-communication.api'

describe('Notification page for caregiver', () => {
  const firstName = 'Jeanned'
  const lastName = 'Arc'
  const directSharePatient: ShareUser = {
    user: {
      userid: 'caregiverId',
      profile: { firstName: 'caregiverFirstName', lastName: 'caregiverLastName' }
    } as IUser,
    status: UserInviteStatus.Accepted,
    invitation: invitationDirectShare
  }

  beforeAll(() => {
    mockUserApi().mockUserDataFetch({ firstName, lastName })
    mockAuth0Hook(UserRole.Caregiver)
    mockTeamAPI()
    mockPatientApiForCaregivers()
    mockNotificationAPI()
    mockDirectShareApi()
    mockDblCommunicationApi()
    jest.spyOn(NotificationApi, 'getReceivedInvitations').mockResolvedValue([invitationDirectShare])
    jest.spyOn(DirectShareApi, 'getDirectShares').mockResolvedValue([directSharePatient])
    jest.spyOn(NotificationApi, 'acceptInvitation').mockResolvedValue()
  })

  it('should be able to accept a direct share invite', async () => {
    const router = renderPage('/notifications')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/notifications')
    })

    await testNotificationManagementForCaregiver()
  })
})
