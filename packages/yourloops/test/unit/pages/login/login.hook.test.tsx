/*
 * Copyright (c) 2024-2026, Diabeloop
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

import { act } from 'react'
import * as router from 'react-router'
import { renderHook } from '@testing-library/react'
import { useLogin } from '../../../../pages/login/login.hook'
import { AppRoute } from '../../../../models/enums/routes.enum'
import * as auth0Mock from '@auth0/auth0-react'

jest.mock('@auth0/auth0-react')

describe('Login hook', () => {
  const useNavigateMock = jest.fn()
  const loginWithRedirectMock = jest.fn()

  beforeAll(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => useNavigateMock);
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      loginWithRedirect: loginWithRedirectMock
    })
  })

  beforeEach(() => {
    loginWithRedirectMock.mockResolvedValue(undefined)
  })

  afterEach(() => {
    loginWithRedirectMock.mockReset()
  })

  describe('redirectToSignupInformation', () => {
    it('should redirect to the Signup Information page', () => {
      const { result } = renderHook(() => useLogin())

      act(() => {
        result.current.redirectToSignupInformation()
      })

      expect(useNavigateMock).toHaveBeenCalledWith(AppRoute.SignupInformation)
    })
  })

  describe ('loginWithState', () => {
    it('should call loginWithRedirect with the appState JSON-encoded', async () => {
      const appState = { showConsent: true, callbackUrl: '/home' }
      const { result } = renderHook(() => useLogin())

      await act(async () => {
        await result.current.loginWithState(appState)
      })

      expect(loginWithRedirectMock).toHaveBeenCalledWith({
        appState: { appStateJSON: encodeURIComponent(JSON.stringify(appState)) }
      })
    })

    it('should preserve nested/complex appState structure', async () => {
      const appState = { showConsent: true, callbackUrl: '/home?foo=bar&baz=1', meta: { step: 2 } }
      const { result } = renderHook(() => useLogin())

      await act(async () => {
        await result.current.loginWithState(appState)
      })

      const [call] = loginWithRedirectMock.mock.calls
      const decoded = JSON.parse(decodeURIComponent(call[0].appState.appStateJSON))
      expect(decoded).toEqual(appState)
    })

    it('should call loginWithRedirect exactly once per invocation', async () => {
      const { result } = renderHook(() => useLogin())

      await act(async () => {
        await result.current.loginWithState({ showConsent: false })
      })

      expect(loginWithRedirectMock).toHaveBeenCalledTimes(1)
    })

    it('should propagate errors thrown by loginWithRedirect', async () => {
      const error = new Error('Auth0 failure')
      loginWithRedirectMock.mockRejectedValue(error)
      const { result } = renderHook(() => useLogin())

      await expect(result.current.loginWithState({ showConsent: true })).rejects.toThrow('Auth0 failure')
    })
  })
})
