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


import { Preferences, Profile, Settings, UserRoles } from "../../../models/shoreline";
import { Session, SignupUser, UpdateUser } from "../../../lib/auth/models";
import { User } from "../../../lib/auth";
import { HcpProfession } from "../../../models/hcp-profession";

/**
 * API Stubs
 */
export interface AuthAPIStubs {
  login: jest.Mock<Promise<Session>, [string, string, string]>;
  requestPasswordReset: jest.Mock<Promise<void>, [string, string, string | undefined, boolean | undefined]>;
  resetPassword: jest.Mock<Promise<boolean>, [string, string, string, string]>;
  signup: jest.Mock<Promise<Session>, [string, string, UserRoles, string]>;
  resendSignup: jest.Mock<Promise<boolean>, [string, string, string | undefined]>;
  sendAccountValidation: jest.Mock<Promise<boolean>, [Readonly<Session>, string | undefined]>;
  accountConfirmed: jest.Mock<Promise<boolean>, string[]>;
  updatePreferences: jest.Mock<Promise<Preferences>, [Readonly<Session>]>;
  updateProfile: jest.Mock<Promise<Profile>, [Readonly<Session>]>;
  updateSettings: jest.Mock<Promise<Settings>, [Readonly<Session>]>;
  updateUser: jest.Mock<Promise<void>, [Readonly<Session>, UpdateUser]>;
  refreshToken: jest.Mock<Promise<string>, [Readonly<Session>]>;
  logout: jest.Mock<Promise<void>, [Readonly<Session>]>;
}

export const createAuthAPIStubs = (session: Session): AuthAPIStubs => ({
  login: jest.fn<Promise<Session>, [string, string, string]>().mockResolvedValue(session),
  requestPasswordReset: jest.fn<Promise<void>, [string, string, string | undefined, boolean | undefined]>().mockResolvedValue(),
  resetPassword: jest.fn<Promise<boolean>, [string, string, string, string]>().mockResolvedValue(true),
  signup: jest.fn<Promise<Session>, [string, string, UserRoles, string]>().mockResolvedValue(session),
  resendSignup: jest.fn<Promise<boolean>, [string, string, string | undefined]>().mockResolvedValue(true),
  sendAccountValidation: jest.fn<Promise<boolean>, [Readonly<Session>, string | undefined]>().mockResolvedValue(true),
  accountConfirmed: jest.fn().mockResolvedValue(true),
  updatePreferences: jest.fn<Promise<Preferences>, [Readonly<Session>]>().mockResolvedValue(session.user.preferences),
  updateProfile: jest.fn<Promise<Profile>, [Readonly<Session>]>().mockResolvedValue(session.user.profile),
  updateSettings: jest.fn<Promise<Settings>, [Readonly<Session>]>().mockResolvedValue(session.user.settings),
  updateUser: jest.fn<Promise<void>, [Readonly<Session>, UpdateUser]>().mockResolvedValue(),
  refreshToken: jest.fn<Promise<string>, [Readonly<Session>]>().mockResolvedValue(""),
  logout: jest.fn<Promise<void>, [Readonly<Session>]>().mockResolvedValue(),
});

export const resetAuthAPIStubs = (apiStubs: AuthAPIStubs, session: Session): void => {
  apiStubs.accountConfirmed.mockReset();
  apiStubs.accountConfirmed = jest.fn().mockResolvedValue(true);
  apiStubs.accountConfirmed.mockResolvedValue(true);

  apiStubs.login.mockReset();
  apiStubs.login = jest.fn<Promise<Session>, [string, string, string]>().mockResolvedValue(session);
  apiStubs.login.mockResolvedValue(session);

  apiStubs.logout.mockReset();
  apiStubs.logout = jest.fn<Promise<void>, [Readonly<Session>]>().mockResolvedValue();
  apiStubs.logout.mockResolvedValue();

  apiStubs.refreshToken.mockReset();
  apiStubs.refreshToken = jest.fn<Promise<string>, [Readonly<Session>]>().mockResolvedValue("");
  apiStubs.refreshToken.mockResolvedValue("");

  apiStubs.requestPasswordReset.mockReset();
  apiStubs.requestPasswordReset = jest.fn<Promise<void>, [string, string, string | undefined, boolean | undefined]>().mockResolvedValue();
  apiStubs.requestPasswordReset.mockResolvedValue();

  apiStubs.resendSignup.mockReset();
  apiStubs.resendSignup = jest.fn<Promise<boolean>, [string, string, string | undefined]>().mockResolvedValue(true);
  apiStubs.resendSignup.mockResolvedValue(true);

  apiStubs.resetPassword.mockReset();
  apiStubs.resetPassword = jest.fn<Promise<boolean>, [string, string, string, string]>().mockResolvedValue(true);
  apiStubs.resetPassword.mockResolvedValue(true);

  apiStubs.sendAccountValidation.mockReset();
  apiStubs.sendAccountValidation = jest.fn<Promise<boolean>, [Readonly<Session>, string | undefined]>().mockResolvedValue(true);
  apiStubs.sendAccountValidation.mockResolvedValue(true);

  apiStubs.signup.mockReset();
  apiStubs.signup = jest.fn<Promise<Session>, [string, string, UserRoles, string]>().mockResolvedValue(session);
  apiStubs.signup.mockResolvedValue(session);

  apiStubs.updatePreferences.mockReset();
  apiStubs.updatePreferences = jest.fn<Promise<Preferences>, [Readonly<Session>]>().mockResolvedValue(session.user.preferences);
  apiStubs.updatePreferences.mockResolvedValue(session.user.preferences);

  apiStubs.updateProfile.mockReset();
  apiStubs.updateProfile = jest.fn<Promise<Profile>, [Readonly<Session>]>().mockResolvedValue(session.user.profile);
  apiStubs.updateProfile.mockResolvedValue(session.user.profile);

  apiStubs.updateUser.mockReset();
  apiStubs.updateUser = jest.fn<Promise<void>, [Readonly<Session>, UpdateUser]>().mockResolvedValue();
  apiStubs.updateUser.mockResolvedValue();

  apiStubs.updateSettings.mockReset();
  apiStubs.updateSettings = jest.fn<Promise<Settings>, [Readonly<Session>]>().mockResolvedValue(session.user.settings);
  apiStubs.updateSettings.mockResolvedValue(session.user.settings);
};
/**
 * Auth hook stubs definitions
 */
