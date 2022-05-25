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
import jwtDecode from "jwt-decode";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";

import { useAuth0 } from "@auth0/auth0-react";
import { IUser, Preferences, Profile, Settings, UserRoles } from "../../models/shoreline";
import { HcpProfession } from "../../models/hcp-profession";
import { zendeskLogout } from "../zendesk";
import User from "./user";
import {
  AuthAPI,
  AuthContext,
  AuthProvider,
  JwtShorelinePayload,
  Session,
  SignupForm,
} from "./models";
import AuthAPIImpl from "./api";
import appConfig from "../config";
import HttpService from "../../services/http";
import UserApi from "./user-api";

const ReactAuthContext = createContext({} as AuthContext);
const log = bows("AuthHook");

export function AuthContextImpl(api: AuthAPI): AuthContext {
  const { logout: auth0logout, user: auth0user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { t } = useTranslation("yourloops");
  const [traceToken, setTraceToken] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [fetchingUser, setFetchingUser] = useState<boolean>(false);

  const isLoggedIn = useMemo<boolean>(() => isAuthenticated && !!user, [isAuthenticated, user]);
  const session = useCallback(
    (): Session | null => sessionToken && traceToken && user ? { sessionToken, traceToken, user } : null,
    [sessionToken, traceToken, user]
  );

  const getAuthInfos = (): Session => {
    const s = session();
    if (s) {
      return s;
    }
    throw Error(t("not-logged-in"));
  };

  const updatePreferences = async (preferences: Preferences, refresh = true): Promise<Preferences> => {
    const authInfo = getAuthInfos();
    log.info("updatePreferences", authInfo.user.userid);
    const updatedUser = new User(authInfo.user);
    updatedUser.preferences = preferences;
    const updatedPreferences = await api.updatePreferences({ ...authInfo, user: updatedUser });
    if (refresh) {
      updatedUser.preferences = updatedPreferences;
      setUser(updatedUser);
    }
    return updatedPreferences;
  };

  const updateProfile = async (profile: Profile, refresh = true): Promise<Profile> => {
    const authInfo = getAuthInfos();
    log.info("updateProfile", authInfo.user.userid);
    const updatedUser = new User(authInfo.user);
    updatedUser.profile = profile;
    const updatedProfile = await api.updateProfile({ ...authInfo, user: updatedUser });
    if (refresh) {
      updatedUser.profile = updatedProfile;
      setUser(updatedUser);
    }
    return updatedProfile;
  };

  const updateSettings = async (settings: Settings, refresh = true): Promise<Settings> => {
    const authInfo = getAuthInfos();
    log.info("updateSettings", authInfo.user.userid);
    const updatedUser = new User(authInfo.user);
    updatedUser.settings = settings;
    const updatedSettings = await api.updateSettings({ ...authInfo, user: updatedUser });
    if (refresh) {
      updatedUser.settings = updatedSettings;
      setUser(updatedUser);
    }
    return settings;
  };

  const updatePassword = async (currentPassword: string, password: string): Promise<void> => {
    const authInfo = getAuthInfos();
    if (authInfo.user.isUserPatient()) {
      throw new Error("invalid-user-role");
    }

    return api.updateUser(authInfo, { currentPassword, password });
  };

  const flagPatient = async (userId: string): Promise<void> => {
    log.info("flagPatient", userId);
    const authInfo = getAuthInfos();
    const updatedUser = new User(authInfo.user);
    if (_.isNil(updatedUser.preferences)) {
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
    updatedUser.preferences = await api.updatePreferences({ ...authInfo, user: updatedUser });
    setUser(updatedUser);
  };

  const setFlagPatients = async (userIds: string[]): Promise<void> => {
    log.info("setFlagPatients", userIds);
    const authInfo = getAuthInfos();
    const updatedUser = new User(authInfo.user);
    if (_.isNil(updatedUser.preferences)) {
      updatedUser.preferences = {};
    }
    updatedUser.preferences.patientsStarred = userIds;
    updatedUser.preferences = await api.updatePreferences({ ...authInfo, user: updatedUser });
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
    const authInfo = getAuthInfos();
    if (authInfo.user.role !== UserRoles.caregiver) {
      throw new Error("invalid-user-role");
    }

    // Call first Update user as it is the most important call
    // if it failed, for now we don't have compensation transaction that revert db change
    await api.updateUser(authInfo, { roles: [UserRoles.hcp] });

    const now = new Date().toISOString();
    const updatedProfile = _.cloneDeep(authInfo.user.profile ?? {}) as Profile;
    updatedProfile.termsOfUse = { acceptanceTimestamp: now, isAccepted: true };
    updatedProfile.privacyPolicy = { acceptanceTimestamp: now, isAccepted: true };
    updatedProfile.contactConsent = { acceptanceTimestamp: now, isAccepted: feedbackConsent };
    updatedProfile.hcpProfession = hcpProfession;
    const profile = await updateProfile(updatedProfile, false);

    // Ask for a new token with the updated role
    const newToken = await api.refreshToken(authInfo);
    const tokenInfos = jwtDecode<JwtShorelinePayload>(newToken);
    // Check we have the new role
    if (tokenInfos.role !== UserRoles.hcp) {
      throw new Error("Role change is not effective");
    }
    // Refresh our data:
    const updatedUser = new User(authInfo.user);
    updatedUser.role = UserRoles.hcp;
    updatedUser.profile = profile;
    setSessionToken(newToken);
    setUser(updatedUser);
  };

  const certifyProfessionalAccount = async (): Promise<void> => {
    if (!user) {
      throw Error("User not logged in");
    }
    const { frProId } = await api.certifyProfessionalAccount();
    user.frProId = frProId;
    setUser(user);
  };

  const redirectToProfessionalAccountLogin = (): void => window.location.assign(`${appConfig.API_HOST}/auth/oauth/login`);

  /*******************************************************/
  /****** AUTH 0 HACK FOR LOGIN/LOGOUT AND SIGNUP *******/
  /*****************************************************/

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
      if (auth0user) {
        setFetchingUser(true);
        const user = new User(mapAuth0UserToIUser);

        // Temporary here waiting all backend services be compatible with Auth0
        // see https://diabeloop.atlassian.net/browse/YLP-1553
        const sessionToken = await UserApi.getShorelineAccessToken(user.username);
        HttpService.shorelineAccessToken = sessionToken;

        user.profile = await UserApi.getProfile(user.userid);
        user.preferences = await UserApi.getPreferences(user.userid);
        user.settings = await UserApi.getSettings(user.userid);

        setUser(user);
        setSessionToken(sessionToken);
        setTraceToken(uuidv4());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingUser(false);
    }
  }, [auth0user, mapAuth0UserToIUser]);

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

    if (user) {
      await UserApi.updateProfile(user?.userid, profile);
      await UserApi.updatePreferences(user?.userid, preferences);
      await UserApi.updateSettings(user?.userid, settings);
      user.preferences = preferences;
      user.profile = profile;
      user.settings = settings;
    }
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
    session,
    fetchingUser,
    setUser,
    certifyProfessionalAccount,
    redirectToProfessionalAccountLogin,
    updateProfile,
    updatePreferences,
    updateSettings,
    updatePassword,
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
  const { children, api, value } = props;
  const authValue = value ?? AuthContextImpl(api ?? AuthAPIImpl); // eslint-disable-line new-cap

  return <ReactAuthContext.Provider value={authValue}>{children}</ReactAuthContext.Provider>;
}
