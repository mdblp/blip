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
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { renderPage } from '../../utils/render'
import userEvent from '@testing-library/user-event'
import { checkFooterForUserNotLoggedIn } from '../../assert/footer.assert'

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
    expect(screen.getByRole('button', { name: 'Register' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Connect' })).toBeVisible()
    expect(screen.queryByTestId('language-selector')).toBeVisible()

    checkFooterForUserNotLoggedIn(false)

    // More info link should disappear if language is french
    fireEvent.mouseDown(within(languageSelector).getByRole('button', { hidden: true }))
    await userEvent.click(screen.getByText('Français'))
    expect(moreInfoLink).not.toBeVisible()

    await userEvent.click(registerButton)
    expect(loginWithRedirectMock).toHaveBeenCalledWith(expect.objectContaining({ authorizationParams: { screen_hint: 'signup' } }))

    await userEvent.click(loginButton)
    expect(loginWithRedirectMock).toHaveBeenCalled()
  })
})
