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

'use strict';

var salinity = require('salinity');
var expect = salinity.expect;
var testMoment = require('moment');

describe('sundial', function() {

  describe('datetimeWrapper',function(){
    var datetimeWrapper = require('../sundial');

    it('should not break require',function(){
      expect(datetimeWrapper).exists;
    });
    it('should have applyTimezone method',function(){
      expect(datetimeWrapper.applyTimezone).exists;
    });
    it('should have a buildTimestamp method',function(){
      expect(datetimeWrapper.buildTimestamp).exists;
    });
    it('should have a ceil method',function(){
      expect(datetimeWrapper.ceil).exists;
    });
    it('should have a checkTimezoneName method',function(){
      expect(datetimeWrapper.checkTimezoneName).exists;
    });
    it('should have dateDifference method',function(){
      expect(datetimeWrapper.dateDifference).exists;
    });
    it('should have a floor method',function(){
      expect(datetimeWrapper.floor).exists;
    });
    it('should have formatDeviceTime method',function(){
      expect(datetimeWrapper.formatDeviceTime).exists;
    });
    it('should have formatFromOffset method',function(){
      expect(datetimeWrapper.formatFromOffset).exists;
    });
    it('should have formatForStorage method',function(){
      expect(datetimeWrapper.formatForStorage).exists;
    });
    it('should have a formatInTimezone method', function(){
      expect(datetimeWrapper.formatInTimezone).exists;
    });
    it('should have getDeviceTimezone method',function() {
      expect(datetimeWrapper.getDeviceTimezone).exists;
    });
    it('should have getMsFromMidnight method',function() {
      expect(datetimeWrapper.getMsFromMidnight).exists;
    });
    it('should have getOffset method',function(){
      expect(datetimeWrapper.getOffset).exists;
    });
    it('should have getOffsetFromTime method',function(){
      expect(datetimeWrapper.getOffsetFromTime).exists;
    });
    it('should have getTimezones method',function(){
      expect(datetimeWrapper.getTimezones).exists;
    });
    it('should have futureDate method',function(){
      expect(datetimeWrapper.futureDate).exists;
    });
    it('should have isISODate method',function(){
      expect(datetimeWrapper.isISODate).exists;
    });
    it('should have isValidDate method',function(){
      expect(datetimeWrapper.isValidDate).exists;
    });
    it('should have isValidDateForMask method',function(){
      expect(datetimeWrapper.isValidDateForMask).exists;
    });
    it('should have parseFromFormat method',function(){
      expect(datetimeWrapper.parseFromFormat).exists;
    });
    it('should have a translateMask method',function(){
      expect(datetimeWrapper.translateMask).exists;
    });
    it('should have utcString method',function(){
      expect(datetimeWrapper.utcDateString).exists;
    });
    describe('applyOffset', function() {
      it('should yield a UTC timestamp five hours later when given offset of 300, Zulu timestamp', function() {
        var res = datetimeWrapper.applyOffset('2014-01-01T00:00:00.000Z', 300);
        expect(res.toISOString()).to.equal('2014-01-01T05:00:00.000Z');
      });

      it('should yield a UTC timestamp five hours later when given offset of 300, timezone-naive timestamp', function() {
        var res = datetimeWrapper.applyOffset('2014-01-01T00:00:00', 300);
        expect(res.toISOString()).to.equal('2014-01-01T05:00:00.000Z');
      });

      it('should yield a UTC timestamp five hours earlier when given offset of -300, Zulu timestamp', function() {
        var res = datetimeWrapper.applyOffset('2014-01-01T05:00:00.000Z', -300);
        expect(res.toISOString()).to.equal('2014-01-01T00:00:00.000Z');
      });

      it('should yield a UTC timestamp five hours earlier when given offset of -300, timezone-naive timestamp', function() {
        var res = datetimeWrapper.applyOffset('2014-01-01T05:00:00', -300);
        expect(res.toISOString()).to.equal('2014-01-01T00:00:00.000Z');
      });

      it('should handle offset given as string without error', function() {
        var res = datetimeWrapper.applyOffset('2014-01-01T05:00:00.000Z', '-300');
        expect(res.toISOString()).to.equal('2014-01-01T00:00:00.000Z');
      });
    });

    describe('applyTimezone', function() {
      it('should yield a UTC time offset five hours later when non-DST and given `US/Eastern` timezone', function() {
        var res = datetimeWrapper.applyTimezone('2014-01-01T00:00:00', 'US/Eastern').toISOString();
        expect(res).to.equal('2014-01-01T05:00:00.000Z');
      });

      it('should yield a UTC time offset four hours later when DST and given `US/Eastern` timezone', function() {
        var res = datetimeWrapper.applyTimezone('2014-06-01T00:00:00', 'US/Eastern').toISOString();
        expect(res).to.equal('2014-06-01T04:00:00.000Z');
      });

      it('should assume UTC time when no timezone provided', function() {
        var res = datetimeWrapper.applyTimezone('2014-01-01T00:00:00').toISOString();
        expect(res).to.equal('2014-01-01T00:00:00.000Z');
      });

      it('should throw an error if timezone name not recognized by moment', function() {
        var fn = function() { datetimeWrapper.applyTimezone('2014-01-01T00:00:00', 'Foo'); };
        expect(fn).to.throw(Error, 'Unrecognized timezone name!');
      });
    });

    describe('buildTimestamp', function() {
      var inputObj = {
        year: 2013,
        month: 1,
        day: 22,
        hours: 4,
        minutes: 25,
        seconds: 21
      };
      var built = datetimeWrapper.buildTimestamp(inputObj);
      it('returns a JavaScript Date object when input object has all required fields', function() {
        expect(built).to.eql(new Date('2013-01-22T04:25:21.000Z'));
      });

      it('can have a timezone applied later', function() {
        expect(datetimeWrapper.applyTimezone(built, 'US/Eastern').toISOString()).to.equal('2013-01-22T09:25:21.000Z');
      });

      it('can yield a deviceTime later', function() {
        expect(datetimeWrapper.formatDeviceTime(built)).to.equal('2013-01-22T04:25:21');
      });

      it('can yield a timezoneOffset after conversion to UTC (when given named timezone)', function() {
        var edgeCase = {
          year: 2014,
          month: 3,
          day: 9,
          hours: 2,
          minutes: 0,
          seconds: 0
        };
        var builtEdgeCase = datetimeWrapper.buildTimestamp(edgeCase);
        var edgeInUTC = datetimeWrapper.applyTimezone(builtEdgeCase, 'US/Eastern');
        expect(datetimeWrapper.getOffsetFromZone(edgeInUTC.toISOString(), 'US/Eastern')).to.equal(-240);
      });

      it('returns null when input object is missing one or more required fields', function() {
        var inputObj = {
          year: 2013,
          month: 1,
          day: 22,
          hours: 4,
          minutes: 25
        };
        var built = datetimeWrapper.buildTimestamp(inputObj);
        expect(built).to.equal(null);
      });
    });

    describe('ceil', function() {
      it('returns midnight of next day when units are days', function() {
        var res = datetimeWrapper.ceil('2014-01-01T12:00:00.000Z', 'days');
        expect(res.toISOString()).to.equal('2014-01-02T00:00:00.000Z');
      });

      it('returns midnight of next day in specified timezone when units are days', function() {
        var res = datetimeWrapper.ceil('2014-01-01T12:00:00.000Z', 'days', 'Pacific/Honolulu');
        expect(res.toISOString()).to.equal('2014-01-02T10:00:00.000Z');
      });

      it('should throw an error if timezone name not recognized by moment', function() {
        var fn = function() { datetimeWrapper.ceil('2014-01-01T12:00:00.000Z', 'days', 'Foo'); };
        expect(fn).to.throw(Error, 'Unrecognized timezone name!');
      });
    });

    describe('checkTimezoneName', function() {
      it('should not throw an error on a null, undefined, or empty string timezone', function() {
        var fn = function() { datetimeWrapper.checkTimezoneName(null); };
        expect(fn).not.to.throw(Error);
      });

      it('should not throw an error on a recognized timezone', function() {
        var fn = function() { datetimeWrapper.checkTimezoneName('US/Central'); };
        expect(fn).not.to.throw(Error);
      });

      it('should throw an error on `Foo` timezone', function() {
        var fn = function() { datetimeWrapper.checkTimezoneName('Foo'); };
        expect(fn).to.throw(Error, 'Unrecognized timezone name!');
      });
    });

    describe('dateDifference', function() {
      it('returns the difference between two timestamps', function() {
        var t1 = '2013-01-22T04:25:21.000Z';
        var t2 = '2013-01-23T04:25:21.000Z';

        var hrsNeg = datetimeWrapper.dateDifference(t1,t2,'hours');
        expect(hrsNeg).to.equal(-24);

        var hrs = datetimeWrapper.dateDifference(t2,t1,'hours');
        expect(hrs).to.equal(24);

      });
      it('returns the difference between two timestamps rounded down', function() {
        var birthday = '2000-01-22T04:25:21.000Z';
        var today = '2013-01-21T04:25:21.000Z';

        var yrsAgo = datetimeWrapper.dateDifference(birthday,today,'years');
        expect(yrsAgo).to.equal(-12);

        //and then if it was your bday 'today'
        var birthdayToday = '2000-01-21T04:25:21.000Z';

        yrsAgo = datetimeWrapper.dateDifference(birthdayToday,today,'years');
        expect(yrsAgo).to.equal(-13);


      });
    });

    describe('floor', function() {
      it('returns previous midnight when units are days', function() {
        var res = datetimeWrapper.floor('2014-01-01T12:00:00.000Z', 'days');
        expect(res.toISOString()).to.equal('2014-01-01T00:00:00.000Z');
      });

      it('returns previous midnight in specified timezone when units are days', function() {
        var res = datetimeWrapper.floor('2014-01-01T12:00:00.000Z', 'days', 'Pacific/Honolulu');
        expect(res.toISOString()).to.equal('2014-01-01T10:00:00.000Z');
      });

      it('should throw an error if timezone name not recognized by moment', function() {
        var fn = function() { datetimeWrapper.floor('2014-01-01T12:00:00.000Z', 'days', 'Foo'); };
        expect(fn).to.throw(Error, 'Unrecognized timezone name!');
      });
    });

    describe('formatDeviceTime', function() {
      it('returns a string formatted as ISO-format without milliseconds or timezone offset', function() {
        expect(datetimeWrapper.formatDeviceTime('2014-01-01T00:00:00.000Z')).to.equal('2014-01-01T00:00:00');
      });

      it('always speaks UTC, even when given non-Zulu ISO timestamp', function() {
        expect(datetimeWrapper.formatDeviceTime('2013-12-31T16:00:00-08:00')).to.equal('2014-01-01T00:00:00');
      });

      it('interprets a timezone-naive timestamp as if it is Zulu time', function() {
        expect(datetimeWrapper.formatDeviceTime('2014-01-01T00:00:00')).to.equal('2014-01-01T00:00:00');
      });

      it('speaks integer timestamps fluently', function() {
        expect(datetimeWrapper.formatDeviceTime(Date.parse('2014-01-01T00:00:00.000Z'))).to.equal('2014-01-01T00:00:00');
      });

      it('speaks JavaScript Date fluently too', function() {
        expect(datetimeWrapper.formatDeviceTime(new Date('2014-01-01T00:00:00.000Z'))).to.equal('2014-01-01T00:00:00');
      });
    });

    describe('formatFromOffset', function() {
      var utcDateString = '2013-05-09T00:00:00-00:00';
      it('returns a string formatted as MMMM D [at] h:mm a with the given offset applied', function() {
        expect(datetimeWrapper.formatFromOffset(utcDateString, -240)).to.equal('May 8 at 8:00 pm');
      });
    });

    describe('formatForStorage', function() {
      var basicTimestamp = '2014-10-03T13:23';
      var offsetMins = -780;

      it('returns a string',function(){

        var utcString = datetimeWrapper.formatForStorage(basicTimestamp,offsetMins);
        expect(utcString).is.a.String;
      });

      it('returns a valid date',function(){

        var utcString = datetimeWrapper.formatForStorage(basicTimestamp,offsetMins);
        expect(testMoment(utcString).isValid()).is.true;

      });
      it('has the offset from UTC',function(){

        var utcString = datetimeWrapper.formatForStorage(basicTimestamp,offsetMins);
        var offsetFromTimestamp = testMoment.parseZone(utcString).zone();
        expect(-offsetFromTimestamp).to.equal(offsetMins);

      });
      it('does not contain the `Z` designator for the zero UTC offset',function(){

        var utcString = datetimeWrapper.utcDateString();

        expect(utcString).to.not.contain('Z');
        expect(utcString).to.not.contain('z');

      });
    });

    describe('formatInTimezone', function() {
      it('returns `365th` at UTC 9 a.m., Honolulu 11 p.m. New Year\'s Eve', function() {
        var res = datetimeWrapper.formatInTimezone('2014-01-01T09:00:00Z', 'Pacific/Honolulu', 'DDDo');
        expect(res).to.equal('365th');
      });

      it('returns `1st` at UTC 9 a.m., Eastern 4 a.m. New Year\'s Day', function() {
        var res = datetimeWrapper.formatInTimezone('2014-01-01T09:00:00Z', 'US/Eastern', 'DDDo');
        expect(res).to.equal('1st');
      });

      it('returns `2nd` at UTC 3 p.m., Auckland 4 a.m. January 2nd', function() {
        var res = datetimeWrapper.formatInTimezone('2014-01-01T15:00:00Z', 'Pacific/Auckland', 'DDDo');
        expect(res).to.equal('2nd');
      });

      it('should throw an error if timezone name not recognized by moment', function() {
        var fn = function() { datetimeWrapper.formatInTimezone('2014-01-01T15:00:00Z', 'Foo', 'DDDo'); };
        expect(fn).to.throw(Error, 'Unrecognized timezone name!');
      });
    });

    describe('futureDate', function() {
      it('returns a plausible date for future date', function() {
        var fd0 = datetimeWrapper.futureDate(0);  // current time
        var fd5 = datetimeWrapper.futureDate(5);  // 5 days from now
        var jd0 = datetimeWrapper.parseFromFormat(fd0, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
        var jd5 = datetimeWrapper.parseFromFormat(fd5, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
        // this should be 5 days (plus a couple of msec)
        var delta = jd5 - jd0;
        var expected = 5 * 24 * 60 * datetimeWrapper.MIN_TO_MSEC;
        var variance = delta - expected;
        expect(variance < 10 && variance >= 0).to.be.true;
      });
    });

    describe('getDeviceTimezone', function() {

      it('returns a valid timezone object',function(){
        var timezone = datetimeWrapper.getDeviceTimezone();
        expect(timezone.name).to.have.length.above(0);
        expect(timezone.label).to.have.length.above(0);
      });
    });

    describe('getMsFromMidnight', function() {
      it('should return 1 when 1ms from UTC midnight and no offset', function() {
        expect(datetimeWrapper.getMsFromMidnight('2014-01-01T00:00:00.001Z')).to.equal(1);
      });

      it('should return 25 when 25ms from US/Eastern midnight during non-DST', function() {
        var easternNoDSTOffset = -300;
        expect(datetimeWrapper.getMsFromMidnight('2014-01-01T05:00:00.025Z', easternNoDSTOffset)).to.equal(25);
      });

      it('should return 25 when 25ms from US/Eastern midnight during non-DST', function() {
        var easternNoDSTOffset = -300;
        expect(datetimeWrapper.getMsFromMidnight('2014-01-01T00:00:00.025-05:00', easternNoDSTOffset)).to.equal(25);
      });

      it('should return 300000 when 5 min from Pacific/Auckland midnight during DST', function() {
        var aucklandDSTOffset = 780;
        expect(datetimeWrapper.getMsFromMidnight('2013-12-31T11:05:00.000Z', aucklandDSTOffset)).to.equal(300000);
      });
    });

    describe('getOffset', function() {
      it('returns the browser local offset from UTC in minutes',function(){

        var offset = datetimeWrapper.getOffset();
        var usersZone = new Date().getTimezoneOffset();
        expect(offset).to.equal(-usersZone);
      });
    });

    describe('getOffsetFromTime', function() {
      it('returns the offset from UTC in minutes, +/-HH:MM zone format',function(){

        var timestamp = '2013-01-01T00:00:00-13:00';

        var offset = datetimeWrapper.getOffsetFromTime(timestamp);
        expect(offset).to.equal(-780);
      });

      it('returns the offset from UTC in minutes, assuming local timezone, Zulu timestamp',function(){
        var timestamp = '2013-01-01T00:00:00.000Z';

        var offset = datetimeWrapper.getOffsetFromTime(timestamp);
        var localOffset = new Date().getTimezoneOffset();
        // because it's impossible to make a test that will pass in non-Zulu environments
        // without doing timezone detection!
        if (localOffset === 0) {
          expect(offset).to.equal(-localOffset);
        }
      });
    });

    describe('getOffsetFromZone', function() {
      it('returns an offset of -300 for US/Eastern during non-DST', function() {
        var offset = datetimeWrapper.getOffsetFromZone('2014-01-01T00:00:00.000Z', 'US/Eastern');
        expect(offset).to.equal(-300);
      });

      it('returns an offset of -240 for US/Eastern during DST', function() {
        var offset = datetimeWrapper.getOffsetFromZone('2014-07-01T05:00:00.000Z', 'US/Eastern');
        expect(offset).to.equal(-240);
      });

      it('should throw an error if timezone name not recognized by moment', function() {
        var fn = function() { datetimeWrapper.getOffsetFromZone('2014-07-01T05:00:00.000Z', 'Foo'); };
        expect(fn).to.throw(Error, 'Unrecognized timezone name!');
      });
    });

    describe('getTimezones', function() {

      it('returns 131 timezone objects',function(){
        expect(datetimeWrapper.getTimezones()).to.have.length(131);
      });

      it('returns timezone objects with a non-empty string name and label each',function(){
        datetimeWrapper.getTimezones().forEach(function(timezone){
          expect(timezone.name).to.have.length.above(0);
          expect(timezone.label).to.have.length.above(0);
        });
      });
    });

    describe('isISODate', function() {
      it('returns false for null',function(){
        expect(datetimeWrapper.isISODate(null)).is.false;
      });

      it('returns false for empty string',function(){
        expect(datetimeWrapper.isISODate('')).is.false;
      });

      it('returns false for invalid date',function(){
        expect(datetimeWrapper.isISODate('Junk')).is.false;
      });

      it('return false for valid but non-ISO (i.e., timezone-naive) date',function(){
        expect(datetimeWrapper.isISODate(new Date().toISOString().slice(0,-5))).is.false;
      });

      it('returns true for valid non-Zulu ISO date',function(){
        expect(datetimeWrapper.isISODate(testMoment().parseZone().format())).is.true;
      });

      it('returns true for valid Zulu ISO date',function(){
        expect(datetimeWrapper.isISODate(new Date().toISOString())).is.true;
      });
    });

    describe('isValidDate', function() {

      it('returns false for null',function(){
        expect(datetimeWrapper.isValidDate(null)).is.false;
      });
      it('returns false for empty string',function(){
        expect(datetimeWrapper.isValidDate('')).is.false;
      });
      it('returns false for invalid date',function(){
        expect(datetimeWrapper.isValidDate('Junk')).is.false;
      });
      it('returns true for a valid date',function(){
        expect(datetimeWrapper.isValidDate(new Date().toISOString())).is.true;
      });
    });

    describe('isValidDateForMask', function() {

      var MASK = 'MM/DD/YYYY';

      it('returns false for null',function(){
        expect(datetimeWrapper.isValidDateForMask(null,MASK)).is.false;
      });
      it('returns false for empty string',function(){
        expect(datetimeWrapper.isValidDateForMask('',MASK)).is.false;
      });
      it('returns false for invalid date',function(){
        expect(datetimeWrapper.isValidDateForMask('Junk',MASK)).is.false;
      });
      it('returns false when valid date doesn\'t match the given mask',function(){
        expect(datetimeWrapper.isValidDateForMask(new Date().toISOString(),MASK)).is.false;
      });
      it('returns false for a invalid date that matchs the mask',function(){
        var badFebDate = '02/31/1999';
        expect(datetimeWrapper.isValidDateForMask(badFebDate, MASK)).is.false;
      });
      it('returns true for a valid date that matchs the mask',function(){
        var goodFebDate = '02/28/1999';
        expect(datetimeWrapper.isValidDateForMask(goodFebDate, MASK)).is.true;
      });
      it('works for a range of dates',function(){

        var badFebDate = '02/29/1999';
        expect(datetimeWrapper.isValidDateForMask(badFebDate, MASK)).is.false;

        var feb2012LeapYear = '02/29/2012';
        expect(datetimeWrapper.isValidDateForMask(feb2012LeapYear, MASK)).is.true;

        var feb2008LeapYear = '02/29/2008';
        expect(datetimeWrapper.isValidDateForMask(feb2008LeapYear, MASK)).is.true;

        var badAprilDate = '04/31/1962';
        expect(datetimeWrapper.isValidDateForMask(badAprilDate, MASK)).is.false;

        var badJuneDate = '06/31/1951';
        expect(datetimeWrapper.isValidDateForMask(badJuneDate, MASK)).is.false;
        
        var badSepDate = '09/31/1977';
        expect(datetimeWrapper.isValidDateForMask(badSepDate, MASK)).is.false;
        
        var badNovDate = '11/31/1983';
        expect(datetimeWrapper.isValidDateForMask(badNovDate, MASK)).is.false;
      });
    });

    describe('parseFromFormat', function() {
      var euroFormat = 'DD-MM-YYYY hh:mm a';
      it('should yield a UTC time offset five hours later when non-DST and given `US/Eastern` timezone', function() {
        var res = datetimeWrapper.parseFromFormat('31-12-2013 06:32 p.m.', euroFormat, 'US/Eastern').toISOString();
        expect(res).to.equal('2013-12-31T23:32:00.000Z');
      });

      it('should yield a UTC time offset four hours later when DST and given `US/Eastern` timezone', function() {
        var res = datetimeWrapper.parseFromFormat('30-06-2014 07:32 p.m.', euroFormat, 'US/Eastern').toISOString();
        expect(res).to.equal('2014-06-30T23:32:00.000Z');
      });

      it('should correctly parse another format', function() {
        var fmt = 'MMMM DD YYYY HH:mm:ss';
        var res = datetimeWrapper.parseFromFormat('Jun 30 2014 19:32:00', fmt, 'US/Eastern').toISOString();
        expect(res).to.equal('2014-06-30T23:32:00.000Z');
      });

      it('should correctly parse another format even if seconds are missing', function() {
        var fmt = 'MMMM DD YYYY HH:mm:ss';
        var res = datetimeWrapper.parseFromFormat('Jun 30 2014 19:32', fmt, 'US/Eastern').toISOString();
        expect(res).to.equal('2014-06-30T23:32:00.000Z');
      });

      it('should assume UTC time when no timezone provided', function() {
        var res = datetimeWrapper.parseFromFormat('30-06-2014 07:32 p.m.', euroFormat).toISOString();
        expect(res).to.equal('2014-06-30T19:32:00.000Z');
      });

      it('should throw an error if timezone name not recognized by moment', function() {
        var fn = function() { datetimeWrapper.parseFromFormat('30-06-2014 07:32 p.m.', euroFormat, 'Foo'); };
        expect(fn).to.throw(Error, 'Unrecognized timezone name!');
      });
    });

    describe('translateMask', function() {
      var AMERICAN_MASK = 'MM/DD/YYYY';
      var INTL_MASK = 'DD/MM/YYYY';
      var ISO_MASK = 'YYYY-MM-DD';
      it('translates an American date format into ISO date format', function() {
        expect(datetimeWrapper.translateMask('03/10/2014', AMERICAN_MASK, ISO_MASK)).to.equal('2014-03-10');
      });

      it('translates an international date format into ISO date format', function() {
        expect(datetimeWrapper.translateMask('10/03/2014', INTL_MASK, ISO_MASK)).to.equal('2014-03-10');
      });

      it('throws an error if input datetime does not match input mask', function() {
        var fn = function() { datetimeWrapper.translateMask('31/03/2014', AMERICAN_MASK, ISO_MASK); };
        expect(fn).to.throw(Error);
      });
    });

    describe('utcDateString', function() {
      /*
       * http://en.wikipedia.org/wiki/Iso8601#Time_offsets_from_UTC
       */
      it('returns a string',function(){

        var utcString = datetimeWrapper.utcDateString();
        expect(utcString).is.a.String;
      });

      it('returns a valid date',function(){

        var utcString = datetimeWrapper.utcDateString();
        expect(testMoment(utcString).isValid()).is.true;

      });
      it('has the offset from UTC or is Zulu time',function(){

        var utcString = datetimeWrapper.utcDateString();

        expect(datetimeWrapper.isISODate(utcString)).to.be.true;

      });
      it('does not contain the `Z` designator for the zero UTC offset',function(){

        var utcString = datetimeWrapper.utcDateString();

        expect(utcString).to.not.contain('Z');
        expect(utcString).to.not.contain('z');

      });
    });
  });
});
