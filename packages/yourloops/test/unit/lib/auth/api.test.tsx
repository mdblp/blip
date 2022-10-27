/**
 * Copyright (c) 2021, Diabeloop
 * Auth API tests
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

import { Preferences, Profile, Settings, UserMetadata } from '../../../../models/user'
import UserApi from '../../../../lib/auth/user-api'
import HttpService, { ErrorMessageStatus } from '../../../../services/http'
import { AxiosResponse, AxiosResponseHeaders } from 'axios'
import { HttpHeaderKeys } from '../../../../models/api'

describe('Auth API', () => {
  const userId = 'userId'
  const profile = { firstName: 'Bernard', lastName: 'Tichaut' } as Profile
  const settings = { country: 'france' } as Settings
  const preferences = { displayLanguageCode: 'en' } as Preferences

  describe('getShorelineAccessToken', () => {
    it('should get an access token from shoreline service', async () => {
      const token = 'session-token'
      const data = { token, userid: userId }
      const headers = { [HttpHeaderKeys.sessionToken]: token } as AxiosResponseHeaders
      const expectedResponse = { token, id: data.userid }
      jest.spyOn(HttpService, 'get').mockResolvedValueOnce({
        data,
        headers
      } as AxiosResponse)

      const response = await UserApi.getShorelineAccessToken()

      expect(response).toEqual(expectedResponse)
      expect(HttpService.get).toHaveBeenCalledWith({ url: 'auth/login' })
    })

    it('should throw an error if profile does not exist', async () => {
      jest.spyOn(HttpService, 'get').mockRejectedValue('error')
      await expect(async () => {
        await UserApi.getShorelineAccessToken()
      }).rejects.toThrowError('unknown user')
    })
  })

  describe('getUserMetadata', () => {
    it('should get the user metadata (profile, preferences, settings at once)', async () => {
      const data: UserMetadata = { profile, settings, preferences }
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
      }).rejects.toThrowError('This error was thrown by a mock on purpose')
    })
  })

  describe('updateProfile', () => {
    it('should return the updated profile on success', async () => {
      const profile: Profile = {
        fullName: 'Test Example',
        firstName: 'Text',
        lastName: 'Example'
      }
      jest.spyOn(HttpService, 'put').mockResolvedValue({ data: profile } as AxiosResponse)
      const userId = 'fakeUserId'

      const updatedProfile = await UserApi.updateProfile(userId, profile)
      expect(updatedProfile).toEqual(profile)
      expect(HttpService.put).toHaveBeenCalledWith({
        url: `/metadata/${userId}/profile`,
        payload: profile
      })
    })
  })

  describe('updatePreferences', () => {
    it('should return the updated preferences on success', async () => {
      const preferences: Preferences = {
        displayLanguageCode: 'de'
      }
      const userId = 'fakeUserId'
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
      const settings: Settings = {
        country: 'FR'
      }
      const userId = 'fakeUserId'
      jest.spyOn(HttpService, 'put').mockResolvedValue({ data: settings } as AxiosResponse)

      const updatedSettings = await UserApi.updateSettings(userId, settings)

      expect(updatedSettings).toEqual(settings)

      expect(HttpService.put).toHaveBeenCalledWith({
        url: `/metadata/${userId}/settings`,
        payload: settings
      })
    })
  })
})
