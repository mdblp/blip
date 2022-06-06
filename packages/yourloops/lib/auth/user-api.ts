/**
 * Copyright (c) 2022, Diabeloop
 * User management - API calls
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

import { Preferences, Profile, Settings } from "../../models/shoreline";
import HttpService, { StatusErrorMessage } from "../../services/http";
import { HttpHeaderKeys } from "../../models/api";

export default class UserApi {
  static async getShorelineAccessToken(email: string): Promise<string> {
    try {
      const { headers } = await HttpService.post({ url: `auth/hack/user/${email}` });
      return headers[HttpHeaderKeys.sessionToken];
    } catch (err) {
      console.log("This profile doesn't exists");
      return "no-token";
    }
  }

  static async getProfile(userId: string): Promise<Profile | undefined> {
    try {
      const { data } = await HttpService.get<Profile>({ url: `/metadata/${userId}/profile` });
      return data;
    } catch (err) {
      if (err === StatusErrorMessage.NotFound) {
        console.log(`No profile for ${userId}`);
        return undefined;
      }
      throw Error(err as string);
    }
  }

  static async getPreferences(userId: string): Promise<Preferences | undefined> {
    try {
      const { data } = await HttpService.get<Preferences>({ url: `/metadata/${userId}/preferences` });
      return data;
    } catch (err) {
      if (err === StatusErrorMessage.NotFound) {
        console.log(`No preferences for ${userId}`);
        return undefined;
      }
      throw Error(err as string);
    }
  }

  static async getSettings(userId: string): Promise<Settings | undefined> {
    try {
      const { data } = await HttpService.get<Settings>({ url: `/metadata/${userId}/settings` });
      return data;
    } catch (err) {
      if (err === StatusErrorMessage.NotFound) {
        console.log(`No settings for ${userId}`);
        return undefined;
      }
      throw Error(err as string);
    }
  }

  static async updateProfile(userId: string, profile: Profile): Promise<Profile> {
    const { data } = await HttpService.put<Profile, Profile>({
      url: `/metadata/${userId}/profile`,
      payload: profile,
    });
    return data;
  }

  static async updatePreferences(userId: string, preferences: Preferences): Promise<Preferences> {
    const { data } = await HttpService.put<Preferences, Preferences>({
      url: `/metadata/${userId}/preferences`,
      payload: preferences,
    });
    return data;
  }

  static async updateSettings(userId: string, settings: Settings): Promise<Settings> {
    const { data } = await HttpService.put<Settings, Settings>({
      url: `/metadata/${userId}/settings`,
      payload: settings,
    });
    return data;
  }
}
