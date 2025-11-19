/*
 * Copyright (c) 2022-2025, Diabeloop
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

import UserApi from '../../../lib/auth/user.api'
import { type UserAccount } from '../../../lib/auth/models/user-account.model'
import { type Preferences } from '../../../lib/auth/models/preferences.model'
import { type Settings } from '../../../lib/auth/models/settings.model'

interface MockUserDataFetchParams {
  firstName?: string
  lastName?: string
  account?: UserAccount
  preferences?: Preferences
  settings?: Settings
}

export const mockUserApi = () => {
  const updateProfileMock = jest.spyOn(UserApi, 'updateUserAccount').mockResolvedValue(undefined)
  const updatePreferencesMock = jest.spyOn(UserApi, 'updatePreferences').mockResolvedValue(undefined)
  const updateSettingsMock = jest.spyOn(UserApi, 'updateSettings').mockResolvedValue(undefined)
  const updateAuth0UserMetadataMock = jest.spyOn(UserApi, 'completeUserSignup').mockResolvedValue(undefined)

  const mockUserDataFetch = ({ firstName, lastName, account, settings, preferences }: MockUserDataFetchParams) => {
    jest.spyOn(UserApi, 'getUserMetadata').mockResolvedValue({
      profile: {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email: 'fake@email.com',
        termsOfUse: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
        privacyPolicy: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
        trainingAck: { acceptanceTimestamp: '2022-10-11', isAccepted: true },
        ...account
      } as UserAccount,
      settings: settings ?? {},
      preferences: preferences ?? {}
    })
  }

  return {
    updateAuth0UserMetadataMock,
    updateProfileMock,
    updatePreferencesMock,
    updateSettingsMock,
    mockUserDataFetch
  }
}
