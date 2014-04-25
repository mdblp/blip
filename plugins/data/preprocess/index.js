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

var tideline = window.tideline;
var watson = tideline.watson;
var _ = tideline.lib._;
var TidelineData = tideline.TidelineData;
var SegmentUtil = tideline.data.SegmentUtil;

var log = tideline.lib.bows('Preprocess');

function alwaysTrue() {
  return true;
}

function notZero(e) {
  return e.value !== 0;
}

var TYPES_TO_INCLUDE = {
  // basals with value 0 don't get excluded because they are legitimate targets for visualization
  'basal-rate-segment': alwaysTrue,
  bolus: notZero,
  carbs: notZero,
  cbg: notZero,
  message: notZero,
  smbg: notZero,
  settings: notZero
};

var Preprocess = {

  REQUIRED_TYPES: ['basal-rate-segment', 'bolus', 'carbs', 'cbg', 'message', 'smbg', 'settings'],

  OPTIONAL_TYPES: [],

  MMOL_STRING: 'mmol/L',

  MGDL_STRING: 'mg/dL',

  MMOL_TO_MGDL: 18,

  mungeBasals: function(data) {
    var segments = new SegmentUtil(_.where(data, {'type': 'basal-rate-segment'}));
    data = _.reject(data, function(d) {
      return d.type === 'basal-rate-segment';
    });
    data = data.concat(segments.actual.concat(segments.getUndelivered('scheduled')));
    return data;
  },

  editBoluses: function(data) {
    // two adjustments to boluses here:
    // changed `extended` to false when extendedDelivery = 0
    // (these are instances where someone changed their mind about a combo bolus, basically)
    // ~and~
    // when there is a joinKey to a wizard event from which we can obtain
    // the recommendation for a bolus, extract it to populate the `recommended` field
    var wizards = _.where(data, {'type': 'wizard'});
    return _.map(data, function(d) {
      if (d.type === 'bolus' && d.joinKey != null) {
        var joined = _.findWhere(wizards, {'joinKey': d.joinKey});
        if (joined) {
          d.recommended = joined.payload.estimate;
        }
        return d;
      }
      if (d.extended && d.extendedDelivery === 0) {
        d.extended = false;
        return d;
      }
      else {
        return d;
      }
    });
  },

  filterData: function(data) {
    // filter out types we aren't using for visualization
    //  ~and~
    // because of how the Tidepool back end parses some data sources
    // we're creating things like carb events with values of 0, which
    // we don't want to visualize, so...
    // this function also removes all data with value 0 except for basals, since
    // we do want to visualize basals (e.g., temps) with value 0.0

    var counts = {};

    function incrementCount(count, type) {
      if (counts[count] == null) {
        counts[count] = {};
      }

      if (counts[count][type] == null) {
        counts[count][type] = 0;
      }

      ++counts[count][type];
    }

    var nonZeroData = _.filter(data, function(d) {
      var includeFn = TYPES_TO_INCLUDE[d.type];
      if (includeFn == null) {
        incrementCount('excluded', d.type);
        return false;
      }

      var retVal = includeFn(d);
      incrementCount(retVal ? 'included' : 'excluded', d.type);
      return retVal;
    });

    log('Excluded:', counts.excluded || 0);
    log('# of data points', nonZeroData.length);
    log('Data types:', counts.included);

    return nonZeroData;
  },

  runWatson: function(data) {
    data = watson.normalizeAll(data);
    // Ensure the data is properly sorted
    data = _.sortBy(data, function(d) {
      // ISO8601 format lexicographically sorts according to timestamp
      return d.normalTime;
    });
    return data;
  },

  checkRequired: function(tidelineData) {
    _.forEach(this.REQUIRED_TYPES, function(type) {
      if (!tidelineData.grouped[type]) {
        log('No', type, 'data! Replaced with empty array.');
        tidelineData.grouped[type] = [];
      }
    });

    return tidelineData;
  },

  translateMmol: function(data) {
    return _.map(data, function(d) {
      if (d.units === this.MMOL_STRING) {
        d.units = this.MGDL_STRING;
        d.value = parseInt(Math.round(d.value * this.MMOL_TO_MGDL, 10));
      }
      return d;
    }, this);
  },

  basalSchedulesToArray: function(basalSchedules) {
    var schedules = [];
    for(var key in basalSchedules) {
      schedules.push({
        'name': key,
        'value': basalSchedules[key]
      });
    }
    return schedules;
  },

  sortBasalSchedules: function(data) {
    return _.map(data, function(d) {
      var schedules;
      if (d.type === 'settings') {
        schedules = this.basalSchedulesToArray(d.basalSchedules);
        if (d.source === 'carelink') {
          for (var i = 0; i < schedules.length; i++) {
            if (schedules[i].name === 'standard') {
              var standard = schedules[i];
              var index = schedules.indexOf(standard);
              schedules.splice(index, 1);
              schedules.unshift(standard);
              break;
            }
          }
        }
        d.basalSchedules = schedules;
        return d;
      }
      else {
        return d;
      }
    }, this);
  },

  processData: function(data) {
    if (!(data && data.length)) {
      log('Unexpected data input, defaulting to empty array.');
      data = [];
    }

    data = this.editBoluses(data);
    data = this.filterData(data);
    data = this.mungeBasals(data);
    data = this.runWatson(data);
    data = this.translateMmol(data);
    data = this.sortBasalSchedules(data);

    var tidelineData = this.checkRequired(new TidelineData(data));

    return tidelineData;
  }
};

module.exports = Preprocess;
