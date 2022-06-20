/**
 * Copyright (c) 2021, Diabeloop
 * Hook for auth API
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

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import bows from "bows";
import _ from "lodash";

import { useAuth0 } from "@auth0/auth0-react";
import { IUser, Preferences, Profile, Settings, UserRoles } from "../../models/shoreline";
import { HcpProfession } from "../../models/hcp-profession";
import { zendeskLogout } from "../zendesk";
import User from "./user";
import {
  AuthContext,
  AuthProvider,
  SignupForm,
} from "./models";
import appConfig from "../config";
import HttpService from "../../services/http";
import UserApi from "./user-api";

const ReactAuthContext = createContext({} as AuthContext);
const log = bows("AuthHook");

export function AuthContextImpl(): AuthContext {
  const { logout: auth0logout, user: auth0user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [user, setUser] = useState<User | null>(null);
  const [fetchingUser, setFetchingUser] = useState<boolean>(false);

  const isLoggedIn = useMemo<boolean>(() => isAuthenticated && !!user, [isAuthenticated, user]);

  const getUser = (): User => {
    if (!user) {
      throw Error("user not logged in");
    }
    return user;
  };

  const updatePreferences = async (preferences: Preferences, refresh = true): Promise<Preferences> => {
    log.info("updatePreferences", getUser().userid);
    const updatedUser = new User(getUser());
    updatedUser.preferences = preferences;
    const updatedPreferences = await UserApi.updatePreferences(getUser().userid, preferences);
    if (refresh) {
      updatedUser.preferences = updatedPreferences;
      setUser(updatedUser);
    }
    return updatedPreferences;
  };

  const updateProfile = async (profile: Profile, refresh = true): Promise<Profile> => {
    log.info("updateProfile", getUser().userid);
    const updatedUser = new User(getUser());
    updatedUser.profile = profile;
    const updatedProfile = await UserApi.updateProfile(getUser().userid, profile);
    if (refresh) {
      updatedUser.profile = updatedProfile;
      setUser(updatedUser);
    }
    return updatedProfile;
  };

  const updateSettings = async (settings: Settings, refresh = true): Promise<Settings> => {
    log.info("updateSettings", getUser().userid);
    const updatedUser = new User(getUser());
    updatedUser.settings = settings;
    const updatedSettings = await UserApi.updateSettings(getUser().userid, settings);
    if (refresh) {
      updatedUser.settings = updatedSettings;
      setUser(updatedUser);
    }
    return settings;
  };

  const flagPatient = async (userId: string): Promise<void> => {
    log.info("flagPatient", userId);

    const updatedUser = new User(getUser());
    if (!updatedUser.preferences) {
      updatedUser.preferences = {};
    }
    if (!Array.isArray(updatedUser.preferences.patientsStarred)) {
      updatedUser.preferences.patientsStarred = [userId];
    } else if (updatedUser.preferences.patientsStarred.includes(userId)) {
      const patientsStarred = updatedUser.preferences.patientsStarred.filter((id: string) => id !== userId);
      updatedUser.preferences.patientsStarred = patientsStarred;
    } else {
      updatedUser.preferences.patientsStarred.push(userId);
    }
    updatedUser.preferences = await UserApi.updatePreferences(getUser().userid, updatedUser.preferences);
    setUser(updatedUser);
  };

  const setFlagPatients = async (userIds: string[]): Promise<void> => {
    log.info("setFlagPatients", userIds);
    const updatedUser = new User(getUser());
    if (!updatedUser.preferences) {
      updatedUser.preferences = {};
    }
    updatedUser.preferences.patientsStarred = userIds;
    updatedUser.preferences = await UserApi.updatePreferences(getUser().userid, updatedUser.preferences);
    setUser(updatedUser);
  };

  const getFlagPatients = (): string[] => {
    const flagged = user?.preferences?.patientsStarred;
    if (Array.isArray(flagged)) {
      return Array.from(flagged);
    }
    return [];
  };

  const switchRoleToHCP = async (feedbackConsent: boolean, hcpProfession: HcpProfession): Promise<void> => {

    if (getUser().role !== UserRoles.caregiver) {
      throw new Error("invalid-user-role");
    }

    /** TODO role changing was performed with a call to shoreline.
     *   Now it has to be done with Auth0 since role is a part of auth0 user metadata.
     *   see YLP-1590 (https://diabeloop.atlassian.net/browse/YLP-1590)
     **/

    const now = new Date().toISOString();
    const updatedProfile = _.cloneDeep(getUser().profile ?? {}) as Profile;
    updatedProfile.termsOfUse = { acceptanceTimestamp: now, isAccepted: true };
    updatedProfile.privacyPolicy = { acceptanceTimestamp: now, isAccepted: true };
    updatedProfile.contactConsent = { acceptanceTimestamp: now, isAccepted: feedbackConsent };
    updatedProfile.hcpProfession = hcpProfession;
    await updateProfile(updatedProfile, false);
    // Refresh our data:
    const updatedUser = new User(getUser());
    updatedUser.role = UserRoles.hcp;
    updatedUser.profile = updatedProfile;
    setUser(updatedUser);
  };

  const redirectToProfessionalAccountLogin = (): void => window.location.assign(`${appConfig.API_HOST}/auth/oauth/login`);

  const mapAuth0UserToIUser = useMemo<IUser>(() => {
    let user = {};
    if (auth0user && auth0user.sub) {
      const parsedSub = auth0user.sub.split("|");
      const id = parsedSub[1];
      user = {
        role: auth0user["http://your-loops.com/roles"][0],
        userid: id,
        emailVerified: auth0user.email_verified,
        username: auth0user.email,
      };
    }
    return user as IUser;
  }, [auth0user]);

  const getUserInfo = useCallback(async () => {
    try {
      setFetchingUser(true);
      const user = new User(mapAuth0UserToIUser);

      // Temporary here waiting all backend services be compatible with Auth0
      // see https://diabeloop.atlassian.net/browse/YLP-1553
      try {
        const { token, id } = await UserApi.getShorelineAccessToken();
        HttpService.shorelineAccessToken = token;
        user.userid = id;
      } catch (err) {
        console.log(err);
      }

      user.profile = await UserApi.getProfile(user.userid);
      user.preferences = await UserApi.getPreferences(user.userid);
      user.settings = await UserApi.getSettings(user.userid);

      setUser(user);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingUser(false);
    }
  }, [mapAuth0UserToIUser]);

  const logout = async (): Promise<void> => {
    try {
      if (window.cleanBlipReduxStore) {
        window.cleanBlipReduxStore();
      }
      zendeskLogout();
      await auth0logout({ returnTo: window.location.origin });
    } catch (err) {
      log.error("logout", err);
    }
  };

  const completeSignup = async (signupForm: SignupForm): Promise<void> => {
    const now = new Date().toISOString();
    const profile: Profile = {
      fullName: `${signupForm.profileFirstname} ${signupForm.profileLastname}`,
      firstName: signupForm.profileFirstname,
      lastName: signupForm.profileLastname,
      termsOfUse: { acceptanceTimestamp: now, isAccepted: signupForm.terms },
      privacyPolicy: { acceptanceTimestamp: now, isAccepted: signupForm.privacyPolicy },
      contactConsent: { acceptanceTimestamp: now, isAccepted: signupForm.feedback },
      hcpProfession: signupForm.hcpProfession,
    };
    const preferences: Preferences = { displayLanguageCode: signupForm.preferencesLanguage };
    const settings: Settings = { country: signupForm.profileCountry };

    await UserApi.updateProfile(getUser().userid, profile);
    await UserApi.updatePreferences(getUser().userid, preferences);
    await UserApi.updateSettings(getUser().userid, settings);
    getUser().preferences = preferences;
    getUser().profile = profile;
    getUser().settings = settings;
  };

  useEffect(() => {
    (async () => {
      if (isAuthenticated && !user) {
        const getAccessToken = async () => getAccessTokenSilently();
        HttpService.setGetAccessTokenMethod(getAccessToken);
        await getUserInfo();
      }
    })();
  }, [getAccessTokenSilently, getUserInfo, isAuthenticated, user]);

  return {
    user,
    isLoggedIn,
    fetchingUser,
    setUser,
    redirectToProfessionalAccountLogin,
    updateProfile,
    updatePreferences,
    updateSettings,
    logout,
    completeSignup,
    flagPatient,
    setFlagPatients,
    getFlagPatients,
    switchRoleToHCP,
  };
}

// Hook for child components to get the auth object
// and re-render when it changes.
export function useAuth(): AuthContext {
  return useContext(ReactAuthContext);
}

/**
 * Provider component that wraps your app and makes auth object available to any child component that calls useAuth().
 * @param props for auth provider & children
 */
export function AuthContextProvider(props: AuthProvider): JSX.Element {
  const { children, value } = props;
  const authValue = value ?? AuthContextImpl(); // eslint-disable-line new-cap

  return <ReactAuthContext.Provider value={authValue}>{children}</ReactAuthContext.Provider>;
}
