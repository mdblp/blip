// == BSD2 LICENSE ==
// Copyright (c) 2014, Tidepool Project
//
// This program is free software; you can redistribute it and/or modify it under
// the terms of the associated License, which is identical to the BSD 2-Clause
// License as published by the Open Source Initiative at opensource.org.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the License for more details.
//
// You should have received a copy of the License along with this program; if
// not, you can obtain one from Tidepool Project at tidepool.org.
// == BSD2 LICENSE ==

const chai = require('chai')
const expect = chai.expect
const datetimeWrapper = require('../sundial')

describe('sundial', function() {

  describe('datetimeWrapper',function(){

    it('should not break require',function(){
      expect(datetimeWrapper).to.exist
    })
    it('should have an applyOffset method',function(){
      expect(datetimeWrapper.applyOffset).to.exist
    })

    describe('applyOffset', function() {
      it('should throw an error if no timestamp is provided', function() {
        const fn1 = function() { datetimeWrapper.applyOffset(undefined) }
        expect(fn1).to.throw('No timestamp provided as first argument!')
        const fn2 = function() { datetimeWrapper.applyOffset(null) }
        expect(fn2).to.throw('No timestamp provided as first argument!')
        const fn3 = function() { datetimeWrapper.applyOffset('') }
        expect(fn3).to.throw('No timestamp provided as first argument!')
      })

      it('should yield a UTC timestamp five hours later when given offset of 300, Zulu timestamp', function() {
        const res = datetimeWrapper.applyOffset('2014-01-01T00:00:00.000Z', 300)
        expect(res.toISOString()).to.equal('2014-01-01T05:00:00.000Z')
      })

      it('should yield a UTC timestamp five hours later when given offset of 300, timezone-naive timestamp', function() {
        const res = datetimeWrapper.applyOffset('2014-01-01T00:00:00', 300)
        expect(res.toISOString()).to.equal('2014-01-01T05:00:00.000Z')
      })

      it('should yield a UTC timestamp five hours earlier when given offset of -300, Zulu timestamp', function() {
        const res = datetimeWrapper.applyOffset('2014-01-01T05:00:00.000Z', -300)
        expect(res.toISOString()).to.equal('2014-01-01T00:00:00.000Z')
      })

      it('should yield a UTC timestamp five hours earlier when given offset of -300, timezone-naive timestamp', function() {
        const res = datetimeWrapper.applyOffset('2014-01-01T05:00:00', -300)
        expect(res.toISOString()).to.equal('2014-01-01T00:00:00.000Z')
      })

      it('should handle offset given as string without error', function() {
        const res = datetimeWrapper.applyOffset('2014-01-01T05:00:00.000Z', '-300')
        expect(res.toISOString()).to.equal('2014-01-01T00:00:00.000Z')
      })
    })

  })
})
