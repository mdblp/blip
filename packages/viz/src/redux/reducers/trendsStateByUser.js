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
import update from 'immutability-helper'
import bows from 'bows'

import * as actionTypes from '../constants/actionTypes'

const CBG_FLAGS = 'cbgFlags'
const CBG_100_ENABLED = 'cbg100Enabled'
const CBG_80_ENABLED = 'cbg80Enabled'
const CBG_50_ENABLED = 'cbg50Enabled'
const CBG_MEDIAN_ENABLED = 'cbgMedianEnabled'
const FOCUSED_CBG_DATE_TRACE = 'focusedCbgDateTrace'
const FOCUSED_CBG_SLICE = 'focusedCbgSlice'
const FOCUSED_CBG_KEYS = 'focusedCbgSliceKeys'
const SHOW_CBG_DATE_TRACES = 'showingCbgDateTraces'

const initialState = {
  [CBG_FLAGS]: {
    [CBG_100_ENABLED]: true,
    [CBG_80_ENABLED]: true,
    [CBG_50_ENABLED]: true,
    [CBG_MEDIAN_ENABLED]: true
  },
  [FOCUSED_CBG_DATE_TRACE]: null,
  [FOCUSED_CBG_SLICE]: null,
  [FOCUSED_CBG_KEYS]: null,
  [SHOW_CBG_DATE_TRACES]: false
}

const log = bows('Viz')

const trendsStateByUser = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PATIENT_DATA_SUCCESS: {
      const { patientId: userId } = action.payload
      if (state[userId]) {
        return state
      }
      return update(
        state,
        { [userId]: { $set: _.assign({}, initialState) } }
      )
    }
    case actionTypes.FOCUS_TRENDS_CBG_SLICE: {
      const { focusedKeys, sliceData: data, slicePosition: position, userId } = action.payload
      return update(
        state,
        { [userId]: {
          [FOCUSED_CBG_SLICE]: { $set: { data, position } },
          [FOCUSED_CBG_KEYS]: { $set: focusedKeys }
        } }
      )
    }
    case actionTypes.LOGOUT_REQUEST:
      return {}
    case actionTypes.SHOW_CBG_DATE_TRACES: {
      const { userId } = action.payload
      return update(
        state,
        { [userId]: { [SHOW_CBG_DATE_TRACES]: { $set: true } } }
      )
    }
    case actionTypes.UNFOCUS_TRENDS_CBG_SLICE: {
      const { userId } = action.payload
      return update(
        state,
        { [userId]: {
          [FOCUSED_CBG_DATE_TRACE]: { $set: null },
          [FOCUSED_CBG_SLICE]: { $set: null },
          [FOCUSED_CBG_KEYS]: { $set: null },
          [SHOW_CBG_DATE_TRACES]: { $set: false }
        } }
      )
    }
    default:
      log.warn('Unknown action', action.type)
      return state
  }
}

export default trendsStateByUser
