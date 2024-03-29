/*
 * Copyright (c) 2022-2023, Diabeloop
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

import { getUserName, sanitizeBgUnit } from '../../../../lib/auth/user.util'
import { Unit } from 'medical-domain'

describe('User util', () => {
  describe('getUserName', () => {
    it('should return the translated value if first and last name are present, else the fullname', () => {
      const firstName = 'Ali'
      const lastName = 'Gator'
      const fullName = 'Ali Gator'

      const onlyFullNameCaseName = getUserName('', '', fullName)
      const firstNameCaseName = getUserName(firstName, '', fullName)
      const lastNameCaseName = getUserName('', lastName, fullName)
      const bothNamesCaseName = getUserName(firstName, lastName, fullName)

      expect(onlyFullNameCaseName).toEqual(fullName)
      expect(firstNameCaseName).toEqual(fullName)
      expect(lastNameCaseName).toEqual(fullName)
      expect(bothNamesCaseName).toEqual('user-name')
    })
  })

  describe('sanitizeBgUnit', () => {
    it('should return the default unit when no unit is provided', () => {
      expect(sanitizeBgUnit(undefined)).toEqual(Unit.MilligramPerDeciliter)
    })

    it('should return the appropriate unit even if the casing is wrong', () => {
      expect(sanitizeBgUnit(Unit.MilligramPerDeciliter)).toEqual(Unit.MilligramPerDeciliter)
      expect(sanitizeBgUnit('mg/dl')).toEqual(Unit.MilligramPerDeciliter)
      expect(sanitizeBgUnit('MG/DL')).toEqual(Unit.MilligramPerDeciliter)
      expect(sanitizeBgUnit('Mg/dl')).toEqual(Unit.MilligramPerDeciliter)

      expect(sanitizeBgUnit(Unit.MmolPerLiter)).toEqual(Unit.MmolPerLiter)
      expect(sanitizeBgUnit('mmol/l')).toEqual(Unit.MmolPerLiter)
      expect(sanitizeBgUnit('MMOL/L')).toEqual(Unit.MmolPerLiter)
      expect(sanitizeBgUnit('Mmol/l')).toEqual(Unit.MmolPerLiter)
    })
  })
})
