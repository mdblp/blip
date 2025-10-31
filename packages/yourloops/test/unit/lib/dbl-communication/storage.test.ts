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

import {
  registerBannerAck,
  isBannerInfoAcknowledged,
  registerDblCommunicationAck,
  isDblCommunicationAcknowledged
} from '../../../../lib/dbl-communication/storage'

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    clear: jest.fn(() => {
      store = {}
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    })
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

describe('DblCommunication Storage', () => {
  beforeEach(() => {
    mockLocalStorage.clear()
    jest.clearAllMocks()
  })

  describe('registerDblCommunicationAck', () => {
    it('should register a new communication acknowledgment', () => {
      // Given
      const id = 'comm-123'

      // When
      registerDblCommunicationAck(id)

      // Then
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'acknowledgedDblCommunicationIds',
        JSON.stringify([id])
      )
    })

    it('should add to existing acknowledgments without duplicates', () => {
      // Given
      const existingIds = ['comm-111', 'comm-222']
      const newId = 'comm-333'
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingIds))

      // When
      registerDblCommunicationAck(newId)

      // Then
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'acknowledgedDblCommunicationIds',
        JSON.stringify([...existingIds, newId])
      )
    })

    it('should not add duplicate acknowledgments', () => {
      // Given
      const existingIds = ['comm-111', 'comm-222']
      const duplicateId = 'comm-111'
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingIds))

      // When
      registerDblCommunicationAck(duplicateId)

      // Then
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled()
    })

    it('should handle empty localStorage gracefully', () => {
      // Given
      mockLocalStorage.getItem.mockReturnValue(null)
      const id = 'comm-123'

      // When
      registerDblCommunicationAck(id)

      // Then
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'acknowledgedDblCommunicationIds',
        JSON.stringify([id])
      )
    })
  })

  describe('isDblCommunicationAcknowledged', () => {
    it('should return true for acknowledged communication', () => {
      // Given
      const acknowledgedIds = ['comm-111', 'comm-222']
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(acknowledgedIds))

      // When
      const result = isDblCommunicationAcknowledged('comm-111')

      // Then
      expect(result).toBe(true)
    })

    it('should return false for non-acknowledged communication', () => {
      // Given
      const acknowledgedIds = ['comm-111', 'comm-222']
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(acknowledgedIds))

      // When
      const result = isDblCommunicationAcknowledged('comm-333')

      // Then
      expect(result).toBe(false)
    })

    it('should return false when localStorage is empty', () => {
      // Given
      mockLocalStorage.getItem.mockReturnValue(null)

      // When
      const result = isDblCommunicationAcknowledged('comm-123')

      // Then
      expect(result).toBe(false)
    })
  })

  describe('registerBannerAck', () => {
    it('should register first acknowledgment for a new banner', () => {
      // Given
      const bannerId = 'banner-123'

      // When
      registerBannerAck(bannerId)

      // Then
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'acknowledgedBannersIds',
        JSON.stringify({ [bannerId]: 1 })
      )
    })

    it('should increment acknowledgment count for existing banner', () => {
      // Given
      const bannerId = 'banner-123'
      const existingData = { [bannerId]: 2, 'other-banner': 1 }
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingData))

      // When
      registerBannerAck(bannerId)

      // Then
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'acknowledgedBannersIds',
        JSON.stringify({ ...existingData, [bannerId]: 3 })
      )
    })

    it('should handle empty localStorage gracefully', () => {
      // Given
      mockLocalStorage.getItem.mockReturnValue(null)
      const bannerId = 'banner-123'

      // When
      registerBannerAck(bannerId)

      // Then
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'acknowledgedBannersIds',
        JSON.stringify({ [bannerId]: 1 })
      )
    })
  })

  describe('isBannerInfoAcknowledged', () => {
    it('should return true when acknowledgment count meets required views', () => {
      // Given
      const banner = {
        id: 'banner-123',
        message: 'Test message',
        level: 'info' as const,
        nbOfViewsBeforeHide: 3
      }
      const acknowledgementsData = { [banner.id]: 3 }
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(acknowledgementsData))

      // When
      const result = isBannerInfoAcknowledged(banner)

      // Then
      expect(result).toBe(true)
    })

    it('should return true when acknowledgment count exceeds required views', () => {
      // Given
      const banner = {
        id: 'banner-123',
        message: 'Test message',
        level: 'warning' as const,
        nbOfViewsBeforeHide: 2
      }
      const acknowledgementsData = { [banner.id]: 5 }
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(acknowledgementsData))

      // When
      const result = isBannerInfoAcknowledged(banner)

      // Then
      expect(result).toBe(true)
    })

    it('should return false when acknowledgment count is below required views', () => {
      // Given
      const banner = {
        id: 'banner-123',
        message: 'Test message',
        level: 'error' as const,
        nbOfViewsBeforeHide: 5
      }
      const acknowledgementsData = { [banner.id]: 2 }
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(acknowledgementsData))

      // When
      const result = isBannerInfoAcknowledged(banner)

      // Then
      expect(result).toBe(false)
    })

    it('should return false for banner with no acknowledgments', () => {
      // Given
      const banner = {
        id: 'banner-123',
        message: 'Test message',
        level: 'info' as const,
        nbOfViewsBeforeHide: 1
      }
      const acknowledgementsData = { 'other-banner': 5 }
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(acknowledgementsData))

      // When
      const result = isBannerInfoAcknowledged(banner)

      // Then
      expect(result).toBe(false)
    })

    it('should return false when localStorage is empty', () => {
      // Given
      const banner = {
        id: 'banner-123',
        message: 'Test message',
        level: 'info' as const,
        nbOfViewsBeforeHide: 1
      }
      mockLocalStorage.getItem.mockReturnValue(null)

      // When
      const result = isBannerInfoAcknowledged(banner)

      // Then
      expect(result).toBe(false)
    })
  })
})
