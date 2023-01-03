/*
 * Copyright (c) 2022, Diabeloop
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
import { UserRoles } from '../../../lib/auth/models/enums/user-roles.enum'
import { AuthenticatedUserMetadata } from '../../../lib/auth/models/enums/authenticated-user-metadata.enum'

export const loggedInUserId = '919b1575bad58'
export const loggedInUserEmail = 'john.doe@example.com'
export const getAccessTokenSilentlyMock = jest.fn()

export const mockAuth0Hook = (role: UserRoles = UserRoles.hcp, userId = loggedInUserId) => {
  (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
    isAuthenticated: true,
    isLoading: false,
    user: {
      email: loggedInUserEmail,
      email_verified: true,
      sub: 'auth0|' + userId,
      [AuthenticatedUserMetadata.Roles]: [role]
    },
    getAccessTokenSilently: getAccessTokenSilentlyMock
  })
}