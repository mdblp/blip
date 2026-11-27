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

import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  getAccessTokenWithPopupMock,
  loggedInUserId,
  logoutMock,
  mockAuth0Hook
} from '../../mock/auth0.hook.mock'
import { checkConsentStepHcp, checkProfileStep } from '../../assert/signup-stepper.assert'
import { mockUserApi } from '../../mock/user.api.mock'
import { mockTeamInvitations } from '../../mock/team.api.mock'
import { renderPage } from '../../utils/render'
import { UserRole } from '../../../../lib/auth/models/enums/user-role.enum'
import { CountryCode } from '../../../../lib/auth/models/country.model'
import { HcpProfession } from '../../../../lib/auth/models/enums/hcp-profession.enum'
import TeamAPI from '../../../../lib/team/team.api'
import { type ITeam } from '../../../../lib/team/models/i-team.model'

describe('Signup stepper as an invited hcp', () => {
  const { updateAuth0UserMetadataMock } = mockUserApi()
  const firstName = 'Lara'
  const lastName = 'Tatouille'

  beforeAll(() => {
    mockAuth0Hook(UserRole.Unset)
  })

  beforeEach(() => {
    mockTeamInvitations([{ id: 'team-id', name: 'Team invited in' } as ITeam])
  })

  const renderSignup = async () => {
    const router = renderPage('/')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/complete-signup')
    })
  }

  it('should skip the account type selection and create a hcp account', async () => {
    await renderSignup()

    // The selection step is skipped: consent is the first step
    expect(await screen.findByTestId('consents')).toBeVisible()
    expect(TeamAPI.getTeamInvitations).toHaveBeenCalledTimes(1)
    expect(screen.queryByTestId('create-caregiver-account')).not.toBeInTheDocument()
    expect(screen.queryByTestId('create-hcp-account')).not.toBeInTheDocument()
    expect(screen.queryByTestId('create-patient-account')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Select account type')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Consent')).toBeInTheDocument()
    expect(screen.getByLabelText('Create profile')).toBeInTheDocument()

    // Consent is the one of a hcp
    await checkConsentStepHcp()
    await userEvent.click(screen.getByText('Next'))

    // Profile
    await checkProfileStep(firstName, lastName)
    const hcpProfessionSelector = screen.getByTestId('hcp-profession-selector')
    fireEvent.mouseDown(within(hcpProfessionSelector).getByRole('combobox', { hidden: true }))
    await userEvent.click(screen.getByText('Nurse'))
    await userEvent.click(screen.getByText('Create account'))

    expect(updateAuth0UserMetadataMock).toHaveBeenCalledWith(
      loggedInUserId,
      expect.objectContaining({
        role: UserRole.Hcp,
        profile: expect.objectContaining({ hcpProfession: HcpProfession.nurse }),
        settings: { country: CountryCode.France }
      })
    )
    expect(getAccessTokenWithPopupMock).toHaveBeenCalledWith({ authorizationParams: { ignoreCache: true } })
    expect(screen.getByTestId('message-complete-account')).toBeVisible()
  })

  it('should logout when going back from the first step', async () => {
    await renderSignup()
    await screen.findByTestId('consents')

    await userEvent.click(screen.getByRole('button', { name: 'Back' }))

    expect(logoutMock).toHaveBeenCalled()
  })

  it('should block the signup when the invitations cannot be fetched, and recover on retry', async () => {
    jest.spyOn(TeamAPI, 'getTeamInvitations').mockRejectedValueOnce(new Error('mocked error'))
    await renderSignup()

    const retryButton = await screen.findByRole('button', { name: 'Retry' })
    expect(screen.getByText(/Something went wrong. Please try again in a few moments./)).toBeVisible()
    expect(screen.queryByTestId('consents')).not.toBeInTheDocument()
    expect(screen.queryByTestId('create-caregiver-account')).not.toBeInTheDocument()

    logoutMock.mockClear()
    await userEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(logoutMock).toHaveBeenCalledTimes(1)

    await userEvent.click(retryButton)

    expect(await screen.findByTestId('consents')).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument()
  })
})
