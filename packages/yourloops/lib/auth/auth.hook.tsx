/*
 * Copyright (c) 2021-2022, Diabeloop
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

import React, {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import bows from 'bows'
import _ from 'lodash'

import { useAuth0 } from '@auth0/auth0-react'
import { HcpProfession } from './models/enums/hcp-profession.enum'
import { zendeskLogout } from '../zendesk'
import User from './models/user.model'
import appConfig from '../config/config'
import HttpService from '../../services/http.service'
import UserApi from './user.api'
import { availableLanguageCodes, changeLanguage, getCurrentLang } from '../language'
import metrics from '../metrics'
import { AuthContext } from './models/auth-context.model'
import { Preferences } from './models/preferences.model'
import { Profile } from './models/profile.model'
import { Settings } from './models/settings.model'
import { UserRoles } from './models/enums/user-roles.enum'
import { AuthenticatedUser } from './models/authenticated-user.model'
import { SignupForm } from './models/signup-form.model'

const ReactAuthContext = createContext({} as AuthContext)
const log = bows('AuthHook')

export function AuthContextImpl(): AuthContext {
  const { logout: auth0logout, user: auth0user, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [user, setUser] = useState<User | null>(null)
  const [fetchingUser, setFetchingUser] = useState<boolean>(false)

  const isLoggedIn = useMemo<boolean>(() => isAuthenticated && !!user, [isAuthenticated, user])

  const getUser = (): User => {
    if (!user) {
      throw Error('user not logged in')
    }
    return user
  }

  const refreshUser = (): void => {
    setUser(_.cloneDeep(user))
  }

  const updatePreferences = async (preferences: Preferences): Promise<void> => {
    const user = getUser()
    user.preferences = await UserApi.updatePreferences(user.id, preferences)
    refreshUser()
  }

  const updateProfile = async (profile: Profile): Promise<void> => {
    const user = getUser()
    user.profile = await UserApi.updateProfile(user.id, profile)
    refreshUser()
  }

  const updateSettings = async (settings: Settings): Promise<void> => {
    const user = getUser()
    user.settings = await UserApi.updateSettings(user.id, settings)
    refreshUser()
  }

  const flagPatient = async (userId: string): Promise<void> => {
    const user = getUser()

    if (!user.preferences) {
      user.preferences = {}
    }

    const flaggedPatients = user.preferences?.patientsStarred
    if (flaggedPatients) {
      if (flaggedPatients.includes(userId)) {
        user.preferences.patientsStarred = flaggedPatients.filter((id: string) => id !== userId)
      } else {
        user.preferences.patientsStarred?.push(userId)
      }
    } else {
      user.preferences.patientsStarred = [userId]
    }

    user.preferences = await UserApi.updatePreferences(user.id, user.preferences)
    refreshUser()
  }

  const setFlagPatients = async (userIds: string[]): Promise<void> => {
    const user = getUser()
    if (!user.preferences) {
      user.preferences = {}
    }
    user.preferences.patientsStarred = userIds
    user.preferences = await UserApi.updatePreferences(user.id, user.preferences)
    refreshUser()
  }

  const getFlagPatients = (): string[] => {
    return user?.preferences?.patientsStarred ?? []
  }

  const switchRoleToHCP = async (feedbackConsent: boolean, hcpProfession: HcpProfession): Promise<void> => {
    const user = getUser()
    const now = new Date().toISOString()
    const payload: ChangeUserRolePayload = {
      role: UserRoles.hcp,
      profile: {
        termsOfUse: { acceptanceTimestamp: now, isAccepted: true },
        privacyPolicy: { acceptanceTimestamp: now, isAccepted: true },
        contactConsent: { acceptanceTimestamp: now, isAccepted: feedbackConsent },
        hcpProfession
      }
    }

    await UserApi.changeUserRoleToHcp(user.id, payload)

    user.role = UserRoles.hcp
    user.profile = { ...user.profile, ...payload.profile }
    refreshUser()
  }

  const redirectToProfessionalAccountLogin = (): void => window.location.assign(`${appConfig.API_HOST}/auth/oauth/login`)

  const updateUserLanguage = (user: User): void => {
    const languageCode = user.preferences?.displayLanguageCode
    if (languageCode && availableLanguageCodes.includes(languageCode) && languageCode !== getCurrentLang()) {
      changeLanguage(languageCode)
    }
  }

  const getUserInfo = useCallback(async () => {
    try {
      setFetchingUser(true)
      const user = new User(auth0user as AuthenticatedUser)

      if (user.role !== UserRoles.unset) {
        const userMetadata = await UserApi.getUserMetadata(user.id)
        if (userMetadata) {
          user.profile = userMetadata.profile
          user.preferences = userMetadata.preferences
          user.settings = userMetadata.settings
        }
        updateUserLanguage(user)
        metrics.setUser(user)
      }

      setUser(user)
    } catch (err) {
      console.error(err)
    } finally {
      setFetchingUser(false)
    }
  }, [auth0user])

  const logout = async (): Promise<void> => {
    try {
      if (window.cleanBlipReduxStore) {
        window.cleanBlipReduxStore()
      }
      zendeskLogout()
      await auth0logout({ returnTo: window.location.origin })
      metrics.resetUser()
    } catch (err) {
      log.error('logout', err)
    }
  }

  const completeSignup = async (signupForm: SignupForm): Promise<void> => {
    const now = new Date().toISOString()
    const profile: Profile = {
      email: auth0user.email,
      fullName: `${signupForm.profileFirstname} ${signupForm.profileLastname}`,
      firstName: signupForm.profileFirstname,
      lastName: signupForm.profileLastname,
      termsOfUse: { acceptanceTimestamp: now, isAccepted: signupForm.terms },
      privacyPolicy: { acceptanceTimestamp: now, isAccepted: signupForm.privacyPolicy }
    }
    if (signupForm.accountRole === UserRoles.hcp) {
      profile.contactConsent = { acceptanceTimestamp: now, isAccepted: signupForm.feedback }
      profile.hcpProfession = signupForm.hcpProfession
    }
    const preferences: Preferences = { displayLanguageCode: signupForm.preferencesLanguage }
    const settings: Settings = { country: signupForm.profileCountry }

    const user = getUser()

    await UserApi.completeUserSignup(user.id, {
      email: auth0user.email,
      role: signupForm.accountRole,
      preferences,
      profile,
      settings
    })

    // Refreshing access token to get the new role in it
    await getAccessTokenSilently({ ignoreCache: true })

    user.role = signupForm.accountRole
    user.preferences = preferences
    user.profile = profile
    user.settings = settings
  }

  useEffect(() => {
    (async () => {
      if (isAuthenticated && !user) {
        const getAccessToken = async (): Promise<string> => await getAccessTokenSilently()
        HttpService.setGetAccessTokenMethod(getAccessToken)
        await getUserInfo()
      }
    })()
  }, [getAccessTokenSilently, getUserInfo, isAuthenticated, user])

  return {
    user,
    isLoggedIn,
    fetchingUser,
    redirectToProfessionalAccountLogin,
    updateProfile,
    updatePreferences,
    updateSettings,
    logout,
    completeSignup,
    flagPatient,
    setFlagPatients,
    getFlagPatients,
    switchRoleToHCP
  }
}

// Hook for child components to get the auth object
// and re-render when it changes.
export function useAuth(): AuthContext {
  return useContext(ReactAuthContext)
}

/**
 * Provider component that wraps your app and makes auth object available to any child component that calls useAuth().
 * @param props for auth provider & children
 */
export const AuthContextProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <ReactAuthContext.Provider value={AuthContextImpl()}>
      {children}
    </ReactAuthContext.Provider>
  )
}
