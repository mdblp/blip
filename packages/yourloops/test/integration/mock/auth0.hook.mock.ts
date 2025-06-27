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

import * as auth0Mock from '@auth0/auth0-react'
import { UserRole } from '../../../lib/auth/models/enums/user-role.enum'
import { AuthenticatedUserMetadata } from '../../../lib/auth/models/enums/authenticated-user-metadata.enum'

export const loggedInUserId = 'loggedInUserId'
export const loggedInUserEmail = 'yann.blanc@example.com'
export const loggedInUserFirstName = 'Yann'
export const loggedInUserLastName = 'Blanc'
export const loggedInUserFullName = `${loggedInUserFirstName} ${loggedInUserLastName}`
export const userTimId = 'userTimId'
export const userTimEmail = 'tim.canu@example.com'
export const userTimFirstName = 'Tim'
export const userTimLastName = 'Canu'
export const userTimFullName = `${userTimFirstName} ${userTimLastName}`
export const userHugoId = 'userHugoId'
export const userHugoEmail = 'hugo.rodrigues@example.com'
export const userHugoFirstName = 'Hugo'
export const userHugoLastName = 'Rodrigues'
export const userHugoFullName = `${userHugoFirstName} ${userHugoLastName}`
export const userYdrisId = 'userYdrisId'
export const userYdrisEmail = 'ydris.rebibane@example.com'
export const userYdrisFirstName = 'Ydris'
export const userYdrisLastName = 'Rebibane'
export const userYdrisFullName = `${userYdrisFirstName} ${userYdrisLastName}`
export const getAccessTokenWithPopupMock = jest.fn()
export const loginWithRedirect = jest.fn()
export const logoutMock = jest.fn()

export const mockAuth0Hook = (role: UserRole = UserRole.Hcp, userId = loggedInUserId) => {
  (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
    isAuthenticated: true,
    isLoading: false,
    user: {
      email: loggedInUserEmail,
      email_verified: true,
      sub: 'auth0|' + userId,
      [AuthenticatedUserMetadata.Roles]: [role]
    },
    getAccessTokenWithPopup: getAccessTokenWithPopupMock,
    logout: logoutMock
  })
}
