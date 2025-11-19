/*
 * Copyright (c) 2025, Diabeloop
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

import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderPage } from '../../utils/render'
import { mockDblCommunicationApiPage } from '../../mock/dbl-communication.api'
import { AppRoute } from '../../../../models/enums/routes.enum'
import { type InformationPage } from '../../../../lib/dbl-communication/models/page.model'
import * as storage from '../../../../lib/dbl-communication/storage'
import { mockPatientLogin } from '../../mock/patient-login.mock'
import { patient2Info } from '../../data/patient.api.data'

async function renderDblCommunicationPage() {
  const router = renderPage(AppRoute.DblCommunication)
  await waitFor(() => {
    expect(router.state.location.pathname).toEqual(AppRoute.DblCommunication)
    expect(screen.getByTestId('dbl-comm-header')).toBeInTheDocument()
    expect(screen.getByTestId('header-main-logo')).toBeInTheDocument()
  })
  return router
}

const newDblCommunication = {
  id: "page-info-12345",
  title: "Important Information",
  content: "<p>This is an <b>important information</b> page for all users.</p>"
} as InformationPage

describe('DBL Communication Page', () => {
  afterEach(() => {
    jest.restoreAllMocks()
    localStorage.clear()
  })

  describe('When user has a new communication to display', () => {
    beforeEach(() => {
      mockPatientLogin(patient2Info)
      mockDblCommunicationApiPage(newDblCommunication)
    })

    it('should render the communication page with correct content', async () => {

      await renderDblCommunicationPage()

      // Check title container
      const titleContainer = screen.getByTestId('dbl-comm-title')
      expect(titleContainer).toBeInTheDocument()
      expect(titleContainer.innerHTML).toContain(newDblCommunication.title)

      // Check content is rendered with HTML
      const detailsContainer = screen.getByTestId('dbl-comm-details')
      expect(detailsContainer).toBeInTheDocument()
      expect(detailsContainer.innerHTML).toContain(newDblCommunication.content)

      // Check continue button
      const continueButton = screen.getByRole('button', { name: 'Continue' })
      expect(continueButton).toBeInTheDocument()
    })

    it('should acknowledge the communication and redirect when continue button is clicked', async () => {
      const registerDblCommunicationAckSpy = jest.spyOn(storage, 'registerDblCommunicationAck')
      const router = await renderDblCommunicationPage()

      const continueButton = screen.getByRole('button', { name: 'Continue' })

      await act(async () => {
        await userEvent.click(continueButton)
      })

      // Check that acknowledgment was registered
      expect(registerDblCommunicationAckSpy).toHaveBeenCalledWith(newDblCommunication.id)

      // Check redirection to home
      await waitFor(() => {
        expect(router.state.location.pathname).toEqual('/')
      })
    })
  })
})

