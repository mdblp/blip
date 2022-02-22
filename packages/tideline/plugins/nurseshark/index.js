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

import _ from "lodash";
import crossfilter from "crossfilter2";
import bows from "bows";

import { MGDL_UNITS, MMOLL_UNITS } from "../../js/data/util/constants";
import dt from "../../js/data/util/datetime";
import format from "../../js/data/util/format";

const log = bows("Nurseshark");
const defaultSource = "Diabeloop";

function isBadStatus(d) {
  if (_.isNil(d.annotations)) {
    return false;
  }
  const numAnnotations = d.annotations.length;
  for (let i = 0; i < numAnnotations; ++i) {
    let code = d.annotations[i].code;
    if (code === "status/unknown-previous") {
      return true;
    }
  }
}

function basalSchedulesToArray(basalSchedules) {
  var standard = [], schedules = [];
  for (var key in basalSchedules) {
    if (key === "standard") {
      standard.push({
        name: key,
        value: basalSchedules[key]
      });
    }
    else {
      schedules.push({
        name: key,
        value: basalSchedules[key]
      });
    }
  }
  return standard.concat(schedules);
}

function cloneDeep(d) {
  var newObj = {}, keys = Object.keys(d);
  var numKeys = keys.length;
  for (var i = 0; i < numKeys; ++i) {
    var key = keys[i];
    if (typeof d[key] === "object") {
      newObj[key] = _.cloneDeep(d[key]);
    }
    else {
      newObj[key] = d[key];
    }
  }
  return newObj;
}

const timeIt = _.get(window, "config.DEV", false) ? (fn, name) => {
  console.time(name);
  fn();
  console.timeEnd(name);
} : (fn) => fn();

