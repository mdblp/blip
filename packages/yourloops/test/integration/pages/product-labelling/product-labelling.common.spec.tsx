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
import userEvent from '@testing-library/user-event'
import { act, screen, waitFor } from '@testing-library/react'
import i18n from 'i18next'
import { renderPage } from '../../utils/render'
import { LanguageCodes } from '../../../../lib/auth/models/enums/language-codes.enum'
import { checkFooterForUserNotLoggedIn } from '../../assert/footer.assert'

describe('Product labelling page', () => {
  beforeAll(() => {
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: undefined
    })
  })

  it('should render product labelling with the right selected language and version', async () => {
    const router = renderPage('/')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/login')
    })
    checkFooterForUserNotLoggedIn(false)

    await userEvent.click(screen.getByText('Product Labelling'))

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/product-labelling')
    })
    const udi = screen.getByTestId('udipdf')
    // doc name should be `YLPZ-RA-LAD-001-fr-Rev${global.BUILD_CONFIG.YLPZ_RA_LAD_001_FR_REV as string}
    expect(udi).toHaveAttribute('data', 'fake-urlYLPZ-RA-LAD-001-en-Rev9.pdf')
    expect(udi).toHaveAttribute('type', 'application/pdf')
    expect(udi).toHaveAttribute('height', '100%')
    expect(udi).toHaveAttribute('width', '100%')

    act(() => {
      i18n.changeLanguage(LanguageCodes.Fr)
    })
    expect(screen.getByTestId('udipdf')).toHaveAttribute('data', 'fake-urlYLPZ-RA-LAD-001-fr-Rev9.pdf')

    act(() => {
      i18n.changeLanguage(LanguageCodes.Nl)
    })
    expect(screen.getByTestId('udipdf')).toHaveAttribute('data', 'fake-urlYLPZ-RA-LAD-001-nl-Rev6.pdf')

    act(() => {
      i18n.changeLanguage(LanguageCodes.Es)
    })
    expect(screen.getByTestId('udipdf')).toHaveAttribute('data', 'fake-urlYLPZ-RA-LAD-001-es-Rev6.pdf')

    act(() => {
      i18n.changeLanguage(LanguageCodes.It)
    })
    expect(screen.getByTestId('udipdf')).toHaveAttribute('data', 'fake-urlYLPZ-RA-LAD-001-it-Rev6.pdf')

    act(() => {
      i18n.changeLanguage(LanguageCodes.De)
    })
    expect(screen.getByTestId('udipdf')).toHaveAttribute('data', 'fake-urlYLPZ-RA-LAD-001-de-Rev6.pdf')

  })
})
