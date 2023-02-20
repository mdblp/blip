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
import mutationTracker from 'object-invariant-test-helper'

import * as actionTypes from '../../../src/redux/constants/actionTypes'
import trendsStateByUser from '../../../src/redux/reducers/trendsStateByUser'

describe('trendsStateByUser', () => {
  const USER_1 = 'a1b2c3'
  const USER_2 = 'd4e5f6'

  const datum = { median: 100 }
  const position = { median: 10 }

  it('should return the initial state of {}', () => {
    expect(trendsStateByUser(undefined, {})).to.deep.equal({})
  })

  describe('FETCH_PATIENT_DATA_SUCCESS', () => {
    it('should set up the default trends state for the user if not in tree', () => {
      const initialState = {}
      const tracked = mutationTracker.trackObj(initialState)
      expect(trendsStateByUser(initialState, {
        type: actionTypes.FETCH_PATIENT_DATA_SUCCESS,
        payload: { patientId: USER_1 }
      })).to.deep.equal({
        [USER_1]: {
          focusedCbgSlice: null,
          focusedCbgSliceKeys: null,
          showingCbgDateTraces: false
        }
      })
      expect(mutationTracker.hasMutated(tracked)).to.be.false
    })

    it('should not change anything if the user is in tree already', () => {
      const initialState = {
        [USER_1]: {
          focusedCbgSlice: null,
          focusedCbgSliceKeys: null,
          showingCbgDateTraces: false
        }
      }
      const tracked = mutationTracker.trackObj(initialState)
      expect(trendsStateByUser(initialState, {
        type: actionTypes.FETCH_PATIENT_DATA_SUCCESS,
        payload: { patientId: USER_1 }
      })).to.deep.equal(initialState)
      expect(mutationTracker.hasMutated(tracked)).to.be.false
    })

    it('should set up the default trends state for an additional user w/o wiping first', () => {
      const initialState = {
        [USER_1]: {
          focusedCbgSlice: null,
          focusedCbgSliceKeys: null,
          showingCbgDateTraces: false
        }
      }
      const tracked = mutationTracker.trackObj(initialState)
      expect(trendsStateByUser(initialState, {
        type: actionTypes.FETCH_PATIENT_DATA_SUCCESS,
        payload: { patientId: USER_2 }
      })).to.deep.equal({
        [USER_1]: {
          focusedCbgSlice: null,
          focusedCbgSliceKeys: null,
          showingCbgDateTraces: false
        },
        [USER_2]: {
          focusedCbgSlice: null,
          focusedCbgSliceKeys: null,
          showingCbgDateTraces: false
        }
      })
      expect(mutationTracker.hasMutated(tracked)).to.be.false
    })
  })

  describe('FOCUS_TRENDS_CBG_SLICE', () => {
    const focusedKeys = ['min', 'max']

    it("should store focused slice, slice's position, and the focused slice keys", () => {
      const initialState = {
        [USER_1]: {
          focusedCbgSlice: null,
          focusedCbgSliceKeys: ['median'],
          showingCbgDateTraces: false
        }
      }
      const tracked = mutationTracker.trackObj(initialState)
      expect(trendsStateByUser(initialState, {
        type: actionTypes.FOCUS_TRENDS_CBG_SLICE,
        payload: { focusedKeys, sliceData: datum, slicePosition: position, userId: USER_1 }
      })[USER_1]).to.deep.equal({
        focusedCbgSlice: { data: datum, position },
        focusedCbgSliceKeys: focusedKeys,
        showingCbgDateTraces: false
      })
      expect(mutationTracker.hasMutated(tracked)).to.be.false
    })
  })

  describe('LOGOUT_REQUEST', () => {
    it('should reset to the initial state of {}', () => {
      const initialState = {
        [USER_1]: {
          focusedCbgSlice: { datum, position },
          focusedCbgSliceKeys: ['median'],
          showingCbgDateTraces: false
        }
      }
      const tracked = mutationTracker.trackObj(initialState)
      expect(trendsStateByUser(initialState, {
        type: actionTypes.LOGOUT_REQUEST
      })).to.deep.equal({})
      expect(mutationTracker.hasMutated(tracked)).to.be.false
    })
  })

  describe('SHOW_CBG_DATE_TRACES', () => {
    it('should set showingCbgDateTraces to true', () => {
      const initialState = {
        [USER_1]: {
          focusedCbgSlice: null,
          focusedCbgSliceKeys: null,
          showingCbgDateTraces: false
        }
      }
      const tracked = mutationTracker.trackObj(initialState)
      expect(trendsStateByUser(initialState, {
        type: actionTypes.SHOW_CBG_DATE_TRACES,
        payload: { userId: USER_1 }
      })[USER_1]).to.deep.equal({
        focusedCbgSlice: null,
        focusedCbgSliceKeys: null,
        showingCbgDateTraces: true
      })
      expect(mutationTracker.hasMutated(tracked)).to.be.false
    })
  })

  describe('UNFOCUS_TRENDS_CBG_SLICE', () => {
    it('should reset all focusedCbg* props and showingCbgDateTraces', () => {
      const initialState = {
        [USER_1]: {
          focusedCbgSlice: { datum, position },
          focusedCbgSliceKeys: ['median'],
          showingCbgDateTraces: true
        }
      }
      const tracked = mutationTracker.trackObj(initialState)
      expect(trendsStateByUser(initialState, {
        type: actionTypes.UNFOCUS_TRENDS_CBG_SLICE,
        payload: { userId: USER_1 }
      })[USER_1]).to.deep.equal({
        focusedCbgSlice: null,
        focusedCbgSliceKeys: null,
        showingCbgDateTraces: false
      })
      expect(mutationTracker.hasMutated(tracked)).to.be.false
    })
  })
})
