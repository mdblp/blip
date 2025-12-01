/*
 * Copyright (c) 2022-2025, Diabeloop
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

import { renderPage } from '../../utils/render'
import {
  getAccessTokenWithPopupMock,
  loggedInUserEmail,
  loggedInUserId,
  mockAuth0Hook
} from '../../mock/auth0.hook.mock'
import { mockTeamAPI } from '../../mock/team.api.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import { screen, waitFor } from '@testing-library/react'
import { checkCaregiverLayout } from '../../assert/layout.assert'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'
import { mockPatientApiForCaregivers, mockPatientApiForHcp } from '../../mock/patient.api.mock'
import { type UserAccount } from '../../../../lib/auth/models/user-account.model'
import { type Settings } from '../../../../lib/auth/models/settings.model'
import { CountryCodes } from '../../../../lib/auth/models/country.model'
import { LanguageCodes } from '../../../../lib/auth/models/enums/language-codes.enum'
import UserApi from '../../../../lib/auth/user.api'
import { type Preferences } from '../../../../lib/auth/models/preferences.model'
import { UserRole } from '../../../../lib/auth/models/enums/user-role.enum'
import { mockUserApi } from '../../mock/user.api.mock'
import { mockAuthApi } from '../../mock/auth.api.mock'
import { Unit } from 'medical-domain'
import ErrorApi from '../../../../lib/error/error.api'
import {
  testCaregiverUserInfoUpdate,
  testEmailChangeRequest,
  testPasswordChangeRequest, testPasswordChangeRequestFailed
} from '../../use-cases/user-account-management'
import {
  testCaregiverSwitchRoleDialogsClosing,
  testCaregiverSwitchRoleToHcp
} from '../../use-cases/caregiver-switch-role-hcp'
import { AppUserRoute } from '../../../../models/enums/routes.enum'
import { mockDblCommunicationApi } from '../../mock/dbl-communication.api'

describe('User account page for caregiver', () => {
  const userAccountRoute = AppUserRoute.UserAccount

  const account: UserAccount = {
    email: 'phil@defer.com',
    firstName: 'Phil',
    lastName: 'Defer',
    fullName: 'Phil Defer',
    termsOfUse: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
    privacyPolicy: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
    trainingAck: { acceptanceTimestamp: '2022-10-11', isAccepted: true }
  }
  const settings: Settings = {
    country: CountryCodes.France,
    units: { bg: Unit.MmolPerLiter }
  }
  const preferences: Preferences = { displayLanguageCode: LanguageCodes.Fr }
  const changeUserRoleToHcpMock = jest.spyOn(UserApi, 'changeUserRoleToHcp').mockResolvedValue(undefined)

  beforeAll(() => {
    mockAuth0Hook(UserRole.Caregiver)
    mockDblCommunicationApi()
    mockAuthApi()
    mockUserApi().mockUserDataFetch({ account, preferences, settings })
    mockNotificationAPI()
    mockDirectShareApi()
    mockTeamAPI()
    mockPatientApiForCaregivers()
    mockPatientApiForHcp() // Do not remove this, this is needed for when the user switches role
  })

  it('should render user account page for a caregiver and be able to change his password and change his role to HCP', async () => {
    jest.spyOn(ErrorApi, 'sendError').mockResolvedValue(null)

    const expectedUserAccount = { ...account, firstName: 'Jean', lastName: 'Talue', fullName: 'Jean Talue' }
    const expectedPreferences = { displayLanguageCode: 'en' as LanguageCodes }
    const expectedSettings: Settings = { ...settings, units: { bg: Unit.MilligramPerDeciliter } }
    const updateUserAccountMock = jest.spyOn(UserApi, 'updateUserAccount').mockResolvedValue(expectedUserAccount)
    const updatePreferencesMock = jest.spyOn(UserApi, 'updatePreferences').mockResolvedValue(expectedPreferences)
    const updateSettingsMock = jest.spyOn(UserApi, 'updateSettings').mockResolvedValue(expectedSettings)

    const router = renderPage(userAccountRoute)
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(userAccountRoute)
    })

    await checkCaregiverLayout(`${account.lastName} ${account.firstName}`)

    await testCaregiverUserInfoUpdate()

    expect(updatePreferencesMock).toHaveBeenCalledWith(loggedInUserId, expectedPreferences)
    expect(updateUserAccountMock).toHaveBeenCalledWith(loggedInUserId, expectedUserAccount)
    expect(updateSettingsMock).toHaveBeenCalledWith(loggedInUserId, expectedSettings)

    await testPasswordChangeRequest(loggedInUserEmail)

    await testCaregiverSwitchRoleDialogsClosing()
    await testCaregiverSwitchRoleToHcp()

    expect(changeUserRoleToHcpMock).toHaveBeenCalled()
    expect(getAccessTokenWithPopupMock).toHaveBeenCalledWith({ authorizationParams: { ignoreCache: true } })
  })

  it('should render user account page for a caregiver and display error if change password failed', async () => {
    const router = renderPage(userAccountRoute)
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(userAccountRoute)
    })

    await testPasswordChangeRequestFailed(loggedInUserEmail)
  })

  it('should open the change e-mail popup, complete the flow successfully and display success snackbar', async () => {
    const router = renderPage(userAccountRoute)
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(userAccountRoute)
      expect(screen.getByText('User account')).toBeVisible()
    })

    await testEmailChangeRequest(loggedInUserId, 'newEmail@diabeloop.fr', '457845789')
  })
})
