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
import { mockAuth0Hook, mockAuth0HookUnlogged } from '../mock/auth0.hook.mock'
import { renderPage } from '../utils/render'
import { UserRole } from '../../../lib/auth/models/enums/user-role.enum'
import { AppRoute, AppUserRoute } from '../../../models/enums/routes.enum'
import UserApi from '../../../lib/auth/user.api'
import { Profile } from '../../../lib/auth/models/profile.model'
import { mockNotificationAPI } from '../mock/notification.api.mock'
import { mockTeamAPI, myThirdTeamId } from '../mock/team.api.mock'
import { mockUserApi } from '../mock/user.api.mock'
import { flaggedPatientId, patient1Id } from '../data/patient.api.data'
import { mockPatientApiForCaregivers, mockPatientApiForHcp } from '../mock/patient.api.mock'
import { mockDirectShareApi } from '../mock/direct-share.api.mock'
import { mockDataAPI } from '../mock/data.api.mock'

describe('Router for everyone', () => {

  const mockHcpUser = () => {
    const firstName = 'Eric'
    const lastName = 'Ard'
    mockNotificationAPI()
    mockTeamAPI()
    mockUserApi().mockUserDataFetch({ firstName, lastName })
    mockPatientApiForHcp()
    mockDirectShareApi()
    mockDataAPI()
    mockAuth0Hook(UserRole.Hcp)
  }

  const mockCaregiverUser = () => {
    const firstName = 'Eric'
    const lastName = 'Ard'
    mockAuth0Hook(UserRole.Caregiver)
    mockNotificationAPI()
    mockDirectShareApi()
    mockUserApi().mockUserDataFetch({ firstName, lastName })
    mockPatientApiForCaregivers()
  }

  it('should redirect to login page when path is "/" and user is not logged in', async () => {
    mockAuth0HookUnlogged()

    const router = renderPage('/')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/login')
    })

    expect(await screen.findByTestId('info-container')).toHaveTextContent('YourLoops is a web application offered by Diabeloop to facilitate the monitoring of patients with diabetes using compatible medical devices.')
  })

  it('should redirect to complete signup page when path is "/" and this is the first user login', async () => {
    mockAuth0Hook(UserRole.Unset)

    const router = renderPage('/')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(AppRoute.CompleteSignup)
    })

    expect(await screen.findByTestId('card-signup')).toHaveTextContent('Account creation finalization')
  })

  it('should redirect to new consent page when path is "/" and patient has to accept consent', async () => {
    jest.spyOn(UserApi, 'getUserMetadata').mockResolvedValue({
      profile: {
        firstName: 'firstName',
        lastName: 'lastName',
        fullName: `firstName lastName`,
        email: 'fake@email.com',
        termsOfUse: { acceptanceTimestamp: '2021-01-02', isAccepted: false },
        privacyPolicy: { acceptanceTimestamp: '2021-01-02', isAccepted: false },
        trainingAck: { acceptanceTimestamp: '2022-10-11', isAccepted: false }
      } as Profile,
      settings: {},
      preferences: {}
    })
    mockAuth0Hook(UserRole.Patient)

    const router = renderPage('/')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(AppRoute.NewConsent)
    })

    expect(await screen.findByTestId('consent-page')).toHaveTextContent('Welcome to YourLoops! Please read and accept the terms of use and privacy policy before using the service.')
  })

  it('should redirect to renew consent page when path is "/" and hcp has to accept consent', async () => {
    jest.spyOn(UserApi, 'getUserMetadata').mockResolvedValue({
      profile: {
        firstName: 'firstName',
        lastName: 'lastName',
        fullName: `firstName lastName`,
        email: 'fake@email.com',
        termsOfUse: { acceptanceTimestamp: '2021-01-02', isAccepted: false },
        privacyPolicy: { acceptanceTimestamp: '2021-01-02', isAccepted: false },
        trainingAck: { acceptanceTimestamp: '2022-10-11', isAccepted: false }
      } as Profile,
      settings: {},
      preferences: {}
    })
    mockAuth0Hook(UserRole.Patient)

    const router = renderPage('/')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(AppRoute.NewConsent)
    })

    expect(await screen.findByTestId('consent-page')).toHaveTextContent('Welcome to YourLoops! Please read and accept the terms of use and privacy policy before using the service.')
  })

  it('should redirect to training page when path is "/" and user has not done training', async () => {
    jest.spyOn(UserApi, 'getUserMetadata').mockResolvedValue({
      profile: {
        firstName: 'firstName',
        lastName: 'lastName',
        fullName: `firstName lastName`,
        email: 'fake@email.com',
        termsOfUse: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
        privacyPolicy: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
        trainingAck: { acceptanceTimestamp: '2022-10-11', isAccepted: false }
      } as Profile,
      settings: {},
      preferences: {}
    })
    mockAuth0Hook(UserRole.Hcp)

    const router = renderPage('/')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(AppRoute.Training)
    })

    expect(await screen.findByTestId('training-container')).toHaveTextContent('New training available, please read what\'s new before continuing on YourLoops.')
  })

  it('should not be able to access the login page when authenticated', async () => {
    mockHcpUser()

    const router = renderPage(AppRoute.Login)
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/teams/myThirdTeamId/patients')
    })

    expect(await screen.findByTestId('patient-list-header')).toBeVisible()
  })

  it('should not be able to access the verify email page when authenticated', async () => {
    mockHcpUser()

    const router = renderPage(AppRoute.VerifyEmail)
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/teams/myThirdTeamId/patients')
    })

    expect(await screen.findByTestId('patient-list-header')).toBeVisible()
  })

  it('should not be able to go to the training page when training has been done', async () => {
    mockHcpUser()

    const router = renderPage(AppRoute.Training)
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/teams/myThirdTeamId/patients')
    })

    expect(await screen.findByTestId('patient-list-header')).toBeVisible()
  })
})
