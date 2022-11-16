/**
 * Copyright (c) 2022, Diabeloop
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

import { screen, within } from '@testing-library/react'
import diabeloopUrl from '../../../lib/diabeloop-url'
import { getCurrentLang } from '../../../lib/language'
import { UserRoles } from '../../../models/user'

export const checkFooter = (role?: UserRoles) => {
  const footer = within(screen.getByTestId('footer'))
  const intendedUseLink = footer.getByText('Intended Use')
  const trainingLink = footer.getByText('Training')
  const termsOfUseLink = footer.getByText('Terms of use')
  const privacyPolicyLink = footer.getByText('Privacy Policy')
  const cookiesManagementLink = footer.getByText('Cookies management')
  const cookiesPolicyLink = footer.getByText('Cookies policy')
  const contactLink = footer.getByText('Contact')

  expect(intendedUseLink).toBeVisible()
  expect(intendedUseLink).toHaveAttribute('href', '/intended-use')
  expect(trainingLink).toBeVisible()
  expect(trainingLink).toHaveAttribute('href', diabeloopUrl.getTrainingUrl(getCurrentLang(), role))
  expect(termsOfUseLink).toBeVisible()
  expect(termsOfUseLink).toHaveAttribute('href', diabeloopUrl.getTermsUrL(getCurrentLang()))
  expect(privacyPolicyLink).toBeVisible()
  expect(privacyPolicyLink).toHaveAttribute('href', diabeloopUrl.getPrivacyPolicyUrL(getCurrentLang()))
  expect(cookiesManagementLink).toBeVisible()
  expect(cookiesPolicyLink).toBeVisible()
  expect(cookiesPolicyLink).toHaveAttribute('href', diabeloopUrl.getCookiesPolicyUrl(getCurrentLang()))
  expect(contactLink).toBeVisible()
}
