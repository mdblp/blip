/*
 * Copyright (c) 2022-2023, Diabeloop
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

import HttpService, { ErrorMessageStatus } from '../http/http.service'
import bows from 'bows'
import { type UserMetadata } from './models/user-metadata.model'
import { type Profile } from './models/profile.model'
import { type Preferences } from './models/preferences.model'
import { type Settings } from './models/settings.model'
import { type CompleteSignupPayload } from './models/complete-signup-payload.model'
import { UserRole } from './models/enums/user-role.enum'
import { type ChangeUserRoleToHcpPayload } from './models/change-user-role-to-hcp-payload.model'

const log = bows('User API')

export default class UserApi {
  static async changeUserRoleToHcp(userId: string, payload: ChangeUserRoleToHcpPayload): Promise<void> {
    await HttpService.post({
      url: `/bff/v1/accounts/${userId}`,
      payload: { ...payload, role: UserRole.Hcp }
    })
  }

  static async completeUserSignup(userId: string, payload: CompleteSignupPayload): Promise<CompleteSignupPayload> {
    const { data } = await HttpService.post<CompleteSignupPayload, CompleteSignupPayload>({
      url: `/bff/v1/accounts/${userId}`,
      payload
    })
    return data
  }

  static async getUserMetadata(userId: string): Promise<UserMetadata | undefined> {
    try {
      // TODO: change to /bff/v1/patients/${userId} for having diabeticProfile (return when not set)
      const { data } = await HttpService.get<UserMetadata>({ url: `/metadata/${userId}` })
      return data
    } catch (err) {
      const error = err as Error
      if (error.message === ErrorMessageStatus.NotFound) {
        log.info(`No profile for ${userId}`)
        return undefined
      }
      throw err
    }
  }

  static async updateProfile(userId: string, profile: Profile): Promise<Profile> {
    const { data } = await HttpService.put<Profile, Profile>({
      url: `/metadata/${userId}/profile`,
      payload: profile
    })
    return data
  }

  static async updatePreferences(userId: string, preferences: Preferences): Promise<Preferences> {
    const { data } = await HttpService.put<Preferences, Preferences>({
      url: `/metadata/${userId}/preferences`,
      payload: preferences
    })
    return data
  }

  static async updateSettings(userId: string, settings: Settings): Promise<Settings> {
    const { data } = await HttpService.put<Settings, Settings>({
      url: `/metadata/${userId}/settings`,
      payload: settings
    })
    return data
  }
}
