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

import { renderPage } from '../../utils/render'
import { loggedInUserId, mockAuth0Hook } from '../../mock/mockAuth0Hook'
import { Preferences, Profile, Settings, UserRoles } from '../../../../models/user'
import { mockUserDataFetch } from '../../mock/auth'
import { mockTeamAPI } from '../../mock/mockTeamAPI'
import { mockNotificationAPI } from '../../mock/mockNotificationAPI'
import { act, fireEvent, screen, within } from '@testing-library/react'
import { checkPatientLayout } from '../../assert/layout'
import { mockDirectShareApi } from '../../mock/mockDirectShareAPI'
import { mockPatientAPI } from '../../mock/mockPatientAPI'
import { checkPatientProfilePage } from '../../assert/profile'
import userEvent from '@testing-library/user-event'
import { Units } from '../../../../models/generic'
import UserApi from '../../../../lib/auth/user-api'
import { LanguageCodes } from '../../../../models/locales'

describe('Profile page for patient', () => {
  const profile: Profile = {
    email: 'elie@coptere.com',
    firstName: 'Elie',
    lastName: 'Coptere',
    fullName: 'Elie Coptere',
    patient: {
      birthday: '1964-12-01',
      birthPlace: 'Anywhere',
      diagnosisDate: '2020-12-02',
      diagnosisType: '1',
      referringDoctor: 'Dr Dre',
      sex: 'M',
      ins: '123456789012345',
      ssn: '012345678901234',
      birthFirstName: 'Elie',
      birthLastName: 'Coptere',
      birthNames: 'Elie Damien Jean',
      birthPlaceInseeCode: '38100',
      oid: 'oid'
    },
    termsOfUse: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
    privacyPolicy: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
    trainingAck: { acceptanceTimestamp: '2022-10-11', isAccepted: true }
  }
  const settings: Settings = {
    a1c: {
      date: '2020-01-01',
      value: '7.5'
    },
    country: 'FR',
    units: { bg: Units.mole }
  }
  const preferences: Preferences = { displayLanguageCode: 'fr' }

  beforeAll(() => {
    mockAuth0Hook(UserRoles.patient)
    mockUserDataFetch({ profile, preferences, settings })
    mockNotificationAPI()
    mockDirectShareApi()
    mockTeamAPI()
    mockPatientAPI()
  })

  it('should render profile page for a french patient and be able to edit his profile', async () => {
    const expectedProfile = { ...profile, firstName: 'Jean', lastName: 'Tanrien', fullName: 'Jean Tanrien' }
    const expectedPreferences = { displayLanguageCode: 'en' as LanguageCodes }
    const updateProfileMock = jest.spyOn(UserApi, 'updateProfile').mockResolvedValue(expectedProfile)
    const updatePreferencesMock = jest.spyOn(UserApi, 'updatePreferences').mockResolvedValue(expectedPreferences)

    await act(async () => {
      renderPage('/preferences')
    })
    checkPatientLayout(`${profile.firstName} ${profile.lastName}`)
    const fields = checkPatientProfilePage(settings.country)
    const saveButton = screen.getByRole('button', { name: 'Save' })

    expect(fields.firstNameInput).toHaveValue(profile.firstName)
    expect(fields.lastNameInput).toHaveValue(profile.lastName)
    expect(fields.birthdayInput).toHaveValue(profile.patient.birthday)
    expect(fields.birthPlaceInput).toHaveValue(profile.patient.birthPlace)
    expect(fields.birthFirstNameInput).toHaveValue(profile.patient.birthFirstName)
    expect(fields.birthLastNameInput).toHaveValue(profile.patient.birthLastName)
    expect(fields.birthNamesInput).toHaveValue(profile.patient.birthNames)
    expect(fields.birthPlaceZipcodeInput).toHaveValue(profile.patient.birthPlaceInseeCode)
    expect(fields.insInput).toHaveValue(profile.patient.ins)
    expect(fields.ssnInput).toHaveValue(profile.patient.ssn)
    expect(fields.oidInput).toHaveValue(profile.patient.oid)
    expect(fields.unitsSelect).toHaveTextContent(settings.units.bg)
    expect(fields.languageSelect).toHaveTextContent('Français')
    expect(fields.genderSelect).toHaveTextContent('Male')
    expect(fields.referringDoctorInput).toHaveValue(profile.patient.referringDoctor)
    expect(saveButton).toBeDisabled()

    fireEvent.mouseDown(within(screen.getByTestId('profile-local-selector')).getByRole('button'))
    fireEvent.click(screen.getByRole('option', { name: 'English' }))

    userEvent.clear(fields.firstNameInput)
    userEvent.clear(fields.lastNameInput)
    await userEvent.type(fields.firstNameInput, 'Jean')
    await userEvent.type(fields.lastNameInput, 'Tanrien')

    expect(saveButton).not.toBeDisabled()
    await act(async () => {
      userEvent.click(saveButton)
    })

    expect(saveButton).toBeDisabled()
    expect(screen.getByRole('alert')).toBeVisible()
    expect(updatePreferencesMock).toHaveBeenCalledWith(loggedInUserId, expectedPreferences)
    expect(updateProfileMock).toHaveBeenCalledWith(loggedInUserId, expectedProfile)
  })

  it('should render profile page without specific INS fields when patient is not french', async () => {
    settings.country = 'EN'
    mockUserDataFetch({ profile, preferences, settings })
    await act(async () => {
      renderPage('/preferences')
    })
    checkPatientLayout(`${profile.firstName} ${profile.lastName}`)
    checkPatientProfilePage(settings.country)
  })
})
