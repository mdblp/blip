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
      testGetRedirectUrl('/', buildUser({ hasToDisplayDblCommunicationPage: true }), true, '/dbl-communication')
    })

    it('should return undefined when there is no user', () => {
      testGetRedirectUrl('/', null, true, undefined)
    })

    it('should return undefined when the user is not authenticated anymore but is still in the auth context', () => {
      const user = buildUser({
        isFirstLogin: true,
        hasToAcceptNewConsent: true,
        hasToRenewConsent: true,
        hasToDisplayTrainingInfoPage: true,
        hasToDisplayDblCommunicationPage: true
      })

      testGetRedirectUrl('/login', user, false, undefined)
    })

    describe('gates ordering', () => {
      it('should present the gates one after the other, from the most blocking one', () => {
        testGetRedirectUrl('/', buildUser({
          isFirstLogin: true,
          hasToAcceptNewConsent: true,
          hasToRenewConsent: true,
          hasToDisplayTrainingInfoPage: true,
          hasToDisplayDblCommunicationPage: true
        }), true, '/complete-signup')

        testGetRedirectUrl('/', buildUser({
          hasToAcceptNewConsent: true,
          hasToRenewConsent: true,
          hasToDisplayTrainingInfoPage: true,
          hasToDisplayDblCommunicationPage: true
        }), true, '/dbl-communication')

        testGetRedirectUrl('/', buildUser({
          hasToAcceptNewConsent: true,
          hasToRenewConsent: true,
          hasToDisplayTrainingInfoPage: true
        }), true, '/new-consent')

        testGetRedirectUrl('/', buildUser({
          hasToRenewConsent: true,
          hasToDisplayTrainingInfoPage: true
        }), true, '/renew-consent')

        testGetRedirectUrl('/', buildUser({ hasToDisplayTrainingInfoPage: true }), true, '/training')
        testGetRedirectUrl('/', buildUser(), true, undefined)
      })

      it('should keep the user on a route which already satisfies the pending gate', () => {
        testGetRedirectUrl('/product-labelling', buildUser({ hasToDisplayTrainingInfoPage: true }), true, '/training')
      })
    })

    describe('no redirection loop between the gates', () => {
      it('should resolve to the dbl communication page instead of bouncing between it and the training page', () => {
        const user = buildUser({ hasToDisplayTrainingInfoPage: true, hasToDisplayDblCommunicationPage: true })

        testGetRedirectUrl('/dbl-communication', user, true, undefined)
        testGetRedirectUrl('/training', user, true, '/dbl-communication')
      })

      it('should resolve to the dbl communication page instead of bouncing between it and a consent page', () => {
        const userToAcceptConsent = buildUser({ hasToAcceptNewConsent: true, hasToDisplayDblCommunicationPage: true })
        testGetRedirectUrl('/dbl-communication', userToAcceptConsent, true, undefined)
        testGetRedirectUrl('/new-consent', userToAcceptConsent, true, '/dbl-communication')

        const userToRenewConsent = buildUser({ hasToRenewConsent: true, hasToDisplayDblCommunicationPage: true })
        testGetRedirectUrl('/dbl-communication', userToRenewConsent, true, undefined)
        testGetRedirectUrl('/renew-consent', userToRenewConsent, true, '/dbl-communication')
      })

      it('should resolve to the complete signup page instead of bouncing between it and the dbl communication page', () => {
        const user = buildUser({ isFirstLogin: true, hasToDisplayDblCommunicationPage: true })

        testGetRedirectUrl('/complete-signup', user, true, undefined)
        testGetRedirectUrl('/dbl-communication', user, true, '/complete-signup')
      })

      it('should not redirect away from a consent page when both consents are pending', () => {
        const user = buildUser({ hasToAcceptNewConsent: true, hasToRenewConsent: true })

        testGetRedirectUrl('/new-consent', user, true, undefined)
        testGetRedirectUrl('/renew-consent', user, true, undefined)
        testGetRedirectUrl('/', user, true, '/new-consent')
      })

      it('should not redirect away from the complete signup page when the training is pending', () => {
        testGetRedirectUrl('/complete-signup', buildUser({ hasToDisplayTrainingInfoPage: true }), true, undefined)
      })

      it('should be satisfied by its own route for every gate', () => {
        USER_GATES.forEach((gate) => {
          expect(gate.satisfiedByRoutes).toContain(gate.route)
        })
      })

      it('should always reach a stable route, for every combination of pending gates and every route', () => {
        const flagNames: Array<keyof UserGateFlags> = [
          'isFirstLogin',
          'hasToAcceptNewConsent',
          'hasToRenewConsent',
          'hasToDisplayTrainingInfoPage',
          'hasToDisplayDblCommunicationPage'
        ]
        const routes = [...Object.values(AppRoute), '/', '/unknown-route']
        const maxHops = flagNames.length + 2

        for (let combination = 0; combination < 2 ** flagNames.length; combination++) {
          const flags = flagNames.reduce<UserGateFlags>((acc, flagName, index) => {
            acc[flagName] = (combination & (1 << index)) !== 0
            return acc
          }, {})
          const user = buildUser(flags)

          routes.forEach((initialRoute) => {
            const visitedRoutes = [initialRoute]
            let currentRoute = initialRoute
            let redirection = getRedirectUrl(currentRoute, user, true)

            while (redirection !== undefined && visitedRoutes.length <= maxHops) {
              expect(visitedRoutes).not.toContain(redirection)
              visitedRoutes.push(redirection)
              currentRoute = redirection
              redirection = getRedirectUrl(currentRoute, user, true)
            }

            expect(redirection).toBeUndefined()
          })
        }
      })
    })
  })
})
