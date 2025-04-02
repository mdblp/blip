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

import { renderPage } from '../../utils/render'
import { AppRoute } from '../../../../models/enums/routes.enum'
import { waitFor } from '@testing-library/react'
import {
  testVerifyEmailResultErrorAccountAlreadyVerified,
  testVerifyEmailResultErrorAccountDoesNotExist,
  testVerifyEmailResultErrorEmailNotVerifiedOrGenericError,
  testVerifyEmailResultErrorLinkAlreadyUsed,
  testVerifyEmailResultErrorLinkExpired,
  testVerifyEmailResultSuccess
} from '../../use-cases/email-verification'
import * as auth0Mock from '@auth0/auth0-react'
import { getAccessTokenWithPopupMock, logoutMock } from '../../mock/auth0.hook.mock'
import { Auth0Error } from '../../../../lib/auth/models/enums/auth0-error.enum'

describe('Verify email result page', () => {
  beforeAll(() => {
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      getAccessTokenWithPopup: getAccessTokenWithPopupMock,
      logout: logoutMock,
      getAccessTokenSilently: jest.fn().mockRejectedValue({ error_description: Auth0Error.LoginRequired })
    })
  })

  describe('Success case', () => {
    it('should display a success screen and allow the user to login', async () => {
      const router = renderPage(`${AppRoute.VerifyEmailResult}?success=true`)
      await waitFor(() => {
        expect(router.state.location.pathname).toEqual(AppRoute.VerifyEmailResult)
      })

      await testVerifyEmailResultSuccess()
    })
  })

  describe('Error case', () => {
    it('should display an error screen if the link is expired', async () => {
      const router = renderPage(`${AppRoute.VerifyEmailResult}?success=false&message=Access%20expired.`)
      await waitFor(() => {
        expect(router.state.location.pathname).toEqual(AppRoute.VerifyEmailResult)
      })

      await testVerifyEmailResultErrorLinkExpired()
    })

    it('should display an error screen if the link has already been used', async () => {
      const router = renderPage(`${AppRoute.VerifyEmailResult}?success=false&message=This%20URL%20can%20be%20used%20only%20once`)
      await waitFor(() => {
        expect(router.state.location.pathname).toEqual(AppRoute.VerifyEmailResult)
      })

      await testVerifyEmailResultErrorLinkAlreadyUsed()
    })

    it('should display an error screen if the email could not be verified', async () => {
      const router = renderPage(`${AppRoute.VerifyEmailResult}?success=false&message=Your%20email%20address%20could%20not%20be%20verified.`)
      await waitFor(() => {
        expect(router.state.location.pathname).toEqual(AppRoute.VerifyEmailResult)
      })

      await testVerifyEmailResultErrorEmailNotVerifiedOrGenericError()
    })

    it('should display an error screen if the account is already verified', async () => {
      const router = renderPage(`${AppRoute.VerifyEmailResult}?success=false&message=This%20account%20is%20already%20verified.`)
      await waitFor(() => {
        expect(router.state.location.pathname).toEqual(AppRoute.VerifyEmailResult)
      })

      await testVerifyEmailResultErrorAccountAlreadyVerified()
    })

    it('should display an error screen if the account does not exist', async () => {
      const router = renderPage(`${AppRoute.VerifyEmailResult}?success=false&message=User%20account%20does%20not%20exist%20or%20verification%20code%20is%20invalid.`)
      await waitFor(() => {
        expect(router.state.location.pathname).toEqual(AppRoute.VerifyEmailResult)
      })

      await testVerifyEmailResultErrorAccountDoesNotExist()
    })

    it('should display an error screen if another error occurs', async () => {
      const router = renderPage(`${AppRoute.VerifyEmailResult}?success=false&message=Generic%20error`)
      await waitFor(() => {
        expect(router.state.location.pathname).toEqual(AppRoute.VerifyEmailResult)
      })

      await testVerifyEmailResultErrorEmailNotVerifiedOrGenericError()
    })
  })
})
