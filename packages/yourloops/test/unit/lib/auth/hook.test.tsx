/**
 * Copyright (c) 2021, Diabeloop
 * Auth hook tests
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
import _ from 'lodash'
import * as auth0Mock from '@auth0/auth0-react'
import { Auth0Provider } from '@auth0/auth0-react'

import {
  AuthenticatedUserMetadata,
  Preferences,
  Profile,
  Settings,
  UserMetadata,
  UserRoles
} from '../../../../models/user'
import { AuthContext, AuthContextProvider, SignupForm, useAuth, User } from '../../../../lib/auth'
import { HcpProfession } from '../../../../models/hcp-profession'
import UserApi from '../../../../lib/auth/user-api'
import { Units } from '../../../../models/generic'

jest.mock('@auth0/auth0-react')

describe('Auth hook', () => {
  let auth: AuthContext | null = null
  const id = '0123456789'
  const userId = 'fakeUserId'
  const userId1 = 'fakeUserId1'
  const userId2 = 'fakeUserId2'
  const profile: Profile = {
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    email: 'fake@email.com',
    hcpProfession: HcpProfession.diabeto
  }
  const preferences: Preferences = { displayLanguageCode: 'en' }
  const settings: Settings = { country: 'FR', units: { bg: Units.gram } }

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
      await waitFor(() => expect(auth.isLoggedIn).toBeTruthy())
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
      logout: jest.fn()
    })
    jest.spyOn(UserApi, 'getUserMetadata').mockResolvedValue({ profile, preferences, settings })
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
      await auth.logout()
      expect(auth0Mock.useAuth0().logout).toHaveBeenCalledTimes(1)
    })
  })

  describe('Updates', () => {
    const updatedPreferences: Preferences = { displayLanguageCode: 'fr' }
    const updatedProfile: Profile = {
      ...profile,
      privacyPolicy: { acceptanceTimestamp: new Date().toISOString(), isAccepted: true }
    }
    const updatedSettings: Settings = { ...settings, country: 'EN' }

    beforeAll(() => {
      jest.spyOn(UserApi, 'updateProfile').mockResolvedValueOnce(updatedProfile)
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
      expect(auth.user.profile).toEqual(profile)

      await act(async () => {
        await auth.updateProfile({ ...updatedProfile })
      })
      expect(UserApi.updateProfile).toHaveBeenCalledWith(auth.user.id, updatedProfile)
      expect(auth.user.profile).toEqual(updatedProfile)
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

    /** TODO role changing was performed with a call to shoreline.
     *   Now it has to be done with Auth0 since role is a part of auth0 user metadata.
     *   see YLP-1590 (https://diabeloop.atlassian.net/browse/YLP-1590)
     **/

    it.skip('switchRoleToHCP should not call updateProfile if updateUser failed', async () => {
      jest.spyOn(UserApi, 'updateProfile').mockRejectedValue(_.noop)
      await initAuthContext()
      let error: Error | null = null
      try {
        await auth.switchRoleToHCP(false, HcpProfession.diabeto)
      } catch (reason) {
        error = reason
      }
      expect(error).toBeInstanceOf(Function)
      expect(UserApi.updateProfile).toHaveBeenCalledTimes(1)
    })

    it.skip('switchRoleToHCP should call updateProfile after updateUser', async () => {
      jest.spyOn(UserApi, 'updateProfile').mockResolvedValue({} as Profile)
      const now = Date.now()
      await initAuthContext()

      const user: User = { ...auth.user }
      user.role = UserRoles.hcp
      await act(async () => await auth.switchRoleToHCP(false, HcpProfession.diabeto))
      const updatedUser: User = auth.user

      expect(UserApi.updateProfile).toHaveBeenCalledTimes(1)
      expect(updatedUser.profile.termsOfUse.isAccepted).toBe(true)
      expect(updatedUser.profile.privacyPolicy.isAccepted).toBe(true)
      expect(Date.parse(updatedUser.profile.termsOfUse.acceptanceTimestamp)).toBeGreaterThanOrEqual(now)
      expect(Date.parse(updatedUser.profile.privacyPolicy.acceptanceTimestamp)).toBeGreaterThanOrEqual(now)
      expect(updatedUser.role).toBe(UserRoles.hcp)
    })

    it.skip('switchRoleToHCP should succeed (accept feedback)', async () => {
      const now = new Date()
      await initAuthContext()
      const updateProfileSpy = jest.spyOn(UserApi, 'updateProfile').mockResolvedValue(Promise.resolve(updatedProfile))

      await auth.switchRoleToHCP(true, HcpProfession.diabeto)

      expect(UserApi.updateProfile).toHaveBeenCalledTimes(1)
      const profile = updateProfileSpy.mock.calls[0][1]
      expect(typeof profile).toBe('object')
      expect(profile.termsOfUse).toBeDefined()
      expect(profile.privacyPolicy).toBeDefined()
      expect(profile.contactConsent).toBeDefined()
      expect(profile.termsOfUse.isAccepted).toBe(true)
      expect(profile.privacyPolicy.isAccepted).toBe(true)
      expect(profile.contactConsent.isAccepted).toBe(true)
      expect(Date.parse(profile.termsOfUse.acceptanceTimestamp)).toBeGreaterThanOrEqual(now.valueOf())
      expect(Date.parse(profile.privacyPolicy.acceptanceTimestamp)).toBeGreaterThanOrEqual(now.valueOf())
      expect(Date.parse(profile.contactConsent.acceptanceTimestamp)).toBeGreaterThanOrEqual(now.valueOf())
      expect(typeof auth.user.profile).toBe('object')
      expect(auth.user.profile.termsOfUse).toBeDefined()
      expect(auth.user.profile.privacyPolicy).toBeDefined()
      expect(auth.user.profile.contactConsent).toBeDefined()
      expect(auth.user.role).toBe(UserRoles.hcp)
    })

    it.skip('switchRoleToHCP should succeed (decline feedback)', async () => {
      const now = new Date()
      // const accepts = {
      //   acceptanceTimestamp: now.toISOString(),
      //   isAccepted: true
      // }
      // const decline = {
      //   acceptanceTimestamp: accepts.acceptanceTimestamp,
      //   isAccepted: false
      // }
      // authApiCaregiverStubs.updateProfile.mockResolvedValue({
      //   ...authCaregiver.profile,
      //   termsOfUse: accepts,
      //   privacyPolicy: accepts,
      //   contactConsent: decline
      // })
      await initAuthContext()

      await act(async () => await auth.switchRoleToHCP(false, HcpProfession.diabeto))

      expect(UserApi.updateProfile).toHaveBeenCalledTimes(1)
      expect(Date.parse(auth.user.profile.termsOfUse.acceptanceTimestamp)).toBeGreaterThanOrEqual(now.valueOf())
      expect(Date.parse(auth.user.profile.privacyPolicy.acceptanceTimestamp)).toBeGreaterThanOrEqual(now.valueOf())
      expect(Date.parse(auth.user.profile.contactConsent.acceptanceTimestamp)).toBeGreaterThanOrEqual(now.valueOf())
      expect(auth.user.profile.termsOfUse.isAccepted).toBe(true)
      expect(auth.user.profile.privacyPolicy.isAccepted).toBe(true)
      expect(auth.user.profile.contactConsent.isAccepted).toBe(false)
      expect(auth.user.role).toBe(UserRoles.hcp)
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
        displayLanguageCode: 'fr',
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
      jest.spyOn(UserApi, 'updateAuth0UserMetadata').mockResolvedValueOnce(undefined)
      jest.spyOn(UserApi, 'getUserMetadata').mockResolvedValueOnce(undefined)
      jest.spyOn(UserApi, 'updateProfile').mockResolvedValue(undefined)
      jest.spyOn(UserApi, 'updateSettings').mockResolvedValue(undefined)
      jest.spyOn(UserApi, 'updatePreferences').mockResolvedValue(undefined)
      const signupForm: SignupForm = {
        accountRole: UserRoles.hcp,
        profileFirstname: 'Tim',
        profileLastname: 'Hagine',
        hcpProfession: HcpProfession.nurse,
        preferencesLanguage: 'fr',
        profileCountry: 'fr',
        terms: true,
        privacyPolicy: true,
        feedback: true
      }
      await initAuthContext()

      expect(auth.user.profile).toBeUndefined()
      expect(auth.user.preferences).toBeUndefined()
      expect(auth.user.settings).toBeUndefined()

      await act(async () => {
        await auth.completeSignup(signupForm)
      })

      expect(auth.user.role).toEqual(UserRoles.hcp)
      expect(auth.user.profile.firstName).toEqual('Tim')
      expect(auth.user.profile.lastName).toEqual('Hagine')
      expect(auth.user.profile.fullName).toEqual('Tim Hagine')
      expect(auth.user.profile.hcpProfession).toEqual(HcpProfession.nurse)
      expect(auth.user.profile.termsOfUse.isAccepted).toBeTruthy()
      expect(auth.user.profile.privacyPolicy.isAccepted).toBeTruthy()
      expect(auth.user.profile.contactConsent.isAccepted).toBeTruthy()
      expect(auth.user.preferences.displayLanguageCode).toEqual('fr')
      expect(auth.user.settings.country).toEqual('fr')
    })
  })
})
