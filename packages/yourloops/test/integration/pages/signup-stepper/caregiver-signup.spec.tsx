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

import { act, screen } from '@testing-library/react'
import { loggedInUserEmail, loggedInUserId, mockAuth0Hook } from '../../mock/mockAuth0Hook'
import { createMemoryHistory } from 'history'
import { checkAccountSelectorStep, checkConsentStep, checkProfileStep, checkStepper } from '../../assert/signup-stepper'
import { mockUserApi } from '../../mock/mockUserApi'
import { UserRoles } from '../../../../models/user'
import userEvent from '@testing-library/user-event'
import { renderPageFromHistory } from '../../utils/render'

jest.setTimeout(15000)

describe('Signup stepper as caregiver', () => {
  const { updateAuth0UserMetadataMock } = mockUserApi()
  const history = createMemoryHistory({ initialEntries: ['/'] })
  const firstName = 'Sandy'
  const lastName = 'Kilo'
  const expectedProfile = {
    email: loggedInUserEmail,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    privacyPolicy: { isAccepted: true, acceptanceTimestamp: expect.any(String) },
    termsOfUse: { isAccepted: true, acceptanceTimestamp: expect.any(String) }
  }

  beforeAll(() => {
    mockAuth0Hook(UserRoles.unset)
  })

  it('should be able to create a caregiver account', async () => {
    renderPageFromHistory(history)
    expect(history.location.pathname).toEqual('/complete-signup')

    checkStepper()

    // Step one
    checkAccountSelectorStep()
    userEvent.click(screen.getByLabelText('Create caregiver account'))
    userEvent.click(screen.getByText('Next'))

    // Step two
    checkConsentStep()
    expect(screen.queryByLabelText('Feedback checkbox')).not.toBeInTheDocument()
    userEvent.click(screen.getByText('Next'))

    // Step three
    const createButton = screen.getByText('Create Account')
    await checkProfileStep(firstName, lastName)
    expect(screen.queryByTestId('hcp-profession-selector')).not.toBeInTheDocument()
    expect(createButton).not.toBeDisabled()
    await act(async () => {
      userEvent.click(createButton)
    })
    expect(updateAuth0UserMetadataMock).toHaveBeenCalledWith(
      loggedInUserId,
      expect.objectContaining({
        role: UserRoles.caregiver,
        profile: expectedProfile,
        preferences: { displayLanguageCode: 'en' },
        settings: { country: 'FR' }
      })
    )
  })
})
