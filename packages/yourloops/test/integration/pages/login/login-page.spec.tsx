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
import { act, fireEvent, screen, within } from '@testing-library/react'
import { checkFooter } from '../../assert/footer'
import { renderPage } from '../../utils/render'
import userEvent from '@testing-library/user-event'

describe('Login page', () => {
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
    renderPage('/')

    const header = screen.getByTestId('login-page-header')
    const registerButton = within(header).getByRole('button', { name: 'Register' })
    const loginButton = within(header).getByRole('button', { name: 'Connection' })
    const contactLink = within(header).getByRole('link', { name: 'Contact' })
    const languageSelector = within(header).queryByTestId('language-selector')
    const infoContainer = screen.getByTestId('info-container')
    const moreInfoLink = within(infoContainer).getByRole('link')

    // Images
    expect(screen.getByAltText('Yourloops brand colors')).toBeVisible()
    expect(screen.getByAltText('Yourloops laptop')).toBeVisible()

    // header
    expect(header).toBeVisible()
    expect(within(header).getByTestId('header-main-logo')).toBeVisible()
    expect(registerButton).toBeVisible()
    expect(loginButton).toBeVisible()
    expect(contactLink).toBeVisible()
    expect(contactLink).toHaveAttribute('href', 'mailto:yourloops@diabeloop.com')
    expect(within(header).getByTestId('language-icon')).toBeVisible()
    expect(languageSelector).toBeVisible()

    // main content
    expect(within(infoContainer).getByText('is a web application offered by Diabeloop in order to facilitate the monitoring of patients with diabetes using compatible medical devices.')).toBeVisible()
    expect(within(infoContainer).getByText('It provides access to visual representations of data that are automatically uploaded from DBL devices: blood sugar levels, insulin, carbohydrates and physical activity.')).toBeVisible()
    expect(within(infoContainer).getByText('YourLoops also enables patients to securely share their data with their medical team or caregivers.')).toBeVisible()
    expect(within(infoContainer).getByText('For health professionals, YourLoops is the platform for monitoring their patients. Through these features, it saves time and facilitates therapeutic decision-making.')).toBeVisible()
    expect(moreInfoLink).toBeVisible()
    expect(moreInfoLink).toHaveAttribute('href', 'https://www.dbl-diabetes.com')
    checkFooter({ needFooterLanguageSelector: false })

    // More info link should disappear if language is french
    fireEvent.mouseDown(within(languageSelector).getByRole('button', { hidden: true }))
    await userEvent.click(screen.getByText('Français'))
    expect(moreInfoLink).not.toBeVisible()

    await userEvent.click(registerButton)
    expect(loginWithRedirectMock).toHaveBeenCalledWith(expect.objectContaining({ screen_hint: 'signup' }))

    await userEvent.click(loginButton)
    expect(loginWithRedirectMock).toHaveBeenCalled()
  })

  it('should redirect to verify-email page if the user has not yet confirmed his email', async () => {
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      error: Error('Please verify your email before logging in.')
    })
    let router
    await act(async () => {
      router = await renderPage('/')
    })
    expect(router.current.history.location.pathname).toEqual('/verify-email')
  })

  it('should show a snackbar alert if auth0 returns an error', async () => {
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      error: Error('Hi there, i\'m an error !!')
    })
    await act(async () => {
      await renderPage('/')
    })
    expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('Hi there, i\'m an error !!')
  })
})
