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

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { v4 as uuidv4 } from 'uuid'

import appConfig from '../config/config'
import HttpService from './http.service'
import { HttpHeaderKeys } from './models/enums/http-header-keys.enum'

class AxiosService {
  init(baseUrl: string, hasInterceptors = false): AxiosInstance {
    const axiosInstance = axios.create({
      baseURL: baseUrl
    })

    if (hasInterceptors) {
      axiosInstance.interceptors.request.use(this.onFulfilled)
    }

    return axiosInstance
  }

  private async onFulfilled(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    if (config.params?.noHeader) {
      delete config.params.noHeader
      return config
    }
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${await HttpService.getAccessToken()}`,
        [HttpHeaderKeys.traceToken]: uuidv4()
      }
    }
  }
}

const internalAxios = new AxiosService().init(appConfig.API_HOST, true)
const auth0Axios = new AxiosService().init(`https://${appConfig.AUTH0_DOMAIN}`)

export { internalAxios, auth0Axios }
