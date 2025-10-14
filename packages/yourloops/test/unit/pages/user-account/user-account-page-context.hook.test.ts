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

import { act, renderHook } from '@testing-library/react'
import * as authHookMock from '../../../../lib/auth'
import { type User } from '../../../../lib/auth'
import * as alertMock from '../../../../components/utils/snackbar'
import { type UserAccount } from '../../../../lib/auth/models/user-account.model'
import { type Settings } from '../../../../lib/auth/models/settings.model'
import { CountryCodes } from '../../../../lib/auth/models/country.model'
import { type Preferences } from '../../../../lib/auth/models/preferences.model'
import { UserRole } from '../../../../lib/auth/models/enums/user-role.enum'
import { LanguageCodes } from '../../../../lib/auth/models/enums/language-codes.enum'
import { Unit } from 'medical-domain'
import { Gender } from '../../../../lib/auth/models/enums/gender.enum'
import { UserAccountFormKey } from '../../../../pages/user-account/models/enums/profile-form-key.enum'
import useUserAccountPageContextHook from '../../../../pages/user-account/user-account-page-context.hook'

jest.mock('../../../../lib/auth')
jest.mock('../../../../components/utils/snackbar')

describe('User account page context hook', () => {
  const account: UserAccount = {
    email: 'elie@coptere.com',
    firstName: 'Elie',
    lastName: 'Coptere',
    fullName: 'Elie Coptere',
    patient: {
      birthday: '1964-12-01',
      birthPlace: 'Anywhere',
      diagnosisDate: '2020-12-02',
      diagnosisType: '1',
      sex: Gender.Male,
    },
    termsOfUse: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
    privacyPolicy: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
    trainingAck: { acceptanceTimestamp: '2022-10-11', isAccepted: true }
  }
  const settings: Settings = {
    a1c: {
      rawdate: '2020-01-01',
      value: '7.5',
      date: '2020-01-01'
    },
    country: CountryCodes.France,
    units: { bg: Unit.MmolPerLiter }
  }
  const preferences: Preferences = { displayLanguageCode: LanguageCodes.Fr }
  const onSuccessAlertMock = jest.fn()
  const onErrorAlertMock = jest.fn()
  const updateUserAccountMock = jest.fn()
  const updateSettingsMock = jest.fn()
  const updatePreferencesMock = jest.fn()

  beforeEach(() => {
    (alertMock.useAlert as jest.Mock).mockImplementation(() => ({
      success: onSuccessAlertMock,
      error: onErrorAlertMock
    }));
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        updateUserAccount: updateUserAccountMock,
        updateSettings: updateSettingsMock,
        updatePreferences: updatePreferencesMock,
        user: {
          role: UserRole.Patient,
          isUserHcp: () => false,
          isUserCaregiver: () => false,
          isUserPatient: () => true,
          account,
          preferences,
          settings,
          firstName: account.firstName,
          lastName: account.lastName,
          birthday: account.patient.birthday
        } as User
      }
    })
  })

  it('should save profile when user change some fields', async () => {
    const firstName = 'Odile'
    const lastName = 'Deray'
    const expectedUserAccount = { ...account, firstName, lastName, fullName: `${firstName} ${lastName}` }
    const expectedSettings = { ...settings, units: { bg: Unit.MilligramPerDeciliter } }
    const expectedPreferences = { displayLanguageCode: 'en' }
    const { result } = renderHook(() => useUserAccountPageContextHook())
    const { updateUserAccountForm } = result.current
    await act(async () => {
      updateUserAccountForm(UserAccountFormKey.firstName, firstName)
      updateUserAccountForm(UserAccountFormKey.lastName, lastName)
      updateUserAccountForm(UserAccountFormKey.units, Unit.MilligramPerDeciliter)
      updateUserAccountForm(UserAccountFormKey.lang, 'en')
    })
    await act(async () => {
      await result.current.saveUserAccount()
    })
    expect(updateUserAccountMock).toHaveBeenCalledWith(expectedUserAccount)
    expect(updateSettingsMock).toHaveBeenCalledWith(expectedSettings)
    expect(updatePreferencesMock).toHaveBeenCalledWith(expectedPreferences)
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
          isUserPatient: () => true,
          settings
        } as User
      }
    })

    const { result } = renderHook(() => useUserAccountPageContextHook())
    await act(async () => {
      await result.current.saveUserAccount()
    })
    expect(onErrorAlertMock).toHaveBeenCalled()
  })
})
