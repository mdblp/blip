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
import { expect, assert } from 'chai'
import * as annotations from '../../src/utils/annotations'

const noAnnotations = {
  type: 'smbg',
  units: 'mg/dL',
  value: 100
}

const veryHigh = {
  type: 'smbg',
  units: 'mg/dL',
  value: 601,
  annotations: [
    {
      code: 'bg/out-of-range',
      value: 'high',
      threshold: 600
    }
  ]
}

const veryLow = {
  type: 'smbg',
  units: 'mg/dL',
  value: 39,
  annotations: [
    {
      code: 'bg/out-of-range',
      value: 'low',
      threshold: 40
    }
  ]
}

const animasBolus = {
  type: 'bolus',
  extended: 1.2,
  duration: 18000000,
  normalTime: '2017-11-11T05:45:52.000Z',
  annotations: [
    { code: 'animas/bolus/extended-equal-split' }
  ]
}

describe('annotation utilities', () => {
  describe('getAnnotations', () => {
    it('should be a function', () => {
      assert.isFunction(annotations.getAnnotations)
    })

    it('should return empty aray for non-annotated datum', () => {
      expect(annotations.getAnnotations(noAnnotations)).to.deep.equal([])
    })

    it('should return annotations for annotated datum', () => {
      expect(annotations.getAnnotations(veryHigh)).to.deep.equal(veryHigh.annotations)
      expect(annotations.getAnnotations(veryLow)).to.deep.equal(veryLow.annotations)
      expect(annotations.getAnnotations(animasBolus)).to.deep.equal(animasBolus.annotations)
    })
  })

  describe('getOutOfRangeAnnotationMessage', () => {
    it('should be a function', () => {
      assert.isFunction(annotations.getOutOfRangeAnnotationMessage)
    })

    it('should return empty aray for non-annotated and in-range datum', () => {
      expect(annotations.getOutOfRangeAnnotationMessage(noAnnotations)).to.deep.equal([])
    })

    it('should return annotation messages for annotated datum', () => {
      expect(annotations.getOutOfRangeAnnotationMessage(veryHigh)[0].message.value).to.deep.equal(
        '* This BG value was higher than your device could record. Your actual BG value is higher than it appears here.'
      )
      expect(annotations.getOutOfRangeAnnotationMessage(veryLow)[0].message.value).to.deep.equal(
        '* This BG value was lower than your device could record. Your actual BG value is lower than it appears here.'
      )
    })
  })
})
