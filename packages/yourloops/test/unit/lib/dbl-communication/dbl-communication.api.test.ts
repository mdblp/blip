/*
 * Copyright (c) 2025, Diabeloop
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

import DblCommunicationApi from '../../../../lib/dbl-communication/dbl-communication.api'
import HttpService from '../../../../lib/http/http.service'
import { type InformationPage } from '../../../../lib/dbl-communication/models/page.model'
import { type BannerContent } from '../../../../lib/dbl-communication/models/banner.model'
import { type AxiosResponse } from 'axios'

jest.mock('../../../../lib/http/http.service')
const mockedHttpService = HttpService as jest.Mocked<typeof HttpService>

// Mock console.log to avoid cluttering test output
const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

describe('DblCommunicationApi', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    consoleSpy.mockRestore()
  })

  describe('getInfoPage', () => {
    it('should return information page data with acknowledged set to false when API call succeeds', async () => {
      // Given
      const mockApiResponse: InformationPage = {
        id: 'test-id',
        title: 'Test Title',
        content: 'Test content with <br/> HTML',
      }
      mockedHttpService.get.mockResolvedValue({ data: mockApiResponse } as AxiosResponse)

      // When
      const result = await DblCommunicationApi.getInfoPage()

      // Then
      expect(mockedHttpService.get).toHaveBeenCalledWith({ url: 'bff/communications/ylp-info-page' })
      expect(result).toEqual({
        ...mockApiResponse
      })
    })

    it('should return undefined and log error when API call fails', async () => {
      // Given
      const mockError = new Error('Network error')
      mockedHttpService.get.mockRejectedValue(mockError)

      // When
      const result = await DblCommunicationApi.getInfoPage()

      // Then
      expect(mockedHttpService.get).toHaveBeenCalledWith({ url: 'bff/communications/ylp-info-page' })
      expect(result).toBeUndefined()
    })

    it('should handle null response data gracefully', async () => {
      // Given
      mockedHttpService.get.mockResolvedValue({ data: null } as AxiosResponse)

      // When
      const result = await DblCommunicationApi.getInfoPage()

      // Then
      expect(result).toEqual(null)
    })
  })

  describe('getDblBanner', () => {
    it('should return banner content when API call succeeds', async () => {
      // Given
      const mockBannerData: BannerContent = {
        id: 'banner-id',
        message: 'Important system message',
        level: 'warning',
        nbOfViewsBeforeHide: 3
      }
      mockedHttpService.get.mockResolvedValue({ data: mockBannerData } as AxiosResponse)

      // When
      const result = await DblCommunicationApi.getDblBanner()

      // Then
      expect(mockedHttpService.get).toHaveBeenCalledWith({ url: 'bff/communications/ylp-banner' })
      expect(result).toEqual(mockBannerData)
    })

    it('should return undefined and log error when API call fails', async () => {
      // Given
      const mockError = new Error('Server error')
      mockedHttpService.get.mockRejectedValue(mockError)

      // When
      const result = await DblCommunicationApi.getDblBanner()

      // Then
      expect(mockedHttpService.get).toHaveBeenCalledWith({ url: 'bff/communications/ylp-banner' })
      expect(result).toBeUndefined()
    })

    it('should handle different banner levels correctly', async () => {
      // Given
      const infoBanner: BannerContent = {
        id: 'info-banner',
        message: 'Information message',
        level: 'info',
        nbOfViewsBeforeHide: 1
      }
      mockedHttpService.get.mockResolvedValue({ data: infoBanner } as AxiosResponse)

      // When
      const result = await DblCommunicationApi.getDblBanner()

      // Then
      expect(result).toEqual(infoBanner)
    })

    it('should handle error level banners', async () => {
      // Given
      const errorBanner: BannerContent = {
        id: 'error-banner',
        message: 'Critical system error',
        level: 'error',
        nbOfViewsBeforeHide: 5
      }
      mockedHttpService.get.mockResolvedValue({ data: errorBanner } as AxiosResponse)

      // When
      const result = await DblCommunicationApi.getDblBanner()

      // Then
      expect(result).toEqual(errorBanner)
    })
  })
})
