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

import config from '../../../../../lib/config/config'
import User from '../../../../../lib/auth/models/user.model'
import { UserRole } from '../../../../../lib/auth/models/enums/user-role.enum'
import { AuthenticatedUserMetadata } from '../../../../../lib/auth/models/enums/authenticated-user-metadata.enum'
import { type UserAccount } from '../../../../../lib/auth/models/user-account.model'
import { isDblCommunicationAcknowledged } from '../../../../../lib/dbl-communication/storage'

jest.mock('../../../../../lib/dbl-communication/storage', () => ({
  isDblCommunicationAcknowledged: jest.fn()
}))

describe('User', () => {
  const email = 'text@example.com'

  beforeAll(() => {
    config.LATEST_TERMS = '2021-01-01'
  })

  function createUser(role: UserRole = UserRole.Unset) {
    return new User({
      sub: 'auth0|abcd',
      email,
      [AuthenticatedUserMetadata.Roles]: [role],
      email_verified: true
    })
  }

  it('should create the user', () => {
    const user = createUser()
    expect(user.id).toBe('abcd')
    expect(user.username).toBe('text@example.com')
    expect(user.latestConsentChangeDate).toBeInstanceOf(Date)
    expect(user.latestConsentChangeDate.toISOString()).toBe('2021-01-01T00:00:00.000Z')
  })

  it('getFirstName', () => {
    const user = createUser()
    expect(user.firstName).toBe('')
    user.account = {
      fullName: 'Hello',
      firstName: 'Test',
      lastName: 'Example',
      email
    }
    expect(user.firstName).toBe('Test')
  })

  it('getLastName', () => {
    const user = createUser()
    expect(user.lastName).toBe('text@example.com')
    user.account = {
      fullName: 'Hello World',
      firstName: 'Test',
      email
    }
    expect(user.lastName).toBe('Hello World')
    user.account = {
      fullName: 'Hello World',
      firstName: 'Test',
      lastName: 'Example',
      email
    }
    expect(user.lastName).toBe('Example')
  })

  it('getFullName', () => {
    const user = createUser()
    expect(user.fullName).toBe('text@example.com')
    user.account = {
      fullName: 'Barack Afritt',
      email
    }
    expect(user.fullName).toBe('Barack Afritt')
  })

  it('shouldAcceptConsent', () => {
    const user = createUser()
    expect(user.shouldAcceptConsent()).toBe(true)
    user.account = {
      fullName: 'Test Example',
      termsOfUse: {},
      email
    }
    expect(user.shouldAcceptConsent()).toBe(true)
    user.account.termsOfUse.isAccepted = false
    expect(user.shouldAcceptConsent()).toBe(true)
    user.account.termsOfUse.isAccepted = true
    expect(user.shouldAcceptConsent()).toBe(true)
    user.account.privacyPolicy = {}
    expect(user.shouldAcceptConsent()).toBe(true)
    user.account.privacyPolicy.isAccepted = false
    expect(user.shouldAcceptConsent()).toBe(true)
    user.account.privacyPolicy.isAccepted = true
    expect(user.shouldAcceptConsent()).toBe(false)
  })

  it('shouldRenewConsent', () => {
    const user = createUser()
    expect(user.shouldRenewConsent()).toBe(true)
    user.account = {
      fullName: 'Test Example',
      email
    }
    expect(user.shouldRenewConsent()).toBe(true)
    user.account.termsOfUse = null
    expect(user.shouldRenewConsent()).toBe(true)
    user.account.termsOfUse = {}
    expect(user.shouldRenewConsent()).toBe(true)
    user.account.privacyPolicy = null
    expect(user.shouldRenewConsent()).toBe(true)
    user.account.privacyPolicy = {}
    expect(user.shouldRenewConsent()).toBe(true)
    user.account.termsOfUse.acceptanceTimestamp = 'an invalid string date'
    expect(user.shouldRenewConsent()).toBe(true)
    user.account.termsOfUse.acceptanceTimestamp = '2020-12-01'
    expect(user.shouldRenewConsent()).toBe(true)
    user.account.termsOfUse.acceptanceTimestamp = '2021-01-02'
    user.account.privacyPolicy.acceptanceTimestamp = '2020-12-01'
    expect(user.shouldRenewConsent()).toBe(true)
    user.account.privacyPolicy.acceptanceTimestamp = '2021-01-02'
    expect(user.shouldRenewConsent()).toBe(false)
  })

  describe('hasToDisplayDblCommunicationPage', () => {

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('hasToDisplayDblCommunicationPage - should return false when newDblCommunication is undefined', () => {
      const user = createUser()
      expect(user.hasToDisplayDblCommunicationPage()).toBe(false)
    })

    it('hasToDisplayDblCommunicationPage - should return false when communication is acknowledged', () => {
      const user = createUser()
      user.newDblCommunication = { id: 'comm-1', title: 'New Communication', content: 'Content' };

      (isDblCommunicationAcknowledged as jest.Mock).mockReturnValue(true)

      expect(user.hasToDisplayDblCommunicationPage()).toBe(false)
      expect(isDblCommunicationAcknowledged).toHaveBeenCalledWith('comm-1')
    })

    it('hasToDisplayDblCommunicationPage - should return true when communication is not acknowledged', () => {
      const user = createUser()
      user.newDblCommunication = { id: 'comm-1', title: 'New Communication', content: 'Content' };

      (isDblCommunicationAcknowledged as jest.Mock).mockReturnValue(false)

      expect(user.hasToDisplayDblCommunicationPage()).toBe(true)
      expect(isDblCommunicationAcknowledged).toHaveBeenCalledWith('comm-1')
    })
  })

  describe('Get birthday', () => {
    it('should return the birthday if user is a patient and has a birthday in his profile', () => {
      const user = createUser(UserRole.Patient)
      user.account = { patient: { birthday: '1985-05-23T05:45:00Z07:00' } } as UserAccount
      expect(user.birthday).toEqual('1985-05-23')
    })

    it('should return an empty string if patient has no birthday in his profile', () => {
      const user = createUser(UserRole.Patient)
      expect(user.birthday).toEqual('')
    })

    it('should return undefined if user is not a patient', () => {
      const user = createUser(UserRole.Hcp)
      expect(user.birthday).toBeUndefined()
    })
  })
})
