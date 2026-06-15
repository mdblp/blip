/*
 * Copyright (c) 2022-2026, Diabeloop
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
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { renderPage } from '../../utils/render'
import userEvent from '@testing-library/user-event'
import { checkFooterForUserNotLoggedIn } from '../../assert/footer.assert'
import {
  testLoginWithAppState,
  testLoginWithAppStateWithoutPartnerState,
  testLoginWithoutAppState
} from '../../use-cases/login'

jest.mock('@mui/material/useMediaQuery', () => {
  return () => true
})

describe('Login page mobile view', () => {
  const loginWithRedirectMock = jest.fn()
  beforeAll(() => {
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: undefined,
      loginWithRedirect: loginWithRedirectMock
    })
  })

  it('should render entire page with correct elements', async () => {
    const router = renderPage('/')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/login')
    })

    const languageSelector = screen.queryByTestId('language-selector')
    const moreInfoLink = screen.getByRole('link', { name: 'Learn more' })
    const registerButton = screen.getByRole('button', { name: 'Register' })
    const loginButton = screen.getByRole('button', { name: 'Connect' })

    expect(screen.getByAltText('YourLoops brand colors')).toBeVisible()
    expect(screen.getByTestId('page-title')).toHaveTextContent('All you need for efficient data sharing and visualization')
    expect(screen.getByTestId('header-main-logo')).toBeVisible()
    expect(registerButton).toBeVisible()
    expect(loginButton).toBeVisible()
    expect(languageSelector).toBeVisible()

    checkFooterForUserNotLoggedIn(false)

    // More info link should disappear if language is french
    fireEvent.mouseDown(within(languageSelector).getByRole('combobox', { hidden: true }))
    await userEvent.click(screen.getByText('Français'))
    expect(moreInfoLink).not.toBeVisible()

    await userEvent.click(loginButton)
    expect(loginWithRedirectMock).toHaveBeenCalled()
  })

  it('should login immediately and pass app state to Auth0 if there are query parameters', async () => {
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: undefined,
      loginWithRedirect: loginWithRedirectMock
    })

    renderPage('/login?partnerId=partnerId&callbackUrl=https://fake-url.com&state=isFromYourLoops')

    await testLoginWithAppState(loginWithRedirectMock)
  })

  it('should login immediately and should not pass partner state if it is not defined', async () => {
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: undefined,
      loginWithRedirect: loginWithRedirectMock
    })

    renderPage('/login?partnerId=partnerId&callbackUrl=https://fake-url.com')

    await testLoginWithAppStateWithoutPartnerState(loginWithRedirectMock)
  })

  it('should not login immediately if query parameters are wrong', async () => {
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: undefined,
      loginWithRedirect: loginWithRedirectMock
    })

    renderPage('/login?test=test')

    await testLoginWithoutAppState(loginWithRedirectMock)
  })
})
