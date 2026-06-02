/*
 * Copyright (c) 2026, Diabeloop
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

export const checkUserAccountMenuNotVisible = (): void => {
  expect(screen.queryByTestId('user-account-menu')).not.toBeInTheDocument()
  expect(screen.queryByText('Data sharing')).not.toBeInTheDocument()
}

export const checkUserAccountMenuVisible = (): void => {
  const menu = screen.getByTestId('user-account-menu')
  expect(menu).toHaveTextContent('User accountAccountData sharing')
}

export const checkDataSharingContentNoData = async (): Promise<void> => {
  const dataSharingMenuButton = within(screen.getByTestId('user-account-menu')).getByText('Data sharing')
  await userEvent.click(dataSharingMenuButton)

  expect(screen.getByTestId('user-account-view')).toHaveTextContent('Data sharingRemote monitoring toolsNo data sharing enabled.The Diabeloop system now supports remote monitoring. Talk to your healthcare professional for more information.')
}

export const checkDataSharingContentWithData = async (): Promise<void> => {
  const dataSharingMenuButton = within(screen.getByTestId('user-account-menu')).getByText('Data sharing')
  await userEvent.click(dataSharingMenuButton)

  expect(screen.getByTestId('user-account-view')).toHaveTextContent('Data sharingRemote monitoring toolsThe applications listed in this table have access to your YourLoops data. You can revoke their access at any time.')
  const table = screen.getByLabelText('Remote monitoring tools table')
  expect(table).toHaveTextContent('Remote monitoring toolActivation date')

  const glookoXtRow = within(table).getByTestId('monitoring-tool-row-GLOOKO_XT')
  expect(glookoXtRow).toHaveTextContent('Glooko XTMay 13, 2026Revoke consent')
  expect(within(table).getByTestId('monitoring-tool-row-MY_DIABBY')).toHaveTextContent('MyDiabby HealthcareMay 19, 2026Revoke consent')

  const revokeConsentButton = within(glookoXtRow).getByRole('button', { name: 'Revoke consent' })
  expect(revokeConsentButton).toBeVisible()
  await userEvent.click(revokeConsentButton)

  const dialog = screen.getByTestId('revoke-consent-dialog')
  expect(dialog).toBeVisible()
  expect(dialog).toHaveTextContent('Revoke consentDo you want to revoke the access of the application Glooko XT to your data?Your data will no longer be transmitted to Glooko XT.CancelRevoke consent')

  const cancelButton = within(dialog).getByRole('button', { name: 'Cancel' })
  await userEvent.click(cancelButton)
  expect(dialog).not.toBeInTheDocument()
}

export const checkRevokeConsentSuccess = async (): Promise<void> => {
  const table = screen.getByLabelText('Remote monitoring tools table')
  const glookoXtRow = within(table).getByTestId('monitoring-tool-row-GLOOKO_XT')
  const revokeConsentButton = within(glookoXtRow).getByRole('button', { name: 'Revoke consent' })

  await userEvent.click(revokeConsentButton)

  const dialog = screen.getByTestId('revoke-consent-dialog')
  const revokeButton = within(dialog).getByRole('button', { name: 'Revoke consent' })

  await userEvent.click(revokeButton)
  expect(dialog).not.toBeInTheDocument()
  expect(screen.getByRole('alert')).toHaveTextContent('Consent revoked successfully')
}

export const checkRevokeConsentError = async (): Promise<void> => {
  const dataSharingMenuButton = within(screen.getByTestId('user-account-menu')).getByText('Data sharing')

  await userEvent.click(dataSharingMenuButton)

  const table = screen.getByLabelText('Remote monitoring tools table')
  const myDiabbyRow = within(table).getByTestId('monitoring-tool-row-MY_DIABBY')
  const revokeConsentButton = within(myDiabbyRow).getByRole('button', { name: 'Revoke consent' })

  await userEvent.click(revokeConsentButton)

  const dialog = screen.getByTestId('revoke-consent-dialog')
  const revokeButton = within(dialog).getByRole('button', { name: 'Revoke consent' })

  await userEvent.click(revokeButton)
  expect(dialog).not.toBeInTheDocument()
  expect(screen.getByRole('alert')).toHaveTextContent('An error occurred, please try again later.')
}

export const checkDataAccessRequestModalNotVisible = (): void => {
  expect(screen.queryByTestId('data-access-request-dialog')).not.toBeInTheDocument()
}

export const checkGlookoXtDataAccessRequestModalVisible = (): void => {
  const modal = screen.queryByTestId('data-access-request-dialog')

  expect(modal).toBeVisible()
  expect(modal).toHaveTextContent('Data access requestThe Glooko XT app is requesting access to your data.If you agree, the following data will be shared:Glucose levelsInsulin delivery information (basal rate and boluses)Meal and rescue carb informationAlarms / alerts relating to data transmission and time outside the target range.Physical activity dataSome system settingsYou can revoke access to your data at any time in your User Account.')
  expect(within(modal).getByRole('button', { name: 'Deny access' })).toBeVisible()
  expect(within(modal).getByRole('button', { name: 'Allow access' })).toBeVisible()
}

export const checkMyDiabbyDataAccessRequestModalVisible = (): void => {
  const modal = screen.queryByTestId('data-access-request-dialog')

  expect(modal).toBeVisible()
  expect(modal).toHaveTextContent('Data access requestThe MyDiabby Healthcare app is requesting access to your data.If you agree, the following data will be shared:Glucose levelsInsulin delivery information (basal rate and boluses)Meal and rescue carb informationAlarms / alerts relating to data transmission and time outside the target range.Physical activity dataSome system settingsYou can revoke access to your data at any time in your User Account.')
  expect(within(modal).getByRole('button', { name: 'Deny access' })).toBeVisible()
  expect(within(modal).getByRole('button', { name: 'Allow access' })).toBeVisible()
}

export const checkAcceptDataAccessRequest = async (): Promise<void> => {
  const modal = screen.queryByTestId('data-access-request-dialog')
  const allowAccessButton = within(modal).getByRole('button', { name: 'Allow access' })

  await userEvent.click(allowAccessButton)

  expect(screen.queryByTestId('data-access-request-dialog')).toHaveTextContent('Data access grantedThe application Glooko XT now has access to your data.You will be redirected to the application.')

  const okLink = within(modal).getByRole('link', { name: 'Ok' })
  expect(okLink).toBeVisible()
  expect(okLink).toHaveAttribute('href', 'https://fake-url.com')
}

export const checkDenyDataAccessRequest = async (): Promise<void> => {
  const modal = screen.queryByTestId('data-access-request-dialog')
  const denyAccessButton = within(modal).getByRole('button', { name: 'Deny access' })

  await userEvent.click(denyAccessButton)

  expect(screen.queryByTestId('data-access-request-dialog')).toHaveTextContent('Data access refusedYou have denied the application MyDiabby Healthcare access to your data.You will be redirected to the application.')

  const okLink = within(modal).getByRole('link', { name: 'Ok' })
  expect(okLink).toBeVisible()
  expect(okLink).toHaveAttribute('href', 'https://fake-url.com')
}

export const checkDataAccessRequestError = async (): Promise<void> => {
  const modal = screen.queryByTestId('data-access-request-dialog')
  const allowAccessButton = within(modal).getByRole('button', { name: 'Allow access' })

  await userEvent.click(allowAccessButton)

  expect(screen.queryByTestId('data-access-request-dialog')).toHaveTextContent('Error during data access requestAn error occurred while processing the data access request from MyDiabby Healthcare. Please retry the process.You will be redirected to the application.')

  const okLink = within(modal).getByRole('link', { name: 'Ok' })
  expect(okLink).toBeVisible()
  expect(okLink).toHaveAttribute('href', 'https://fake-url.com')
}
