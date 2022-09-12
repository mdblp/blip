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
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { act, render, screen, waitFor } from '@testing-library/react'
import { AuthContextProvider } from '../../lib/auth'
import { MainLobby } from '../../app/main-lobby'
import { checkHeader } from './utils/header'
import { checkDrawer } from './utils/drawer'
import { checkFooter } from './utils/footer'
import { mockAuth0Hook } from './utils/mockAuth0Hook'
import { mockUserDataFetch } from './utils/auth'
import PatientApi from '../../lib/patient/patient-api'
import TeamApi from '../../lib/team/team-api'

jest.mock('@auth0/auth0-react')
describe('Invalid Route', () => {
  const unknownRoute = '/unknown-route'
  const firstName = 'firstName'
  const lastName = 'lastName'
  const history = createMemoryHistory({ initialEntries: [unknownRoute] })

  beforeAll(() => {
    mockAuth0Hook()
    mockUserDataFetch(firstName, lastName)
  })

  function getInvalidRoutePage() {
    return (
      <Router history={history}>
        <AuthContextProvider>
          <MainLobby />
        </AuthContextProvider>
      </Router>
    )
  }

  it('should render correct components when navigating to an unknown route and redirect to \'/\' when clicking on home link', async () => {
    jest.spyOn(TeamApi, 'getTeams').mockResolvedValue([])
    jest.spyOn(PatientApi, 'getPatients').mockResolvedValue([])
    act(() => {
      render(getInvalidRoutePage())
    })

    await waitFor(() => expect(history.location.pathname).toBe('/not-found'))

    expect(screen.getByText('page-not-found')).toBeVisible()
    const homeLink = screen.getByText('breadcrumb-home')
    expect(homeLink).toBeVisible()
    expect(homeLink).toHaveAttribute('href', '/')

    checkHeader(`${firstName} ${lastName}`)
    checkDrawer()
    checkFooter()
  })
})
