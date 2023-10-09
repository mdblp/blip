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

import axios from 'axios'
import { AuthApi } from '../../../../lib/auth/auth.api'

jest.mock('../../../../lib/http/axios.service')

describe('Auth API', () => {
  const userEmail = 'test@email.com'

  describe('sendResetPasswordEmail', () => {
    it('should post a request to Auth0', async () => {
      jest.spyOn(axios, 'post').mockResolvedValueOnce(Promise.resolve({}))

      await AuthApi.sendResetPasswordEmail(userEmail)

      expect(axios.post).toHaveBeenCalledWith('/dbconnections/change_password', {
        client_id: '',
        connection: 'Username-Password-Authentication',
        email: userEmail
      }, { baseURL: 'https://', params: { noHeader: true } })
    })

    it('should throw an error when the request fails', async () => {
      const errorMessage = { message: 'Error' }
      jest.spyOn(axios, 'post').mockRejectedValueOnce(errorMessage)

      await expect(AuthApi.sendResetPasswordEmail(userEmail)).rejects.toEqual(errorMessage)

      expect(axios.post).toHaveBeenCalledWith('/dbconnections/change_password', {
        client_id: '',
        connection: 'Username-Password-Authentication',
        email: userEmail
      }, { baseURL: 'https://', params: { noHeader: true } })
    })
  })
})
