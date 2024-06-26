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

import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import {
  getAccessTokenWithPopupMock,
  loggedInUserEmail,
  loggedInUserId,
  mockAuth0Hook
} from '../../mock/auth0.hook.mock'
import {
  checkAccountSelectorStep,
  checkConsentStepHcp,
  checkProfileStep,
  checkStepper
} from '../../assert/signup-stepper.assert'
import { mockUserApi } from '../../mock/user.api.mock'
import { HcpProfession } from '../../../../lib/auth/models/enums/hcp-profession.enum'
import userEvent from '@testing-library/user-event'
import { renderPage } from '../../utils/render'
import { UserRole } from '../../../../lib/auth/models/enums/user-role.enum'
import { CountryCodes } from '../../../../lib/auth/models/country.model'
import { checkFooterForUserNotLoggedIn } from '../../assert/footer.assert'
import { type Profile } from '../../../../lib/auth/models/profile.model'

describe('Signup stepper as hcp', () => {
  const { updateAuth0UserMetadataMock } = mockUserApi()
  const firstName = 'Lara'
  const lastName = 'Tatouille'
  const expectedProfile: Profile = {
    email: loggedInUserEmail,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    privacyPolicy: { isAccepted: true, acceptanceTimestamp: expect.any(String) },
    termsOfUse: { isAccepted: true, acceptanceTimestamp: expect.any(String) },
    contactConsent: { isAccepted: true, acceptanceTimestamp: expect.any(String) },
    hcpConfirmAck: { isAccepted: true, acceptanceTimestamp: expect.any(String) },
    hcpProfession: HcpProfession.nurse
  }

  beforeAll(() => {
    mockAuth0Hook(UserRole.Unset)
  })

  it('should be able to create a hcp account', async () => {
    const router = renderPage('/')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/complete-signup')
    })
    checkFooterForUserNotLoggedIn(true)
    checkStepper()

    // Step one
    checkAccountSelectorStep()
    await userEvent.click(screen.getByLabelText('Create professional account'))
    await userEvent.click(screen.getByText('Next'))

    // Step two
    const feedbackCheckbox = screen.queryByLabelText('Feedback checkbox')

    await checkConsentStepHcp()
    expect(feedbackCheckbox).toBeVisible()

    await userEvent.click(feedbackCheckbox)
    await userEvent.click(screen.getByText('Next'))

    // Step three
    const createButton = screen.getByText('Create account')
    const hcpProfessionSelector = screen.queryByTestId('hcp-profession-selector')

    await checkProfileStep(firstName, lastName)
    expect(hcpProfessionSelector).toBeVisible()

    fireEvent.mouseDown(within(hcpProfessionSelector).getByRole('combobox', { hidden: true }))
    await userEvent.click(screen.getByText('Nurse'))

    fireEvent.mouseDown(within(screen.getByTestId('country-selector')).getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: 'Japan' }))

    fireEvent.mouseDown(within(screen.getByTestId('country-selector')).getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: 'United Kingdom' }))

    expect(createButton).not.toBeDisabled()
    await userEvent.click(screen.getByText('Create account'))

    expect(updateAuth0UserMetadataMock).toHaveBeenCalledWith(
      loggedInUserId,
      expect.objectContaining({
        role: UserRole.Hcp,
        profile: expectedProfile,
        preferences: { displayLanguageCode: 'en' },
        settings: { country: CountryCodes.UnitedKingdom }
      })
    )
    expect(getAccessTokenWithPopupMock).toHaveBeenCalledWith({ authorizationParams: { ignoreCache: true } })
    const completedAccountMessage = screen.getByTestId('message-complete-account')
    expect(completedAccountMessage).toHaveTextContent('Clicking the continue button will take you to your dashboard. You can then join or create care teams, and invite your patients so as to share their data.')
  })
})