export interface AuthContextStubs {
  certifyProfessionalAccount: jest.Mock<Promise<void>, null>;
  flagPatient: jest.Mock<Promise<void>, [string]>;
  getFlagPatients: jest.Mock<string[], []>;
  isAuthHookInitialized: boolean;
  isAuthInProgress: boolean;
  isLoggedIn: boolean;
  login: jest.Mock<Promise<User>, [string, string, string | null]>;
  logout: jest.Mock<Promise<void>, [boolean | undefined]>;
  redirectToProfessionalAccountLogin: jest.Mock<void, []>;
  resendSignup: jest.Mock<Promise<boolean>, [string]>;
  resetPassword: jest.Mock<Promise<boolean>, [string, string, string]>;
  sendPasswordResetEmail: jest.Mock<Promise<void>, [string, string]>;
  session: jest.Mock<Session | null, []>;
  sessionToken: string | null;
  setFlagPatients: jest.Mock<Promise<void>, [string[]]>;
  setUser: jest.Mock<void, [User]>;
  signup: jest.Mock<Promise<void>, [SignupUser]>;
  switchRoleToHCP: jest.Mock<Promise<void>, [boolean, HcpProfession]>;
  traceToken: string | null;
  updatePassword: jest.Mock<Promise<void>, [string, string]>;
  updatePreferences: jest.Mock<Promise<Preferences>, [Preferences, boolean | undefined]>;
  updateProfile: jest.Mock<Promise<Profile>, [Profile, boolean | undefined]>;
  updateSettings: jest.Mock<Promise<Settings>, [Settings, boolean | undefined]>;
  user: Readonly<User> | null;
}

/**
 * Hook Stubs
 */
export const createAuthHookStubs = (session?: Session): AuthContextStubs => ({
  certifyProfessionalAccount: jest.fn<Promise<void>, null>().mockResolvedValue(),
  flagPatient: jest.fn<Promise<void>, [string]>().mockResolvedValue(),
  getFlagPatients: jest.fn<string[], []>().mockReturnValue([]),
  isAuthHookInitialized: true,
  isAuthInProgress: false,
  isLoggedIn: true,
  login: jest.fn<Promise<User>, [string, string, string | null]>().mockResolvedValue(session.user),
  logout: jest.fn<Promise<void>, [boolean | undefined]>().mockResolvedValue(),
  redirectToProfessionalAccountLogin: jest.fn<void, []>().mockReturnValue(),
  resendSignup: jest.fn<Promise<boolean>, [string]>().mockResolvedValue(true),
  resetPassword: jest.fn<Promise<boolean>, [string, string, string]>().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn<Promise<void>, [string, string]>().mockResolvedValue(),
  session: jest.fn<Session | null, []>().mockReturnValue(session),
  sessionToken: session.sessionToken,
  setFlagPatients: jest.fn<Promise<void>, [string[]]>().mockResolvedValue(),
  setUser: jest.fn<void, [User]>(),
  signup: jest.fn<Promise<void>, [SignupUser]>().mockResolvedValue(),
  switchRoleToHCP: jest.fn<Promise<void>, [boolean, HcpProfession]>().mockResolvedValue(),
  traceToken: session.traceToken,
  updatePassword: jest.fn<Promise<void>, [string, string]>().mockResolvedValue(),
  updatePreferences: jest.fn<Promise<Preferences>, [Preferences, boolean | undefined]>().mockResolvedValue(session.user.preferences),
  updateProfile: jest.fn<Promise<Profile>, [Profile, boolean | undefined]>().mockResolvedValue(session.user.profile),
  updateSettings: jest.fn<Promise<Settings>, [Settings, boolean | undefined]>().mockResolvedValue(session.user.settings),
  user: session?.user ?? null,
});

/**
 *mockReset() stubs history & behavior
 *
 * TODO complete me
 */
export const resetAuthHookStubs = (hookStubs: AuthContextStubs, session?: Session): void => {
  hookStubs.user = session?.user ?? null;
  hookStubs.sessionToken = session.sessionToken;
  hookStubs.traceToken = session.traceToken;
  hookStubs.isLoggedIn = typeof session === "object";
  hookStubs.isAuthInProgress = false;
  hookStubs.isAuthHookInitialized = true;

  hookStubs.logout.mockReset();
  hookStubs.logout = jest.fn<Promise<void>, [boolean | undefined]>().mockResolvedValue();
  hookStubs.logout.mockResolvedValue();

  hookStubs.session.mockReset();
  hookStubs.session = jest.fn<Session | null, []>().mockReturnValue(session);
  hookStubs.session.mockReturnValue(session);
};


