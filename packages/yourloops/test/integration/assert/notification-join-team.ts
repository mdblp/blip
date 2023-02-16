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

import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

export const closeDialogNotificationTeam = async () => {
  const badgeNotification = screen.getByLabelText('Go to notifications list')
  expect(badgeNotification).toHaveTextContent('1')
  const badgeTeam = screen.getByLabelText('Open team menu')
  expect(badgeTeam).toHaveTextContent('2')
  const acceptButtonNotification = screen.getByRole('button', { name: 'Accept' })
  expect(screen.getByTestId('notification-line')).toHaveTextContent("You're invited to share your diabetes data with sysReq-67-team2.")
  await userEvent.click(acceptButtonNotification)

  const dialog = screen.getByRole('dialog')
  const addTeamButtonForCancelDialog = within(dialog).getByRole('button', { name: 'Continue' })
  const cancelTeamButton = within(dialog).getByRole('button', { name: 'Cancel' })

  expect(dialog).toHaveTextContent('Join the care team sysReq-67-team2Please enter the team code (9 digits)CancelContinue')
  expect(addTeamButtonForCancelDialog).toBeDisabled()
  await userEvent.click(cancelTeamButton)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}
