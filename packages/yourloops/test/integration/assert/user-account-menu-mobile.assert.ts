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
import userEvent from '@testing-library/user-event/dist/cjs/index.js'

export const checkUserAccountMenuCardsVisible = (): void => {
  expect(screen.queryByTestId('user-account-menu-mobile-account')).toBeVisible()
  expect(screen.queryByTestId('user-account-menu-mobile-data-sharing')).toBeVisible()
}

export const checkUserAccountMenuCardsNotVisible = (): void => {
  expect(screen.queryByTestId('user-account-menu-mobile-account')).not.toBeInTheDocument()
  expect(screen.queryByTestId('user-account-menu-mobile-account-data-sharing')).not.toBeInTheDocument()
}

export const checkUserAccountMenuCard = (): void => {
  expect(screen.getByText('First name')).toBeVisible()
  expect(screen.getByText('Last name')).toBeVisible()
  expect(screen.getByText('Country')).toBeVisible()
  expect(screen.getByText('Gender')).toBeVisible()
  expect(screen.getByText('Email')).toBeVisible()
  expect(screen.getByText('Units')).toBeVisible()
  expect(screen.getByText('Language')).toBeVisible()
}

export const checkClickViewMoreUserAccount = async (): Promise<void> => {
  const viewMoreUserAccount = within(screen.getByTestId('user-account-menu-mobile-account'))
  await userEvent.click(viewMoreUserAccount.getByText('View more'))
  const userAccountTitle = await screen.findByText('User account');
  expect(userAccountTitle).toBeInTheDocument();

}

export const checkClickViewMoreDataSharing = async (): Promise<void> => {
  screen.debug(screen.getByTestId('user-account-menu-mobile-data-sharing'));
  const containerElement = screen.getByTestId('user-account-menu-mobile-data-sharing')
  const container = within(containerElement);

  const viewMoreButton = await container.findByText('View more');
  await userEvent.click(viewMoreButton);

  // On cherche le titre SPÉCIFIQUEMENT à l'intérieur de ce composant-là :
  const specTitle = await container.findByText('Remote monitoring tools');
  expect(specTitle).toBeVisible();
}


