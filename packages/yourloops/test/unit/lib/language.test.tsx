/*
 * Copyright (c) 2021-2023, Diabeloop
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

import i18n from 'i18next'
import moment from 'moment-timezone'

import config from '../../../lib/config/config'
import { formatNumberForLang, getCurrentLang, getLangName } from '../../../lib/language'
import { LanguageCodes } from '../../../lib/auth/models/enums/language-codes.enum'
import i18next from 'i18next'

describe('Language', () => {
  const zeSpy = jest.fn()

  beforeAll(() => {
    window.zE = zeSpy
    config.METRICS_SERVICE = 'matomo'
  })

  afterAll(async () => {
    delete window.zE
    await i18n.changeLanguage(LanguageCodes.En)
    delete window._paq
    config.METRICS_SERVICE = 'disabled'
  })

  beforeEach(() => {
    zeSpy.mockReset()
    window._paq = []
  })

  it('should update zendesk & moment locale on change', async () => {
    await i18n.changeLanguage(LanguageCodes.Fr)
    expect(zeSpy).toHaveBeenCalledTimes(1)
    expect(moment.locale()).toBe(LanguageCodes.Fr)
    expect(localStorage.getItem('lang')).toBe(LanguageCodes.Fr)
    expect(getCurrentLang()).toBe(LanguageCodes.Fr)
    expect(window._paq).toEqual([['setCustomVariable', 1, 'UserLang', LanguageCodes.Fr, 'visit']])
  })

  it('getLangName should return the language name', () => {
    expect(getLangName(LanguageCodes.En)).toBe('English')
    expect(getLangName(LanguageCodes.Fr)).toBe('Français')
    expect(getLangName(LanguageCodes.De)).toBe('Deutsch')
    expect(getLangName(LanguageCodes.Es)).toBe('Español')
    expect(getLangName(LanguageCodes.It)).toBe('Italiano')
    expect(getLangName(LanguageCodes.Nl)).toBe('Nederlands')
  })


  describe('formatNumberForLang', () => {
    function checkFormattedNumber() {
      const integer = 10
      const formattedInteger = formatNumberForLang(integer, 0)
      expect(formattedInteger).toBe('10')
      const nan = '--'
      const formattedNan = formatNumberForLang(nan)
      expect(formattedNan).toBe('--')
      const anotherNan = '< 10'
      const anotherNanFormatted = formatNumberForLang(anotherNan)
      expect(anotherNanFormatted).toBe('< 10')
    }

    it('should format numbers correctly for non english language', () => {
      i18next.changeLanguage('fr')
      const decimal = 10.45
      const formattedDecimal = formatNumberForLang(decimal)
      expect(formattedDecimal).toBe('10,45')
      const decimalAsString = '10.45'
      const formattedDecimalAsString = formatNumberForLang(decimalAsString)
      expect(formattedDecimalAsString).toBe('10,45')
      checkFormattedNumber()
    })

    it('should format numbers correctly for english language', () => {
      i18next.changeLanguage('en')
      const decimal = 10.45
      const formattedDecimal = formatNumberForLang(decimal)
      expect(formattedDecimal).toBe('10.45')
      checkFormattedNumber()
    })

    it('should format numbers with minimum fraction digits', () => {
      i18next.changeLanguage('en')
      const number = 10
      const formattedWithMinFraction = formatNumberForLang(number, 1)
      expect(formattedWithMinFraction).toBe('10.0')
    })

    it('should format numbers with no minimum fraction digits when explicitly set to 0', () => {
      i18next.changeLanguage('en')
      const number = 10
      const formattedWithoutFraction = formatNumberForLang(number, 0)
      expect(formattedWithoutFraction).toBe('10')
    })

    it('should handle decimal numbers with various fraction digits', () => {
      i18next.changeLanguage('en')
      const number1 = 10.1
      expect(formatNumberForLang(number1)).toBe('10.1')
      const number2 = 10.123
      expect(formatNumberForLang(number2)).toBe('10.123')
      const number3 = 10.1234
      expect(formatNumberForLang(number3)).toBe('10.123')
    })

    it('should format string numbers for non-english languages', () => {
      i18next.changeLanguage('de')
      const stringDecimal = '123.456'
      const formatted = formatNumberForLang(stringDecimal)
      expect(formatted).toBe('123,456')
    })

    it('should format string numbers for english language', () => {
      i18next.changeLanguage('en')
      const stringDecimal = '123.456'
      const formatted = formatNumberForLang(stringDecimal)
      expect(formatted).toBe('123.456')
    })
  })
})
