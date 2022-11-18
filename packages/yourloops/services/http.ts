/**
 * Copyright (c) 2022, Diabeloop
 * Http service to make requests
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

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import httpStatus from '../lib/http-status-codes'
import { t } from '../lib/language'

interface Args {
  url: string
  config?: AxiosRequestConfig
}

interface ArgsWithPayload<P> extends Args {
  payload?: P
}

export enum ErrorMessageStatus {
  NotFound = '404-not-found'
}

export default class HttpService {
  private static retrieveAccessToken: () => Promise<string>

  static setGetAccessTokenMethod(accessTokenMethod: () => Promise<string>): void {
    HttpService.retrieveAccessToken = accessTokenMethod
  }

  static async getAccessToken(): Promise<string> {
    return await HttpService.retrieveAccessToken()
  }

  static async get<T>(args: Args): Promise<AxiosResponse<T>> {
    const { url, config } = args
    try {
      return await axios.get<T>(url, { ...config })
    } catch (error) {
      throw HttpService.handleError(error as AxiosError)
    }
  }

  static async post<R, P = undefined>(argsWithPayload: ArgsWithPayload<P>, excludedErrorCodes?: number[]): Promise<AxiosResponse<R>> {
    const { url, payload, config } = argsWithPayload
    try {
      return await axios.post<R, AxiosResponse<R>, P>(url, payload, { ...config })
    } catch (error) {
      throw HttpService.handleError(error as AxiosError, excludedErrorCodes)
    }
  }

  static async put<R, P = undefined>(argsWithPayload: ArgsWithPayload<P>): Promise<AxiosResponse<R>> {
    const { url, payload, config } = argsWithPayload
    try {
      return await axios.put<R, AxiosResponse<R>, P>(url, payload, { ...config })
    } catch (error) {
      throw HttpService.handleError(error as AxiosError)
    }
  }

  static async delete(args: Args): Promise<AxiosResponse> {
    const { url, config } = args
    try {
      return await axios.delete(url, { ...config })
    } catch (error) {
      throw HttpService.handleError(error as AxiosError)
    }
  }

  private static handleError(error: AxiosError, excludedErrorCodes: number[] = []): Error {
    if (!error.response || excludedErrorCodes.includes(error.response.status)) {
      return error
    }

    if (error.response.status >= 400 && error.response.status <= 550) {
      switch (error.response.status) {
        case httpStatus.StatusNotFound:
          throw Error(ErrorMessageStatus.NotFound)
        case httpStatus.StatusInternalServerError:
          throw Error(t('error-http-500'))
        default:
          throw Error(t('error-http-40x'))
      }
    }
  }
}
