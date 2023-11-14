/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2014, Tidepool Project
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

import dt from '../js/data/util/datetime'

describe('datetime utility', function() {


  describe('getLocalDate', function() {
    it('should be a function', function() {
      assert.isFunction(dt.getLocalDate)
    })

    it('should return `2015-01-01` for UTC midnight January 1st, 2015, no timezoneName', function() {
      expect(dt.getLocalDate('2015-01-01T00:00:00.000Z')).to.equal('2015-01-01')
    })

    it('should return `2014-12-31` for UTC midnight January 1st, 2015, Pacific/Honolulu', function() {
      expect(dt.getLocalDate('2015-01-01T00:00:00.000Z', 'Pacific/Honolulu')).to.equal('2014-12-31')
    })
  })

  describe('isNearRightEdge', function() {
    it('should be a function', function() {
      assert.isFunction(dt.isNearRightEdge)
    })

    it('should return true when t1 is less than six hours before t2', function() {
      var t1 = {normalTime: '2014-01-01T21:00:01.000Z'}
      var t2 = new Date('2014-01-02T00:00:00.000Z')
      expect(dt.isNearRightEdge(t1, t2)).to.be.true
    })

    it('should return false when t1 is greater than six hours before t2', function() {
      var t1 = {normalTime: '2014-01-01T05:59:59.999Z'}
      var t2 = new Date('2014-01-02T00:00:00.000Z')
      expect(dt.isNearRightEdge(t1, t2)).to.be.false
    })
  })
})
