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

import appConfig from '../config/config'
import { type AxiosResponse } from 'axios'
import HttpService from '../http/http.service'

const AUTH0_CONNECTION_TYPE = 'Username-Password-Authentication'
const AUTH0_CHANGE_PASSWORD_URL = '/dbconnections/change_password'
const AUTH_CHANGE_USERNAME_URL = '/auth/v2/user'
const AUTH_VALIDATE_CHANGE_USERNAME_URL = '/auth/v2/verify-email'

export class AuthApi {
  static async sendResetPasswordEmail(userEmail: string): Promise<AxiosResponse> {
    return await HttpService.post({
      url: AUTH0_CHANGE_PASSWORD_URL,
      payload: {
        client_id: appConfig.AUTH0_CLIENT_ID,
        email: userEmail,
        connection: AUTH0_CONNECTION_TYPE
      },
      config: { baseURL: `https://${appConfig.AUTH0_DOMAIN}`, params: { noHeader: true } }
    })
  }

  static async sendChangeEmailRequest(userId: string, newUserEmail: string): Promise<AxiosResponse> {
    return await HttpService.put({
      url: `${AUTH_CHANGE_USERNAME_URL}/${userId}`,
      payload: {
        username: newUserEmail,
      },
    })
  }

  static async validateChangeEmailRequest(code: string): Promise<AxiosResponse> {
    return await HttpService.post({
      url: `${AUTH_VALIDATE_CHANGE_USERNAME_URL}?verificationCode=${code}`,
    })
  }
}
