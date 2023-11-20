/*
 * Copyright (c) 2021-2023, Diabeloop
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
  type FunctionComponent,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState
} from 'react'

import { useAuth0 } from '@auth0/auth0-react'
import { type HcpProfession } from './models/enums/hcp-profession.enum'
import User from './models/user.model'
import UserApi from './user.api'
import { type AuthContext } from './models/auth-context.model'
import { type Preferences } from './models/preferences.model'
import { type Profile } from './models/profile.model'
import { type Settings } from './models/settings.model'
import { UserRole } from './models/enums/user-role.enum'
import { type ChangeUserRoleToHcpPayload } from './models/change-user-role-to-hcp-payload.model'
import { useRevalidator, useRouteLoaderData } from 'react-router-dom'
import { useIdleTimer } from 'react-idle-timer'
import { ConfigService } from '../config/config.service'
import { useLogout } from './logout.hook'
import HttpService from '../http/http.service'

const ReactAuthContext = createContext({} as AuthContext)

export function AuthContextImpl(): AuthContext {
  const {
    isAuthenticated,
    getAccessTokenWithPopup
  } = useAuth0()
  const logout = useLogout()
  const user = useRouteLoaderData('user-route') as User

  const { revalidate } = useRevalidator()

  const isLoggedIn = useMemo<boolean>(() => isAuthenticated && !!user, [isAuthenticated, user])

  const onIdle = async (): Promise<void> => {
    if (isLoggedIn) {
      await logout(true)
    }
  }

  useIdleTimer({ timeout: ConfigService.getIdleTimeout(), onIdle })

  const getUser = (): User => {
    if (!user) {
      throw Error('user not logged in')
    }
    return user
  }

  const refreshUser = async (): Promise<void> => {
    await HttpService.removeCache()
    revalidate()
  }

  const updatePreferences = async (preferences: Preferences): Promise<void> => {
    const user = getUser()
    user.preferences = await UserApi.updatePreferences(user.id, preferences)
    await refreshUser()
  }

  const updateProfile = async (profile: Profile): Promise<void> => {
    const user = getUser()
    user.profile = await UserApi.updateProfile(user.id, profile)
    await refreshUser()
  }

  const updateSettings = async (settings: Settings): Promise<void> => {
    const user = getUser()
    user.settings = await UserApi.updateSettings(user.id, settings)
    await refreshUser()
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
    await refreshUser()
  }

  const setFlagPatients = async (userIds: string[]): Promise<void> => {
    const user = getUser()
    if (!user.preferences) {
      user.preferences = {}
    }
    user.preferences.patientsStarred = userIds
    user.preferences = await UserApi.updatePreferences(user.id, user.preferences)
    await refreshUser()
  }

  const getFlagPatients = (): string[] => {
    return user?.preferences?.patientsStarred ?? []
  }

  const switchRoleToHCP = async (feedbackConsent: boolean, hcpProfession: HcpProfession): Promise<void> => {
    const user = getUser()
    const now = new Date().toISOString()
    const payload: ChangeUserRoleToHcpPayload = {
      termsOfUse: { acceptanceTimestamp: now, isAccepted: true },
      privacyPolicy: { acceptanceTimestamp: now, isAccepted: true },
      contactConsent: { acceptanceTimestamp: now, isAccepted: feedbackConsent },
      hcpProfession
    }

    await UserApi.changeUserRoleToHcp(user.id, payload)
    await refreshToken() // Refreshing access token to get the new role in it

    user.role = UserRole.Hcp
    user.profile = { ...user.profile, ...payload }
    await refreshUser()
  }

  const refreshToken = async (): Promise<void> => {
    await getAccessTokenWithPopup({ authorizationParams: { ignoreCache: true } })
  }

  return {
    user,
    isLoggedIn,
    updateProfile,
    updatePreferences,
    updateSettings,
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
