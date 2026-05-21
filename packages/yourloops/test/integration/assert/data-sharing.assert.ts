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
