/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2016, Tidepool Project
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

import { assert, expect } from 'chai'

import * as utils from '../../../src/utils/trends/data'

describe('[trends] data utils', () => {
  describe('findDatesIntersectingWithCbgSliceSegment', () => {
    const focusedSlice = {
      data: {
        msFrom: 0,
        msTo: 10,
        ninetiethQuantile: 90,
        thirdQuartile: 75
      }
    }
    const focusedSliceKeys = ['thirdQuartile', 'ninetiethQuantile']
    const cbgData = [{
      // ms in range, value = bottom of range
      localDate: '2016-12-31',
      msPer24: 5,
      value: 75
    }, {
      // ms in range, value = top of range
      localDate: '2016-12-25',
      msPer24: 5,
      value: 90
    }, {
      // ms in range, value in range
      localDate: '2016-12-30',
      msPer24: 5,
      value: 80
    }, {
      // ms at bottom (= in range), value in range
      localDate: '2016-12-26',
      msPer24: 0,
      value: 80
    }, {
      // ms at top (out of range), value in range
      localDate: '2017-01-05',
      msPer24: 10,
      value: 80
    }, {
      // ms in range, value below range
      localDate: '2017-01-01',
      msPer24: 5,
      value: 10
    }, {
      // ms in range, value above range
      localDate: '2017-01-02',
      msPer24: 5,
      value: 95
    }]

    it('should be a function', () => {
      assert.isFunction(utils.findDatesIntersectingWithCbgSliceSegment)
    })

    it('returns an empty array on empty data', () => {
      expect(utils.findDatesIntersectingWithCbgSliceSegment(
        [], focusedSlice, focusedSliceKeys
      )).to.deep.equal([])
    })

    it('should find four intersecting 2016 dates', () => {
      expect(utils.findDatesIntersectingWithCbgSliceSegment(
        cbgData, focusedSlice, focusedSliceKeys
      )).to.deep.equal([
        '2016-12-25',
        '2016-12-26',
        '2016-12-30',
        '2016-12-31'
      ])
    })
  })
})
