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

import { expect } from 'chai'

import * as BasicsUtils from '../../../plugins/blip/basics/components/BasicsUtils'

describe('BasicsUtils', () => {
  const optionMatchingPathAndKey = {
    path: 'smbg',
    key: 'smbg'
  }

  const optionTotalKey = {
    path: 'smbg',
    key: 'total'
  }

  const optionOther = {
    key: 'data',
    path: 'other'
  }

  const optionOtherNoPath = {
    key: 'other'
  }

  const optionTotalNoPath = {
    key: 'total'
  }

  const data = {
    other: {
      data: {
        count: 6
      }
    },
    smbg: {
      total: 8
    },
    total: 14
  }

})
