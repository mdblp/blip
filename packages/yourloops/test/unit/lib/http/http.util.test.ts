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

import { HttpUtil } from '../../../../lib/http/http.util'
import { AxiosError } from 'axios'

describe('HttpUtil', function () {
  describe('handleError', () => {
    it('should return the raw error', () => {
      const emptyError = {}
      const emptyErrorResult = HttpUtil.handleError(emptyError as AxiosError)
      expect(emptyErrorResult).toEqual(emptyError)

      const errorStatus = 400
      const error = { response: { status: errorStatus } }
      const excludedErrorResult = HttpUtil.handleError(error as AxiosError, [errorStatus])
      expect(excludedErrorResult).toEqual(error)
    })

    it('should return undefined if the error response status is out of range', () => {
      const belowRangeStatusError = { response: { status: 300 } }
      const belowRangeErrorResult = HttpUtil.handleError(belowRangeStatusError as AxiosError)
      expect(belowRangeErrorResult).toEqual(undefined)

      const aboveRangeStatusError = { response: { status: 600 } }
      const aboveRangeErrorResult = HttpUtil.handleError(aboveRangeStatusError as AxiosError)
      expect(aboveRangeErrorResult).toEqual(undefined)
    })

    it('should throw with the predefined error messages when the error response status is within range', () => {
      const notFoundError = { response: { status: 404 } }
      try {
        HttpUtil.handleError(notFoundError as AxiosError)
      } catch (error) {
        expect(error.message).toEqual('404-not-found')
      }

      const internalServerError = { response: { status: 500 } }
      try {
        HttpUtil.handleError(internalServerError as AxiosError)
      } catch (error) {
        expect(error.message).toEqual('error-http-500')
      }

      const withinRangeError = { response: { status: 409 } }
      try {
        HttpUtil.handleError(withinRangeError as AxiosError)
      } catch (error) {
        expect(error.message).toEqual('error-http-40x')
      }
    })
  })
})
