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

import UserApi from '../../../../lib/auth/user.api'
import HttpService, { ErrorMessageStatus } from '../../../../lib/http/http.service'
import { type AxiosResponse } from 'axios'
import { type UserAccount } from '../../../../lib/auth/models/user-account.model'
import { type Settings } from '../../../../lib/auth/models/settings.model'
import { type Preferences } from '../../../../lib/auth/models/preferences.model'
import { type UserMetadata } from '../../../../lib/auth/models/user-metadata.model'
import { type CompleteSignupPayload } from '../../../../lib/auth/models/complete-signup-payload.model'
import { UserRole } from '../../../../lib/auth/models/enums/user-role.enum'
import { CountryCodes } from '../../../../lib/auth/models/country.model'
import { HcpProfession } from '../../../../lib/auth/models/enums/hcp-profession.enum'
import { type ChangeUserRoleToHcpPayload } from '../../../../lib/auth/models/change-user-role-to-hcp-payload.model'

describe('User API', () => {
  const userId = 'userId'
  const account: UserAccount = {
    firstName: 'Bernard',
    lastName: 'Tichaut',
    fullName: 'Bernard Tichaut',
    email: 'narbe@email.com'
  }
  const settings = { country: CountryCodes.France } as Settings
  const preferences = { displayLanguageCode: 'en' } as Preferences

  describe('getUserMetadata', () => {
    it('should get the user metadata (profile, preferences, settings at once)', async () => {
      const data: UserMetadata = { profile: account, settings, preferences }
      jest.spyOn(HttpService, 'get').mockResolvedValueOnce({ data } as AxiosResponse)
      const response = await UserApi.getUserMetadata(userId)
      expect(response).toEqual(data)
      expect(HttpService.get).toHaveBeenCalledWith({ url: `/metadata/${userId}` })
    })

    it('should return undefined if user is not found', async () => {
      jest.spyOn(HttpService, 'get').mockRejectedValueOnce(Error(ErrorMessageStatus.NotFound))
      const response = await UserApi.getUserMetadata(userId)
      expect(response).toBeUndefined()
    })

    it('should throw an error if http call failed', async () => {
      jest.spyOn(HttpService, 'get').mockRejectedValueOnce(Error('This error was thrown by a mock on purpose'))
      await expect(async () => {
        await UserApi.getUserMetadata(userId)
      }).rejects.toThrow('This error was thrown by a mock on purpose')
    })
  })

  describe('updateProfile', () => {
    it('should return the updated profile on success', async () => {
      jest.spyOn(HttpService, 'put').mockResolvedValue({ data: account } as AxiosResponse)
      const updatedProfile = await UserApi.updateUserAccount(userId, account)
      expect(updatedProfile).toEqual(account)
      expect(HttpService.put).toHaveBeenCalledWith({
        url: `/metadata/${userId}/profile`,
        payload: account
      })
    })
  })

  describe('updatePreferences', () => {
    it('should return the updated preferences on success', async () => {
      jest.spyOn(HttpService, 'put').mockResolvedValue({ data: preferences } as AxiosResponse)
      const updatedPreferences = await UserApi.updatePreferences(userId, preferences)
      expect(updatedPreferences).toEqual(preferences)

      expect(HttpService.put).toHaveBeenCalledWith({
        url: `/metadata/${userId}/preferences`,
        payload: preferences
      })
    })
  })

  describe('updateSettings', () => {
    it('should return the updated settings on success', async () => {
      jest.spyOn(HttpService, 'put').mockResolvedValue({ data: settings } as AxiosResponse)
      const updatedSettings = await UserApi.updateSettings(userId, settings)
      expect(updatedSettings).toEqual(settings)
      expect(HttpService.put).toHaveBeenCalledWith({
        url: `/metadata/${userId}/settings`,
        payload: settings
      })
    })
  })

  describe('completeUserSignup', () => {
    it('should return the complete signup payload on success', async () => {
      const payload: CompleteSignupPayload = {
        profile: account,
        settings,
        preferences,
        email: 'test@email.com',
        role: UserRole.Hcp
      }
      jest.spyOn(HttpService, 'post').mockResolvedValue({ data: payload } as AxiosResponse)
      const completedSignup = await UserApi.completeUserSignup(userId, payload)
      expect(completedSignup).toEqual(payload)
      expect(HttpService.post).toHaveBeenCalledWith({
        url: `/bff/v1/accounts/${userId}`,
        payload
      })
    })
  })

  describe('changeUserRoleToHcp', () => {
    it('should return the change user role payload on success', async () => {
      const now = new Date().toISOString()
      const payload: ChangeUserRoleToHcpPayload = {
        termsOfUse: { acceptanceTimestamp: now, isAccepted: true },
        privacyPolicy: { acceptanceTimestamp: now, isAccepted: true },
        contactConsent: { acceptanceTimestamp: now, isAccepted: true },
        hcpProfession: HcpProfession.diabeto
      }
      jest.spyOn(HttpService, 'post').mockResolvedValue({ data: payload } as AxiosResponse)
      await UserApi.changeUserRoleToHcp(userId, payload)
      expect(HttpService.post).toHaveBeenCalledWith({
        url: `/bff/v1/accounts/${userId}`,
        payload: { ...payload, role: UserRole.Hcp }
      })
    })
  })
})
