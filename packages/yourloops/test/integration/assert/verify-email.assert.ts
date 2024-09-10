/*
 * Copyright (c) 2023-2024, Diabeloop
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
import userEvent from '@testing-library/user-event'
import { logoutMock } from '../mock/auth0.hook.mock'

export const checkHeader = (headerId: string) => {
  const pageHeader = within(screen.getByTestId(headerId))
  expect(pageHeader.getByLabelText('YourLoops Logo')).toBeVisible()
}

export const checkHeaderWithLogoutButton = async (headerId: string) => {
  checkHeader(headerId)
  const headerLogoutButton = within(screen.getByTestId(headerId)).getByText('Logout')
  expect(headerLogoutButton).toBeEnabled()

  await userEvent.click(headerLogoutButton)
  expect(logoutMock).toHaveBeenCalledTimes(1)
}

export const checkVerifyEmailPageContent = async () => {
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
}

export const checkVerifyEmailResultSuccessContent = () => {
  const pageContent = within(screen.getByTestId('verify-email-result-content'))
  expect(pageContent.getByTestId('right-icon')).toBeVisible()
  expect(pageContent.getByText('Your e-mail address was verified.')).toBeVisible()
  expect(pageContent.getByText('You can now continue to YourLoops.')).toBeVisible()
  const continueButton = pageContent.getByRole('button', { name: 'Continue' })
  expect(continueButton).toBeVisible()
}

export const checkVerifyEmailResultSuccessContinueButton = async () => {
  const pageContent = within(screen.getByTestId('verify-email-result-content'))
  const continueButton = pageContent.getByRole('button', { name: 'Continue' })

  await userEvent.click(continueButton)
  expect(screen.getByText('Register')).toBeVisible()
  expect(screen.getByText('Connect')).toBeVisible()
}

export const checkVerifyEmailResultErrorContent = () => {
  const pageContent = within(screen.getByTestId('verify-email-result-content'))
  expect(pageContent.getByTestId('wrong-icon')).toBeVisible()
  expect(pageContent.getByText('Your e-mail address could not be verified.')).toBeVisible()
  const logoutButton = pageContent.getByRole('button', { name: 'Logout' })
  expect(logoutButton).toBeVisible()
}

export const checkVerifyEmailResultErrorLinkExpiredLabel = () => {
  const pageContent = within(screen.getByTestId('verify-email-result-content'))
  expect(pageContent.getByText('This verification link has expired.')).toBeVisible()
}

export const checkVerifyEmailResultErrorLinkAlreadyUsedLabel = () => {
  const pageContent = within(screen.getByTestId('verify-email-result-content'))
  expect(pageContent.getByText('This verification link has already been used.')).toBeVisible()
}

export const checkVerifyEmailResultErrorAccountAlreadyVerifiedLabel = () => {
  const pageContent = within(screen.getByTestId('verify-email-result-content'))
  expect(pageContent.getByText('This account is already verified.')).toBeVisible()
}

export const checkVerifyEmailResultErrorAccountDoesNotExistLabel = () => {
  const pageContent = within(screen.getByTestId('verify-email-result-content'))
  expect(pageContent.getByText('The user account does not exist.')).toBeVisible()
}

export const checkVerifyEmailResultErrorEmailGenericLabel = () => {
  const pageContent = within(screen.getByTestId('verify-email-result-content'))
  expect(pageContent.getByText('An error occurred during the process.')).toBeVisible()
}

export const checkVerifyEmailResultErrorLogoutButton = async () => {
  const pageContent = within(screen.getByTestId('verify-email-result-content'))
  const logoutButton = pageContent.getByRole('button', { name: 'Logout' })

  await userEvent.click(logoutButton)
  expect(logoutMock).toHaveBeenCalled()
}
