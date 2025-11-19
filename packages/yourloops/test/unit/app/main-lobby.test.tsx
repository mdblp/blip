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

import type User from '../../../lib/auth/models/user.model'
import { getRedirectUrl } from '../../../app/main-lobby'

describe('Main lobby', () => {
  describe('getRedirectUrl', () => {
    function testGetRedirectUrl(route: string, user: User, isAuthenticated: boolean, expectedUrlToRedirectTo: string | undefined) {
      const urlToRedirectTo = getRedirectUrl(route, user, isAuthenticated)
      expect(urlToRedirectTo).toBe(expectedUrlToRedirectTo)
    }

    it("should return renew consent url when user is logged in and did not consent and route is '/'", () => {
      const user = {
        hasToAcceptNewConsent: () => false,
        hasToRenewConsent: () => true,
        isFirstLogin: () => false,
        isUserHcp: () => true,
        hasToDisplayTrainingInfoPage: () => false
      } as User

      testGetRedirectUrl('/', user, true, '/renew-consent')
    })

    it("should return new consent url when user is logged in and did not consent and route is '/' and role is patient", () => {
      const user = {
        hasToAcceptNewConsent: () => true,
        hasToRenewConsent: () => false,
        isFirstLogin: () => false,
        isUserHcp: () => false,
        isUserPatient: () => true,
        hasToDisplayTrainingInfoPage: () => false
      } as User

      testGetRedirectUrl('/', user, true, '/new-consent')
    })

    it("should return undefined when user is not logged in and route is '/login'", () => {
      const user = {
        hasToAcceptNewConsent: () => false,
        hasToRenewConsent: () => false,
        isFirstLogin: () => false,
        hasToDisplayTrainingInfoPage: () => false,
        hasToDisplayDblCommunicationPage: () => false
      } as User

      testGetRedirectUrl('/login', user, false, undefined)
    })

    it("should return default route when user is logged in and route is '/login'", () => {
      const user = {
        hasToAcceptNewConsent: () => false,
        hasToRenewConsent: () => false,
        isFirstLogin: () => false,
        hasToDisplayTrainingInfoPage: () => false
      } as User

      testGetRedirectUrl('/login', user, true, '/')
    })

    it("should return login route when user is not logged in and route is '/'", () => {
      const user = {
        hasToAcceptNewConsent: () => false,
        hasToRenewConsent: () => false,
        isFirstLogin: () => false,
        hasToDisplayTrainingInfoPage: () => false
      } as User

      testGetRedirectUrl('/', user, false, '/login')
    })

    it('should return complete signup url when a new user is logged in and have no profile yet', () => {
      const user = {
        hasToAcceptNewConsent: () => false,
        hasToRenewConsent: () => false,
        isFirstLogin: () => true,
        hasToDisplayTrainingInfoPage: () => false
      } as User

      testGetRedirectUrl('/', user, true, '/complete-signup')
    })

    it('should return training url when a new user is logged in, consents are done and profile is created', () => {
      const user = {
        hasToAcceptNewConsent: () => false,
        hasToRenewConsent: () => false,
        isFirstLogin: () => false,
        hasToDisplayTrainingInfoPage: () => true
      } as User

      testGetRedirectUrl('/', user, true, '/training')
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
