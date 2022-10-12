/**
 * Copyright (c) 2021, Diabeloop
 * Regex tests
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

import { REGEX_EMAIL, REGEX_PHONE, REGEX_ZIPCODE_WITH_STRING, REGEX_ZIPCODE_WITHOUT_STRING } from '../../../lib/utils'

const validEmails = [
  'foobar@domain.de',
  'hello.world@example.com',
  'compte.aidant+1@example.fr',
  'hcp-test@example.com',
  'my123account@domain.fr',
  'abc@sub.domain.org'
]

const invalidEmails = [
  'abcd',
  '<hello>',
  'mañana.es',
  'aaa-ß@example.de',
  ' @example.com',
  '+@example.com',
  '+str@example.com',
  'hello\nworld@test.org',
  'world@test.org\nworld@test.org',
  'name@☃-⌘.com',
  '☃-⌘@domain.com',
  'pine🍍pple@fruit.com',
  'toto@ggrd.fr@aaa.de',
  '<toto@ggrd.fr> v@aaa.de',
  'a@g',
  'er y@example.it',
  'mañana@domain.es',
  '<name> name@example.com',
  'name@invalid-dômain.fr',
  'almost@good.email.es '
]

describe('Regex', () => {
  describe('REGEX_EMAIL', () => {
    it('email regex should accept a list of valid emails', () => {
      validEmails.forEach((email: string) => {
        expect(REGEX_EMAIL.test(email)).toBe(true)
      })
    })

    it('email regex should refuse a list of invalid emails', () => {
      invalidEmails.forEach((email: string) => {
        expect(REGEX_EMAIL.test(email)).toBe(false)
      })
    })
  })

  describe('REGEX_PHONE', () => {
    it('should be valid when given eight numbers', () => {
      // given
      const value = '06000000'
      // when
      const result = REGEX_PHONE.test(value)

      // then
      expect(result).toBeTruthy()
    })

    it('should be invalid when given seven numbers', () => {
      // given
      const value = '0600000'
      // when
      const result = REGEX_PHONE.test(value)

      // then
      expect(result).toBeFalsy()
    })

    it('should be invalid when given twelve numbers', () => {
      // given
      const value = '060000000000'
      // when
      const result = REGEX_PHONE.test(value)

      // then
      expect(result).toBeFalsy()
    })

    it('should be invalid when given alpha characters', () => {
      // given
      const value = 'abcdefghi'
      // when
      const result = REGEX_PHONE.test(value)

      // then
      expect(result).toBeFalsy()
    })

    it('should be invalid when given special characters', () => {
      // given
      const value = '8"(è_çà)"'
      // when
      const result = REGEX_PHONE.test(value)

      // then
      expect(result).toBeFalsy()
    })

    it('should be invalid when given alpha-numeric characters', () => {
      // given
      const value = 'aaddd789'
      // when
      const result = REGEX_PHONE.test(value)

      // then
      expect(result).toBeFalsy()
    })
  })

  describe('REGEX_ZIPCODE_WITHOUT_STRING ', () => {
    it('should be valid when given many numbers with -', () => {
      // given
      const value = '8888-8888888888'
      // when
      const result = REGEX_ZIPCODE_WITHOUT_STRING.test(value)

      // then
      expect(result).toBeTruthy()
    })

    it('should be invalid when given alpha characters', () => {
      // given
      const value = 'abcdefghi'
      // when
      const result = REGEX_ZIPCODE_WITHOUT_STRING.test(value)

      // then
      expect(result).toBeFalsy()
    })

    it('should be invalid when given special characters exepted -', () => {
      // given
      const value = '8"(è_çà)"'
      // when
      const result = REGEX_ZIPCODE_WITHOUT_STRING.test(value)

      // then
      expect(result).toBeFalsy()
    })

    it('should be invalid when given alpha-numeric characters', () => {
      // given
      const value = 'aaddd789'
      // when
      const result = REGEX_ZIPCODE_WITHOUT_STRING.test(value)

      // then
      expect(result).toBeFalsy()
    })
  })

  describe('REGEX_ZIPCODE_WITH_STRING ', () => {
    it('should be valid when given many numbers with one space', () => {
      // given
      const value = '8888 888888888'
      // when
      const result = REGEX_ZIPCODE_WITH_STRING.test(value)

      // then
      expect(result).toBeTruthy()
    })

    it('should be valid when given alpha characters with number and space', () => {
      // given
      const value = 'ALF 88888'
      // when
      const result = REGEX_ZIPCODE_WITH_STRING.test(value)

      // then
      expect(result).toBeTruthy()
    })

    it('should be invalid when given special characters excepted space', () => {
      // given
      const value = '8"(è_ çà)"'
      // when
      const result = REGEX_ZIPCODE_WITH_STRING.test(value)

      // then
      expect(result).toBeFalsy()
    })

    it('should be invalid when given alpha-numeric characters in tiny', () => {
      // given
      const value = 'aaddd789'
      // when
      const result = REGEX_ZIPCODE_WITH_STRING.test(value)

      // then
      expect(result).toBeFalsy()
    })
  })
})
