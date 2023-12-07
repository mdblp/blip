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

import _ from 'lodash'
import { expect } from 'chai'

import { DIABELOOP } from '../../src/utils/constants'

import * as device from '../../src/utils/device'

describe('device utility functions', () => {
  describe('isAutomatedBasalDevice', () => {
    it('should return `true` for an upload record for a DBLG1 system with automated basal delivery capabilities', () => {
      expect(device.isAutomatedBasalDevice(DIABELOOP, 'DBLG1')).to.be.true
    })
  })

  describe('getPumpVocabulary', () => {
    it('should return a pump terminology vocabulary, with default fallbacks for missing keys', () => {
      const manufacturers = [
        DIABELOOP,
        'default'
      ]
      _.forEach(manufacturers, manufacturer => {
        const pumpVocabulary = device.getPumpVocabulary(manufacturer)
        expect(pumpVocabulary, manufacturer).to.have.all.keys([
          'reservoirChange',
          'tubingPrime',
          'cannulaPrime',
          'automatedDelivery',
          'scheduledDelivery'
        ])
      })
    })
  })
})
