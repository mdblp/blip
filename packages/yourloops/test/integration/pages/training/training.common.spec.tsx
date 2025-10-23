/*
 * Copyright (c) 2022-2024, Diabeloop
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

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockPatientLogin } from '../../mock/patient-login.mock'
import { renderPage } from '../../utils/render'
import { mockAuth0Hook } from '../../mock/auth0.hook.mock'
import { mockUserApi } from '../../mock/user.api.mock'
import { UserRole } from '../../../../lib/auth/models/enums/user-role.enum'
import { buildPatient } from '../../data/patient-builder.data'

describe('Training page when new training available', () => {
  beforeAll(() => {
    const profile = {
      email: 'test@it.com',
      firstName: 'Alain',
      lastName: 'Provist',
      fullName: 'Alain Provist',
      patient: { birthday: '2010-01-20' },
      trainingAck: {
        acceptanceTimestamp: null,
        isAccepted: null
      }
    }
    const notAckTrainingPatient = buildPatient({ userid: 'id', profile })
    mockPatientLogin(notAckTrainingPatient)
    mockAuth0Hook(UserRole.Patient)
    mockUserApi()
  })

  it('should render a button opening the training, then a checkbox and a validate button', async () => {
    const router = renderPage('/training')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/training')
    })

    expect(screen.getByText('New training available, please read what\'s new before continuing on YourLoops.')).toBeVisible()
    const openButton = screen.getByText('Open training')
    expect(openButton).toBeEnabled()
    await userEvent.click(openButton)
    const confirmButton = screen.getByText('Confirm')
    expect(confirmButton).toBeDisabled()
    const ackText = screen.getByText('I went through the entire training and I understood it')
    expect(ackText).toBeVisible()
    await userEvent.click(ackText)
    expect(confirmButton).toBeEnabled()
    await userEvent.click(ackText)
    expect(confirmButton).toBeDisabled()
    await userEvent.click(ackText)
    expect(confirmButton).toBeEnabled()
    await userEvent.click(confirmButton)
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/new-consent')
    })
  })
})
