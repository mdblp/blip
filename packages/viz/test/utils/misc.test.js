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

import { assert, expect } from 'chai'
import { patient, anonymousPatient } from '../../data/patient/profiles'
import { getPatientFullName } from '../../src/utils/misc'

describe('misc utility functions', () => {
  describe('getPatientFullName', () => {
    it('should be a function', () => {
      assert.isFunction(getPatientFullName)
    })

    it('returns patient name', () => {
      expect(getPatientFullName(patient)).to.equal(patient.profile.fullName)
    })

    it('returns child name when isOtherPerson', () => {
      expect(getPatientFullName(anonymousPatient)).to.equal('Anonymous user')
    })
  })
})
