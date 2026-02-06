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

import { screen, within } from '@testing-library/react'
import { UserRole } from '../../../lib/auth/models/enums/user-role.enum'
import { ExternalFilesService } from '../../../lib/external-files/external-files.service'

const checkFooter = (hasLanguageSelector: boolean = false) => {
  const footer = within(screen.getByTestId('footer'))
  const productLabellingLink = footer.getByText('Product Labelling')
  const termsOfUseLink = footer.getByText('Terms of use')
  const privacyPolicyLink = footer.getByText('Privacy Policy')
  const cookiesManagementLink = footer.getByText('Cookies management')
  const cookiesPolicyLink = footer.getByText('Cookies policy')
  const contactLink = footer.getByText('Contact')
  const releaseNotesLink = footer.getByTestId('footer-link-url-release-notes')
  const languageSelector = footer.queryByTestId('language-selector')

  hasLanguageSelector
    ? expect(languageSelector).toBeInTheDocument()
    : expect(languageSelector).not.toBeInTheDocument()

  expect(productLabellingLink).toBeVisible()
  expect(productLabellingLink).toHaveAttribute('href', '/product-labelling')
  expect(termsOfUseLink).toBeVisible()
  expect(termsOfUseLink).toHaveAttribute('href', ExternalFilesService.getTermsOfUseUrl())
  expect(privacyPolicyLink).toBeVisible()
  expect(privacyPolicyLink).toHaveAttribute('href', ExternalFilesService.getPrivacyPolicyUrl())
  expect(cookiesManagementLink).toBeVisible()
  expect(cookiesPolicyLink).toBeVisible()
  expect(cookiesPolicyLink).toHaveAttribute('href', ExternalFilesService.getCookiesPolicyUrl())
  expect(releaseNotesLink).toBeVisible()
  expect(releaseNotesLink).toHaveAttribute('href', 'fake-urlyourloops-release-notes.pdf')
  expect(contactLink).toBeVisible()
}

export const checkFooterForUserNotLoggedIn = (hasLanguageSelector: boolean = false) => {
  const footer = within(screen.getByTestId('footer'))
  const trainingLink = footer.getByText('Training')
  expect(trainingLink).toBeVisible()
  expect(trainingLink).toHaveAttribute('href', ExternalFilesService.getTrainingUrl())
  checkFooter(hasLanguageSelector)
}

export const checkFooterForHcp = (hasLanguageSelector: boolean = false) => {
  const footer = within(screen.getByTestId('footer'))
  const trainingLink = footer.getByText('Training')
  expect(trainingLink).toBeVisible()
  expect(trainingLink).toHaveAttribute('href', ExternalFilesService.getTrainingUrl(UserRole.Hcp))
  checkFooter(hasLanguageSelector)
}

export const checkFooterForPatient = (hasLanguageSelector: boolean = false) => {
  const footer = within(screen.getByTestId('footer'))
  const trainingLink = footer.getByText('Training')
  expect(trainingLink).toBeVisible()
  expect(trainingLink).toHaveAttribute('href', ExternalFilesService.getTrainingUrl(UserRole.Patient))
  checkFooter(hasLanguageSelector)
}

export const checkFooterForCaregiver = (hasLanguageSelector: boolean = false) => {
  const footer = within(screen.getByTestId('footer'))
  const trainingLink = footer.getByText('Training')
  expect(trainingLink).toBeVisible()
  expect(trainingLink).toHaveAttribute('href', ExternalFilesService.getTrainingUrl(UserRole.Caregiver))
  checkFooter(hasLanguageSelector)
}
