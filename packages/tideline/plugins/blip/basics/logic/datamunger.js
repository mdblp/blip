/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2015 Tidepool Project
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
import crossfilter from 'crossfilter2'
import moment from 'moment-timezone'

import * as constants from './constants'
import togglableState from '../TogglableState'
import { applyOffset, MGDL_UNITS } from 'medical-domain'

function dataMunger() {
  return {
    getLatestPumpUploaded: function(patientData) {
      const pumpSettings = patientData.medicalData.pumpSettings[0]
      return _.get(pumpSettings, 'source', null)
    },

    processInfusionSiteHistory: function(basicsData, latestPump, patient) {
      if (!latestPump) {
        basicsData.data.reservoirChange = {
          infusionSiteHistory: {},
          data: []
        }
        return null
      }

      const hasSiteChangeSourceSettings = _.get(patient, 'settings.siteChangeSource', false) !== false
      const fullName = _.get(patient, 'profile.fullName', null)

      basicsData.sections.siteChanges.selectorMetaData = {
        latestPump: latestPump,
        hasSiteChangeSourceSettings,
        patientName: fullName
      }

      if (latestPump === constants.DIABELOOP) {
        if (_.isEmpty(_.get(basicsData, 'data.reservoirChange'))) {
          basicsData.data.reservoirChange = {
            infusionSiteHistory: {},
            data: []
          }
        } else {
          basicsData.data.reservoirChange.infusionSiteHistory = this.infusionSiteHistory(basicsData, constants.SITE_CHANGE_RESERVOIR)
        }

        basicsData.sections.siteChanges.type = constants.SITE_CHANGE_RESERVOIR
        basicsData.sections.siteChanges.selector = null
        basicsData.sections.siteChanges.settingsTogglable = togglableState.off

        // Keep the others below for the tests, takes too much time to update them:
      }
    },

    infusionSiteHistory: function(basicsData, type) {
      var infusionSitesPerDay = basicsData.data[type].dataByDate
      var allDays = basicsData.days
      var infusionSiteHistory = {}
      var hasChangeHistory = false
      // daysSince does *not* start at zero because we have to look back to the
      // most recent infusion site change prior to the basics-restricted time domain
      var priorSiteChange = _.findLast(_.keys(infusionSitesPerDay), function(date) {
        return date < allDays[0].date
      })
      var daysSince = (Date.parse(allDays[0].date) - Date.parse(priorSiteChange))/constants.MS_IN_DAY - 1
      _.forEach(allDays, function(day) {
        if (day.type === 'future') {
          infusionSiteHistory[day.date] = {type: 'future'}
        }
        else {
          daysSince += 1
          if (infusionSitesPerDay[day.date] && infusionSitesPerDay[day.date].count >= 1) {
            infusionSiteHistory[day.date] = {
              type: constants.SITE_CHANGE,
              count: infusionSitesPerDay[day.date].count,
              data: infusionSitesPerDay[day.date].data,
              daysSince: daysSince
            }
            daysSince = 0
            hasChangeHistory = true
          }
          else {
            infusionSiteHistory[day.date] = {type: constants.NO_SITE_CHANGE}
          }
        }
      })
      infusionSiteHistory.hasChangeHistory = hasChangeHistory
      return infusionSiteHistory
    },
    _buildCrossfilterUtils: function(dataObj) {

      function getLocalDate(d) {
        return moment.utc(d.normalTime).add(d.displayOffset, 'minutes').toDate().toISOString().slice(0,10)
      }

      function reduceAddMaker() {
        return function reduceAdd(p, v) {
          ++p.count
          p.data.push(v)
          return p
        }
      }

      function reduceRemoveMaker() {
        return function reduceRemove(p, v) {
          --p.count
          _.remove(p.data, function(d) {
            return d.id === v.id
          })
          return p
        }
      }

      function reduceInitialMaker() {
        return function reduceInitial() {
          return {
            count: 0,
            data: []
          }
        }
      }

      dataObj.byLocalDate = dataObj.cf.dimension(getLocalDate)
      var dataByLocalDate = dataObj.byLocalDate.group().reduce(
        reduceAddMaker(),
        reduceRemoveMaker(),
        reduceInitialMaker()
      ).all()
      var dataByDateHash = {}
      for (var j = 0; j < dataByLocalDate.length; ++j) {
        var day = dataByLocalDate[j]
        dataByDateHash[day.key] = day.value
      }
      dataObj.dataByDate = dataByDateHash
    },
    reduceByDay: function(basicsData) {
      for (const type in basicsData.data) {
        let typeObj = basicsData.data[type]
        if (_.isEmpty(typeObj)) {
          continue
        }
        if (_.includes([constants.SITE_CHANGE_RESERVOIR, constants.SITE_CHANGE_CANNULA, constants.SITE_CHANGE_TUBING], type)) {
          typeObj.cf = crossfilter(typeObj.data)
          this._buildCrossfilterUtils(typeObj)
        }
      }
    }
  }
}

export default dataMunger
