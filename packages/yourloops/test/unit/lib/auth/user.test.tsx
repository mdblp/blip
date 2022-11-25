/*
 * Copyright (c) 2021-2022, Diabeloop
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

import { AuthenticatedUserMetadata, UserRoles } from '../../../../models/user'
import config from '../../../../lib/config'
import User from '../../../../lib/auth/user.model'

describe('User', () => {
  let user: User
  const email = 'text@example.com'

  beforeAll(() => {
    config.LATEST_TERMS = '2021-01-01'
  })

  beforeEach(() => {
    user = new User({
      sub: 'auth0|abcd',
      email,
      [AuthenticatedUserMetadata.Roles]: [UserRoles.unset],
      email_verified: true
    })
  })

  afterEach(() => {
    user = null
  })

  it('should create the user', () => {
    expect(user.id).toBe('abcd')
    expect(user.username).toBe('text@example.com')
    expect(user.latestConsentChangeDate).toBeInstanceOf(Date)
    expect(user.latestConsentChangeDate.toISOString()).toBe('2021-01-01T00:00:00.000Z')
  })

  it('getFirstName', () => {
    expect(user.firstName).toBe('')
    user.profile = {
      fullName: 'Hello',
      firstName: 'Test',
      lastName: 'Example',
      email
    }
    expect(user.firstName).toBe('Test')
  })

  it('getLastName', () => {
    expect(user.lastName).toBe('text@example.com')
    user.profile = {
      fullName: 'Hello World',
      firstName: 'Test',
      email
    }
    expect(user.lastName).toBe('Hello World')
    user.profile = {
      fullName: 'Hello World',
      firstName: 'Test',
      lastName: 'Example',
      email
    }
    expect(user.lastName).toBe('Example')
  })

  it('getFullName', () => {
    expect(user.fullName).toBe('text@example.com')
    user.profile = {
      fullName: 'Barack Afritt',
      email
    }
    expect(user.fullName).toBe('Barack Afritt')
  })

  it('shouldAcceptConsent', () => {
    expect(user.shouldAcceptConsent()).toBe(true)
    user.profile = {
      fullName: 'Test Example',
      termsOfUse: {},
      email
    }
    expect(user.shouldAcceptConsent()).toBe(true)
    user.profile.termsOfUse.isAccepted = false
    expect(user.shouldAcceptConsent()).toBe(true)
    user.profile.termsOfUse.isAccepted = true
    expect(user.shouldAcceptConsent()).toBe(true)
    user.profile.privacyPolicy = {}
    expect(user.shouldAcceptConsent()).toBe(true)
    user.profile.privacyPolicy.isAccepted = false
    expect(user.shouldAcceptConsent()).toBe(true)
    user.profile.privacyPolicy.isAccepted = true
    expect(user.shouldAcceptConsent()).toBe(false)
  })

  it('shouldRenewConsent', () => {
    expect(user.shouldRenewConsent()).toBe(true)
    user.profile = {
      fullName: 'Test Example',
      email
    }
    expect(user.shouldRenewConsent()).toBe(true)
    user.profile.termsOfUse = null
    expect(user.shouldRenewConsent()).toBe(true)
    user.profile.termsOfUse = {}
    expect(user.shouldRenewConsent()).toBe(true)
    user.profile.privacyPolicy = null
    expect(user.shouldRenewConsent()).toBe(true)
    user.profile.privacyPolicy = {}
    expect(user.shouldRenewConsent()).toBe(true)
    user.profile.termsOfUse.acceptanceTimestamp = 'an invalid string date'
    expect(user.shouldRenewConsent()).toBe(true)
    user.profile.termsOfUse.acceptanceTimestamp = '2020-12-01'
    expect(user.shouldRenewConsent()).toBe(true)
    user.profile.termsOfUse.acceptanceTimestamp = '2021-01-02'
    user.profile.privacyPolicy.acceptanceTimestamp = '2020-12-01'
    expect(user.shouldRenewConsent()).toBe(true)
    user.profile.privacyPolicy.acceptanceTimestamp = '2021-01-02'
    expect(user.shouldRenewConsent()).toBe(false)
  })

  it('getParsedFrProId should return null when user frProId is null', () => {
    const res = user.getParsedFrProId()
    expect(res).toBeNull()
  })

  it('getParsedFrProId should return correct result when user frProId is not null', () => {
    const expectedRes = 'value'
    user.frProId = `key:uid:${expectedRes}`
    const actualRes = user.getParsedFrProId()
    expect(actualRes).toBe(expectedRes)
  })
})
