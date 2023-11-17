/*
 * Copyright (c) 2023, Diabeloop
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

import { getAccessTokenSilentlyMock, logoutMock, mockAuth0HookUnlogged } from '../../mock/auth0.hook.mock'
import { renderPage } from '../../utils/render'
import { screen, waitFor, within } from '@testing-library/react'
import { checkFooterForUserNotLoggedIn } from '../../assert/footer.assert'
import userEvent from '@testing-library/user-event'
import { AppRoute } from '../../../../models/enums/routes.enum'
import { AUTH0_ERROR_EMAIL_NOT_VERIFIED } from '../../../../lib/auth/models/auth0-error.model'

describe('Verify email page', () => {
  it('should display a description of the email verification process with options', async () => {
    mockAuth0HookUnlogged()
    getAccessTokenSilentlyMock.mockRejectedValue({ error_description: AUTH0_ERROR_EMAIL_NOT_VERIFIED })
    window.open = jest.fn()

    const router = renderPage(AppRoute.VerifyEmail)

    expect(await screen.findByTestId('footer')).toBeVisible()

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(AppRoute.VerifyEmail)
    })

    checkFooterForUserNotLoggedIn(true)

    const pageHeader = within(screen.getByTestId('verify-email-header'))
    expect(pageHeader.getByLabelText('YourLoops Logo')).toBeVisible()
    const headerLogoutButton = pageHeader.getByText('Logout')
    expect(headerLogoutButton).toBeEnabled()

    await userEvent.click(headerLogoutButton)
    expect(logoutMock).toHaveBeenCalledTimes(1)

    const pageContent = within(screen.getByTestId('verify-email-content'))
    expect(pageContent.getByLabelText('YourLoops Logo')).toBeVisible()
    expect(pageContent.getByText('Verify your email address')).toBeVisible()
    expect(pageContent.getByText('To use YourLoops, you need to confirm your email address by clicking on the link we sent you. This helps to keep your account secure.')).toBeVisible()

    const contactSupportSection = pageContent.getByTestId('verify-email-details-2')
    expect(contactSupportSection).toHaveTextContent('No mail in your inbox or spam folder? Contact the customer support.')
    const contactSupportButton = within(contactSupportSection).getByRole('button', { name: 'Contact the customer support' })
    expect(contactSupportButton).toBeVisible()

    await userEvent.click(contactSupportButton)
    expect(window.open).toHaveBeenCalledTimes(1)

    const createNewAccountSection = pageContent.getByTestId('verify-email-details-3')
    expect(createNewAccountSection).toHaveTextContent('Wrong address? If you mistyped your email when signing up, logout and create a new account.')
    const logoutAndCreateNewAccountButton = within(createNewAccountSection).getByRole('button', { name: 'logout and create a new account' })
    expect(logoutAndCreateNewAccountButton).toBeVisible()

    await userEvent.click(logoutAndCreateNewAccountButton)
    expect(logoutMock).toHaveBeenCalledTimes(2)

    const logoutSection = pageContent.getByTestId('verify-email-details-4')
    expect(logoutSection).toHaveTextContent('Do you want to login with another address? Try to login again.')
    const tryToLoginAgainButton = within(logoutSection).getByRole('button', { name: 'Try to login again' })
    expect(tryToLoginAgainButton).toBeVisible()

    await userEvent.click(tryToLoginAgainButton)
    expect(logoutMock).toHaveBeenCalledTimes(3)

    const continueButton = pageContent.getByText('Continue')
    expect(continueButton).toBeEnabled()

    await userEvent.click(continueButton)
    expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('You have not verified your email.')
  })
})
