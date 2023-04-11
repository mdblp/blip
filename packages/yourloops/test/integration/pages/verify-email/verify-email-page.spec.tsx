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

import * as auth0Mock from '@auth0/auth0-react'
import { getAccessTokenWithPopupMock, logoutMock } from '../../mock/auth0.hook.mock'
import { renderPage } from '../../utils/render'
import { screen, waitFor, within } from '@testing-library/react'
import { checkFooter } from '../../assert/footer'

describe('Verify email page', () => {
  it('should display a description of the email verification process with options', async () => {
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      getAccessTokenWithPopup: getAccessTokenWithPopupMock,
      logout: logoutMock
    })

    const router = renderPage('/verify-email')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/verify-email')
    })

    checkFooter({ needFooterLanguageSelector: true })

    const pageHeader = within(screen.getByTestId('verify-email-header'))
    expect(pageHeader.getByText('Logout')).toBeEnabled()
    expect(pageHeader.getByLabelText('YourLoops Logo')).toBeVisible()

    const pageContent = within(screen.getByTestId('verify-email-content'))
    expect(pageContent.getByLabelText('YourLoops Logo')).toBeVisible()
    expect(pageContent.getByText('Verify your email address')).toBeVisible()
    expect(pageContent.getByText('To use YourLoops, you need to confirm your email address by clicking on the link we sent you. This helps to keep your account secure.')).toBeVisible()

    const contactSupportSection = pageContent.getByTestId('verify-email-details-2')
    expect(contactSupportSection).toHaveTextContent('No mail in your inbox or spam folder? Contact the customer support.')
    expect(within(contactSupportSection).getByRole('button', { name: 'Contact the customer support' })).toBeVisible()

    const createNewAccountSection = pageContent.getByTestId('verify-email-details-3')
    expect(createNewAccountSection).toHaveTextContent('Wrong address? If you mistyped your email when signing up, create a new account.')
    expect(within(createNewAccountSection).getByRole('button', { name: 'create a new account' })).toBeVisible()

    const logoutSection = pageContent.getByTestId('verify-email-details-4')
    expect(logoutSection).toHaveTextContent('Do you want to login with another address? Try to login again.')
    expect(within(logoutSection).getByRole('button', { name: 'Try to login again' })).toBeVisible()

    const continueButton = pageContent.getByText('Continue')
    expect(continueButton).toBeEnabled()
  })
})
