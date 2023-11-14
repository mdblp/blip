/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2017, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

/* eslint-disable max-len */

import _ from 'lodash'
import { assert, expect } from 'chai'

import * as bgUtils from '../../src/utils/bloodglucose'
import { TimeService } from 'medical-domain'

describe('blood glucose utilities', () => {
  describe('generateBgRangeLabels', () => {
    const bounds = {
      mgdl: {
        veryHighThreshold: 300.12345,
        targetUpperBound: 180,
        targetLowerBound: 70,
        veryLowThreshold: 55
      },
      mmoll: {
        veryHighThreshold: 16.666667,
        targetUpperBound: 10,
        targetLowerBound: 3.9,
        veryLowThreshold: 3.1
      }
    }

    it('should generate formatted range labels for mg/dL BG prefs', () => {
      const bgPrefs = {
        bgBounds: bounds.mgdl,
        bgUnits: 'mg/dL'
      }

      const result = bgUtils.generateBgRangeLabels(bgPrefs)

      expect(result).to.eql({
        veryLow: 'below 55 mg/dL',
        low: 'between 55 - 70 mg/dL',
        target: 'between 70 - 180 mg/dL',
        high: 'between 180 - 300 mg/dL',
        veryHigh: 'above 300 mg/dL'
      })
    })

    it('should generate condensed formatted range labels for mg/dL BG prefs when condensed option set', () => {
      const bgPrefs = {
        bgBounds: bounds.mgdl,
        bgUnits: 'mg/dL'
      }

      const result = bgUtils.generateBgRangeLabels(bgPrefs, { condensed: true })

      expect(result).to.eql({
        veryLow: '<55',
        low: '55-70',
        target: '70-180',
        high: '180-300',
        veryHigh: '>300'
      })
    })

    it('should generate formatted range labels for mmol/L BG prefs', () => {
      const bgPrefs = {
        bgBounds: bounds.mmoll,
        bgUnits: 'mmol/L'
      }

      const result = bgUtils.generateBgRangeLabels(bgPrefs)

      expect(result).to.eql({
        veryLow: 'below 3.1 mmol/L',
        low: 'between 3.1 - 3.9 mmol/L',
        target: 'between 3.9 - 10.0 mmol/L',
        high: 'between 10.0 - 16.7 mmol/L',
        veryHigh: 'above 16.7 mmol/L'
      })
    })

    it('should generate condensed formatted range labels for mmol/L BG prefs when condensed option set', () => {
      const bgPrefs = {
        bgBounds: bounds.mmoll,
        bgUnits: 'mmol/L'
      }

      const result = bgUtils.generateBgRangeLabels(bgPrefs, { condensed: true })

      expect(result).to.eql({
        veryLow: '<3.1',
        low: '3.1-3.9',
        target: '3.9-10.0',
        high: '10.0-16.7',
        veryHigh: '>16.7'
      })
    })
  })

  describe('reshapeBgClassesToBgBounds', () => {
    const bgPrefs = {
      bgClasses: {
        veryHigh: 600,
        high: 300,
        target: 180,
        low: 70,
        veryLow: 54
      },
      bgUnits: 'mg/dL'
    }

    it('should be a function', () => {
      assert.isFunction(bgUtils.reshapeBgClassesToBgBounds)
    })

    it('should extract and reshape `bgClasses` to `bgBounds`', () => {
      expect(bgUtils.reshapeBgClassesToBgBounds(bgPrefs)).to.deep.equal({
        veryHighThreshold: 300,
        targetUpperBound: 180,
        targetLowerBound: 70,
        veryLowThreshold: 54
      })
    })
  })

  describe('getOutOfRangeThreshold', () => {
    it('should return a high out-of-range threshold for a high datum', () => {
      const datum = {
        type: 'smbg',
        value: 601,
        annotations: [
          {
            code: 'bg/out-of-range',
            threshold: 600,
            value: 'high'
          }
        ]
      }

      expect(bgUtils.getOutOfRangeThreshold(datum)).to.deep.equal({
        high: 600
      })
    })

    it('should return a low out-of-range threshold for a low datum', () => {
      const datum = {
        type: 'smbg',
        value: 32,
        annotations: [
          {
            code: 'bg/out-of-range',
            threshold: 40,
            value: 'low'
          }
        ]
      }

      expect(bgUtils.getOutOfRangeThreshold(datum)).to.deep.equal({
        low: 40
      })
    })

    it('should return null for an in-range datum', () => {
      const datum = {
        type: 'smbg',
        value: 100
      }

      expect(bgUtils.getOutOfRangeThreshold(datum)).to.equal(null)
    })
  })

  describe('weightedCGMCount', () => {
    it('should return a count of 1 for every cgm datum by default', () => {
      const data = _.map(_.range(0, 10), () => ({
        deviceId: 'Dexcom_XXXXXXX',
        type: 'cbg'
      }))

      expect(bgUtils.weightedCGMCount(data)).to.equal(data.length)
    })

    it('should return a count of 1 for every cgm datum by default when missing the deviceId property', () => {
      const data = _.map(_.range(0, 10), () => ({
        type: 'cbg'
      }))

      expect(bgUtils.weightedCGMCount(data)).to.equal(data.length)
    })

    it('should return a count of 3 for every FreeStyle Libre cgm datum by default', () => {
      const data = _.map(_.range(0, 10), () => ({
        deviceId: 'AbbottFreeStyleLibre_XXXXXXX',
        type: 'cbg'
      }))

      expect(bgUtils.weightedCGMCount(data)).to.equal(data.length * 3)
    })

    it('should properly handle a mix of FreeStyle Libre and Dexcom data', () => {
      const data = _.map(_.range(0, 10), () => ({
        deviceId: 'Dexcom_XXXXXXX'
      })).concat(_.map(_.range(0, 10), () => ({
        deviceId: 'AbbottFreeStyleLibre_XXXXXXX',
        type: 'cbg'
      })))

      expect(bgUtils.weightedCGMCount(data)).to.equal(40)
    })
  })

  describe('cgmSampleFrequency', () => {
    it('should get the CGM sample frequency in milliseconds from a CGM data point', () => {
      const dexcomDatum = {
        deviceId: 'Dexcom_XXXXXXX'
      }
      expect(bgUtils.cgmSampleFrequency(dexcomDatum)).to.equal(5 * TimeService.MS_IN_MIN)

      const libreDatum = {
        deviceId: 'AbbottFreeStyleLibre_XXXXXXX'
      }
      expect(bgUtils.cgmSampleFrequency(libreDatum)).to.equal(15 * TimeService.MS_IN_MIN)
    })
  })
})
/* eslint-enable max-len */
