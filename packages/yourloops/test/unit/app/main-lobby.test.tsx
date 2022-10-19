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

import React, { FunctionComponent } from 'react'
import { createMemoryHistory, MemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import * as auth0Mock from '@auth0/auth0-react'
import { Auth0Provider } from '@auth0/auth0-react'

import * as authHookMock from '../../../lib/auth'
import { MainLobby } from '../../../app/main-lobby'
import renderer, { ReactTestRenderer } from 'react-test-renderer'
import { ConsentPage } from '../../../pages/login'
import CompleteSignUpPage from '../../../pages/signup/complete-signup-page'
import User from '../../../lib/auth/user'
import PatientConsentPage from '../../../pages/patient/patient-consent'
import DirectShareApi from '../../../lib/share/direct-share-api'
import TrainingPage from '../../../pages/training/training'
import LoginPage from '../../../pages/login/loginPage'

jest.mock('../../../lib/auth')
jest.mock('@auth0/auth0-react')
describe('Main lobby', () => {
  function renderMainLayout(history: MemoryHistory) {
    return renderer.create(
      <Auth0Provider clientId="__test_client_id__" domain="__test_domain__">
        <Router history={history}>
          <MainLobby />
        </Router>
      </Auth0Provider>
    )
  }

  beforeEach(() => {
    (auth0Mock.Auth0Provider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children
    });
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false
    })
  })

  function checkRenderAndRoute(currentComponent: ReactTestRenderer, history: MemoryHistory, expectedComponent: FunctionComponent, route: string) {
    const mainPageLayout = currentComponent.root.findByType(expectedComponent)
    expect(mainPageLayout).toBeDefined()
    expect(history.location.pathname).toBe(route)
  }

  beforeAll(() => {
    jest.spyOn(DirectShareApi, 'getDirectShares').mockResolvedValue([])
  })

  it("should render ConsentPage when user is logged in and did not consent and route is '/'", () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          hasToAcceptNewConsent: () => false,
          hasToRenewConsent: () => true,
          isFirstLogin: () => false,
          isUserHcp: () => true,
          hasToDisplayTrainingInfoPage: () => false
        } as User
      }
    })
    const component = renderMainLayout(history)
    checkRenderAndRoute(component, history, ConsentPage, '/renew-consent')
  })

  it("should render PatientConsentPage when user is logged in and did not consent and route is '/' and role is patient", () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          hasToAcceptNewConsent: () => true,
          hasToRenewConsent: () => false,
          isFirstLogin: () => false,
          isUserHcp: () => false,
          isUserPatient: () => true,
          hasToDisplayTrainingInfoPage: () => false
        } as User
      }
    })
    const component = renderMainLayout(history)
    checkRenderAndRoute(component, history, PatientConsentPage, '/new-consent')
  })

  it("should render LoginPage when user is not logged in route is '/login'", () => {
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          hasToAcceptNewConsent: () => false,
          hasToRenewConsent: () => false,
          isFirstLogin: () => false,
          hasToDisplayTrainingInfoPage: () => false
        } as User
      }
    })
    const history = createMemoryHistory({ initialEntries: ['/login'] })
    const component = renderMainLayout(history)
    checkRenderAndRoute(component, history, LoginPage, '/login')
  })

  it('should render CompleteSignupPage when a new user is logged in and have no profile yet', () => {
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          hasToAcceptNewConsent: () => false,
          hasToRenewConsent: () => false,
          isFirstLogin: () => true,
          hasToDisplayTrainingInfoPage: () => false
        } as User
      }
    })
    const history = createMemoryHistory({ initialEntries: ['/complete-signup'] })
    const component = renderMainLayout(history)
    checkRenderAndRoute(component, history, CompleteSignUpPage, '/complete-signup')
  })

  it('should render Training page when a new user is logged in, consents are done and profile is created', () => {
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          hasToAcceptNewConsent: () => false,
          hasToRenewConsent: () => false,
          isFirstLogin: () => false,
          hasToDisplayTrainingInfoPage: () => true
        } as User
      }
    })
    const history = createMemoryHistory({ initialEntries: ['/training'] })
    const component = renderMainLayout(history)
    checkRenderAndRoute(component, history, TrainingPage, '/training')
  })
})
