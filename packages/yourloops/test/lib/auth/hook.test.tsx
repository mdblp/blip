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
import { AuthContext } from "../../../lib/auth";
import { AuthContextImpl } from "../../../lib/auth/hook";
import { loggedInUsers } from "../../common";
import { HcpProfession } from "../../../models/hcp-profession";
import { createAuthAPIStubs, resetAuthAPIStubs } from "./utils";
import UserApi from "../../../lib/auth/user-api";
import { Units } from "../../../models/generic";
import User from "../../../lib/auth/user";

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
  const auth0UserId = "0123456789";

  const initAuthContext = async (): Promise<void> => {
    const AuthContextProvider = (): JSX.Element => {
      authContext = AuthContextImpl();
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
        "email": "john.doe@example.com",
        "email_verified": true,
        "sub": `auth0|${auth0UserId}`,
        "http://your-loops.com/roles": ["caregiver"],
      },
      logout: jest.fn(),
    });
    jest.spyOn(UserApi, "getShorelineAccessToken").mockResolvedValue(Promise.resolve({
      token: loggedInUsers.hcpSession.sessionToken,
      id: loggedInUsers.hcpSession.user.userid,
    }));
    jest.spyOn(UserApi, "getProfile").mockResolvedValue(Promise.resolve({
      firstName: "John",
      lastName: "Doe",
      fullName: "John Doe",
      hcpProfession: HcpProfession.diabeto,
    }));
    jest.spyOn(UserApi, "getPreferences").mockResolvedValue(Promise.resolve({ displayLanguageCode: "en" }));
    jest.spyOn(UserApi, "getSettings").mockResolvedValue(Promise.resolve({ country: "FR", units: { bg: Units.gram } }));
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
      await initAuthContext();
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
      await initAuthContext();
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
    jest.spyOn(UserApi, "updateProfile").mockResolvedValue(Promise.resolve(updatedProfile));
    jest.spyOn(UserApi, "updatePreferences").mockResolvedValue(Promise.resolve(updatedPreferences));
    jest.spyOn(UserApi, "updateSettings").mockResolvedValue(Promise.resolve(updatedSettings));

    it("updatePreferences should not call the API if the user is not logged in", async () => {
      unAuthenticateUser();
      authApiHcpStubs.updatePreferences.mockResolvedValue(updatedPreferences);
      await initAuthContext();
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
      await initAuthContext();
      expect(authContext.user.preferences).toEqual({ displayLanguageCode: "en" });

      const result = await authContext.updatePreferences({ ...updatedPreferences });
      expect(UserApi.updatePreferences).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedPreferences);
      expect(authContext.user.preferences).toEqual(updatedPreferences);
    });

    it("updateProfile should not call the API if the user is not logged in", async () => {
      unAuthenticateUser();
      authApiHcpStubs.updateProfile.mockResolvedValue(updatedProfile);
      await initAuthContext();
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
      await initAuthContext();
      expect(authContext.user.profile).toEqual(loggedInUsers.hcp.profile);

      const result = await authContext.updateProfile({ ...updatedProfile });
      expect(UserApi.updateProfile).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedProfile);
      expect(authContext.user.profile).toEqual(updatedProfile);
    });

    it("updateSettings should not call the API if the user is not logged in", async () => {
      unAuthenticateUser();
      authApiHcpStubs.updateSettings.mockResolvedValue(updatedSettings);
      await initAuthContext();
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
      await initAuthContext();
      expect(authContext.user.settings).toEqual(loggedInUsers.hcp.settings);

      const result = await authContext.updateSettings({ ...updatedSettings });
      expect(UserApi.updateSettings).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedSettings);
      expect(authContext.user.settings).toEqual(updatedSettings);
    });

    it("updatePassword should not call the API if the user is not logged in", async () => {
      unAuthenticateUser();
      authApiHcpStubs.updateUser.mockResolvedValue();
      await initAuthContext();
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

    it.skip("updatePassword should call the API with the good parameters", async () => {
      authApiHcpStubs.updateUser.mockResolvedValue();
      await initAuthContext();
      expect(authContext.user.settings).toEqual(loggedInUsers.hcp.settings);

      await authContext.updatePassword("abcd", "1234");
      expect(authApiHcpStubs.updateUser).toHaveBeenCalledTimes(1);
    });

    it("switchRoleToHCP should not call updateProfile if updateUser failed", async () => {
      jest.spyOn(UserApi, "updateProfile").mockRejectedValue(_.noop);
      await initAuthContext();
      let error: Error | null = null;
      try {
        await authContext.switchRoleToHCP(false, HcpProfession.diabeto);
      } catch (reason) {
        error = reason;
      }
      expect(error).toBeInstanceOf(Function);
      expect(UserApi.updateProfile).toHaveBeenCalledTimes(1);
      expect(authApiCaregiverStubs.updateProfile).toHaveBeenCalledTimes(0);
    });

    it("switchRoleToHCP should call updateProfile after updateUser", async () => {
      jest.spyOn(UserApi, "updateProfile").mockResolvedValue({} as Profile);
      const now = Date.now();
      await initAuthContext();

      const user: User = { ...authContext.user };
      user.role = UserRoles.hcp;
      await act(async () => authContext.switchRoleToHCP(false, HcpProfession.diabeto));
      const updatedUser: User = authContext.user;

      expect(UserApi.updateProfile).toHaveBeenCalledTimes(1);
      expect(updatedUser.profile.termsOfUse.isAccepted).toBe(true);
      expect(updatedUser.profile.privacyPolicy.isAccepted).toBe(true);
      expect(Date.parse(updatedUser.profile.termsOfUse.acceptanceTimestamp)).toBeGreaterThan(now);
      expect(Date.parse(updatedUser.profile.privacyPolicy.acceptanceTimestamp)).toBeGreaterThan(now);
      expect(updatedUser.role).toBe(UserRoles.hcp);
    });

    it("switchRoleToHCP should succeed (accept feedback)", async () => {
      const now = new Date();
      await initAuthContext();
      const updateProfileSpy = jest.spyOn(UserApi, "updateProfile").mockResolvedValue(Promise.resolve(updatedProfile));

      await authContext.switchRoleToHCP(true, HcpProfession.diabeto);

      expect(UserApi.updateProfile).toHaveBeenCalledTimes(1);
      const profile = updateProfileSpy.mock.calls[0][1];
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
    });

    it("switchRoleToHCP should succeed (decline feedback)", async () => {
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
      await initAuthContext();

      await act(async () => authContext.switchRoleToHCP(false, HcpProfession.diabeto));

      expect(UserApi.updateProfile).toHaveBeenCalledTimes(1);
      expect(Date.parse(authContext.user.profile.termsOfUse.acceptanceTimestamp)).toBeGreaterThanOrEqual(now.valueOf());
      expect(Date.parse(authContext.user.profile.privacyPolicy.acceptanceTimestamp)).toBeGreaterThanOrEqual(now.valueOf());
      expect(Date.parse(authContext.user.profile.contactConsent.acceptanceTimestamp)).toBeGreaterThanOrEqual(now.valueOf());
      expect(authContext.user.profile.termsOfUse.isAccepted).toBe(true);
      expect(authContext.user.profile.privacyPolicy.isAccepted).toBe(true);
      expect(authContext.user.profile.contactConsent.isAccepted).toBe(false);
      expect(authContext.user.role).toBe(UserRoles.hcp);
    });
  });

  describe("Flag patient", () => {
    it("should flag a un-flagged patient", async () => {
      const userId = uuidv4();
      jest.spyOn(UserApi, "updatePreferences").mockResolvedValue({ patientsStarred: [userId] });
      delete authHcp.user.preferences;
      await initAuthContext();
      await act(async () => {
        await authContext.flagPatient(userId);
      });
      expect(UserApi.updatePreferences).toHaveBeenCalledTimes(1);
      expect(authContext.user.preferences.patientsStarred).toEqual([userId]);
    });
    it("should un-flag a flagged patient", async () => {
      const userId = uuidv4();
      const otherUserId = uuidv4();
      authHcp.user.preferences = { patientsStarred: [userId, otherUserId] };
      jest.spyOn(UserApi, "updatePreferences").mockResolvedValue({ patientsStarred: [otherUserId] });
      await initAuthContext();
      await act(async () => {
        await authContext.flagPatient(userId);
      });
      expect(UserApi.updatePreferences).toHaveBeenCalledTimes(1);
      expect(authContext.user.preferences.patientsStarred).toEqual([otherUserId]);
    });

    it("should add another user to an existing list", async () => {
      const userId1 = uuidv4();
      const userId2 = uuidv4();
      jest.spyOn(UserApi, "updatePreferences").mockResolvedValueOnce({ patientsStarred: [userId1] });
      jest.spyOn(UserApi, "updatePreferences").mockResolvedValueOnce({ patientsStarred: [userId1, userId2] });
      await initAuthContext();
      expect(authContext.getFlagPatients()).toEqual([]);


      await act(async () => {
        await authContext.flagPatient(userId1);
      });
      expect(UserApi.updatePreferences).toHaveBeenCalledTimes(1);


      await act(async () => {
        await authContext.flagPatient(userId2);
      });
      expect(UserApi.updatePreferences).toHaveBeenCalledTimes(2);
      expect(authContext.getFlagPatients()).toEqual([userId1, userId2]);
    });

    it("setFlagPatients should replace the currently flagged patient", async () => {
      const userId = "0123456789";
      jest.spyOn(UserApi, "updatePreferences").mockResolvedValueOnce({
        displayLanguageCode: "fr",
        patientsStarred: [userId],
      });
      authHcp.user.preferences.patientsStarred = ["old"];
      jest.spyOn(UserApi, "getPreferences").mockResolvedValue(Promise.resolve({
        displayLanguageCode: "en",
        patientsStarred: ["old"],
      }));
      await initAuthContext();
      expect(authContext.getFlagPatients()).toEqual(["old"]);
      await authContext.setFlagPatients([userId]);
      const after = authContext.getFlagPatients();
      expect(UserApi.updatePreferences).toHaveBeenCalledTimes(1);
      expect(after).toEqual([userId]);
    });
  });
});

