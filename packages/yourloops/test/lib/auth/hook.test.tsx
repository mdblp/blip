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
import { MemoryRouter, Route } from "react-router-dom";
import * as H from "history";

import { Preferences, Profile, Settings, UserRoles } from "../../../models/shoreline";
import config from "../../../lib/config";
import { waitTimeout } from "../../../lib/utils";
import { AuthAPI, AuthContext, Session, SignupUser, User } from "../../../lib/auth";
import { AuthContextImpl } from "../../../lib/auth/hook";
import { loggedInUsers } from "../../common";
import { HcpProfession } from "../../../models/hcp-profession";
import { STORAGE_KEY_SESSION_TOKEN, STORAGE_KEY_TRACE_TOKEN, STORAGE_KEY_USER } from "../../../lib/auth/models";
import { AuthAPIStubs, createAuthAPIStubs, resetAuthAPIStubs } from "./utils";

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
  let testHistory: H.History<unknown> | null = null;
  let testLocation: H.Location<unknown> | null = null;

  const initAuthContext = async (session: Session | null, stubApi: AuthAPI | AuthAPIStubs): Promise<void> => {
    const initialRoute = "/";
    if (session !== null) {
      sessionStorage.setItem(STORAGE_KEY_SESSION_TOKEN, session.sessionToken);
      sessionStorage.setItem(STORAGE_KEY_TRACE_TOKEN, session.traceToken);
      sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(session.user));
    }
    const AuthContextProvider = (): JSX.Element => {
      authContext = AuthContextImpl(stubApi as AuthAPI);
      return <ReactAuthContext.Provider value={authContext} />;
    };
    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <MemoryRouter initialEntries={[initialRoute]}>
            <AuthContextProvider />
            <Route
              path="*"
              render={({ history, location }) => {
                testHistory = history;
                testLocation = location;
                return null;
              }}
            />
          </MemoryRouter>,
          container,
          resolve
        );
      });
    });
    expect(authContext).not.toBeNull();
    expect(authContext.isAuthHookInitialized).toBeTruthy();
  };

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    sessionStorage.removeItem(STORAGE_KEY_SESSION_TOKEN);
    sessionStorage.removeItem(STORAGE_KEY_TRACE_TOKEN);
    sessionStorage.removeItem(STORAGE_KEY_USER);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
    resetAuthAPIStubs(authApiHcpStubs, loggedInUsers.hcpSession);
    resetAuthAPIStubs(authApiCaregiverStubs, loggedInUsers.caregiverSession);
    resetAuthAPIStubs(authApiPatientStubs, loggedInUsers.patientSession);
    authContext = null;
  });


  afterAll(() => {
    sessionStorage.removeItem(STORAGE_KEY_SESSION_TOKEN);
    sessionStorage.removeItem(STORAGE_KEY_TRACE_TOKEN);
    sessionStorage.removeItem(STORAGE_KEY_USER);
  });

  describe("Initialization", () => {
    it("should initialize as logout state when no auth storage exists", async () => {
      await initAuthContext(null, authApiHcpStubs);
      expect(typeof authContext.traceToken).toBe("string");
      expect(authContext.traceToken.length).toBeGreaterThan(0);
      expect(authContext.sessionToken).toBeNull();
      expect(authContext.user).toBeNull();
    }
    );

    it("should initialized as logout state when trace token is not valid", async () => {
      await initAuthContext({
        sessionToken: authHcp.sessionToken,
        traceToken: "abcd",
        user: authHcp.user,
      }, authApiHcpStubs);
      expect(typeof authContext.traceToken).toBe("string");
      expect(authContext.traceToken.length).toBeGreaterThan(0);
      expect(authContext.sessionToken).toBeNull();
      expect(authContext.user).toBeNull();
    }
    );

    it("should initialized as logout state when session token has expired", async () => {
      const expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNyIjoiYTAwMDAwMDAiLCJuYW1lIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwic3ZyIjoibm8iLCJyb2xlIjoiaGNwIiwiaWF0IjoxNjI0OTU2MzA3LCJleHAiOjE2MjQ5NTYzMDZ9.fEaJHx1E53fh9m4DwNNXFm--iD6gEWJ0YmlsRVCOmog";
      await initAuthContext({
        sessionToken: expiredToken,
        traceToken: authHcp.traceToken,
        user: authHcp.user,
      }, authApiHcpStubs);
      expect(typeof authContext.traceToken).toBe("string");
      expect(authContext.traceToken.length).toBeGreaterThan(0);
      expect(authContext.sessionToken).toBeNull();
      expect(authContext.user).toBeNull();
    }
    );

    it("should initialized as login state when auth storage exists", async () => {
      await initAuthContext(authHcp, authApiHcpStubs);
      expect(authContext.traceToken).toBe(authHcp.traceToken);
      expect(authContext.sessionToken).toBe(authHcp.sessionToken);
      expect(authContext.user).not.toBeNull();
      expect(authContext.user.userid).toBe(authHcp.user.userid);
    }
    );
  });

  describe("Login", () => {
    beforeAll(() => {
      config.METRICS_SERVICE = "matomo";
      window._paq = [];
    });
    afterAll(() => {
      delete window._paq;
      config.METRICS_SERVICE = "disabled";
    });

    it("should call the login api function and set the context values", async () => {
      const session = loggedInUsers.hcpSession;
      const stubs = createAuthAPIStubs(session);
      await initAuthContext(null, stubs);
      expect(authContext.session()).toBeNull();
      expect(authContext.isLoggedIn).toBe(false);

      const user = await authContext.login("abc", "abc", "abc");
      expect(stubs.login).toHaveBeenCalledTimes(1);
      expect(user).toEqual(session.user);
      expect(authContext.traceToken).toBe(session.traceToken);
      expect(authContext.sessionToken).toBe(session.sessionToken);
      expect(authContext.user).not.toBeNull();
      expect(authContext.user.userid).toBe(session.user.userid);
      expect(sessionStorage.getItem(STORAGE_KEY_SESSION_TOKEN)).toBe(session.sessionToken);
      expect(sessionStorage.getItem(STORAGE_KEY_TRACE_TOKEN)).toBe(session.traceToken);
      expect(sessionStorage.getItem(STORAGE_KEY_USER)).toBe(JSON.stringify(session.user));
      expect(window._paq).toEqual([
        ["setUserId", session.user.userid],
        ["setCustomVariable", 1, "UserRole", "hcp", "page"],
        ["trackEvent", "registration", "login", "hcp"],
      ]);
      expect(authContext.session()).toEqual(session);
      expect(authContext.isLoggedIn).toBe(true);
    }
    );

    it("should throw an exception if the api call failed", async () => {
      await initAuthContext(null, authApiHcpStubs);
      authApiHcpStubs.login.mockRejectedValue(new Error("wrong"));

      let user: User | null = null;
      let error: Error | null = null;
      try {
        user = await authContext.login("abc", "abc", "abc");
      } catch (reason) {
        error = reason;
      }
      expect(user).toBeNull();
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("wrong");
      expect(typeof authContext.traceToken).toBe("string");
      expect(authContext.traceToken.length).toBeGreaterThan(0);
      expect(authContext.sessionToken).toBeNull();
      expect(authContext.user).toBeNull();
      expect(authContext.session()).toBeNull();
      expect(authContext.isLoggedIn).toBe(false);
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
      await initAuthContext(authHcp, authApiHcpStubs);
      expect(authContext.session()).not.toBeNull();
      expect(authContext.isLoggedIn).toBe(true);

      window._paq = []; // Clear the login part
      await authContext.logout();
      await waitTimeout(10);
      expect(authApiHcpStubs.logout).toHaveBeenCalledTimes(1);
      expect(typeof authContext.traceToken).toBe("string");
      expect(authContext.traceToken.length).toBeGreaterThan(0);
      expect(authContext.sessionToken).toBeNull();
      expect(authContext.user).toBeNull();
      expect(sessionStorage.getItem(STORAGE_KEY_SESSION_TOKEN)).toBeNull();
      expect(sessionStorage.getItem(STORAGE_KEY_TRACE_TOKEN)).toBeNull();
      expect(sessionStorage.getItem(STORAGE_KEY_USER)).toBeNull();
      // The first entry is for the "fake" login at the init
      expect(window._paq).toHaveLength(4);
      expect(window._paq[0]).toEqual(["trackEvent", "registration", "logout"]);
      expect(window._paq[1]).toEqual(["deleteCustomVariable", 1, "page"]);
      expect(window._paq[2]).toEqual(["resetUserId"]);
      expect(window._paq[3]).toEqual(["deleteCookies"]);
      expect(cleanBlipReduxStore).toHaveBeenCalledTimes(1);
      expect(authContext.session()).toBeNull();
      expect(authContext.isLoggedIn).toBe(false);
      expect(testLocation.pathname).toBe("/login");
      expect(testLocation.search).toBe("");
      expect(testLocation.state).toBeUndefined();
      expect(testHistory.length).toBe(2);
    });
    it("should not crash if the api call crash", async () => {
      authApiHcpStubs.logout.mockRejectedValue(_.noop);
      await initAuthContext(authHcp, authApiHcpStubs);
      await authContext.logout();
      await waitTimeout(10);
      expect(authApiHcpStubs.logout).toHaveBeenCalledTimes(1);
      expect(authContext.session()).toBeNull();
      expect(authContext.isLoggedIn).toBe(false);
    });
    it("should correctly set the URL parameters when logout with session timeout set to true", async () => {
      await initAuthContext(authCaregiver, authApiCaregiverStubs);
      expect(authContext.session()).not.toBeNull();
      expect(authContext.isLoggedIn).toBe(true);

      await authContext.logout(true);
      await waitTimeout(10);

      expect(testLocation.pathname).toBe("/");
      expect(testLocation.search).toBe("?login=caregiver%40example.com&sessionExpired=true");
      expect(testLocation.state).toEqual({ from: { pathname: "/" } });
      expect(testHistory.length).toBe(2);
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
      authApiHcpStubs.updatePreferences.mockResolvedValue(updatedPreferences);
      await initAuthContext(null, authApiHcpStubs);
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
      await initAuthContext(authHcp, authApiHcpStubs);
      expect(authContext.user.preferences).toEqual({ displayLanguageCode: "en" });

      const result = await authContext.updatePreferences({ ...updatedPreferences });
      expect(authApiHcpStubs.updatePreferences).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedPreferences);
      expect(authContext.user.preferences).toEqual(updatedPreferences);
    });

    it("updateProfile should not call the API if the user is not logged in", async () => {
      authApiHcpStubs.updateProfile.mockResolvedValue(updatedProfile);
      await initAuthContext(null, authApiHcpStubs);
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
      await initAuthContext(authHcp, authApiHcpStubs);
      expect(authContext.user.profile).toEqual(loggedInUsers.hcp.profile);

      const result = await authContext.updateProfile({ ...updatedProfile });
      expect(authApiHcpStubs.updateProfile).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedProfile);
      expect(authContext.user.profile).toEqual(updatedProfile);
    });

    it("updateSettings should not call the API if the user is not logged in", async () => {
      authApiHcpStubs.updateSettings.mockResolvedValue(updatedSettings);
      await initAuthContext(null, authApiHcpStubs);
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
      await initAuthContext(authHcp, authApiHcpStubs);
      expect(authContext.user.settings).toEqual(loggedInUsers.hcp.settings);

      const result = await authContext.updateSettings({ ...updatedSettings });
      expect(authApiHcpStubs.updateSettings).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedSettings);
      expect(authContext.user.settings).toEqual(updatedSettings);
    });

    it("updatePassword should not call the API if the user is not logged in", async () => {
      authApiHcpStubs.updateUser.mockResolvedValue();
      await initAuthContext(null, authApiHcpStubs);
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
      await initAuthContext(authPatient, authApiPatientStubs);
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
      await initAuthContext(authHcp, authApiHcpStubs);
      expect(authContext.user.settings).toEqual(loggedInUsers.hcp.settings);

      await authContext.updatePassword("abcd", "1234");
      expect(authApiHcpStubs.updateUser).toHaveBeenCalledTimes(1);
    });

    it("switchRoleToHCP should failed for hcp users", async () => {
      await initAuthContext(authHcp, authApiHcpStubs);
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
      await initAuthContext(authPatient, authApiPatientStubs);
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
      await initAuthContext(authCaregiver, authApiCaregiverStubs);
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
      await initAuthContext(authCaregiver, authApiCaregiverStubs);
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
      await initAuthContext(authCaregiver, authApiCaregiverStubs);
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
      await initAuthContext(authCaregiver, authApiCaregiverStubs);

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
      expect(sessionStorage.getItem(STORAGE_KEY_SESSION_TOKEN)).toBe(updatedToken);
      expect(authContext.sessionToken).toBe(updatedToken);
      const storageUser = JSON.parse(sessionStorage.getItem(STORAGE_KEY_USER)) as User;
      expect(storageUser.role).toBe(UserRoles.hcp);
      expect(typeof storageUser.profile).toBe("object");
      expect(storageUser.profile.termsOfUse).toEqual(accepts);
      expect(storageUser.profile.privacyPolicy).toEqual(accepts);
      expect(storageUser.profile.contactConsent).toEqual(accepts);
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
      await initAuthContext(authCaregiver, authApiCaregiverStubs);

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
      expect(sessionStorage.getItem(STORAGE_KEY_SESSION_TOKEN)).toBe(updatedToken);
      expect(authContext.sessionToken).toBe(updatedToken);
      const storageUser = JSON.parse(sessionStorage.getItem(STORAGE_KEY_USER)) as User;
      expect(storageUser.role).toBe(UserRoles.hcp);
      expect(typeof storageUser.profile).toBe("object");
      expect(storageUser.profile.termsOfUse).toEqual(accepts);
      expect(storageUser.profile.privacyPolicy).toEqual(accepts);
      expect(storageUser.profile.contactConsent).toEqual(decline);
    });
  });

  describe("Signup", () => {
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
      await initAuthContext(null, authApiHcpStubs);
      const signupResolve: Session = {
        user: _.cloneDeep(authCaregiver.user),
        sessionToken: authCaregiver.sessionToken,
        traceToken: authContext.traceToken,
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
        authContext.traceToken,
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
      await initAuthContext(authHcp, authApiHcpStubs);
      const result = await authContext.resendSignup("abcd");
      expect(authApiHcpStubs.resendSignup).toHaveBeenCalledTimes(1);
      expect(authApiHcpStubs.resendSignup.mock.calls[0]).toEqual(["abcd", authHcp.traceToken, "en"]);
      expect(result).toBe(true);
    });
  });

  describe("Flag patient", () => {
    it("should flag a un-flagged patient", async () => {
      const userId = uuidv4();
      authApiHcpStubs.updatePreferences.mockResolvedValue({ patientsStarred: [userId] });
      delete authHcp.user.preferences;
      await initAuthContext(authHcp, authApiHcpStubs);
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
      await initAuthContext(authHcp, authApiHcpStubs);
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
      await initAuthContext(session, stubs);
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
      await initAuthContext(authHcp, authApiHcpStubs);
      expect(authContext.getFlagPatients()).toEqual(["old"]);
      await authContext.setFlagPatients([userId]);
      const after = authContext.getFlagPatients();
      expect(authApiHcpStubs.updatePreferences).toHaveBeenCalledTimes(1);
      const apiCall = authApiHcpStubs.updatePreferences.mock.calls[0];
      expect((apiCall[0] as Session).user.preferences.patientsStarred).toEqual([userId]);
      expect(after).toEqual([userId]);
    });
  });

  describe("Password", () => {
    it("sendPasswordResetEmail should call the API", async () => {
      await initAuthContext(null, authApiHcpStubs);
      const username = loggedInUsers.caregiver.username;
      const language = loggedInUsers.caregiver.preferences.displayLanguageCode;
      await authContext.sendPasswordResetEmail(username, language);
      const apiCall = authApiHcpStubs.requestPasswordReset.mock.calls[0];
      expect(apiCall).toMatchObject([username, authContext.traceToken, language]);
    });
    it("resetPassword should call the API", async () => {
      authApiHcpStubs.resetPassword.mockResolvedValue(true);
      await initAuthContext(null, authApiHcpStubs);
      const key = uuidv4();
      const username = loggedInUsers.caregiver.username;
      const password = "abcd";
      const result = await authContext.resetPassword(key, username, password);
      expect(result).toBeTruthy();
      const apiCall = authApiHcpStubs.resetPassword.mock.calls[0];
      expect(apiCall).toMatchObject([key, username, password, authContext.traceToken]);
    });
  });
});