var nurseshark = {
  annotateBasals: function(basals, incompleteSuspends) {
    var crossBasals = crossfilter(basals);
    var basalsByTime = crossBasals.dimension(function(d) {
      return d.time + "/" + dt.addDuration(d.time, d.duration);
    });
    var numSuspends = incompleteSuspends.length;
    function findIntersecting(suspendStart) {
      return function(d) {
        var interval = d.split("/");
        var basalStart = interval[0], basalEnd = interval[1];
        if (basalStart <= suspendStart && suspendStart <= basalEnd) {
          return true;
        }
        return false;
      };
    }
    function handleIntersection(match) {
      if (!match.annotations) {
        match.annotations = [];
      }
      match.annotations.push({
        code: "basal/intersects-incomplete-suspend"
      });
    }

    for (var i = 0; i < numSuspends; ++i) {
      var suspend = incompleteSuspends[i];
      var matches = basalsByTime.filterFunction(
        findIntersecting(suspend.time)
      ).top(Infinity);
      if (matches.length > 0) {
        for (var j = 0; j < matches.length; ++j) {
          handleIntersection(matches[j]);
        }
      }
    }
  },
  joinWizardsAndBoluses: function(wizards, _boluses, collections) {
    var allBoluses = collections.allBoluses;
    var numWizards = wizards.length;
    var joinedWizards = {};
    for (var i = 0; i < numWizards; ++i) {
      var wizard = wizards[i];
      var bolusId = wizard.bolus;
      if (!_.isNil(bolusId) && allBoluses[bolusId]) {
        wizard.bolus = allBoluses[bolusId];
        allBoluses[bolusId].wizard = _.omit(wizard, "bolus");
        joinedWizards[bolusId] = wizard;
      }
    }
  },
  reshapeMessage: function(d) {
    const msg = {
      time: d.timestamp,
      messageText: d.messagetext,
      parentMessage: d.parentmessage || null,
      type: "message",
      user: d.user,
      id: d.id
    };
    if (typeof d.timezone === "string") {
      msg.timezone = d.timezone;
    }
    return msg;
  },
  processData: function(data, bgUnits) {
    if (!Array.isArray(data)) {
      throw new Error("An array is required.");
    }
    // data from the old-old data model (pre-v1 docs) doesn't have a `time` field
    function removeNoTime() {
      const noTimeData = [];
      data = _.filter(data, (d) => {
        if (_.isString(d.timestamp) || _.isString(d.time)) {
          return true;
        }
        noTimeData.push(d);
        return false;
      });
      if (noTimeData.length > 0) {
        log.warn(`${noTimeData.length} records removed due to not having a 'time or 'timestamp field.`, noTimeData);
      }
    }
    timeIt(removeNoTime, "Remove No Time");

    function sortByTime() {
      data = _.sortBy(data, function(d) {
        return Date.parse(d.time);
      });
    }

    timeIt(sortByTime, "Sort");

    var uploadIDSources = {};
    var uploadIDSerials = {};
    var processedData = [], erroredData = [];
    var collections = {
      allBoluses: {},
      allWizards: {}
    };
    var typeGroups = {}, overlappingUploads = {}, mostRecentFromOverlapping = null;

    function createUploadIDsMap() {
      var uploads = _.filter(data, {type: "upload"});
      _.forEach(uploads, function(upload) {
        let source = defaultSource;
        if ("source" in upload && _.isString(upload.source)) {
          source = upload.source;
        } else if (Array.isArray(upload.deviceManufacturers) && upload.deviceManufacturers.length > 0) {
          source = upload.deviceManufacturers[0];
        }

        uploadIDSources[upload.uploadId] = source;
        uploadIDSerials[upload.uploadId] = _.isString(upload.deviceSerialNumber) ? upload.deviceSerialNumber : "Unknown";
      });
    }

    // create a hash of uploadId: source
    createUploadIDsMap();

    var handlers = getHandlers(bgUnits);

    function addNoHandlerMessage(d) {
      d = cloneDeep(d);
      var err = new Error(`No nurseshark handler defined for type ${d.type}`);
      d.errorMessage = err.message;
      return d;
    }

    function process(d) {
      if (overlappingUploads[d.deviceId] && d.deviceId !== mostRecentFromOverlapping) {
        d = cloneDeep(d);
        d.errorMessage = "Overlapping CareLink upload.";
      }
      else {
        d = handlers[d.type] ? handlers[d.type](d, collections) : d.messagetext ? handlers.message(d, collections) : addNoHandlerMessage(d);
        if (d.uploadId) {
          d.deviceSerialNumber = uploadIDSerials[d.uploadId];
        }
        if (!d.source) {
          d.source = defaultSource;
        }
      }

      // because we don't yet have validation on editing timestamps in clamshell and blip notes
      // and someone had made a note with year 2 that caused problems for tideline
      // chose year 2008 because tidline's datetime has a validation step that rejects POSIX timestamps
      // that evaluate to year < 2008
      if (new Date(d.time).getUTCFullYear() < 2008) {
        d.errorMessage = "Invalid datetime (before 2008).";
      }
      if (!_.isNil(d.errorMessage)) {
        erroredData.push(d);
      }
      else {
        processedData.push(d);
        // group data
        if (_.isNil(typeGroups[d.type])) {
          typeGroups[d.type] = [d];
        }
        else {
          typeGroups[d.type].push(d);
        }
      }
    }

    timeIt(function() {
      for (var i = 0; i < data.length; ++i) {
        process(data[i]);
      }
    }, "Process");

    timeIt(function() {
      nurseshark.joinWizardsAndBoluses(typeGroups.wizard || [], typeGroups.bolus || [], collections);
    }, "Join Wizards and Boluses");

    if (typeGroups.deviceEvent && typeGroups.deviceEvent.length > 0) {
      timeIt(function() {
        nurseshark.annotateBasals(typeGroups.basal || [], _.filter(typeGroups.deviceEvent, function(d) {
          if (d.annotations && d.annotations.length > 0) {
            for (var i = 0; i < d.annotations.length; ++i) {
              var annotation = d.annotations[i];
              if (annotation.code === "status/incomplete-tuple") {
                return true;
              }
            }
          }
          return false;
        }));
      }, "Annotate Basals");
    }

    var emoticon = erroredData.length ? ":(" : ":)";
    log(erroredData.length, "items in the erroredData.", emoticon, _.countBy(erroredData, "type"));
    log("Unique error messages:", _.uniq(_.map(erroredData, "errorMessage")));
    return {erroredData: erroredData, processedData: processedData};
  }
};

