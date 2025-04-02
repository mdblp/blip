/*
 * Copyright (c) 2023-2025, Diabeloop
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
import { waitFor } from '@testing-library/react'
import { AppRoute } from '../../../../models/enums/routes.enum'
import { testVerifyEmail } from '../../use-cases/email-verification'
import { Auth0Error } from '../../../../lib/auth/models/enums/auth0-error.enum'

describe('Verify email page', () => {
  it('should display a description of the email verification process with options', async () => {
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      getAccessTokenWithPopup: getAccessTokenWithPopupMock,
      logout: logoutMock,
      getAccessTokenSilently: jest.fn().mockRejectedValue({ error_description: Auth0Error.EmailNotVerified })
    })
    window.open = jest.fn()

    const router = renderPage(AppRoute.VerifyEmail)
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(AppRoute.VerifyEmail)
    })

    await testVerifyEmail()
  })
})
