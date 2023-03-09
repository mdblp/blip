/*
 * Copyright (c) 2022-2023, Diabeloop
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
import { mockAuth0Hook } from '../../mock/auth0.hook.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import { checkHCPLayout } from '../../assert/layout'
import { renderPage } from '../../utils/render'
import { mockUserApi } from '../../mock/user.api.mock'
import { availableTeams, mockTeamAPI, teamThree } from '../../mock/team.api.mock'
import { mockPatientApiForHcp } from '../../mock/patient.api.mock'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'

describe('Invalid Route', () => {
  const firstName = 'firstName'
  const lastName = 'lastName'

  beforeAll(() => {
    mockAuth0Hook()
    mockUserApi().mockUserDataFetch({ firstName, lastName })
    mockNotificationAPI()
    mockTeamAPI()
    mockPatientApiForHcp()
    mockDirectShareApi()
  })

  it('should render correct components when navigating to an unknown route and redirect to \'/\' when clicking on home link', async () => {
    const router = renderPage('/wrongRoute')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/not-found')
    })
    expect(await screen.findByText('Page not found')).toBeVisible()
    const homeLink = screen.getByText('Home')
    expect(homeLink).toBeVisible()
    expect(homeLink).toHaveAttribute('href', '/')

    await checkHCPLayout(`${firstName} ${lastName}`, { teamName: teamThree.name }, availableTeams)
  })
})
