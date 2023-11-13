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

import i18next from 'i18next'
import moment from 'moment-timezone'
import { assert, expect } from 'chai'

import { MGDL_UNITS, MMOLL_UNITS, BG_CLAMP_THRESHOLD } from '../js/data/util/constants'
import fmt from '../js/data/util/format'

describe('format utility', function() {
  before(async () => {
    // At some time we could add test on other languages
    var i18nconf = {
      locales        : ['en', 'fr'],
      defaultLocale : 'en'
    }

    await i18next.init({
      fallbackLng: i18nconf.defaultLocale,
      lng: i18nconf.defaultLocale,
      // To allow . in keys
      keySeparator: false,
      // To allow : in keys
      nsSeparator: '|',
      // debug mode
      debug: false,
      // If the translation is empty, return the key instead
      returnEmptyString: false,
      resources: {
        en: {
          // Default namespace
          translation: {}
        },
        fr: {
          // Default namespace
          translation: {}
        }
      }
    })
    i18next.changeLanguage('en')
  })

  describe('tooltipBGValue', function() {
    it('should be a function', function() {
      assert.isFunction(fmt.tooltipBGValue)
    })

    it('should always return a string', function() {
      assert.isString(fmt.tooltipBGValue(0.9999999999999999999999999, MGDL_UNITS))
      assert.isString(fmt.tooltipBGValue(0.9999999999999999999999999, MMOLL_UNITS))
    })

    it('should return an integer string when units are mg/dL', function() {
      expect(fmt.tooltipBGValue(0.9999999999999999999999999, MGDL_UNITS)).to.equal('1')
    })

    it('should return a float string with one decimal place when units are mmol/L', function() {
      expect(fmt.tooltipBGValue(0.9999999999999999999999999, MMOLL_UNITS)).to.equal('1.0')
      expect(fmt.tooltipBGValue(4.2222222222222222222222222, MMOLL_UNITS)).to.equal('4.2')
    })

    it('should return a float string with one decimal place when no units', function() {
      expect(fmt.tooltipBGValue(4.2222222222222222222222222)).to.equal('4.2')
    })
  })

  describe('tooltipValue', function() {
    it('should be a function', function() {
      assert.isFunction(fmt.tooltipValue)
    })

    it('should always return a string', function() {
      assert.isString(fmt.tooltipValue(0))
      assert.isString(fmt.tooltipValue(0.9999999999999999999999999))
    })

    it('should return `0.0` when passed a value of 0', function() {
      expect(fmt.tooltipValue(0)).to.equal('0.0')
    })

    it('should return `1.075` when passed a value of 1.07499999999999999999', function() {
      expect(fmt.tooltipValue(1.07499999999999999999)).to.equal('1.075')
    })

    it('should remove right-hand zero padding where applicable', function() {
      expect(fmt.tooltipValue(1.200)).to.equal('1.2')
    })
  })

  describe('nameForDisplay', function() {
    it('should be a function', function() {
      assert.isFunction(fmt.nameForDisplay)
    })

    it('should return the same name for display if no words longer than maxWordLength', function() {
      expect(fmt.nameForDisplay('food', 4)).to.equal('food')
      expect(fmt.nameForDisplay('I had a dream', 5)).to.equal('I had a dream')
      expect(fmt.nameForDisplay('In a world where people live forever', 7)).to.equal('In a world where people live forever')
    })

    it('should trim words that are longer than max word length', function() {
      expect(fmt.nameForDisplay('foody', 4)).to.equal('food...')
      expect(fmt.nameForDisplay('Derek Jonesy', 5)).to.equal('Derek Jones...')
      expect(fmt.nameForDisplay('testing123@tidepool.org', 12)).to.equal('testing123@t...')
    })

    it('should sanitize the HTML text', () => {
      expect(fmt.nameForDisplay('<div>')).to.equal('&lt;div&gt;')
    })
  })

  describe('textPreview', function() {
    it('should be a function', function() {
      assert.isFunction(fmt.textPreview)
    })

    it('should return the same string if string length is less than preview length', function() {
      expect(fmt.textPreview('foo', 4)).to.equal('foo')
      expect(fmt.textPreview('I had a dream', 200)).to.equal('I had a dream')
      expect(fmt.textPreview('In a world where people live forever.', 50)).to.equal('In a world where people live forever.')
    })

    it('should return the return a segment of word is no spaces in sentence and previewLength is less than word length', function() {
      expect(fmt.textPreview('foobar', 5)).to.equal('fooba...')
    })

    it('should return the same string if string length is less than preview length', function() {
      expect(fmt.textPreview('foo', 3)).to.equal('foo')
      expect(fmt.textPreview('I had a dream', 13)).to.equal('I had a dream')
      expect(fmt.textPreview('In a world where people live forever.', 50)).to.equal('In a world where people live forever.')
    })

    it('should return the same string if string length is less than preview length', function() {
      expect(fmt.textPreview('foo bar', 3)).to.equal('foo...')
      expect(fmt.textPreview('I had a dream', 12)).to.equal('I had a...')
      expect(fmt.textPreview('In a world where people live forever.', 12)).to.equal('In a world...')
      expect(fmt.textPreview('In a world where people live forever.', 18)).to.equal('In a world where...')
    })

    it('should sanitize the HTML text', () => {
      expect(fmt.textPreview('<div>')).to.equal('&lt;div&gt;')
    })
  })

  describe('fixFloatingPoint', function() {
    it('should be a function', function() {
      assert.isFunction(fmt.fixFloatingPoint)
    })

    it('should return 1.075 when passed a value of 1.07499999999999999999', function() {
      expect(fmt.fixFloatingPoint(1.07499999999999999999)).to.equal(1.075)
    })
  })

  describe('percentage', function() {
    it('should be a function', function() {
      assert.isFunction(fmt.percentage)
    })

    it('should return `-- %` when passed Number.NaN', function() {
      expect(fmt.percentage(Number.NaN)).to.equal('-- %')
    })

    it('should return an integer percentage when passed a value between 0.0 and 1.0', function() {
      expect(fmt.percentage(0.6666666666666666666666667)).to.equal('67%')
    })
  })

  describe('xAxisDayText', function() {
    it('should be a function', function() {
      assert.isFunction(fmt.xAxisDayText)
    })

    it('should return `Wednesday, January 1` on a UTC timestamp at 1 am on first day of 2014', function() {
      expect(fmt.xAxisDayText(moment.utc('2014-01-01T01:00:00.000Z'))).to.equal('Wednesday, January 1')
    })

    it('should return `Tuesday, December 31` on same UTC timestamp when passed a Pacific non-DST offset', function() {
      expect(fmt.xAxisDayText(moment.tz('2014-01-01T01:00:00.000Z', 'US/Pacific'))).to.equal('Tuesday, December 31')
    })
  })

  describe('xAxisTickText', function() {
    it('should be a function', function() {
      assert.isFunction(fmt.xAxisTickText)
    })

    it('should return return `1 am` on a UTC timestamp at 1 am', function() {
      expect(fmt.xAxisTickText(moment.utc('2014-01-01T01:00:00.000Z'))).to.equal('1:00 am')
    })

    it('should return `5 pm` on same UTC timestamp when passed a Pacific non-DST offset', function() {
      expect(fmt.xAxisTickText(moment.tz('2014-01-01T01:00:00.000Z', 'US/Pacific'))).to.equal('5:00 pm')
    })

    it('should return `6 pm` on same UTC timestamp when passed a Pacific DST offset', function() {
      expect(fmt.xAxisTickText(moment.tz('2014-04-01T01:00:00.000Z', 'US/Pacific'))).to.equal('6:00 pm')
    })
  })
})
