/**
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

import axios, { AxiosError, AxiosResponse } from 'axios'

import HttpService from '../../services/http'

describe('HTTP', () => {
  const url = 'myFakeUrl'
  const payload = 'myFakePayload'
  const config = { withCredentials: true }
  let axiosStub: jest.SpyInstance

  afterEach(() => {
    axiosStub.mockRestore()
  })

  describe('get', () => {
    it('should get make correct request', async () => {
      // given
      const expectedResponse = {} as AxiosResponse
      axiosStub = jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve(expectedResponse))

      // when
      const response = await HttpService.get({ url, config })

      // then
      expect(response).toBe(expectedResponse)
      expect(axiosStub).toHaveBeenCalledWith(url, config)
    })

    it('should throw error when failing', async () => {
      // given
      const expectedError = {} as AxiosError
      axiosStub = jest.spyOn(axios, 'get')
      axiosStub.mockImplementation(() => {
        throw expectedError
      })

      // when
      try {
        await HttpService.get({ url, config })
        throw Error('This test should have gone into the catch')
      } catch (errorReceived) {
        // then
        expect(axiosStub).toHaveBeenCalledWith(url, config)
        expect(errorReceived).toBe(expectedError)
      }
    })
  })

  describe('post', () => {
    it('should make correct request', async () => {
      // given
      const expectedResponse = {} as AxiosResponse
      axiosStub = jest.spyOn(axios, 'post').mockResolvedValue(Promise.resolve(expectedResponse))

      // when
      const response = await HttpService.post({ url, payload, config })

      // then
      expect(response).toBe(expectedResponse)
      expect(axiosStub).toHaveBeenCalledWith(url, payload, config)
    })

    it('should throw error when failing', async () => {
      // given
      const expectedError = {} as AxiosError
      axiosStub = jest.spyOn(axios, 'post')
      axiosStub.mockImplementation(() => {
        throw expectedError
      })
      // when
      try {
        await HttpService.post({ url, payload, config })
        throw Error('This test should have gone into the catch')
      } catch (errorReceived) {
        // then
        expect(axiosStub).toHaveBeenCalledWith(url, payload, config)
        expect(errorReceived).toBe(expectedError)
      }
    })
  })

  describe('put', () => {
    it('should make correct request', async () => {
      // given
      const expectedResponse = {} as AxiosResponse
      axiosStub = jest.spyOn(axios, 'put').mockResolvedValue(Promise.resolve(expectedResponse))

      // when
      const response = await HttpService.put({ url, payload, config })

      // then
      expect(response).toBe(expectedResponse)
      expect(axiosStub).toHaveBeenCalledWith(url, payload, config)
    })

    it('should throw error when failing', async () => {
      // given
      const expectedError = {} as AxiosError
      axiosStub = jest.spyOn(axios, 'put')
      axiosStub.mockImplementation(() => {
        throw expectedError
      })

      // when
      try {
        await HttpService.put({ url, payload, config })
        throw Error('This test should have gone into the catch')
      } catch (errorReceived) {
        // then
        expect(axiosStub).toHaveBeenCalledWith(url, payload, config)
        expect(errorReceived).toBe(expectedError)
      }
    })
  })

  describe('delete', () => {
    it('should make correct request', async () => {
      // given
      const expectedResponse = {} as AxiosResponse
      axiosStub = jest.spyOn(axios, 'delete').mockResolvedValue(Promise.resolve(expectedResponse))

      // when
      const response = await HttpService.delete({ url, config })

      // then
      expect(response).toBe(expectedResponse)
      expect(axiosStub).toHaveBeenCalledWith(url, config)
    })

    it('should throw error when failing', async () => {
      // given
      const expectedError = {} as AxiosError
      axiosStub = jest.spyOn(axios, 'delete')
      axiosStub.mockImplementation(() => {
        throw expectedError
      })
      // when
      try {
        await HttpService.delete({ url, config })
        throw Error('This test should have gone into the catch')
      } catch (errorReceived) {
        // then
        expect(axiosStub).toHaveBeenCalledWith(url, config)
        expect(errorReceived).toBe(expectedError)
      }
    })
  })
})
