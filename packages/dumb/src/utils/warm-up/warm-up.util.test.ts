/*
 * Copyright (c) 2026, Diabeloop
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

import { CGMName, type WarmUp } from 'medical-domain'
import { getWarmUpTitle, getWarmUpTooltipContent } from './warm-up.util'

describe('WarmUpUtil', () => {
  const EPOCH_END = 1659985200000 // 2022-08-08T19:00:00Z, i.e. 9:00 pm in Europe/Paris

  const buildWarmUp = (warmupSensorModel?: string, timezone = 'Europe/Paris'): WarmUp => ({
    epochEnd: EPOCH_END,
    timezone,
    warmupSensorModel
  } as WarmUp)

  describe('getWarmUpTooltipContent', () => {
    it('should return the warm-up title, the session end label and the end time for a G6 sensor', () => {
      const content = getWarmUpTooltipContent(buildWarmUp(CGMName.G6))

      expect(content).toEqual({
        title: 'Sensor warmup',
        description: 'Session end',
        endTime: '9:00 pm'
      })
    })

    it('should behave as a G6 sensor when the sensor model is missing', () => {
      const content = getWarmUpTooltipContent(buildWarmUp(undefined))

      expect(content).toEqual({
        title: 'Sensor warmup',
        description: 'Session end',
        endTime: '9:00 pm'
      })
    })

    it('should format the end time in the timezone of the warm-up', () => {
      const content = getWarmUpTooltipContent(buildWarmUp(CGMName.G6, 'UTC'))

      expect(content.endTime).toEqual('7:00 pm')
    })

    it('should return the sensor title, the warm-up description and no end time for a G7 sensor', () => {
      const content = getWarmUpTooltipContent(buildWarmUp(CGMName.G7))

      expect(content).toEqual({
        title: 'Sensor',
        description: 'Sensor warmup'
      })
      expect(content.endTime).toBeUndefined()
    })

    it('should return the sensor title, the warm-up description and no end time for a G7-15 sensor', () => {
      const content = getWarmUpTooltipContent(buildWarmUp(CGMName.G7_15))

      expect(content).toEqual({
        title: 'Sensor',
        description: 'Sensor warmup'
      })
      expect(content.endTime).toBeUndefined()
    })

    it('should return the sensor title, the warm-up description and no end time for an unknown sensor model', () => {
      const content = getWarmUpTooltipContent(buildWarmUp('G8'))

      expect(content).toEqual({
        title: 'Sensor',
        description: 'Sensor warmup'
      })
      expect(content.endTime).toBeUndefined()
    })
  })

  describe('getWarmUpTitle', () => {
    it('should return the warm-up title for a G6 sensor', () => {
      expect(getWarmUpTitle(buildWarmUp(CGMName.G6))).toEqual('Sensor warmup')
    })

    it('should return the warm-up title when the sensor model is missing', () => {
      expect(getWarmUpTitle(buildWarmUp(undefined))).toEqual('Sensor warmup')
    })

    it('should return the sensor title for a G7 sensor', () => {
      expect(getWarmUpTitle(buildWarmUp(CGMName.G7))).toEqual('Sensor')
    })
  })
})
