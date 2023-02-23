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

import update from 'immutability-helper'
import bows from 'bows'

import * as actionTypes from '../constants/actionTypes'

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
        { [userId]: { $set: {} } }
      )
    }
    case actionTypes.LOGOUT_REQUEST:
      return {}
    default:
      log.warn('Unknown action', action.type)
      return state
  }
}

export default trendsStateByUser
