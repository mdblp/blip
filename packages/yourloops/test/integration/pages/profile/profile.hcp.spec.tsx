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

import { renderPage } from '../../utils/render'
import { loggedInUserEmail, loggedInUserId, mockAuth0Hook } from '../../mock/auth0.hook.mock'
import { buildAvailableTeams, mockTeamAPI, myThirdTeamName } from '../../mock/team.api.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'
import { mockPatientApiForHcp } from '../../mock/patient.api.mock'
import { checkHcpProfilePage, checkPasswordChangeRequest } from '../../assert/profile.assert'
import userEvent from '@testing-library/user-event'
import { type Profile } from '../../../../lib/auth/models/profile.model'
import { type Settings } from '../../../../lib/auth/models/settings.model'
import { CountryCodes } from '../../../../lib/auth/models/country.model'
import { LanguageCodes } from '../../../../lib/auth/models/enums/language-codes.enum'
import { HcpProfession } from '../../../../lib/auth/models/enums/hcp-profession.enum'
import UserApi from '../../../../lib/auth/user.api'
import { type Preferences } from '../../../../lib/auth/models/preferences.model'
import { mockUserApi } from '../../mock/user.api.mock'
import { mockAuthApi } from '../../mock/auth.api.mock'
import { Unit } from 'medical-domain'
import {
  type AppMainLayoutHcpParams,
  testAppMainLayoutForHcp,
  testBannerLanguageUpdate
} from '../../use-cases/app-main-layout-visualisation'
import { ConfigService } from '../../../../lib/config/config.service'

describe('Profile page for hcp', () => {
  const profile: Profile = {
    email: 'djamal@alatete.com',
    firstName: 'Djamal',
    lastName: 'Alatete',
    fullName: 'Djamal Alatete',
    termsOfUse: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
    privacyPolicy: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
    trainingAck: { acceptanceTimestamp: '2022-10-11', isAccepted: true },
    hcpProfession: HcpProfession.diabeto
  }
  const settings: Settings = {
    country: CountryCodes.France,
    units: { bg: Unit.MmolPerLiter }
  }
  const preferences: Preferences = { displayLanguageCode: LanguageCodes.Fr }

  beforeAll(() => {
    mockAuth0Hook()
    mockAuthApi()
    mockUserApi().mockUserDataFetch({ profile, preferences, settings })
    mockNotificationAPI()
    mockDirectShareApi()
    mockTeamAPI()
    mockPatientApiForHcp()
  })

  it('should render profile page for a French HCP and be able to edit his profile and change his password', async () => {
    const expectedProfile = {
      ...profile,
      firstName: 'Jean',
      lastName: 'Talue',
      fullName: 'Jean Talue',
      hcpProfession: HcpProfession.nurse
    }

    const appMainLayoutParams: AppMainLayoutHcpParams = {
      footerHasLanguageSelector: false,
      headerInfo: {
        loggedInUserFullName: `${profile.lastName} ${profile.firstName}`,
        teamMenuInfo: {
          selectedTeamName: myThirdTeamName,
          isSelectedTeamPrivate: false,
          availableTeams: buildAvailableTeams()
        }
      }
    }
    const expectedPreferences = { displayLanguageCode: 'en' as LanguageCodes }
    const expectedSettings = { units: { bg: Unit.MilligramPerDeciliter }, country: CountryCodes.Austria }
    const updateProfileMock = jest.spyOn(UserApi, 'updateProfile').mockResolvedValue(expectedProfile)
    const updatePreferencesMock = jest.spyOn(UserApi, 'updatePreferences').mockResolvedValue(expectedPreferences)
    const updateSettingsMock = jest.spyOn(UserApi, 'updateSettings').mockResolvedValue(expectedSettings)

    const router = renderPage('/preferences')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/preferences')
    })

    await testAppMainLayoutForHcp(appMainLayoutParams)
    const fields = checkHcpProfilePage()
    const saveButton = screen.getByRole('button', { name: 'Save' })

    expect(fields.firstNameInput).toHaveValue(profile.firstName)
    expect(fields.lastNameInput).toHaveValue(profile.lastName)
    expect(fields.unitsSelect).toHaveTextContent(settings.units.bg)
    expect(fields.languageSelect).toHaveTextContent('Français')
    expect(fields.hcpProfessionSelect).toHaveTextContent('Diabetologist')
    expect(saveButton).toBeDisabled()

    fireEvent.mouseDown(within(screen.getByTestId('profile-local-selector')).getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: 'English' }))

    fireEvent.mouseDown(within(screen.getByTestId('profile-units-selector')).getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: Unit.MilligramPerDeciliter }))

    fireEvent.mouseDown(within(screen.getByTestId('dropdown-profession-selector')).getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: 'Nurse' }))

    fireEvent.mouseDown(within(screen.getByTestId('country-selector')).getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: 'Japan' }))

    fireEvent.mouseDown(within(screen.getByTestId('country-selector')).getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: 'United Kingdom' }))

    fireEvent.mouseDown(within(screen.getByTestId('country-selector')).getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: 'Austria' }))

    await userEvent.clear(fields.firstNameInput)
    await userEvent.clear(fields.lastNameInput)
    await userEvent.type(fields.firstNameInput, 'Jean')
    await userEvent.type(fields.lastNameInput, 'Talue')

    expect(saveButton).not.toBeDisabled()
    await userEvent.click(saveButton)

    expect(saveButton).toBeDisabled()
    expect(screen.getByRole('alert')).toBeVisible()
    expect(updatePreferencesMock).toHaveBeenCalledWith(loggedInUserId, expectedPreferences)
    expect(updateProfileMock).toHaveBeenCalledWith(loggedInUserId, expectedProfile)
    expect(updateSettingsMock).toHaveBeenCalledWith(loggedInUserId, expectedSettings)

    const profileUpdateSuccessfulSnackbar = screen.getByTestId('alert-snackbar')
    expect(profileUpdateSuccessfulSnackbar).toHaveTextContent('Profile updated')

    const profileUpdateSuccessfulSnackbarCloseButton = within(profileUpdateSuccessfulSnackbar).getByTitle('Close')

    await userEvent.click(profileUpdateSuccessfulSnackbarCloseButton)

    await checkPasswordChangeRequest(loggedInUserEmail)
  })

  it('should show the banner and change its content when the banner is enabled and language is changed', async () => {
    jest.spyOn(ConfigService, 'isBannerEnabled').mockReturnValue(true)

    const router = renderPage('/preferences')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/preferences')
    })

    await testBannerLanguageUpdate()
  })
})
