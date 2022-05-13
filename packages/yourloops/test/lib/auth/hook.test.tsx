/**
 * Copyright (c) 2021, Diabeloop
 * Auth hook tests
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

import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import * as auth0Mock from "@auth0/auth0-react";
import { Auth0Provider } from "@auth0/auth0-react";

import { Preferences, Profile, Settings, UserRoles } from "../../../models/shoreline";
import config from "../../../lib/config";
import { AuthAPI, AuthContext, Session, SignupUser } from "../../../lib/auth";
import { AuthContextImpl } from "../../../lib/auth/hook";
import { loggedInUsers } from "../../common";
import { HcpProfession } from "../../../models/hcp-profession";
import { AuthAPIStubs, createAuthAPIStubs, resetAuthAPIStubs } from "./utils";

jest.mock("@auth0/auth0-react");

describe("Auth hook", () => {
  const authPatient = loggedInUsers.patientSession;
  const authCaregiver = loggedInUsers.caregiverSession;
  const authHcp = loggedInUsers.hcpSession;

  /* eslint-disable new-cap */
  const ReactAuthContext = React.createContext({} as AuthContext);
  const authApiHcpStubs = createAuthAPIStubs(authHcp);
  const authApiCaregiverStubs = createAuthAPIStubs(authCaregiver);
  const authApiPatientStubs = createAuthAPIStubs(authPatient);
  let container: HTMLDivElement | null = null;
  let authContext: AuthContext = null;

  const initAuthContext = async (stubApi: AuthAPI | AuthAPIStubs): Promise<void> => {
    const AuthContextProvider = (): JSX.Element => {
      authContext = AuthContextImpl(stubApi as AuthAPI);
      return <ReactAuthContext.Provider value={authContext} />;
    };
    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <Auth0Provider clientId="__test_client_id__" domain="__test_domain__">
            <AuthContextProvider />
          </Auth0Provider>, container, resolve);
      });
    });
    expect(authContext).not.toBeNull();
  };

  const unAuthenticateUser = () => {
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });
  };

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    (auth0Mock.Auth0Provider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: {
        user: {
          "email": "john.spartan@demolition.man",
          "email_verified": true,
          "sub": "auth0|0123456789",
          "http://your-loops.com/roles": ["hcp"],
        },
      },
      logout: jest.fn(),
    });
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
    resetAuthAPIStubs(authApiHcpStubs, loggedInUsers.hcpSession);
    resetAuthAPIStubs(authApiCaregiverStubs, loggedInUsers.caregiverSession);
    resetAuthAPIStubs(authApiPatientStubs, loggedInUsers.patientSession);
    authContext = null;
  });

  describe("Initialization", () => {
    it("should getUserInfo when authentication is successfully done", async () => {
      await initAuthContext(authApiHcpStubs);
      expect(authContext.isLoggedIn).toBeTruthy();
      expect(authContext.user.username).toBe("john.doe@example.com");
    });
  });

  describe("Logout", () => {
    const cleanBlipReduxStore = jest.fn();

    beforeAll(() => {
      config.METRICS_SERVICE = "matomo";
      window._paq = [];
      window.cleanBlipReduxStore = cleanBlipReduxStore;
    });

    afterAll(() => {
      delete window.cleanBlipReduxStore;
      delete window._paq;
      config.METRICS_SERVICE = "disabled";
    });

    it("should logout the logged-in user", async () => {
      await initAuthContext(authApiHcpStubs);
      expect(authContext.session()).not.toBeNull();
      expect(authContext.isLoggedIn).toBe(true);

      await authContext.logout();
      expect(auth0Mock.useAuth0().logout).toHaveBeenCalledTimes(1);
    });
  });

  describe("Updates", () => {
    const updatedPreferences: Preferences = { displayLanguageCode: "fr" };
    const updatedProfile: Profile = {
      ...loggedInUsers.hcp.profile,
      privacyPolicy: { acceptanceTimestamp: new Date().toISOString(), isAccepted: true },
    };
    const updatedSettings: Settings = { ...loggedInUsers.hcp.settings, country: "FR" };

    it("updatePreferences should not call the API if the user is not logged in", async () => {
      unAuthenticateUser();
      authApiHcpStubs.updatePreferences.mockResolvedValue(updatedPreferences);
      await initAuthContext(authApiHcpStubs);
      expect(authContext.user).toBeNull();

      let error: Error | null = null;
      let result: Preferences | null = null;
      try {
        result = await authContext.updatePreferences({ ...updatedPreferences });
      } catch (reason) {
        error = reason;
      }
      expect(authApiHcpStubs.updatePreferences).toHaveBeenCalledTimes(0);
      expect(result).toBeNull();
      expect(error).not.toBeNull();
      expect(authContext.user).toBeNull();
    });

    it("updatePreferences should call the API with the good parameters", async () => {
      authApiHcpStubs.updatePreferences.mockResolvedValue(updatedPreferences);
      await initAuthContext(authApiHcpStubs);
      expect(authContext.user.preferences).toEqual({ displayLanguageCode: "en" });

      const result = await authContext.updatePreferences({ ...updatedPreferences });
      expect(authApiHcpStubs.updatePreferences).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedPreferences);
      expect(authContext.user.preferences).toEqual(updatedPreferences);
    });

    it("updateProfile should not call the API if the user is not logged in", async () => {
      unAuthenticateUser();
      authApiHcpStubs.updateProfile.mockResolvedValue(updatedProfile);
      await initAuthContext(authApiHcpStubs);
      expect(authContext.user).toBeNull();

      let error: Error | null = null;
      let result: Profile | null = null;
      try {
        result = await authContext.updateProfile({ ...updatedProfile });
      } catch (reason) {
        error = reason;
      }
      expect(authApiHcpStubs.updateProfile).toHaveBeenCalledTimes(0);
      expect(result).toBeNull();
      expect(error).not.toBeNull();
      expect(authContext.user).toBeNull();
    });
    it("updateProfile should call the API with the good parameters", async () => {
      authApiHcpStubs.updateProfile.mockResolvedValue(updatedProfile);
      await initAuthContext(authApiHcpStubs);
      expect(authContext.user.profile).toEqual(loggedInUsers.hcp.profile);

      const result = await authContext.updateProfile({ ...updatedProfile });
      expect(authApiHcpStubs.updateProfile).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedProfile);
      expect(authContext.user.profile).toEqual(updatedProfile);
    });

    it("updateSettings should not call the API if the user is not logged in", async () => {
      unAuthenticateUser();
      authApiHcpStubs.updateSettings.mockResolvedValue(updatedSettings);
      await initAuthContext(authApiHcpStubs);
      expect(authContext.user).toBeNull();

      let error: Error | null = null;
      let result: Settings | null = null;
      try {
        result = await authContext.updateSettings({ ...updatedSettings });
      } catch (reason) {
        error = reason;
      }
      expect(authApiHcpStubs.updateSettings).toHaveBeenCalledTimes(0);
      expect(result).toBeNull();
      expect(error).not.toBeNull();
      expect(authContext.user).toBeNull();
    });
    it("updateSettings should call the API with the good parameters", async () => {
      authApiHcpStubs.updateSettings.mockResolvedValue(updatedSettings);
      await initAuthContext(authApiHcpStubs);
      expect(authContext.user.settings).toEqual(loggedInUsers.hcp.settings);

      const result = await authContext.updateSettings({ ...updatedSettings });
      expect(authApiHcpStubs.updateSettings).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedSettings);
      expect(authContext.user.settings).toEqual(updatedSettings);
    });

    it("updatePassword should not call the API if the user is not logged in", async () => {
      unAuthenticateUser();
      authApiHcpStubs.updateUser.mockResolvedValue();
      await initAuthContext(authApiHcpStubs);
      expect(authContext.user).toBeNull();

      let error: Error | null = null;
      try {
        await authContext.updatePassword("abcd", "1234");
      } catch (reason) {
        error = reason;
      }
      expect(authApiHcpStubs.updateUser).toHaveBeenCalledTimes(0);
      expect(error).not.toBeNull();
      expect(authContext.user).toBeNull();
    });
    it("updatePassword should not call the API if the user is a patient", async () => {
      authApiPatientStubs.updateUser.mockResolvedValue();
      await initAuthContext(authApiPatientStubs);
      expect(authContext.user).not.toBeNull();

      let error: Error | null = null;
      try {
        await authContext.updatePassword("abcd", "1234");
      } catch (reason) {
        error = reason;
      }
      expect(authApiHcpStubs.updateUser).toHaveBeenCalledTimes(0);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("invalid-user-role");
    });
    it("updatePassword should call the API with the good parameters", async () => {
      authApiHcpStubs.updateUser.mockResolvedValue();
      await initAuthContext(authApiHcpStubs);
      expect(authContext.user.settings).toEqual(loggedInUsers.hcp.settings);

      await authContext.updatePassword("abcd", "1234");
      expect(authApiHcpStubs.updateUser).toHaveBeenCalledTimes(1);
    });

    it("switchRoleToHCP should failed for hcp users", async () => {
      await initAuthContext(authApiHcpStubs);
      let error: Error | null = null;
      try {
        await authContext.switchRoleToHCP(false, HcpProfession.diabeto);
      } catch (reason) {
        error = reason;
      }
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("invalid-user-role");
    });
    it("switchRoleToHCP should failed for patient users", async () => {
      await initAuthContext(authApiPatientStubs);
      let error: Error | null = null;
      try {
        await authContext.switchRoleToHCP(false, HcpProfession.diabeto);
      } catch (reason) {
        error = reason;
      }
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("invalid-user-role");
    });
    it("switchRoleToHCP should not call updateProfile if updateUser failed", async () => {
      authApiCaregiverStubs.updateUser.mockRejectedValue(_.noop);
      await initAuthContext(authApiCaregiverStubs);
      let error: Error | null = null;
      try {
        await authContext.switchRoleToHCP(false, HcpProfession.diabeto);
      } catch (reason) {
        error = reason;
      }
      expect(error).toBeInstanceOf(Function);
      expect(authApiCaregiverStubs.updateUser).toHaveBeenCalledTimes(1);
      const updateArgs = authApiCaregiverStubs.updateUser.mock.calls[0];
      expect(updateArgs[0]).toHaveProperty("user");
      expect(updateArgs[0]).toHaveProperty("sessionToken");
      expect(updateArgs[0]).toHaveProperty("traceToken");
      expect(typeof updateArgs[1]).toBe("object");
      expect(updateArgs[1]).toEqual({ roles: [UserRoles.hcp] });
      expect(authApiCaregiverStubs.updateProfile).toHaveBeenCalledTimes(0);
    });
    it("switchRoleToHCP should call updateProfile after updateUser", async () => {
      const now = Date.now();
      authApiCaregiverStubs.updateProfile.mockRejectedValue(_.noop);
      await initAuthContext(authApiCaregiverStubs);
      let error: Error | null = null;
      try {
        await authContext.switchRoleToHCP(false, HcpProfession.diabeto);
      } catch (reason) {
        error = reason;
      }
      expect(error).toBeInstanceOf(Function);
      expect(authApiCaregiverStubs.updateUser).toHaveBeenCalledTimes(1);
      const updateUserArgs = authApiCaregiverStubs.updateUser.mock.calls[0];
      expect(updateUserArgs[0]).toHaveProperty("user");
      expect(updateUserArgs[0]).toHaveProperty("sessionToken");
      expect(updateUserArgs[0]).toHaveProperty("traceToken");
      expect(typeof updateUserArgs[1]).toBe("object");
      expect(updateUserArgs[1]).toEqual({ roles: [UserRoles.hcp] });
      expect(authApiCaregiverStubs.updateProfile).toHaveBeenCalledTimes(1);
      const updateProfileArgs = authApiCaregiverStubs.updateProfile.mock.calls[0];
      expect(updateProfileArgs[0]).toHaveProperty("user");
      expect(updateProfileArgs[0]).toHaveProperty("sessionToken");
      expect(updateProfileArgs[0]).toHaveProperty("traceToken");
      const profile = updateProfileArgs[0].user.profile;
      expect(typeof profile).toBe("object");
      expect(profile.termsOfUse).toBeDefined();
      expect(profile.privacyPolicy).toBeDefined();
      expect(profile.termsOfUse.isAccepted).toBe(true);
      expect(profile.privacyPolicy.isAccepted).toBe(true);
      expect(Date.parse(profile.termsOfUse.acceptanceTimestamp)).toBeGreaterThan(now);
      expect(Date.parse(profile.privacyPolicy.acceptanceTimestamp)).toBeGreaterThan(now);
      expect(typeof authContext.user.profile).toBe("object");
      expect(authContext.user.profile.termsOfUse).toBeUndefined();
      expect(authContext.user.profile.privacyPolicy).toBeUndefined();
    });
    it("switchRoleToHCP should call refreshToken after updateUser, and verify the received token", async () => {
      const invalidUpdatedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNyIjoiYTBhMGEwYjAiLCJuYW1lIjoiY2FyZWdpdmVyQGV4YW1wbGUuY29tIiwiZW1haWwiOiJjYXJlZ2l2ZXJAZXhhbXBsZS5jb20iLCJzdnIiOiJubyIsInJvbGUiOiJjYXJlZ2l2ZXIiLCJpYXQiOjE2MjUwNjQxNTgsImV4cCI6NTYyNDk1NjMwNn0.MlWX87m5QdZSi2gYO22hfSvR3wZaoFZlTTLlU6dk_FY";
      const now = new Date();
      const accepts = {
        acceptanceTimestamp: now.toISOString(),
        isAccepted: true,
      };
      authApiCaregiverStubs.updateProfile.mockResolvedValue({
        ...authCaregiver.user.profile,
        termsOfUse: accepts,
        privacyPolicy: accepts,
      });
      authApiCaregiverStubs.refreshToken.mockResolvedValue(invalidUpdatedToken);
      await initAuthContext(authApiCaregiverStubs);
      let error: Error | null = null;
      try {
        await authContext.switchRoleToHCP(false, HcpProfession.diabeto);
      } catch (reason) {
        error = reason;
      }
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Role change is not effective");
      expect(authApiCaregiverStubs.updateUser).toHaveBeenCalledTimes(1);
      const updateUserArgs = authApiCaregiverStubs.updateUser.mock.calls[0];
      expect(updateUserArgs[0]).toHaveProperty("user");
      expect(updateUserArgs[0]).toHaveProperty("sessionToken");
      expect(updateUserArgs[0]).toHaveProperty("traceToken");
      expect(updateUserArgs[1]).toEqual({ roles: [UserRoles.hcp] });
      expect(authApiCaregiverStubs.updateProfile).toHaveBeenCalledTimes(1);
      const updateProfileArgs = authApiCaregiverStubs.updateProfile.mock.calls[0];
      expect(updateProfileArgs[0]).toHaveProperty("user");
      expect(updateProfileArgs[0]).toHaveProperty("sessionToken");
      expect(updateProfileArgs[0]).toHaveProperty("traceToken");
      const profile = updateProfileArgs[0].user.profile;
      expect(typeof profile).toBe("object");
      expect(profile.termsOfUse).toBeDefined();
      expect(profile.privacyPolicy).toBeDefined();
      expect(profile.termsOfUse.isAccepted).toBe(true);
      expect(profile.privacyPolicy.isAccepted).toBe(true);
      expect(Date.parse(profile.termsOfUse.acceptanceTimestamp)).toBeGreaterThanOrEqual(now.valueOf());
      expect(Date.parse(profile.privacyPolicy.acceptanceTimestamp)).toBeGreaterThanOrEqual(now.valueOf());
      expect(typeof authContext.user.profile).toBe("object");
      expect(authContext.user.profile.termsOfUse).toBeUndefined();
      expect(authContext.user.profile.privacyPolicy).toBeUndefined();
    });

    it("switchRoleToHCP should succeed (accept feedback)", async () => {
      const updatedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNyIjoiYTBhMGEwYjAiLCJuYW1lIjoiY2FyZWdpdmVyQGV4YW1wbGUuY29tIiwiZW1haWwiOiJjYXJlZ2l2ZXJAZXhhbXBsZS5jb20iLCJzdnIiOiJubyIsInJvbGUiOiJoY3AiLCJpYXQiOjE2MjUwNjQxNTgsImV4cCI6NTYyNDk1NjMwNn0._PK65sdZ_o11nZtJBTILxcS9f9HhRLfAmYsn3Us4s7o";
      const now = new Date();
      const accepts = {
        acceptanceTimestamp: now.toISOString(),
        isAccepted: true,
      };
      authApiCaregiverStubs.updateProfile.mockResolvedValue({
        ...authCaregiver.user.profile,
        termsOfUse: accepts,
        privacyPolicy: accepts,
        contactConsent: accepts,
      });
      authApiCaregiverStubs.refreshToken.mockResolvedValue(updatedToken);
      await initAuthContext(authApiCaregiverStubs);

      await authContext.switchRoleToHCP(true, HcpProfession.diabeto);
      expect(authApiCaregiverStubs.updateUser).toHaveBeenCalledTimes(1);
      const updateUserArgs = authApiCaregiverStubs.updateUser.mock.calls[0];
      expect(updateUserArgs[0]).toHaveProperty("user");
      expect(updateUserArgs[0]).toHaveProperty("sessionToken");
      expect(updateUserArgs[0]).toHaveProperty("traceToken");
      expect(updateUserArgs[1]).toEqual({ roles: [UserRoles.hcp] });
      expect(authApiCaregiverStubs.updateProfile).toHaveBeenCalledTimes(1);
      const updateProfileArgs = authApiCaregiverStubs.updateProfile.mock.calls[0];
      expect(updateUserArgs[0]).toHaveProperty("user");
      expect(updateUserArgs[0]).toHaveProperty("sessionToken");
      expect(updateUserArgs[0]).toHaveProperty("traceToken");
      const profile = updateProfileArgs[0].user.profile;
      expect(typeof profile).toBe("object");
      expect(profile.termsOfUse).toBeDefined();
      expect(profile.privacyPolicy).toBeDefined();
      expect(profile.contactConsent).toBeDefined();
      expect(profile.termsOfUse.isAccepted).toBe(true);
      expect(profile.privacyPolicy.isAccepted).toBe(true);
      expect(profile.contactConsent.isAccepted).toBe(true);
      expect(Date.parse(profile.termsOfUse.acceptanceTimestamp)).toBeGreaterThanOrEqual(now.valueOf());
      expect(Date.parse(profile.privacyPolicy.acceptanceTimestamp)).toBeGreaterThanOrEqual(now.valueOf());
      expect(Date.parse(profile.contactConsent.acceptanceTimestamp)).toBeGreaterThanOrEqual(now.valueOf());
      expect(typeof authContext.user.profile).toBe("object");
      expect(authContext.user.profile.termsOfUse).toBeDefined();
      expect(authContext.user.profile.privacyPolicy).toBeDefined();
      expect(authContext.user.profile.contactConsent).toBeDefined();
      expect(authContext.user.role).toBe(UserRoles.hcp);
      expect(authContext.session().sessionToken).toBe(updatedToken);
    });
    it("switchRoleToHCP should succeed (decline feedback)", async () => {
      const updatedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNyIjoiYTBhMGEwYjAiLCJuYW1lIjoiY2FyZWdpdmVyQGV4YW1wbGUuY29tIiwiZW1haWwiOiJjYXJlZ2l2ZXJAZXhhbXBsZS5jb20iLCJzdnIiOiJubyIsInJvbGUiOiJoY3AiLCJpYXQiOjE2MjUwNjQxNTgsImV4cCI6NTYyNDk1NjMwNn0._PK65sdZ_o11nZtJBTILxcS9f9HhRLfAmYsn3Us4s7o";
      const now = new Date();
      const accepts = {
        acceptanceTimestamp: now.toISOString(),
        isAccepted: true,
      };
      const decline = {
        acceptanceTimestamp: accepts.acceptanceTimestamp,
        isAccepted: false,
      };
      authApiCaregiverStubs.updateProfile.mockResolvedValue({
        ...authCaregiver.user.profile,
        termsOfUse: accepts,
        privacyPolicy: accepts,
        contactConsent: decline,
      });
      authApiCaregiverStubs.refreshToken.mockResolvedValue(updatedToken);
      await initAuthContext(authApiCaregiverStubs);

      await authContext.switchRoleToHCP(false, HcpProfession.diabeto);
      expect(authApiCaregiverStubs.updateUser).toHaveBeenCalledTimes(1);
      const updateUserArgs = authApiCaregiverStubs.updateUser.mock.calls[0];
      expect(updateUserArgs[0]).toHaveProperty(["user"]);
      expect(updateUserArgs[1]).toEqual({ roles: [UserRoles.hcp] });
      expect(authApiCaregiverStubs.updateProfile).toHaveBeenCalledTimes(1);
      const updateProfileArgs = authApiCaregiverStubs.updateProfile.mock.calls[0];
      expect(updateProfileArgs[0]).toHaveProperty(["user"]);
      const profile = updateProfileArgs[0].user.profile;
      expect(typeof authContext.user.profile).toBe("object");
      expect(authContext.user.profile.termsOfUse).toBeDefined();
      expect(authContext.user.profile.privacyPolicy).toBeDefined();
      expect(authContext.user.profile.contactConsent).toBeDefined();
      expect(profile.termsOfUse.isAccepted).toBe(true);
      expect(profile.privacyPolicy.isAccepted).toBe(true);
      expect(profile.contactConsent.isAccepted).toBe(false);
      expect(Date.parse(profile.termsOfUse.acceptanceTimestamp)).toBeGreaterThanOrEqual(now.valueOf());
      expect(Date.parse(profile.privacyPolicy.acceptanceTimestamp)).toBeGreaterThanOrEqual(now.valueOf());
      expect(Date.parse(profile.contactConsent.acceptanceTimestamp)).toBeGreaterThanOrEqual(now.valueOf());
      expect(typeof authContext.user.profile).toBe("object");
      expect(authContext.user.profile.termsOfUse).toBeDefined();
      expect(authContext.user.profile.privacyPolicy).toBeDefined();
      expect(authContext.user.profile.contactConsent).toBeDefined();
      expect(authContext.user.role).toBe(UserRoles.hcp);
      expect(authContext.session().sessionToken).toBe(updatedToken);
    });
  });

  describe.skip("Signup", () => {
    it("should call the API with all the good parameters", async () => {
      const infos: SignupUser = {
        accountPassword: "abcd",
        accountRole: UserRoles.caregiver,
        accountUsername: loggedInUsers.caregiver.username,
        preferencesLanguage: loggedInUsers.caregiver.preferences.displayLanguageCode,
        privacyPolicy: true,
        profileCountry: loggedInUsers.caregiver.settings.country,
        profileFirstname: loggedInUsers.caregiver.profile.firstName,
        profileLastname: loggedInUsers.caregiver.profile.lastName,
        profilePhone: "+0000000",
        hcpProfession: HcpProfession.empty,
        terms: true,
        feedback: false,
      };
      await initAuthContext(authApiHcpStubs);
      const signupResolve: Session = {
        user: _.cloneDeep(authCaregiver.user),
        sessionToken: authCaregiver.sessionToken,
        traceToken: authContext.session().traceToken,
      };
      delete signupResolve.user.preferences;
      delete signupResolve.user.profile;
      delete signupResolve.user.settings;
      authApiHcpStubs.signup.mockResolvedValue(signupResolve);
      const callOrder: string[] = [];
      authApiHcpStubs.updateSettings.mockImplementation(() => {
        callOrder.push("updateSettings");
        return Promise.resolve({} as Settings);
      });
      authApiHcpStubs.updateProfile.mockImplementation(() => {
        callOrder.push("updateProfile");
        return Promise.resolve({} as Profile);
      });
      authApiHcpStubs.updatePreferences.mockImplementation(() => {
        callOrder.push("updatePreferences");
        return Promise.resolve({} as Preferences);
      });

      let error: Error | null = null;
      try {
        await authContext.signup(infos);
      } catch (reason) {
        error = reason;
      }
      expect(authApiHcpStubs.signup).toHaveBeenCalledTimes(1);
      expect(authApiHcpStubs.signup.mock.calls[0]).toEqual([
        infos.accountUsername,
        infos.accountPassword,
        infos.accountRole,
      ]);
      expect(authApiHcpStubs.updateProfile).toHaveBeenCalledTimes(1);
      const sentProfile = authApiHcpStubs.updateProfile.mock.calls[0][0].user.profile;
      expect(sentProfile).not.toBeNull();
      expect(sentProfile.contactConsent.isAccepted).toBe(false);
      expect(typeof sentProfile.contactConsent.acceptanceTimestamp).toBe("string");
      expect(sentProfile.hcpProfession).toBe("");
      expect(authApiHcpStubs.updateSettings).toHaveBeenCalledTimes(1);
      expect(authApiHcpStubs.updatePreferences).toHaveBeenCalledTimes(1);
      expect(authApiHcpStubs.sendAccountValidation).toHaveBeenCalledTimes(1);
      expect(authApiHcpStubs.sendAccountValidation.mock.calls[0][1]).toBe(infos.preferencesLanguage);
      expect(error).toBeNull();
      expect(authContext.user).toBeNull();
      expect(callOrder).toEqual(["updateProfile", "updateSettings", "updatePreferences"]);
    });
  });

  describe("Resend sign-up", () => {
    it("should call the resend sign-up api", async () => {
      await initAuthContext(authApiHcpStubs);
      const result = await authContext.resendSignup("abcd");
      expect(authApiHcpStubs.resendSignup).toHaveBeenCalledTimes(1);
      expect(authApiHcpStubs.resendSignup.mock.calls[0]).toEqual(["abcd", authContext.session().traceToken, "en"]);
      expect(result).toBe(true);
    });
  });

  describe("Flag patient", () => {
    it("should flag a un-flagged patient", async () => {
      const userId = uuidv4();
      authApiHcpStubs.updatePreferences.mockResolvedValue({ patientsStarred: [userId] });
      delete authHcp.user.preferences;
      await initAuthContext(authApiHcpStubs);
      await authContext.flagPatient(userId);
      expect(authApiHcpStubs.updatePreferences).toHaveBeenCalledTimes(1);
      const apiCall = authApiHcpStubs.updatePreferences.mock.calls[0];
      expect((apiCall[0] as Session).user.preferences.patientsStarred).toEqual([userId]);
      expect(authContext.user.preferences.patientsStarred).toEqual([userId]);
    });
    it("should un-flag a flagged patient", async () => {
      const userId = uuidv4();
      const otherUserId = uuidv4();
      authHcp.user.preferences = { patientsStarred: [userId, otherUserId] };
      authApiHcpStubs.updatePreferences.mockResolvedValue({ patientsStarred: [otherUserId] });
      await initAuthContext(authApiHcpStubs);
      await authContext.flagPatient(userId);
      expect(authApiHcpStubs.updatePreferences).toHaveBeenCalledTimes(1);
      const apiCall = authApiHcpStubs.updatePreferences.mock.calls[0];
      expect((apiCall[0] as Session).user.preferences.patientsStarred).toEqual([otherUserId]);
      expect(authContext.user.preferences.patientsStarred).toEqual([otherUserId]);
    });
    it("should add another user to an existing list", async () => {
      const userId1 = uuidv4();
      const userId2 = uuidv4();
      const session = loggedInUsers.hcpSession;
      const stubs = createAuthAPIStubs(session);

      stubs.updatePreferences.mockResolvedValueOnce({ patientsStarred: [userId1] });
      stubs.updatePreferences.mockResolvedValueOnce({ patientsStarred: [userId1, userId2] });
      await initAuthContext(stubs);
      expect(authContext.getFlagPatients()).toEqual([]);

      await authContext.flagPatient(userId1);
      expect(stubs.updatePreferences).toHaveBeenCalledTimes(1);
      let apiCall = stubs.updatePreferences.mock.calls[0][0] as Session;
      expect(apiCall.user.preferences.patientsStarred).toEqual([userId1]);
      expect(authContext.user.preferences.patientsStarred).toEqual([userId1]);

      await authContext.flagPatient(userId2);
      expect(stubs.updatePreferences).toHaveBeenCalledTimes(2);
      apiCall = stubs.updatePreferences.mock.calls[1][0] as Session;
      expect(apiCall.user.preferences.patientsStarred).toEqual([userId1, userId2]);
      expect(authContext.getFlagPatients()).toEqual([userId1, userId2]);
    });
    it("setFlagPatients should replace the currently flagged patient", async () => {
      const userId = uuidv4();
      authApiHcpStubs.updatePreferences.mockResolvedValue({ displayLanguageCode: "fr", patientsStarred: [userId] });
      authHcp.user.preferences.patientsStarred = ["old"];
      await initAuthContext(authApiHcpStubs);
      expect(authContext.getFlagPatients()).toEqual(["old"]);
      await authContext.setFlagPatients([userId]);
      const after = authContext.getFlagPatients();
      expect(authApiHcpStubs.updatePreferences).toHaveBeenCalledTimes(1);
      const apiCall = authApiHcpStubs.updatePreferences.mock.calls[0];
      expect((apiCall[0] as Session).user.preferences.patientsStarred).toEqual([userId]);
      expect(after).toEqual([userId]);
    });
  });
});

