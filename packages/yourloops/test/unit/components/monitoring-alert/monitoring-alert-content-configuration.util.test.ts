/*
 * Copyright (c) 2022-2026, Diabeloop
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
  buildThresholds,
  getConvertedValue, getErrorMessage, getPercentageLabels
} from '../../../../components/monitoring-alert/monitoring-alert-content-configuration.util'
import { Unit } from 'medical-domain'

describe('MonitoringAlertsContentConfiguration util', function () {
  describe('buildThresholds', () => {
    const getDefaultMonitoring = () => ({
      enabled: true,
      parameters: {
        bgUnit: Unit.MilligramPerDeciliter,
        lowBg: 50,
        highBg: 140,
        outOfRangeThreshold: 10,
        veryLowBg: 40,
        hypoThreshold: 45,
        nonDataTxThreshold: 50
      }
    })

    it('should return default thresholds value in mmol/L if the parameters are in mmol/L', () => {
      const monitoring = getDefaultMonitoring()
      monitoring.parameters.bgUnit = Unit.MmolPerLiter
      const thresholdsInMmol = buildThresholds(monitoring.parameters.bgUnit)

      expect(thresholdsInMmol.minLowBg).toBe(2.8)
      expect(thresholdsInMmol.maxHighBg).toBe(13.9)
      expect(thresholdsInMmol.minLowBg).toBe(2.8)
      expect(thresholdsInMmol.maxLowBg).toBe(5.6)
      expect(thresholdsInMmol.minVeryLowBg).toBe(2.2)
      expect(thresholdsInMmol.maxVeryLowBg).toBe(5)
    })

    it('should return default thresholds value in mg/dL if the parameters are in mg/dL', () => {
      const monitoring = getDefaultMonitoring()
      const thresholdsInMgdl = buildThresholds(monitoring.parameters.bgUnit)
      expect(thresholdsInMgdl.minHighBg).toBe(140)
      expect(thresholdsInMgdl.maxHighBg).toBe(250)
      expect(thresholdsInMgdl.minLowBg).toBe(50)
      expect(thresholdsInMgdl.maxLowBg).toBe(100)
      expect(thresholdsInMgdl.minVeryLowBg).toBe(40)
      expect(thresholdsInMgdl.maxVeryLowBg).toBe(90)
    })
  })

  describe('getConvertedValue', () => {
    it('should return the value if no conversion necessary', () => {
      const value = 1.1

      expect(getConvertedValue(value, Unit.MilligramPerDeciliter, Unit.MilligramPerDeciliter)).toEqual(value)
      expect(getConvertedValue(value, Unit.MmolPerLiter, Unit.MmolPerLiter)).toEqual(value)
    })

    it('should convert the value and format it', () => {
      expect(getConvertedValue(179, Unit.MilligramPerDeciliter, Unit.MmolPerLiter)).toEqual(9.9)
      expect(getConvertedValue(9.9, Unit.MmolPerLiter, Unit.MilligramPerDeciliter)).toEqual(178)
    })
  })

  describe('getErrorMessage', () => {
    it('should return no error messages when monitoring values are correct', () => {
      const value = 10
      const lowValue = 5
      const highValue = 15

      const errorMessage = getErrorMessage(Unit.MilligramPerDeciliter, value, lowValue, highValue)

      expect(errorMessage).toBeNull()
    })

    it('should return an error message expecting integer values if BG unit is mg/dL', () => {
      const value = 10.1
      const lowValue = 5
      const highValue = 15

      const errorMessage = getErrorMessage(Unit.MilligramPerDeciliter, value, lowValue, highValue)

      expect(errorMessage).toBe('mandatory-integer')
    })

    it('should return an error message expecting float values if BG unit is mmol/L', () => {
      const value = 10.485
      const lowValue = 5
      const highValue = 15

      const errorMessage = getErrorMessage(Unit.MmolPerLiter, value, lowValue, highValue)

      expect(errorMessage).toBe('mandatory-float-number')
    })

    it('should return an error if values are out of range', () => {
      const value = 20
      const lowValue = 5
      const highValue = 15

      const errorMessage = getErrorMessage(Unit.MilligramPerDeciliter, value, lowValue, highValue)

      expect(errorMessage).toBe('mandatory-range')
    })
  })

  describe('getPercentageLabels', () => {
    it('should return an array of 20 items covering 5% to 100% in steps of 5', () => {
      const labels = getPercentageLabels(25)

      expect(labels).toHaveLength(20)
      expect(labels[0]).toContain('5%')
      expect(labels[19]).toContain('100%')
    })

    it('should return plain percentage strings for non-default values', () => {
      const labels = getPercentageLabels(25)

      expect(labels).toContain('5%')
      expect(labels).toContain('10%')
      expect(labels).toContain('100%')
    })

    it('should mark the matching default value with the "(default)" suffix', () => {
      const labels = getPercentageLabels(25)

      expect(labels).toContain('25% (default)')
      expect(labels).not.toContain('25%')
    })

    it('should mark the first item as default when defaultValue is 5', () => {
      const labels = getPercentageLabels(5)

      expect(labels[0]).toBe('5% (default)')
    })

    it('should mark the last item as default when defaultValue is 100', () => {
      const labels = getPercentageLabels(100)

      expect(labels[19]).toBe('100% (default)')
    })

    it('should return no "(default)" label when defaultValue is outside the 5–100 range', () => {
      const labels = getPercentageLabels(0)

      expect(labels.every(label => !label.includes('(default)'))).toBe(true)
    })

    it('should return labels in ascending order', () => {
      const labels = getPercentageLabels(25)
      const numericValues = labels.map(label => parseInt(label))

      expect(numericValues).toEqual([...numericValues].sort((a, b) => a - b))
    })
  })
})
