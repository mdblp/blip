/**
 * Copyright (c) 2022, Diabeloop
 * footer component tests
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
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from '@testing-library/react-hooks/dom'

import Footer from '../../../../components/footer/footer'
import { AuthContext, useAuth, User } from '../../../../lib/auth'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { ROUTES_REQUIRING_LANGUAGE_SELECTOR } from '../../../../app/main-lobby'
import { UserRoles } from '../../../../models/user'

describe('Footer', () => {
  let auth: AuthContext = null
  let container: HTMLElement | null = null
  const history = createMemoryHistory({ initialEntries: ['/'] })

  const FooterLinksComponent = (data: { user: User }): JSX.Element => {
    auth = useAuth()
    auth.user = data.user

    return (
      <Footer />
    )
  }

  const mountComponent = async (user?: User): Promise<void> => {
    await act(() => {
      return new Promise((resolve) => {
        render(
          <Router history={history}>
            <FooterLinksComponent user={user} />
          </Router>, container, resolve)
      })
    })
  }

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container)
      container.remove()
      container = null
    }
  })

  function getLanguageSelector(): HTMLElement {
    return document.getElementById('footer-language-box')
  }

  it('should render language selector on routes requiring it', async () => {
    await mountComponent()
    ROUTES_REQUIRING_LANGUAGE_SELECTOR.forEach((route: string) => {
      history.replace(route)
      expect(getLanguageSelector()).not.toBeNull()
    })
  })

  it('should not render language selector when user is logged in on home page', async () => {
    history.replace('/home')
    await mountComponent({ role: UserRoles.hcp } as User)
    const languageSelector = document.getElementById('footer-language-box')
    const documentSelector = document.getElementById('footer-accompanying-documents-box')
    expect(languageSelector).toBeNull()
    expect(documentSelector).not.toBeNull()
  })
})
