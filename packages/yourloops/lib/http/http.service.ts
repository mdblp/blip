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

import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import HttpStatus from './models/enums/http-status.enum'
import { t } from '../language'
import { AxiosCacheInstance } from 'axios-cache-interceptor'
import { CacheProperties } from 'axios-cache-interceptor/src/cache/cache'
import { GET_TEAMS_CACHE_ID } from '../team/team.api'
import { GET_USER_CACHE_ID } from '../auth/user.api'

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
  private static traceToken: string
  private static axiosWithCache: AxiosCacheInstance

  static setGetAccessTokenMethod(accessTokenMethod: () => Promise<string>): void {
    HttpService.retrieveAccessToken = accessTokenMethod
  }

  static setTraceToken(sessionId: string): void {
    HttpService.traceToken = sessionId
  }

  static async getAccessToken(): Promise<string> {
    return await HttpService.retrieveAccessToken()
  }

  static getTraceToken(): string {
    return HttpService.traceToken
  }

  static setAxiosInstanceWithCache(axiosCache: AxiosCacheInstance): void {
    HttpService.axiosWithCache = axiosCache
  }

  static async get<T>(args: Args, cacheId: string | null = null): Promise<AxiosResponse<T>> {
    const { url, config } = args
    const cache = cacheId ? { id: cacheId } : false

    console.log(url)
    try {
      return await HttpService.axiosWithCache.get<T>(url, {
        ...config,
        cache: cache as Partial<CacheProperties<T, never>>
      })
    } catch (error) {
      throw HttpService.handleError(error as AxiosError)
    }
  }

  static async post<R, P = undefined>(argsWithPayload: ArgsWithPayload<P>, excludedErrorCodes?: number[]): Promise<AxiosResponse<R>> {
    const { url, payload, config } = argsWithPayload
    try {
      await HttpService.axiosWithCache.storage.remove(GET_TEAMS_CACHE_ID)
      await HttpService.axiosWithCache.storage.remove(GET_USER_CACHE_ID)
      return await axios.post<R, AxiosResponse<R>, P>(url, payload, { ...config })
    } catch (error) {
      throw HttpService.handleError(error as AxiosError, excludedErrorCodes)
    }
  }

  static async put<R, P = undefined>(argsWithPayload: ArgsWithPayload<P>): Promise<AxiosResponse<R>> {
    const { url, payload, config } = argsWithPayload
    try {
      await HttpService.axiosWithCache.storage.remove(GET_TEAMS_CACHE_ID)
      await HttpService.axiosWithCache.storage.remove(GET_USER_CACHE_ID)
      return await axios.put<R, AxiosResponse<R>, P>(url, payload, { ...config })
    } catch (error) {
      throw HttpService.handleError(error as AxiosError)
    }
  }

  static async delete(args: Args): Promise<AxiosResponse> {
    const { url, config } = args
    try {
      await HttpService.axiosWithCache.storage.remove(GET_TEAMS_CACHE_ID)
      await HttpService.axiosWithCache.storage.remove(GET_USER_CACHE_ID)
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
        case HttpStatus.StatusNotFound:
          throw Error(ErrorMessageStatus.NotFound)
        case HttpStatus.StatusInternalServerError:
          throw Error(t('error-http-500'))
        default:
          throw Error(t('error-http-40x'))
      }
    }
  }
}
