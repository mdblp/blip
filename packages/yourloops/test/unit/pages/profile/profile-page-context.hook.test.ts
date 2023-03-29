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

import { act, renderHook } from '@testing-library/react'
import * as authHookMock from '../../../../lib/auth'
import { type User } from '../../../../lib/auth'
import * as patientContext from '../../../../lib/patient/patient.provider'
import * as alertMock from '../../../../components/utils/snackbar'
import useProfilePageContextHook from '../../../../pages/profile/profil-page-context.hook'
import { type Profile } from '../../../../lib/auth/models/profile.model'
import { type Settings } from '../../../../lib/auth/models/settings.model'
import { CountryCodes } from '../../../../lib/auth/models/country.model'
import { type Preferences } from '../../../../lib/auth/models/preferences.model'
import { UnitsType } from 'dumb'
import { UserRole } from '../../../../lib/auth/models/enums/user-role.enum'
import { ProfileFormKey } from '../../../../pages/profile/models/enums/profile-form-key.enum'
import { LanguageCodes } from '../../../../lib/auth/models/enums/language-codes.enum'

jest.mock('../../../../lib/auth')
jest.mock('../../../../lib/patient/patient.provider')
jest.mock('../../../../components/utils/snackbar')

describe('Profile page context hook', () => {
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
      ssn: '012345678901234'
    },
    termsOfUse: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
    privacyPolicy: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
    trainingAck: { acceptanceTimestamp: '2022-10-11', isAccepted: true }
  }
  const settings: Settings = {
    a1c: {
      rawdate: '2020-01-01',
      value: '7.5'
    },
    country: CountryCodes.France,
    units: { bg: UnitsType.MMOLL }
  }
  const preferences: Preferences = { displayLanguageCode: LanguageCodes.Fr }
  const onSuccessAlertMock = jest.fn()
  const onErrorAlertMock = jest.fn()
  const updateProfileMock = jest.fn()
  const updateSettingsMock = jest.fn()
  const updatePreferencesMock = jest.fn()
  const refreshPatientMock = jest.fn()

  beforeEach(() => {
    (patientContext.usePatientContext as jest.Mock).mockImplementation(() => ({
      refresh: refreshPatientMock
    }));
    (alertMock.useAlert as jest.Mock).mockImplementation(() => ({
      success: onSuccessAlertMock,
      error: onErrorAlertMock
    }));
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        updateProfile: updateProfileMock,
        updateSettings: updateSettingsMock,
        updatePreferences: updatePreferencesMock,
        user: {
          role: UserRole.Patient,
          isUserHcp: () => false,
          isUserCaregiver: () => false,
          isUserPatient: () => true,
          profile,
          preferences,
          settings,
          firstName: profile.firstName,
          lastName: profile.lastName,
          birthday: profile.patient.birthday
        } as User
      }
    })
  })

  async function renderCustomHook() {
    let hook
    await act(async () => {
      hook = renderHook(() => useProfilePageContextHook())
    })
    return hook
  }

  it('should save profile when user change some fields', async () => {
    const firstName = 'Odile'
    const lastName = 'Deray'
    const expectedProfile = { ...profile, firstName, lastName, fullName: `${firstName} ${lastName}` }
    const expectedSettings = { ...settings, units: { bg: UnitsType.MGDL } }
    const expectedPreferences = { displayLanguageCode: 'en' }

    const { result } = await renderCustomHook()
    const { updateProfileForm } = result.current

    act(() => {
      updateProfileForm(ProfileFormKey.firstName, firstName)
      updateProfileForm(ProfileFormKey.lastName, lastName)
      updateProfileForm(ProfileFormKey.units, UnitsType.MGDL)
      updateProfileForm(ProfileFormKey.lang, 'en')
    })

    await act(async () => {
      await result.current.saveProfile()
    })

    expect(updateProfileMock).toHaveBeenCalledWith(expectedProfile)
    expect(updateSettingsMock).toHaveBeenCalledWith(expectedSettings)
    expect(updatePreferencesMock).toHaveBeenCalledWith(expectedPreferences)
    expect(refreshPatientMock).toHaveBeenCalled()
    expect(onSuccessAlertMock).toHaveBeenCalled()
  })

  it('should throw an error if a problem occurred when saving profile', async () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        updateProfile: jest.fn().mockRejectedValue(undefined),
        user: {
          role: UserRole.Patient,
          isUserHcp: () => false,
          isUserCaregiver: () => false,
          isUserPatient: () => true
        } as User
      }
    })

    const { result } = await renderCustomHook()

    await act(async () => {
      await result.current.saveProfile()
    })
    expect(onErrorAlertMock).toHaveBeenCalled()
  })
})
