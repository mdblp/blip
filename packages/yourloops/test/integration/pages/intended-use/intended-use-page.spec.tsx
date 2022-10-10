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
import * as auth0Mock from '@auth0/auth0-react'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { AuthContextProvider } from '../../../../lib/auth'
import { MainLobby } from '../../../../app/main-lobby'
import React from 'react'
import userEvent from '@testing-library/user-event'
import { act, render, screen } from '@testing-library/react'
import { checkFooter } from '../../assert/footer'
import i18n from 'i18next'

describe('Intended use page', () => {
  const history = createMemoryHistory({ initialEntries: ['/'] })

  function getPage() {
    return (
      <Router history={history}>
        <AuthContextProvider>
          <MainLobby />
        </AuthContextProvider>
      </Router>
    )
  }

  beforeAll(() => {
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: undefined
    })
  })

  it('should render intended use with the right selected language', () => {
    render(getPage())
    expect(screen.getByText('Welcome to Yourloops. Please login or register')).toBeInTheDocument()
    checkFooter()

    userEvent.click(screen.getByText('Intended Use'))

    expect(history.location.pathname).toEqual('/intended-use')
    expect(screen.getByText('Intended Purpose and regulatory information')).toBeInTheDocument()
    expect(screen.getByText('Legal Manufacturer')).toBeInTheDocument()

    act(() => {
      i18n.changeLanguage('fr')
    })
    expect(screen.getByText('Usage prévu et informations réglementaires')).toBeInTheDocument()
    expect(screen.getByText('Fabricant')).toBeInTheDocument()
  })

  it('should render the yourloops version and latest release date on all languages', () => {
    history.location.pathname = '/intended-use'
    render(getPage())
    expect(screen.getByText('YourLoops, version 1.0.0, released on 2000-01-01')).toBeInTheDocument()

    act(() => {
      i18n.changeLanguage('fr')
    })
    expect(screen.getByText('YourLoops, version 1.0.0, libérée le 2000-01-01')).toBeInTheDocument()
  })
})
