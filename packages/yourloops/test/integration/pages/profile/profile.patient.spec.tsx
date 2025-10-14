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
import { loggedInUserId, mockAuth0Hook } from '../../mock/auth0.hook.mock'
import { mockTeamAPI } from '../../mock/team.api.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import { checkPatientLayout } from '../../assert/layout.assert'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'
import { mockPatientApiForPatients } from '../../mock/patient.api.mock'
import { checkPatientProfilePage } from '../../assert/profile.assert'
import userEvent from '@testing-library/user-event'
import { type UserAccount } from '../../../../lib/auth/models/user-account.model'
import { type Settings } from '../../../../lib/auth/models/settings.model'
import { CountryCodes } from '../../../../lib/auth/models/country.model'
import { type Preferences } from '../../../../lib/auth/models/preferences.model'
import { UserRole } from '../../../../lib/auth/models/enums/user-role.enum'
import { LanguageCodes } from '../../../../lib/auth/models/enums/language-codes.enum'
import UserApi from '../../../../lib/auth/user.api'
import { mockUserApi } from '../../mock/user.api.mock'
import { Unit } from 'medical-domain'
import { Gender } from '../../../../lib/auth/models/enums/gender.enum'

describe('User account page for patient', () => {
  const account: UserAccount = {
    email: 'yann.blanc@example.com',
    firstName: 'Elie',
    lastName: 'Coptere',
    fullName: 'Elie Coptere',
    patient: {
      birthday: '1964-12-01',
      birthPlace: 'Anywhere',
      diagnosisDate: '2020-12-02',
      diagnosisType: '1',
      sex: Gender.Male
    },
    termsOfUse: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
    privacyPolicy: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
    trainingAck: { acceptanceTimestamp: '2022-10-11', isAccepted: true }
  }
  const settings: Settings = {
    a1c: {
      rawdate: '2020-01-01',
      date: 'date should not be used in this scenario',
      value: '7.5'
    },
    country: CountryCodes.France,
    units: { bg: Unit.MilligramPerDeciliter }
  }
  const preferences: Preferences = { displayLanguageCode: LanguageCodes.Fr }

  beforeAll(() => {
    mockAuth0Hook(UserRole.Patient)
    mockUserApi().mockUserDataFetch({ account, preferences, settings })
    mockNotificationAPI()
    mockDirectShareApi()
    mockTeamAPI()
    mockPatientApiForPatients()
  })

  it('should render user account page for a French patient and be able to edit his profile', async () => {
    const expectedUserAccount = { ...account, firstName: 'Jean', lastName: 'Tanrien', fullName: 'Jean Tanrien' }
    const expectedPreferences = { displayLanguageCode: 'en' as LanguageCodes }
    const updateUserAccountMock = jest.spyOn(UserApi, 'updateUserAccount').mockResolvedValue(expectedUserAccount)
    const updatePreferencesMock = jest.spyOn(UserApi, 'updatePreferences').mockResolvedValue(expectedPreferences)

    const router = renderPage('/user-account')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/user-account')
    })
    await checkPatientLayout(`${account.lastName} ${account.firstName}`)
    const fields = checkPatientProfilePage()
    const saveButton = screen.getByRole('button', { name: 'Save' })

    expect(fields.firstNameInput).toHaveValue(account.firstName)
    expect(fields.lastNameInput).toHaveValue(account.lastName)
    expect(fields.emailInput).toHaveValue(account.email)
    expect(fields.unitsSelect).toHaveTextContent(settings.units.bg)
    expect(fields.languageSelect).toHaveTextContent('Français')
    expect(fields.genderSelect).toHaveTextContent('Male')
    expect(saveButton).toBeDisabled()
    expect(screen.queryByTestId('country-selector')).not.toBeInTheDocument()

    fireEvent.mouseDown(within(screen.getByTestId('profile-local-selector')).getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: 'English' }))

    await userEvent.clear(fields.firstNameInput)
    await userEvent.clear(fields.lastNameInput)
    await userEvent.type(fields.firstNameInput, 'Jean')
    await userEvent.type(fields.lastNameInput, 'Tanrien')

    expect(saveButton).not.toBeDisabled()
    await userEvent.click(saveButton)

    expect(saveButton).toBeDisabled()
    expect(screen.getByRole('alert')).toBeVisible()
    expect(updatePreferencesMock).toHaveBeenCalledWith(loggedInUserId, expectedPreferences)
    expect(updateUserAccountMock).toHaveBeenCalledWith(loggedInUserId, expectedUserAccount)

    const changePasswordCategoryTitle = screen.queryByText('Security')
    expect(changePasswordCategoryTitle).not.toBeInTheDocument()
    const changePasswordInfoLabel = screen.queryByText('By clicking this button, you will receive an e-mail allowing you to change your password.')
    expect(changePasswordInfoLabel).not.toBeInTheDocument()
    const changePasswordButton = screen.queryByText('Change password')
    expect(changePasswordButton).not.toBeInTheDocument()
  })

  it('should render profile page without specific INS fields when patient is not French', async () => {
    settings.country = CountryCodes.Italy
    mockUserApi().mockUserDataFetch({ account, preferences, settings })
    await act(async () => {
      renderPage('/user-account')
    })
    checkPatientProfilePage()
  })
})
