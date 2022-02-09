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

import React from "react";
import bows from "bows";
import _ from "lodash";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { v4 as uuidv4, validate as validateUuid } from "uuid";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { HistoryState } from "../../models/generic";
import { Profile, Preferences, Settings, UserRoles, IUser } from "../../models/shoreline";
import { HcpProfession } from "../../models/hcp-profession";
import { defer, fixYLP878Settings, numberPrecision } from "../utils";
import { availableLanguageCodes, getCurrentLang, changeLanguage } from "../language";
import metrics from "../metrics";
import { zendeskLogin, zendeskLogout } from "../zendesk";
import User from "./user";
import { Session, AuthAPI, AuthContext, AuthProvider, SignupUser } from "./models";
import AuthAPIImpl from "./api";

interface JwtShorelinePayload extends JwtPayload {
  role: "hcp" | "patient" | "caregiver" | "clinic";
  /** username: an e-mail */
  name: string;
  email: string;
  /** userid */
  usr: string;
  /** yes for server token - we will never have that in Blip: always "no" */
  srv: "yes" | "no";
}

export const STORAGE_KEY_SESSION_TOKEN = "session-token";
export const STORAGE_KEY_TRACE_TOKEN = "trace-token";
export const STORAGE_KEY_USER = "logged-in-user";

const ReactAuthContext = React.createContext({} as AuthContext);
const log = bows("AuthHook");
let firstLoadingDone = false;

const warnNoValidateUUID = _.once(() => log.warn("validateUuid function is not available"));
const validateUuidV4 = (value: string): boolean => {
  // FIXME validateUuid is sometime not present
  // because we have some SOUP which depends on an old deprecated uuid version (v3)
  // and the build seems to choose from one or another...
  if (_.isFunction(validateUuid)) {
    return validateUuid(value);
  }
  warnNoValidateUUID();
  return true;
};

const updateLanguageForUser = (user: User) => {
  const userLanguage = user.preferences?.displayLanguageCode;
  if (typeof userLanguage === "string" && availableLanguageCodes.includes(userLanguage) && userLanguage !== getCurrentLang()) {
    log.info("Update language to user preferences", { userLanguage, currentLanguage: getCurrentLang() });
    // Update the current UI language based on the user preferences
    changeLanguage(userLanguage);
  }
};

/**
 * Provider hook that creates auth object and handles state
 */
