/**
 * Copyright (c) 2022, Diabeloop
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


import { Preferences, Profile, Settings } from "../../../models/user";
import { SignupForm } from "../../../lib/auth/models";
import { User } from "../../../lib/auth";
import { HcpProfession } from "../../../models/hcp-profession";

/**
 * API Stubs
 */
export interface AuthAPIStubs {
  getShorelineAccessToken: jest.Mock<Promise<string>, [string]>;
  updatePreferences: jest.Mock<Promise<Preferences>, []>;
  updateProfile: jest.Mock<Promise<Profile>, []>;
  updateSettings: jest.Mock<Promise<Settings>, []>;
}

export const createAuthAPIStubs = (user: User): AuthAPIStubs => ({
  getShorelineAccessToken: jest.fn<Promise<string>, [string]>().mockResolvedValue("token"),
  updatePreferences: jest.fn<Promise<Preferences>, []>().mockResolvedValue(user.preferences),
  updateProfile: jest.fn<Promise<Profile>, []>().mockResolvedValue(user.profile),
  updateSettings: jest.fn<Promise<Settings>, []>().mockResolvedValue(user.settings),
});

export const resetAuthAPIStubs = (apiStubs: AuthAPIStubs, user: User): void => {
  apiStubs.updatePreferences.mockReset();
  apiStubs.updatePreferences = jest.fn<Promise<Preferences>, []>().mockResolvedValue(user.preferences);
  apiStubs.updatePreferences.mockResolvedValue(user.preferences);

  apiStubs.updateProfile.mockReset();
  apiStubs.updateProfile = jest.fn<Promise<Profile>, []>().mockResolvedValue(user.profile);
  apiStubs.updateProfile.mockResolvedValue(user.profile);

  apiStubs.updateSettings.mockReset();
  apiStubs.updateSettings = jest.fn<Promise<Settings>, []>().mockResolvedValue(user.settings);
  apiStubs.updateSettings.mockResolvedValue(user.settings);
};

/**
 * Auth hook stubs definitions
 */
export interface AuthContextStubs {
  certifyProfessionalAccount: jest.Mock<Promise<void>, null>;
  fetchingUser: boolean;
  flagPatient: jest.Mock<Promise<void>, [string]>;
  getFlagPatients: jest.Mock<string[], []>;
  isLoggedIn: boolean;
  logout: jest.Mock<Promise<void>>;
  redirectToProfessionalAccountLogin: jest.Mock<void, []>;
  setFlagPatients: jest.Mock<Promise<void>, [string[]]>;
  setUser: jest.Mock<void, [User]>;
  completeSignup: jest.Mock<Promise<void>, [SignupForm]>;
  switchRoleToHCP: jest.Mock<Promise<void>, [boolean, HcpProfession]>;
  updatePassword: jest.Mock<Promise<void>, [string, string]>;
  updatePreferences: jest.Mock<Promise<void>, [Preferences]>;
  updateProfile: jest.Mock<Promise<void>, [Profile]>;
  updateSettings: jest.Mock<Promise<void>, [Settings]>;
  user: Readonly<User> | null;
}

/**
 * Hook Stubs
 */
export const createAuthHookStubs = (user?: User): AuthContextStubs => ({
  certifyProfessionalAccount: jest.fn<Promise<void>, null>().mockResolvedValue(),
  fetchingUser: false,
  flagPatient: jest.fn<Promise<void>, [string]>().mockResolvedValue(),
  getFlagPatients: jest.fn<string[], []>().mockReturnValue([]),
  isLoggedIn: true,
  logout: jest.fn<Promise<void>, [boolean | undefined]>().mockResolvedValue(),
  redirectToProfessionalAccountLogin: jest.fn<void, []>().mockReturnValue(),
  setFlagPatients: jest.fn<Promise<void>, [string[]]>().mockResolvedValue(),
  setUser: jest.fn<void, [User]>(),
  completeSignup: jest.fn<Promise<void>, [SignupForm]>().mockResolvedValue(),
  switchRoleToHCP: jest.fn<Promise<void>, [boolean, HcpProfession]>().mockResolvedValue(),
  updatePassword: jest.fn<Promise<void>, [string, string]>().mockResolvedValue(),
  updatePreferences: jest.fn<Promise<void>, [Preferences]>().mockResolvedValue(),
  updateProfile: jest.fn<Promise<void>, [Profile]>().mockResolvedValue(),
  updateSettings: jest.fn<Promise<void>, [Settings]>().mockResolvedValue(),
  user: user ?? null,
});

/**
 *mockReset() stubs history & behavior
 *
 * TODO complete me
 */
export const resetAuthHookStubs = (hookStubs: AuthContextStubs, user?: User): void => {
  hookStubs.isLoggedIn = !!user;

  hookStubs.logout.mockReset();
  hookStubs.logout = jest.fn<Promise<void>, [boolean | undefined]>().mockResolvedValue();
  hookStubs.logout.mockResolvedValue();
};


