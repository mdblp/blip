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

import { expect } from 'chai'

import * as constants from '../js/data/util/constants'

describe('constants', function() {
  it('should export an object', function() {
    expect(typeof constants).to.equal('object')
  })

  it('should define the AUTOMATED_BASAL_DEVICE_MODELS mapping', function() {
    expect(constants.AUTOMATED_BASAL_DEVICE_MODELS).to.eql({
      Medtronic: ['1580', '1581', '1582', '1780', '1781', '1782'],
      Diabeloop: true
    })
  })

  it('should define the AUTOMATED_BASAL_LABELS mapping', function() {
    expect(constants.AUTOMATED_BASAL_LABELS).to.eql({
      Medtronic: 'Auto Mode',
      Diabeloop: 'Loop mode',
      default: 'Automated'
    })
  })

  it('should define the SCHEDULED_BASAL_LABELS mapping', function() {
    expect(constants.SCHEDULED_BASAL_LABELS).to.eql({
      Medtronic: 'Manual',
      Diabeloop: 'Loop mode off',
      default: 'Manual'
    })
  })
})
