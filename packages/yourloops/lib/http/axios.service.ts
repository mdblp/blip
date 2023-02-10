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

import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import HttpService from './http.service'
import { HttpHeaderKeys } from './models/enums/http-header-keys.enum'
import appConfig from '../config/config'

export const onFulfilled = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  if (config.params?.noHeader) {
    delete config.params.noHeader
    return config
  }

  const accessToken: string = await HttpService.getAccessToken()
  const traceToken: string = HttpService.getTraceToken()

  const headers = new AxiosHeaders({
    ...config.headers,
    Authorization: `Bearer ${accessToken}`,
    [HttpHeaderKeys.traceToken]: traceToken
  })

  return { ...config, headers }
}

function initAxios(): void {
  axios.defaults.baseURL = appConfig.API_HOST
  /**
   * We use axios request interceptor to set the access token into headers each request the app send
   */
  axios.interceptors.request.use(onFulfilled)
}

export default initAxios
