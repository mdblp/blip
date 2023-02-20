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

import isTSA from '../../helpers/tidepoolStandardAction'
import * as actionTypes from '../../../src/redux/constants/actionTypes'
import * as actions from '../../../src/redux/actions/'

describe('trends action creators', () => {
  const userId = 'a1b2c3'

  describe('focusTrendsCbgSlice', () => {
    const sliceData = {}
    const slicePosition = {}
    const focusedKeys = []
    const action = actions.focusTrendsCbgSlice(userId, sliceData, slicePosition, focusedKeys)

    it('should be a TSA', () => {
      expect(isTSA(action)).to.be.true
    })

    it('should create an action to focus a trends cbg slice', () => {
      expect(action).to.deep.equal({
        type: actionTypes.FOCUS_TRENDS_CBG_SLICE,
        payload: { sliceData, slicePosition, focusedKeys, userId }
      })
    })
  })

  describe('showCbgDateTraces', () => {
    const action = actions.showCbgDateTraces(userId)

    it('should be a TSA', () => {
      expect(isTSA(action)).to.be.true
    })

    it('should create an action to toggle cbg traces on for the user', () => {
      expect(action).to.deep.equal({
        type: actionTypes.SHOW_CBG_DATE_TRACES,
        payload: { userId }
      })
    })
  })

  describe('unfocusTrendsCbgSlice', () => {
    const action = actions.unfocusTrendsCbgSlice(userId)

    it('should be a TSA', () => {
      expect(isTSA(action)).to.be.true
    })

    it('should create an action to unfocus (all) trends cbg slices', () => {
      expect(action).to.deep.equal({
        type: actionTypes.UNFOCUS_TRENDS_CBG_SLICE,
        payload: { userId }
      })
    })
  })
})
