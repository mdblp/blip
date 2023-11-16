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

import { expect } from 'chai'

import * as data from '../../../src/utils/settings/data'

describe('[settings] data utils', () => {
  describe('deviceName', () => {
    it('should return a formatted device name when provided a known manufacturer key', () => {
      expect(data.deviceName('animas')).to.equal('Animas')
      expect(data.deviceName('insulet')).to.equal('OmniPod')
      expect(data.deviceName('medtronic')).to.equal('Medtronic')
      expect(data.deviceName('tandem')).to.equal('Tandem')
    })

    it('should return the manufacturer key if a device name mapping does not exist', () => {
      expect(data.deviceName('foo')).to.equal('foo')
    })
  })
})
