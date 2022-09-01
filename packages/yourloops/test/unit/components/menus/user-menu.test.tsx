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
import { act } from 'react-dom/test-utils'
import { renderToString } from 'react-dom/server'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import FaceIcon from '@material-ui/icons/Face'
import RoundedHospitalIcon from '../../../../components/icons/RoundedHospitalIcon'
import StethoscopeIcon from '../../../../components/icons/StethoscopeIcon'

import UserMenu from '../../../../components/menus/user-menu'
import { triggerMouseEvent } from '../../common/utils'
import User from '../../../../lib/auth/user'
import * as authHookMock from '../../../../lib/auth/hook'
import { UserRoles } from '../../../../models/user'
import { render, waitFor } from '@testing-library/react'

jest.mock('../../../../lib/auth/hook')
describe('User Menu', () => {
  const history = createMemoryHistory({ initialEntries: ['/'] })
  const logout = jest.fn()

  function openMenu(): void {
    const userMenu = document.getElementById('user-menu')
    triggerMouseEvent('click', userMenu)
  }

  function mountComponent() {
    act(() => {
      render(
        <Router history={history}>
          <UserMenu />
        </Router>
      )
    })
  }

  beforeEach(() => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: { role: UserRoles.hcp } as User,
        logout
      }
    })
  })

  it('should display the hcp icon', () => {
    mountComponent()
    const roleIcon = document.querySelector('#user-role-icon')
    expect(roleIcon.innerHTML).toEqual(renderToString(<StethoscopeIcon />))
  })

  it('should display the caregiver icon', () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { role: UserRoles.caregiver } as User }
    })
    mountComponent()
    const roleIcon = document.querySelector('#user-role-icon')
    expect(roleIcon.innerHTML).toEqual(renderToString(<RoundedHospitalIcon />))
  })

  it('should display the patient icon', () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { role: UserRoles.patient } as User }
    })
    mountComponent()
    const roleIcon = document.querySelector('#user-role-icon')
    expect(roleIcon.innerHTML).toEqual(renderToString(<FaceIcon />))
  })

  it('should redirect to \'/preferences\' route when clicking on profile link', () => {
    mountComponent()
    openMenu()
    const profileItem = document.getElementById('user-menu-settings-item')
    triggerMouseEvent('click', profileItem)
    expect(history.location.pathname).toBe('/preferences')
  })

  it('should logout the user when clicking on logout item', async () => {
    mountComponent()
    openMenu()
    const logoutItem = document.getElementById('user-menu-logout-item')
    await act(async () => {
      triggerMouseEvent('click', logoutItem)
      await waitFor(() => expect(logout).toBeCalledTimes(1))
    })
  })
})