function getHandlers(bgUnits) {
  var lastEnd, lastBasal;

  return {
    basal: function(d) {
      d = cloneDeep(d);
      lastEnd = lastEnd || null;
      lastBasal = lastBasal || {};
      // NB: truthiness warranted here
      // basals with duration of 0 are *not* legitimate targets for visualization
      if (!d.duration) {
        var err2 = new Error("Basal with null/zero duration.");
        d.errorMessage = err2.message;
        return d;
      }
      lastEnd = dt.addDuration(d.time, d.duration);
      if (!d.rate && d.deliveryType === "suspend") {
        d.rate = 0.0;
      }
      if (d.suppressed) {
        this.suppressed(d);
      }
      lastBasal = d;
      return d;
    },
    bolus: function(d, collections) {
      d = cloneDeep(d);
      collections.allBoluses[d.id] = d;
      return d;
    },
    cbg: function(d) {
      d = cloneDeep(d);
      if (bgUnits === MGDL_UNITS) {
        d.value = format.convertBG(d.value, MMOLL_UNITS);
      }
      return d;
    },
    deviceEvent: function(d) {
      d = cloneDeep(d);
      if (isBadStatus(d)) {
        var err = new Error("Bad pump status deviceEvent.");
        d.errorMessage = err.message;
      }
      return d;
    },
    food: function(d) {
      d = cloneDeep(d);
      return d;
    },
    message: function(d) {
      return nurseshark.reshapeMessage(d);
    },
    smbg: function(d) {
      d = cloneDeep(d);
      if (bgUnits === MGDL_UNITS) {
        d.value = format.convertBG(d.value, MMOLL_UNITS);
      }
      return d;
    },
    physicalActivity: function(d) {
      d = cloneDeep(d);
      return d;
    },
    pumpSettings: function(d) {
      d = cloneDeep(d);
      if (bgUnits === MGDL_UNITS) {
        if (d.bgTarget) {
          for (var j = 0; j < d.bgTarget.length; ++j) {
            var current = d.bgTarget[j];
            for (var key in current) {
              if (key !== "start") {
                current[key] = format.convertBG(current[key], MMOLL_UNITS);
              }
            }
          }
        }
        if (d.bgTargets) {
          _.forEach(d.bgTargets, function(bgTarget, bgTargetName){
            for (var j = 0; j < d.bgTargets[bgTargetName].length; ++j) {
              var current = d.bgTargets[bgTargetName][j];
              for (var key in current) {
                if (key !== "range" && key !== "start") {
                  current[key] = format.convertBG(current[key], MMOLL_UNITS);
                }
              }
            }
          });
        }
        if (d.insulinSensitivity) {
          var isfLen = d.insulinSensitivity.length;
          for (var i = 0; i < isfLen; ++i) {
            var item = d.insulinSensitivity[i];
            item.amount = format.convertBG(item.amount, MMOLL_UNITS);
          }
        }
        if (d.insulinSensitivities) {
          _.forEach(d.insulinSensitivities, function(sensitivity, sensitivityName) {
            var isfLen = d.insulinSensitivities[sensitivityName].length;
            for (var i = 0; i < isfLen; ++i) {
              var item = d.insulinSensitivities[sensitivityName][i];
              item.amount = format.convertBG(item.amount, MMOLL_UNITS);
            }
          });
        }
      }
      d.basalSchedules = basalSchedulesToArray(d.basalSchedules);
      return d;
    },
    suppressed: function(d) {
      if (d.suppressed.deliveryType === "temp" && !d.suppressed.rate) {
        if (d.suppressed.percent && d.suppressed.suppressed &&
          d.suppressed.suppressed.deliveryType === "scheduled" && d.suppressed.suppressed.rate >= 0) {
          d.suppressed.rate = d.suppressed.percent * d.suppressed.suppressed.rate;
        }
      }
      // a suppressed should share these attributes with its parent
      d.suppressed.duration = d.duration;
      d.suppressed.time = d.time;
      d.suppressed.deviceTime = d.deviceTime;
      if (d.suppressed.suppressed) {
        this.suppressed(d.suppressed);
      }
    },
    upload: function(d) {
      d = cloneDeep(d);
      return d;
    },
    wizard: function(d) {
      d = cloneDeep(d);
      if (bgUnits === MGDL_UNITS) {
        if (d.bgInput) {
          d.bgInput = format.convertBG(d.bgInput, MMOLL_UNITS);
        }
        if (d.bgTarget) {
          for (var key in d.bgTarget) {
            d.bgTarget[key] = format.convertBG(d.bgTarget[key], MMOLL_UNITS);
          }
        }
        if (d.insulinSensitivity) {
          d.insulinSensitivity = format.convertBG(d.insulinSensitivity, MMOLL_UNITS);
        }
      }
      return d;
    }
  };
}

export default nurseshark;
