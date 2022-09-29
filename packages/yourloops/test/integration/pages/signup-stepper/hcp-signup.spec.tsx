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

import React from 'react'
import { Router } from 'react-router-dom'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { loggedInUserId, mockAuth0Hook } from '../../utils/mockAuth0Hook'
import { AuthContextProvider } from '../../../../lib/auth'
import { MainLobby } from '../../../../app/main-lobby'
import { createMemoryHistory } from 'history'
import { checkAccountSelectorStep, checkConsentStep, checkProfileStep, checkStepper } from '../../assert/signup-stepper'
import { mockUserApi } from '../../utils/mockUserApi'
import { HcpProfession } from '../../../../models/hcp-profession'

describe('Signup stepper', () => {
  const { updateProfileMock, updatePreferencesMock, updateSettingsMock } = mockUserApi()
  const history = createMemoryHistory({ initialEntries: ['/'] })
  const firstName = 'Lara'
  const lastName = 'Tatouille'
  const expectedProfile = {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    privacyPolicy: { isAccepted: true, acceptanceTimestamp: expect.any(String) },
    termsOfUse: { isAccepted: true, acceptanceTimestamp: expect.any(String) },
    contactConsent: { isAccepted: true, acceptanceTimestamp: expect.any(String) },
    hcpProfession: HcpProfession.nurse
  }

  beforeAll(() => {
    mockAuth0Hook(null)
  })

  function getStepperPage(history) {
    return (
      <Router history={history}>
        <AuthContextProvider>
          <MainLobby />
        </AuthContextProvider>
      </Router>
    )
  }

  async function renderDom() {
    act(() => {
      render(getStepperPage(history))
    })
    await waitFor(() => expect(history.location.pathname).toEqual('/complete-signup'))
  }

  it('should be able to create a hcp account', async () => {
    await renderDom()
    checkStepper()

    // Step one
    checkAccountSelectorStep()
    fireEvent.click(screen.getByLabelText('hcp-radio-input'))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))

    // Step two
    const feedbackCheckbox = screen.queryByLabelText('feedback-checkbox')

    checkConsentStep()
    expect(feedbackCheckbox).toBeInTheDocument()

    fireEvent.click(feedbackCheckbox)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))

    // Step three
    const createButton = screen.getByRole('button', { name: 'Create Account' })
    const hcpProfessionSelector = screen.queryByTestId('hcp-profession-selector')

    await checkProfileStep(firstName, lastName)
    expect(hcpProfessionSelector).toBeInTheDocument()

    fireEvent.mouseDown(within(hcpProfessionSelector).getByRole('button'))
    screen.getByRole('listbox')
    fireEvent.click(screen.getByRole('option', { name: 'Nurse' }))

    expect(createButton).not.toBeDisabled()
    await act(async () => {
      fireEvent.click(createButton)
    })

    expect(updateProfileMock).toHaveBeenCalledWith(loggedInUserId, expectedProfile)
    expect(updatePreferencesMock).toHaveBeenCalledWith(loggedInUserId, { displayLanguageCode: 'en' })
    expect(updateSettingsMock).toHaveBeenCalledWith(loggedInUserId, { country: 'FR' })
  })
})
