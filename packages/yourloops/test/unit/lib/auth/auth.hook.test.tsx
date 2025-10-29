/*
 * Copyright (c) 2021-2025, Diabeloop
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
import { render, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import * as auth0Mock from '@auth0/auth0-react'
import { Auth0Provider } from '@auth0/auth0-react'
import { type AuthContext, AuthContextProvider, type SignupForm, useAuth, type User } from '../../../../lib/auth'
import { HcpProfession } from '../../../../lib/auth/models/enums/hcp-profession.enum'
import UserApi from '../../../../lib/auth/user.api'
import { type UserAccount } from '../../../../lib/auth/models/user-account.model'
import { type Preferences } from '../../../../lib/auth/models/preferences.model'
import { type Settings } from '../../../../lib/auth/models/settings.model'
import { AuthenticatedUserMetadata } from '../../../../lib/auth/models/enums/authenticated-user-metadata.enum'
import { UserRole } from '../../../../lib/auth/models/enums/user-role.enum'
import { type UserMetadata } from '../../../../lib/auth/models/user-metadata.model'
import { CountryCodes } from '../../../../lib/auth/models/country.model'
import { LanguageCodes } from '../../../../lib/auth/models/enums/language-codes.enum'
import { Unit } from 'medical-domain'

jest.mock('@auth0/auth0-react')

describe('Auth hook', () => {
  let auth: AuthContext | null = null
  const id = '0123456789'
  const userId = 'fakeUserId'
  const userId1 = 'fakeUserId1'
  const userId2 = 'fakeUserId2'
  const account: UserAccount = {
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    email: 'fake@email.com',
    hcpProfession: HcpProfession.diabeto
  }
  const preferences: Preferences = { displayLanguageCode: LanguageCodes.En }
  const settings: Settings = { country: CountryCodes.France, units: { bg: Unit.MilligramPerDeciliter } }

  const initAuthContext = async (): Promise<void> => {
    auth = null
    const DummyComponent = (): JSX.Element => {
      auth = useAuth()
      return <div />
    }
    await act(async () => {
      render(
        <Auth0Provider clientId="__test_client_id__" domain="__test_domain__">
          <AuthContextProvider>
            <DummyComponent />
          </AuthContextProvider>
        </Auth0Provider>
      )
    })
    await waitFor(() => {
      expect(auth.isLoggedIn).toBeTruthy()
    })
  }

  beforeEach(() => {
    (auth0Mock.Auth0Provider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children
    });
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: {
        email: 'john.doe@example.com',
        email_verified: true,
        sub: `auth0|${id}`,
        [AuthenticatedUserMetadata.Roles]: ['caregiver']
      },
      logout: jest.fn(),
      getAccessTokenWithPopup: jest.fn()
    })
    jest.spyOn(UserApi, 'getUserMetadata').mockResolvedValue({ profile: account, preferences, settings })
  })

  describe('Initialization', () => {
    it('should getUserInfo when authentication is successfully done', async () => {
      await initAuthContext()
      expect(auth.user.username).toBe('john.doe@example.com')
    })
  })

  describe('Logout', () => {
    it('should logout the logged-in user', async () => {
      await initAuthContext()
      expect(auth.user).not.toBeNull()
      expect(auth.isLoggedIn).toBeTruthy()
      auth.logout()
      expect(auth0Mock.useAuth0().logout).toHaveBeenCalledTimes(1)
      expect(auth0Mock.useAuth0().logout).toHaveBeenCalledWith({ logoutParams: { returnTo: 'http://localhost/login' } })
    })

    it('should logout the logged-in idle user', async () => {
      await initAuthContext()
      expect(auth.user).not.toBeNull()
      expect(auth.isLoggedIn).toBeTruthy()
      auth.logout(true)
      expect(auth0Mock.useAuth0().logout).toHaveBeenCalledTimes(1)
      expect(auth0Mock.useAuth0().logout).toHaveBeenCalledWith({ logoutParams: { returnTo: 'http://localhost/login?idle=true' } })
    })
  })

  describe('Updates', () => {
    const updatedPreferences: Preferences = { displayLanguageCode: LanguageCodes.Fr }
    const updatedUserAccount: UserAccount = {
      ...account,
      privacyPolicy: { acceptanceTimestamp: new Date().toISOString(), isAccepted: true }
    }
    const updatedSettings: Settings = { ...settings, country: CountryCodes.Italy }

    beforeAll(() => {
      jest.spyOn(UserApi, 'updateUserAccount').mockResolvedValueOnce(updatedUserAccount)
      jest.spyOn(UserApi, 'updatePreferences').mockResolvedValueOnce(updatedPreferences)
      jest.spyOn(UserApi, 'updateSettings').mockResolvedValueOnce(updatedSettings)
    })

    it('updatePreferences should call the API with the good parameters', async () => {
      await initAuthContext()
      expect(auth.user.preferences).toEqual(preferences)
      await act(async () => {
        await auth.updatePreferences({ ...updatedPreferences })
      })
      expect(UserApi.updatePreferences).toHaveBeenCalledWith(auth.user.id, updatedPreferences)
      expect(auth.user.preferences).toEqual(updatedPreferences)
    })

    it('updateProfile should call the API with the good parameters', async () => {
      await initAuthContext()
      expect(auth.user.account).toEqual(account)

      await act(async () => {
        await auth.updateUserAccount({ ...updatedUserAccount })
      })
      expect(UserApi.updateUserAccount).toHaveBeenCalledWith(auth.user.id, updatedUserAccount)
      expect(auth.user.account).toEqual(updatedUserAccount)
    })

    it('updateSettings should call the API with the good parameters', async () => {
      await initAuthContext()
      expect(auth.user.settings).toEqual(settings)

      await act(async () => {
        await auth.updateSettings({ ...updatedSettings })
      })
      expect(UserApi.updateSettings).toHaveBeenCalledWith(auth.user.id, updatedSettings)
      expect(auth.user.settings).toEqual(updatedSettings)
    })
  })

  describe('Change role from Caregiver to Hcp', () => {
    it('should change the user role', async () => {
      jest.spyOn(UserApi, 'changeUserRoleToHcp').mockResolvedValue(undefined)
      jest.spyOn(UserApi, 'getUserMetadata').mockResolvedValue({
        profile: { ...account, hcpProfession: undefined },
        preferences,
        settings
      })

      const now = Date.now()
      await initAuthContext()
      await act(async () => {
        await auth.switchRoleToHCP(false, HcpProfession.diabeto)
      })
      const updatedUser: User = auth.user

      expect(UserApi.changeUserRoleToHcp).toHaveBeenCalledTimes(1)
      expect(updatedUser.account.termsOfUse.isAccepted).toBe(true)
      expect(updatedUser.account.privacyPolicy.isAccepted).toBe(true)
      expect(Date.parse(updatedUser.account.termsOfUse.acceptanceTimestamp)).toBeGreaterThanOrEqual(now)
      expect(Date.parse(updatedUser.account.privacyPolicy.acceptanceTimestamp)).toBeGreaterThanOrEqual(now)
      expect(updatedUser.role).toBe(UserRole.Hcp)
      expect(updatedUser.account.hcpProfession).toEqual(HcpProfession.diabeto)
      expect(updatedUser.account.contactConsent.isAccepted).toBeFalsy()
    })
  })

  describe('Flag patient', () => {
    it('should flag a un-flagged patient', async () => {
      jest.spyOn(UserApi, 'updatePreferences').mockResolvedValueOnce({ patientsStarred: [userId] })
      await initAuthContext()
      await act(async () => {
        await auth.flagPatient(userId)
      })
      expect(UserApi.updatePreferences).toHaveBeenCalledTimes(1)
      expect(auth.getFlagPatients()).toEqual([userId])
    })

    it('should un-flag a flagged patient', async () => {
      const otherUserId = 'otherUserId'
      jest.spyOn(UserApi, 'getUserMetadata').mockResolvedValueOnce({
        preferences: {
          displayLanguageCode: 'en',
          patientsStarred: [userId, otherUserId]
        }
      } as UserMetadata)
      jest.spyOn(UserApi, 'updatePreferences').mockResolvedValueOnce({ patientsStarred: [otherUserId] })
      await initAuthContext()
      await act(async () => {
        await auth.flagPatient(userId)
      })
      expect(UserApi.updatePreferences).toHaveBeenCalledTimes(1)
      expect(auth.getFlagPatients()).toEqual([otherUserId])
    })

    it('should add another user to an existing list', async () => {
      jest.spyOn(UserApi, 'updatePreferences').mockResolvedValueOnce({ patientsStarred: [userId1] })
      jest.spyOn(UserApi, 'updatePreferences').mockResolvedValueOnce({ patientsStarred: [userId1, userId2] })
      jest.spyOn(UserApi, 'getUserMetadata').mockResolvedValueOnce({
        preferences: {
          displayLanguageCode: 'en',
          patientsStarred: []
        }
      } as UserMetadata)
      await initAuthContext()
      expect(auth.getFlagPatients()).toEqual([])

      await act(async () => {
        await auth.flagPatient(userId1)
      })
      expect(UserApi.updatePreferences).toHaveBeenCalledTimes(1)
      expect(auth.getFlagPatients()).toEqual([userId1])

      await act(async () => {
        await auth.flagPatient(userId2)
      })
      expect(UserApi.updatePreferences).toHaveBeenCalledTimes(2)
      expect(auth.getFlagPatients()).toEqual([userId1, userId2])
    })

    it('setFlagPatients should replace the currently flagged patient', async () => {
      const userId = '0123456789'
      jest.spyOn(UserApi, 'updatePreferences').mockResolvedValueOnce({
        displayLanguageCode: LanguageCodes.Fr,
        patientsStarred: [userId]
      })
      jest.spyOn(UserApi, 'getUserMetadata').mockResolvedValueOnce(Promise.resolve({
        preferences: {
          displayLanguageCode: 'en',
          patientsStarred: ['old']
        }
      } as UserMetadata))
      await initAuthContext()
      expect(auth.getFlagPatients()).toEqual(['old'])
      await act(async () => {
        await auth.setFlagPatients([userId])
      })
      expect(UserApi.updatePreferences).toHaveBeenCalledTimes(1)
      expect(auth.getFlagPatients()).toEqual([userId])
    })
  })

  describe('completeSignup', () => {
    it('should update user profile, preferences and settings', async () => {
      jest.spyOn(UserApi, 'completeUserSignup').mockResolvedValueOnce(undefined)
      jest.spyOn(UserApi, 'getUserMetadata').mockResolvedValueOnce(undefined)
      jest.spyOn(UserApi, 'updateUserAccount').mockResolvedValue(undefined)
      jest.spyOn(UserApi, 'updateSettings').mockResolvedValue(undefined)
      jest.spyOn(UserApi, 'updatePreferences').mockResolvedValue(undefined)
      const signupForm: SignupForm = {
        accountRole: UserRole.Hcp,
        profileFirstname: 'Tim',
        profileLastname: 'Hagine',
        hcpProfession: HcpProfession.nurse,
        preferencesLanguage: LanguageCodes.Fr,
        profileCountry: CountryCodes.France,
        terms: true,
        privacyPolicy: true,
        feedback: true
      }
      await initAuthContext()

      expect(auth.user.account).toBeUndefined()
      expect(auth.user.preferences).toBeUndefined()
      expect(auth.user.settings).toBeUndefined()

      await act(async () => {
        await auth.completeSignup(signupForm)
      })

      expect(auth.user.role).toEqual(UserRole.Hcp)
      expect(auth.user.account.firstName).toEqual('Tim')
      expect(auth.user.account.lastName).toEqual('Hagine')
      expect(auth.user.account.fullName).toEqual('Tim Hagine')
      expect(auth.user.account.hcpProfession).toEqual(HcpProfession.nurse)
      expect(auth.user.account.termsOfUse.isAccepted).toBeTruthy()
      expect(auth.user.account.privacyPolicy.isAccepted).toBeTruthy()
      expect(auth.user.account.contactConsent.isAccepted).toBeTruthy()
      expect(auth.user.preferences.displayLanguageCode).toEqual(LanguageCodes.Fr)
      expect(auth.user.settings.country).toEqual(CountryCodes.France)
    })
  })
})
