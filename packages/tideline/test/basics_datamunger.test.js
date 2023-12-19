/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2015, Tidepool Project
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

import * as constants from '../plugins/blip/basics/logic/constants'
import datamunger from '../plugins/blip/basics/logic/datamunger'

describe('basics datamunger', function() {
  const oneWeekDates = [{
    date: '2015-09-07',
    type: 'past'
  }, {
    date: '2015-09-08',
    type: 'past'
  }, {
    date: '2015-09-09',
    type: 'past'
  }, {
    date: '2015-09-10',
    type: 'past'
  }, {
    date: '2015-09-11',
    type: 'past'
  }, {
    date: '2015-09-12',
    type: 'dayOfUpload'
  }, {
    date: '2015-09-13',
    type: 'future'
  }]
  const countSiteChangesByDay = {
    '2015-09-05': {count: 1},
    '2015-09-08': {count: 1, data: 'a'},
    '2015-09-12': {count: 2, data: 'b'}
  }
  const siteChanges = {
    id: 'siteChanges',
    selectorOptions: {
      primary: { key: constants.SITE_CHANGE_RESERVOIR, label: 'Reservoir Change' },
      rows: []
    },
    type: constants.SITE_CHANGE_RESERVOIR
  }

  const dm = datamunger()
  it('should return an object', function() {
    assert.isObject(dm)
  })

  describe('processInfusionSiteHistory', function() {
    it('should be a function', function() {
      assert.isFunction(dm.processInfusionSiteHistory)
    })

    it('should return null without latest pump', function() {
      const basicsData = {
        data: {},
        siteChanges
      }

      const patient = {
        profile: {
          fullName: 'Jill Jellyfish'
        },
        settings: {
          siteChangeSource: constants.SITE_CHANGE_CANNULA
        }
      }

      expect(dm.processInfusionSiteHistory(basicsData, null, patient)).to.equal(null)
    })

    it('should return that a user has set their site change source settings', function() {
      const basicsData = {
        data: {
          [constants.SITE_CHANGE_RESERVOIR]: {dataByDate: countSiteChangesByDay}
        },
        days: oneWeekDates,
        siteChanges
      }
      const patient = {
        profile: {
          fullName: 'Jill Jellyfish'
        },
        settings: {
          siteChangeSource: constants.SITE_CHANGE_CANNULA
        }
      }

      dm.processInfusionSiteHistory(basicsData, constants.DIABELOOP, patient)
      expect(basicsData.siteChanges.selectorMetaData.hasSiteChangeSourceSettings).to.equal(true)
    })

    it('should return that a user has not set their site change source settings', function() {
      const basicsData = {
        data: {
          [constants.SITE_CHANGE_RESERVOIR]: {dataByDate: countSiteChangesByDay}
        },
        days: oneWeekDates,
        siteChanges
      }

      const patient = {
        profile: {
          fullName: 'Jill Jellyfish'
        },
        settings: {}
      }

      dm.processInfusionSiteHistory(basicsData, constants.DIABELOOP, patient)
      expect(basicsData.siteChanges.selectorMetaData.hasSiteChangeSourceSettings).to.equal(false)
    })

    it('should set siteChanges type to reservoirChange', function() {
      const basicsData = {
        data: {
          [constants.SITE_CHANGE_RESERVOIR]: {dataByDate: countSiteChangesByDay}
        },
        days: oneWeekDates,
        siteChanges
      }

      const patient = {
        profile: {
          fullName: 'Jill Jellyfish'
        },
        settings: {
          siteChangeSource: constants.SITE_CHANGE_TUBING
        }
      }

      dm.processInfusionSiteHistory(basicsData, constants.DIABELOOP, patient)
      expect(basicsData.siteChanges.type).to.equal(constants.SITE_CHANGE_RESERVOIR)
    })
  })

  describe('infusionSiteHistory', function() {
    const bd = {
      data: {reservoirChange: {dataByDate: countSiteChangesByDay}},
      days: oneWeekDates
    }
    it('should be a function', function() {
      assert.isFunction(dm.infusionSiteHistory)
    })

    it('should return an object keyed by date; value is object with attrs type, count, daysSince', function() {
      const res = {}
      oneWeekDates.forEach(function(d) {
        res[d.date] = {type: d.type === 'future' ? d.type : 'noSiteChange'}
      })
      res['2015-09-08'] = {type: 'siteChange', count: 1, daysSince: 3, data: 'a'}
      res['2015-09-12'] = {type: 'siteChange', count: 2, daysSince: 4, data: 'b'}
      res.hasChangeHistory = true
      expect(dm.infusionSiteHistory(bd, 'reservoirChange')).to.deep.equal(res)
    })

    it('should properly calculate the daysSince for the first infusion site change', function() {
      const res2 = {}
      oneWeekDates.forEach(function(d) {
        res2[d.date] = {type: d.type === 'future' ? d.type : 'noSiteChange'}
      })
      res2['2015-09-08'] = {type: 'siteChange', count: 1, daysSince: 7, data: 'a'}
      res2['2015-09-12'] = {type: 'siteChange', count: 1, daysSince: 4, data: 'b'}
      res2.hasChangeHistory = true
      const countSiteChangesByDay2 = {
        '2015-09-01': {count: 1},
        '2015-09-08': {count: 1, data: 'a'},
        '2015-09-12': {count: 1, data: 'b'}
      }
      const bd2 = {
        data: {reservoirChange: {dataByDate: countSiteChangesByDay2}},
        days: oneWeekDates
      }
      expect(dm.infusionSiteHistory(bd2, 'reservoirChange')).to.deep.equal(res2)
    })
  })

  describe('reduceByDay', function() {
    it('should be a function', function() {
      assert.isFunction(dm.reduceByDay)
    })

    describe('crossfilter utils per datatype', function() {
      const then = '2015-01-01T00:00:00.000Z'
      const bd = {
        data: {
          basal: {data: [{type: 'basal', deliveryType: 'temp', normalTime: then, displayOffset: 0}]},
          bolus: {data: [{type: 'bolus', normalTime: then, displayOffset: 0}]},
          reservoirChange: {data: [{type: 'deviceEvent', subType: 'reservoirChange', normalTime: then, displayOffset: 0}]}
        },
        days: [{date: '2015-01-01', type: 'past'}, {date: '2015-01-02', type: 'mostRecent'}]
      }
      dm.reduceByDay(bd)
      const types = ['reservoirChange']
      types.forEach((type) => {
        it('should build crossfilter utils for ' + type, () => {
          expect(Object.keys(bd.data[type])).to.deep.equal(['data', 'cf', 'byLocalDate', 'dataByDate'])
        })

        it('should build a `dataByDate` object for ' + type + ' with *only* localDates with data as keys', () => {
          expect(Object.keys(bd.data[type].dataByDate)).to.deep.equal(['2015-01-01'])
        })
      })
    })
  })
})