export function AuthContextImpl(api: AuthAPI): AuthContext {
  const historyHook = useHistory<HistoryState>();
  const { t } = useTranslation("yourloops");
  // Trace token is used to trace the calls betweens different microservices API calls for debug purpose.
  const [traceToken, setTraceToken] = React.useState<string | null>(null);
  // JWT token as a string.
  const [sessionToken, setSessionToken] = React.useState<string | null>(null);
  // Current authenticated user
  const [user, setUserPrivate] = React.useState<User | null>(null);
  const [isAuthInProgress, setAuthInProgress] = React.useState<boolean>(false);

  // Get the current location path, needed to redirect on refresh the page
  const pathname = historyHook.location.pathname;
  const isAuthHookInitialized = traceToken !== null;
  const isLoggedIn = sessionToken !== null && traceToken !== null && user !== null;
  const session = React.useCallback(
    (): Session | null => sessionToken !== null && traceToken !== null && user !== null ? { sessionToken, traceToken, user } : null,
    [sessionToken, traceToken, user]
  );

  const getAuthInfos = (): Promise<Session> => {
    const s = session();
    if (s !== null) {
      return Promise.resolve(s);
    }
    return Promise.reject(new Error(t("not-logged-in")));
  };

  /**
   * Update hook users infos, perform zendesk & matomo login
   * @param session sessionToken
   * @param trace traceToken
   * @param usr user
   */
  const setAuthInfos = React.useCallback((session: string, trace: string, usr: User): void => {
    updateLanguageForUser(usr);
    setUserPrivate(usr);
    if (session !== sessionToken) {
      setSessionToken(session);
    }
    if (trace !== traceToken) {
      setTraceToken(trace);
    }
    zendeskLogin();
    metrics.setUser(usr);
  }, [sessionToken, traceToken]);

  /**
   * - Update the hook user (no API call is performed with this function)
   * - Update the storage
   * @param u The user
   */
  const setUser = (u: User): void => {
    setUserPrivate(u);
    sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(u.toJSON()));
  };

  const loginPrivate = async (username: string, password: string, key: string | null): Promise<User> => {
    if (!isAuthHookInitialized) {
      throw new Error("not-yet-initialized");
    }

    if (key !== null) {
      await api.accountConfirmed(key, traceToken);
    }

    const auth = await api.login(username, password, traceToken);
    const tokenInfos = jwtDecode<JwtShorelinePayload>(auth.sessionToken);
    if (!_.isString(tokenInfos.role)) {
      // old API support
      let role = _.get(auth.user, "roles[0]", UserRoles.patient);
      if (role === "clinic") {
        role = UserRoles.caregiver;
      }
      auth.user.role = role;
      log.warn("User as a clinic role");
    } else if (tokenInfos.role === "clinic") {
      // TODO After BDD migration this check will be useless
      auth.user.role = UserRoles.caregiver;
    } else {
      auth.user.role = tokenInfos.role as UserRoles;
    }

    auth.user.settings = fixYLP878Settings(auth.user.settings);

    const expirationDate = tokenInfos.exp;
    if (typeof expirationDate === "number" && Number.isSafeInteger(expirationDate)) {
      log.info("Authenticated until ", new Date(expirationDate * 1000).toISOString());
    }

    sessionStorage.setItem(STORAGE_KEY_SESSION_TOKEN, auth.sessionToken);
    sessionStorage.setItem(STORAGE_KEY_TRACE_TOKEN, auth.traceToken);
    sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(auth.user.toJSON()));

    setAuthInfos(auth.sessionToken, auth.traceToken, auth.user);
    return auth.user;
  };

  const login = (username: string, password: string, key: string | null): Promise<User> => {
    log.info("login", username);
    setAuthInProgress(true);
    return loginPrivate(username, password, key).finally(() => {
      setAuthInProgress(false);
      log.info("login done");
    });
  };

  const updatePreferences = async (preferences: Preferences, refresh = true): Promise<Preferences> => {
    const authInfo = await getAuthInfos();
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
    const authInfo = await getAuthInfos();
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
    const authInfo = await getAuthInfos();
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
    const authInfo = await getAuthInfos();
    if (authInfo.user.role === UserRoles.patient) {
      throw new Error("invalid-user-role");
    }

    return api.updateUser(authInfo, { currentPassword, password });
  };

  const signup = async (signup: SignupUser): Promise<void> => {
    log.info("signup", signup.accountUsername);
    const now = new Date().toISOString();
    if (traceToken === null) {
      throw new Error("not-yet-initialized");
    }
    const auth = await api.signup(
      signup.accountUsername,
      signup.accountPassword,
      signup.accountRole,
      traceToken
    );

    auth.user.profile = {
      fullName: `${signup.profileFirstname} ${signup.profileLastname}`,
      firstName: signup.profileFirstname,
      lastName: signup.profileLastname,
      termsOfUse: { acceptanceTimestamp: now, isAccepted: signup.terms },
      privacyPolicy: { acceptanceTimestamp: now, isAccepted: signup.privacyPolicy },
      contactConsent: { acceptanceTimestamp: now, isAccepted: signup.feedback },
      hcpProfession: signup.hcpProfession,
    };
    auth.user.settings = { country: signup.profileCountry };
    auth.user.preferences = { displayLanguageCode: signup.preferencesLanguage };

    // Cannot Use Promise.All as Backend do not handle parallel call correctly
    await api.updateProfile(auth);
    await api.updateSettings(auth);
    await api.updatePreferences(auth);

    // send confirmation signup mail
    await api.sendAccountValidation(auth, signup.preferencesLanguage);

    log.info("signup done", auth);
  };

  const resendSignup = (username: string): Promise<boolean> => {
    if (traceToken === null) {
      throw new Error("not-yet-initialized");
    }
    return api.resendSignup(username, traceToken, getCurrentLang());
  };

  const flagPatient = async (userId: string): Promise<void> => {
    log.info("flagPatient", userId);
    const authInfo = await getAuthInfos();
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
    const authInfo = await getAuthInfos();
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

  const logout = async (sessionExpired = false): Promise<void> => {
    log.info("logout", { sessionExpired });
    setAuthInProgress(true);

    try {
      const authInfo = await getAuthInfos();
      await api.logout(authInfo);
    } catch (reason) {
      log.error("logout", reason);
    }

    if (typeof window.cleanBlipReduxStore === "function") {
      window.cleanBlipReduxStore();
    }
    sessionStorage.removeItem(STORAGE_KEY_SESSION_TOKEN);
    sessionStorage.removeItem(STORAGE_KEY_TRACE_TOKEN);
    sessionStorage.removeItem(STORAGE_KEY_USER);
    metrics.resetUser();
    zendeskLogout();

    setUserPrivate(null);
    setSessionToken(null);
    setTraceToken(null);

    // Push the new location (this reset the state.from.pathname value)
    if (sessionExpired && user !== null) {
      const pathname = historyHook.location.pathname;
      historyHook.push(`/?login=${encodeURIComponent(user.username)}&sessionExpired=true`, { from: { pathname } });
    } else {
      historyHook.push("/");
    }
    setAuthInProgress(false);
    log.info("logout done", { sessionExpired });
  };

  /**
   * @returns true if the email was sucessfully sent.
   */
  const sendPasswordResetEmail = (username: string, language: string): Promise<void> => {
    log.info("sendPasswordResetEmail", username);
    if (traceToken === null) {
      throw new Error("not-yet-initialized");
    }
    return api.requestPasswordReset(username, traceToken, language);
  };

  const resetPassword = (key: string, username: string, password: string): Promise<boolean> => {
    if (traceToken === null) {
      throw new Error("not-yet-initialized");
    }
    return api.resetPassword(key, username, password, traceToken);
  };

  const switchRoleToHCP = async (feedbackConsent: boolean, hcpProfession: HcpProfession): Promise<void> => {
    const authInfo = await getAuthInfos();
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
    sessionStorage.setItem(STORAGE_KEY_SESSION_TOKEN, newToken);
    setSessionToken(newToken);
    setUser(updatedUser);
  };

  const initHook = () => {
    if (isAuthInProgress) {
      return;
    }

    // TODO: Do not delete me yet
    // const onStorageChange = (ev: StorageEvent) => {
    //   log.debug("onStorageChange");
    //   if (ev.storageArea === sessionStorage) {
    //     log.info("onStorageChange", ev.storageArea);
    //     // Not sure on this one
    //     window.removeEventListener("storage", onStorageChange);
    //     setInitialized(false);
    //   }
    // };
    // const unmount = () => {
    //   window.removeEventListener("storage", onStorageChange);
    // };

    // Prevent to set two times the trace token, when we have found one in the storage.
    let initializedFromStorage = false;

    // Use traceToken to know if the API hook is initialized
    if (traceToken === null) {
      log.info("Initializing hook from storage");

      const sessionTokenStored = sessionStorage.getItem(STORAGE_KEY_SESSION_TOKEN);
      const traceTokenStored = sessionStorage.getItem(STORAGE_KEY_TRACE_TOKEN);
      const userStored = sessionStorage.getItem(STORAGE_KEY_USER);

      if (sessionTokenStored === null || traceTokenStored === null || userStored === null) {
        // Clear the storage if one is missing at this point
        sessionStorage.removeItem(STORAGE_KEY_SESSION_TOKEN);
        sessionStorage.removeItem(STORAGE_KEY_TRACE_TOKEN);
        sessionStorage.removeItem(STORAGE_KEY_USER);
        zendeskLogout();
      } else {
        try {
          // FIXME check storage items validity
          const jsonUser = JSON.parse(userStored) as IUser;
          const currentUser = new User(jsonUser);

          if (!validateUuidV4(traceTokenStored)) {
            throw new Error("Invalid trace token uuid");
          }
          const decoded = jwtDecode<JwtPayload>(sessionTokenStored);
          if (typeof decoded.exp === "undefined") {
            throw new Error("Invalid session token");
          }
          if (decoded.exp < (Date.now() / 1000)) {
            throw new Error("Session token as expired");
          }

          log.info("Token expiration date:", new Date(decoded.exp * 1000).toISOString());

          initializedFromStorage = true;
          setAuthInfos(sessionTokenStored, traceTokenStored, currentUser);

          if (pathname !== historyHook.location.pathname) {
            log.info("Reused session storage items, and redirect to", pathname);
            historyHook.push(pathname);
          }

        } catch (e) {
          log.warn("Invalid auth in session storage", e);
          sessionStorage.removeItem(STORAGE_KEY_SESSION_TOKEN);
          sessionStorage.removeItem(STORAGE_KEY_TRACE_TOKEN);
          sessionStorage.removeItem(STORAGE_KEY_USER);
        }
      }
      // window.addEventListener("storage", onStorageChange);
    }

    if (traceToken === null && !initializedFromStorage) {
      // Create a trace token since, we do not have one set in
      // the DOM storage
      setTraceToken(uuidv4());
    }

    if (!firstLoadingDone) {
      firstLoadingDone = true;
      defer(() => {
        const startLoadingTime = window.startLoadingTime;
        if (_.isNumber(startLoadingTime) && Number.isFinite(startLoadingTime)) {
          const loadingTime = (Date.now() - startLoadingTime) / 1000;
          metrics.send("performance", "load_time", "initial", numberPrecision(loadingTime));
          delete window.startLoadingTime;
        }
      }, 1);
    }

    // return unmount;
  };

  React.useEffect(initHook, [historyHook, pathname, traceToken, isAuthInProgress, setAuthInfos]);

  // Return the user object and auth methods
  return {
    user,
    sessionToken,
    traceToken,
    isLoggedIn,
    isAuthInProgress,
    isAuthHookInitialized,
    session,
    setUser,
    login,
    updateProfile,
    updatePreferences,
    updateSettings,
    updatePassword,
    logout,
    signup,
    resendSignup,
    sendPasswordResetEmail,
    resetPassword,
    flagPatient,
    setFlagPatients,
    getFlagPatients,
    switchRoleToHCP,
  };
}

// Hook for child components to get the auth object
// and re-render when it changes.
export function useAuth(): AuthContext {
  return React.useContext(ReactAuthContext);
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
