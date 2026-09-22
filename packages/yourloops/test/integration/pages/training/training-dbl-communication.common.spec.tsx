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

// Regression test for a redirect loop between the onboarding "gate" pages: when a user had both a
// pending training acknowledgment and a pending Diabeloop communication, the app bounced forever
// between '/training' and '/dbl-communication' (see main-lobby.tsx `USER_GATES`).

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockPatientLogin } from '../../mock/patient-login.mock'
import { mockDblCommunicationApiPage } from '../../mock/dbl-communication.api'
import { mockUserApi } from '../../mock/user.api.mock'
import { renderPage } from '../../utils/render'
import { buildPatient } from '../../data/patient-builder.data'
import { type InformationPage } from '../../../../lib/dbl-communication/models/page.model'

const newDblCommunication = {
  id: 'page-info-loop-regression',
  title: 'Important Information',
  content: '<p>This is an <b>important information</b> page for all users.</p>'
} as InformationPage

describe('Training page when a dbl communication is also pending ack', () => {
  afterEach(() => {
    jest.restoreAllMocks()
    localStorage.clear()
  })

  beforeEach(() => {
    const patient = buildPatient({
      userid: 'training-and-dbl-comm-patient',
      profile: { firstName: 'Alain', lastName: 'Provist', fullName: 'Alain Provist' }
    })
    mockPatientLogin(patient)
    // Override the default (fully accepted) account fetched by mockPatientLogin: consents are
    // accepted, but the training acknowledgment is still pending.
    mockUserApi().mockUserDataFetch({
      firstName: patient.profile.firstName,
      lastName: patient.profile.lastName,
      account: {
        email: 'test@it.com',
        fullName: 'Alain Provist',
        termsOfUse: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
        privacyPolicy: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
        trainingAck: { acceptanceTimestamp: null, isAccepted: null }
      }
    })
    // mockPatientLogin defaults the communication API to "nothing to display": override it after,
    // so there is also a pending communication.
    mockDblCommunicationApiPage(newDblCommunication)
  })

  it('should display the communication page, then the training page, without looping between them', async () => {
    const router = renderPage('/')

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/dbl-communication')
      expect(screen.getByTestId('dbl-comm-header')).toBeInTheDocument()
    })

    // Give a redirect loop a chance to manifest: the path must still be the communication page.
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(router.state.location.pathname).toEqual('/dbl-communication')

    await userEvent.click(screen.getByRole('button', { name: 'Continue' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/training')
      expect(screen.getByText('New training available, please read what\'s new before continuing on YourLoops.')).toBeVisible()
    })

    // Again, let's wait...
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(router.state.location.pathname).toEqual('/training')

    await userEvent.click(screen.getByText('Open training'))
    const confirmButton = screen.getByText('Confirm')
    await userEvent.click(screen.getByText('I went through the entire training and I understood it'))
    expect(confirmButton).toBeEnabled()

    await userEvent.click(confirmButton)

    // `UserApi.updateUserAccount` is mocked to resolve `undefined` (see mockUserApi), so the client
    // account is cleared after the ack and the consent gate is (artificially) pending again -- this
    // mirrors the existing training.common.spec.tsx behaviour. The point of this test is that the
    // journey never bounces back to '/dbl-communication' or '/training'.
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/new-consent')
    })
  })
})
