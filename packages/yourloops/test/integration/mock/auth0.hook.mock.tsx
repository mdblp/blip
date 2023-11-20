/*
 * Copyright (c) 2022-2023, Diabeloop
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

import * as auth0Mock from '@auth0/auth0-react'
import { UserRole } from '../../../lib/auth/models/enums/user-role.enum'
import { AuthenticatedUserMetadata } from '../../../lib/auth/models/enums/authenticated-user-metadata.enum'
import { Auth0ContextInterface } from '@auth0/auth0-react/src/auth0-context'
import React, { createContext, useContext, useState } from 'react'
import { AuthSynchronizer } from '../../../router/auth-synchronizer'
import * as MockRouterRoot from '../../../router/root'
import AuthService from '../../../lib/auth/auth.service'

export const loggedInUserId = 'loggedInUserId'
export const loggedInUserEmail = 'yann.blanc@example.com'
export const loggedInUserFirstName = 'Yann'
export const loggedInUserLastName = 'Blanc'
export const loggedInUserFullName = `${loggedInUserFirstName} ${loggedInUserLastName}`
export const userTimId = 'userTimId'
export const userTimEmail = 'tim.canu@example.com'
export const userTimFirstName = 'Tim'
export const userTimLastName = 'Canu'
export const userTimFullName = `${userTimFirstName} ${userTimLastName}`
export const userHugoId = 'userHugoId'
export const userHugoEmail = 'hugo.rodrigues@example.com'
export const userHugoFirstName = 'Hugo'
export const userHugoLastName = 'Rodrigues'
export const userHugoFullName = `${userHugoFirstName} ${userHugoLastName}`
export const userYdrisId = 'userYdrisId'
export const userYdrisEmail = 'ydris.rebibane@example.com'
export const userYdrisFirstName = 'Ydris'
export const userYdrisLastName = 'Rebibane'
export const userYdrisFullName = `${userYdrisFirstName} ${userYdrisLastName}`
export const getAccessTokenWithPopupMock = jest.fn()
export const getAccessTokenSilentlyMock = jest.fn().mockRejectedValue(new Error('This error is thrown on purpose to simulate a non logged user'))
export const logoutMock = jest.fn()
export const loginWithRedirectMock = jest.fn()

interface MockAuth0ContextProviderProps {
  role: UserRole,
  userId: string,
  children: React.ReactNode
}

interface MockAuth0ContextProviderUnloggedProps {
  error?: Error
  children: React.ReactNode
}

const MockAuth0Context = createContext<Auth0ContextInterface>({} as Auth0ContextInterface)

const useMockAuth0Hook = (role: UserRole = UserRole.Hcp, userId = loggedInUserId): Auth0ContextInterface => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const getAccessTokenSilently = (): Promise<unknown> => {
    setIsAuthenticated(true)
    setIsLoading(false)
    return Promise.resolve(null)
  }

  return {
    getIdTokenClaims: jest.fn(),
    handleRedirectCallback: jest.fn(),
    loginWithPopup: jest.fn(),
    loginWithRedirect: jest.fn(),
    isAuthenticated,
    isLoading,
    user: {
      email: loggedInUserEmail,
      email_verified: true,
      sub: 'auth0|' + userId,
      [AuthenticatedUserMetadata.Roles]: [role]
    },
    getAccessTokenWithPopup: getAccessTokenWithPopupMock,
    logout: logoutMock,
    //@ts-ignore
    getAccessTokenSilently: getAccessTokenSilently
  }
}

const useMockAuth0HookUnlogged = (error: Error = null): Auth0ContextInterface => {
  return {
    error,
    getIdTokenClaims: jest.fn(),
    handleRedirectCallback: jest.fn(),
    loginWithPopup: jest.fn(),
    loginWithRedirect: loginWithRedirectMock,
    isAuthenticated: false,
    isLoading: false,
    user: undefined,
    getAccessTokenWithPopup: getAccessTokenWithPopupMock,
    logout: logoutMock,
    //@ts-ignore
    getAccessTokenSilently: getAccessTokenSilentlyMock
  }
}

const MockAuth0ContextProvider = (props: MockAuth0ContextProviderProps): JSX.Element => {
  const context = useMockAuth0Hook(props.role, props.userId)
  return <MockAuth0Context.Provider value={context}>{props.children}</MockAuth0Context.Provider>
}

const MockAuth0ContextProviderUnlogged = (props: MockAuth0ContextProviderUnloggedProps): JSX.Element => {
  const context = useMockAuth0HookUnlogged(props.error)
  return <MockAuth0Context.Provider value={context}>{props.children}</MockAuth0Context.Provider>
}

const useMockAuth0 = (): Auth0ContextInterface => {
  return useContext(MockAuth0Context)
}

export const mockAuth0Hook = (role: UserRole = UserRole.Hcp, userId = loggedInUserId) => {
  AuthService.setAuthUser(null)
  AuthService.setIsAuthenticated(null);
  (MockRouterRoot.RouterRoot as jest.Mock) = jest.fn().mockImplementation(() => {
    return <MockAuth0ContextProvider
      role={role}
      userId={userId}
    >
      <AuthSynchronizer />
    </MockAuth0ContextProvider>
  });
  (auth0Mock.useAuth0 as jest.Mock).mockImplementation(() => {
    return useMockAuth0()
  });
}

export const mockAuth0HookUnlogged = (error: Error = null) => {
  AuthService.setAuthUser(null)
  AuthService.setIsAuthenticated(null);
  (MockRouterRoot.RouterRoot as jest.Mock) = jest.fn().mockImplementation(() => {
    return <MockAuth0ContextProviderUnlogged error={error}>
      <AuthSynchronizer />
    </MockAuth0ContextProviderUnlogged>
  });
  (auth0Mock.useAuth0 as jest.Mock).mockImplementation(() => {
    return useMockAuth0()
  });
}
