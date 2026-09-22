/*
 * Copyright (c) 2022-2026, Diabeloop
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

import type User from '../../../lib/auth/models/user.model'
import { getRedirectUrl, USER_GATES } from '../../../app/main-lobby'
import { AppRoute } from '../../../models/enums/routes.enum'

interface UserGateFlags {
  isFirstLogin?: boolean
  hasToAcceptNewConsent?: boolean
  hasToRenewConsent?: boolean
  hasToDisplayTrainingInfoPage?: boolean
  hasToDisplayDblCommunicationPage?: boolean
}

const buildUser = (flags: UserGateFlags = {}): User => ({
  isFirstLogin: () => flags.isFirstLogin ?? false,
  hasToAcceptNewConsent: () => flags.hasToAcceptNewConsent ?? false,
  hasToRenewConsent: () => flags.hasToRenewConsent ?? false,
  hasToDisplayTrainingInfoPage: () => flags.hasToDisplayTrainingInfoPage ?? false,
  hasToDisplayDblCommunicationPage: () => flags.hasToDisplayDblCommunicationPage ?? false
} as unknown as User)

describe('Main lobby', () => {
  describe('getRedirectUrl', () => {
    function testGetRedirectUrl(route: string, user: User | null, isAuthenticated: boolean, expectedUrlToRedirectTo: string | undefined) {
      const urlToRedirectTo = getRedirectUrl(route, user, isAuthenticated)
      expect(urlToRedirectTo).toBe(expectedUrlToRedirectTo)
    }

    it("should return renew consent url when user is logged in and did not consent and route is '/'", () => {
      testGetRedirectUrl('/', buildUser({ hasToRenewConsent: true }), true, '/renew-consent')
    })

    it("should return new consent url when user is logged in and did not consent and route is '/' and role is patient", () => {
      testGetRedirectUrl('/', buildUser({ hasToAcceptNewConsent: true }), true, '/new-consent')
    })

    it("should return undefined when user is not logged in and route is '/login'", () => {
      testGetRedirectUrl('/login', buildUser(), false, undefined)
    })

    it("should return undefined when user is logged in and route is '/login'", () => {
      testGetRedirectUrl('/login', buildUser(), true, undefined)
    })

    it("should return login route when user is not logged in and route is '/'", () => {
      testGetRedirectUrl('/', buildUser(), false, '/login')
    })

    it('should return complete signup url when a new user is logged in and have no profile yet', () => {
      testGetRedirectUrl('/', buildUser({ isFirstLogin: true }), true, '/complete-signup')
    })

    it('should return training url when a new user is logged in, consents are done and profile is created', () => {
      testGetRedirectUrl('/', buildUser({ hasToDisplayTrainingInfoPage: true }), true, '/training')
    })

    it('should return dbl communication url when a user is logged in and there is a communication available', () => {
      const user = {
        hasToAcceptNewConsent: () => false,
        hasToRenewConsent: () => false,
        isFirstLogin: () => false,
        hasToDisplayTrainingInfoPage: () => false,
        hasToDisplayDblCommunicationPage: () => true
      } as User

      testGetRedirectUrl('/', user, true, '/dbl-communication')
    })
  })
})
