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

import _ from "lodash";
import { extent } from "d3-array";
import moment from "moment-timezone";

import { getBasalSequences, getGroupDurations } from "../../utils/basal";
import { getLatestPumpUpload, isAutomatedBasalDevice } from "../../utils/device";
import { commonStats, statFetchMethods, getStatDefinition } from "../../utils/stat";
import { getLocalizedCeiling } from "../../utils/datetime";

/**
 * @typedef { import("tideline").TidelineData } TidelineData
 * @typedef { import("../data").default } DataUtil
 */

/**
 * processBgRange
 * @param {object} dataByDate - Array of Tidepool datums
 * @returns {Array} the extent of bg range values
 */
function processBgRange(dataByDate) {
  const bgs = _.reduce(
    dataByDate,
    (all, date) => (
      all.concat(_.get(date, "data.cbg", [])).concat(_.get(date, "data.smbg", []))
    ),
    []
  );
  return extent(bgs, (d) => (d.value));
}

function processBolusRange(dataByDate) {
  const boluses = _.reduce(
    dataByDate,
    (all, date) => (
      all.concat(_.get(date, "data.bolus", []))
    ),
    []
  );
  return extent(boluses, (d) => {
    const bolus = d.bolus ? d.bolus : d;
    return bolus.normal + (bolus.extended ?? 0);
  });
}

function processBasalRange(dataByDate) {
  const basals = _.reduce(
    dataByDate,
    (all, date) => (
      all.concat(_.get(date, "data.basal", []))
    ),
    []
  );
  const rawBasalRange = extent(
    basals,
    (d) => (_.max([_.get(d, "suppressed.rate", 0), d.rate]))
  );
  // multiply the max rate by 1.1 to add a little buffer so the highest basals
  // don't sit at the very top of the basal rendering area and bump into boluses
  return [0, rawBasalRange[1] * 1.1];
}

/**
 *
 * @param {{duration:number;epoch:number;epochEnd:number;subType:string;discontinuousEnd:boolean;discontinuousStart:boolean;}[]} basals
 * @param {[number,number]} bounds
 */
function updateBasalDiscontinuous(basals, bounds) {
  if (basals.length < 1) {
    return;
  }
  let prevBasal = null;
  for (let i=0; i<basals.length; i++) {
    const basal = basals[i];
    // trim the first and last basals to fit within the date's bounds
    if (basal.epoch < bounds[0]) {
      basal.duration = basal.duration - (bounds[0] - basal.epoch);
      basal.epoch = bounds[0];
      basal.utc = basal.epoch;
      basal.normalTime = new Date(basal.epoch).toISOString();
    }
    if (basal.epochEnd > bounds[1]) {
      basal.duration = basal.duration - (basal.epochEnd - bounds[1]);
      basal.epochEnd = basal.epoch + basal.duration;
      basal.normalEnd = new Date(basal.epochEnd).toISOString();
    }

    basal.discontinuousEnd = false;
    basal.discontinuousStart = false;

    if (prevBasal && (prevBasal.utc + prevBasal.duration) !== basal.utc) {
      prevBasal.discontinuousEnd = true;
      basal.discontinuousStart = true;
    }

    prevBasal = basal;
  }
}

/**
 *
 * @param {import("tideline").TidelineData} tidelineData
 * @param {moment.Moment} startDate
 * @param {moment.Moment} endDate
 */
export function selectDailyViewData(tidelineData, startDate, endDate) {
  const dailyDataTypes = ["basal", "bolus", "cbg", "food", "message", "smbg", "upload", "physicalActivity"];
  const current = startDate.clone();

  // Partially compute in patient-data.js in blip

  const dataByDate = {};
  const lastDayPlusOne = endDate.clone().add(1, "day").format("YYYY-MM-DD");

  let day;
  while ((day = current.format("YYYY-MM-DD")) !== lastDayPlusOne) {
    const mEnd = current.clone().endOf("day");
    const minEpoch = current.valueOf() - 1;
    const maxEpoch = mEnd.valueOf() + 1;
    const bounds = [current.valueOf(), mEnd.valueOf()]; // Is is exclusive ?
    const data = {};
    for (const type of dailyDataTypes) {
      /** @type {{epoch:number}[]} */
      const filteredData = tidelineData.grouped[type].filter((d) => {
        if (d.epochEnd) {
          return minEpoch < d.epochEnd && d.epoch < maxEpoch;
        }
        return minEpoch < d.epoch && d.epoch < maxEpoch;
      });

      data[type] = filteredData.map((v) => {
        const o = { ...v };
        o.utc = o.epoch;
        o.threeHrBin = Math.floor(moment.tz(o.epoch, o.timezone).hours() / 3) * 3;
        if (type === "bolus" && o.wizard) {
          const reversed = { ...o.wizard };
          delete o.wizard;
          reversed.bolus = o;
          reversed.utc = reversed.epoch;
          return reversed;
        }
        return o;
      });

      if (type === "basal") {
        updateBasalDiscontinuous(data.basal, bounds);
        data.basalSequences = getBasalSequences(data.basal);
        data.timeInAutoRatio = getGroupDurations(data.basal, bounds[0], bounds[1]);
      }
    }

    dataByDate[day] = {
      bounds,
      data,
      date: day,
      endpoints: [current.toISOString(), mEnd.toISOString()],
    };

    current.add(1, "day");
  }

  const bgRange = processBgRange(dataByDate);
  const bolusRange = processBolusRange(dataByDate);
  const basalRange = processBasalRange(dataByDate);

  const dailyData = {
    basalRange,
    bgRange,
    bolusRange,
    dataByDate,
    dateRange: [startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD")],
    latestPumpUpload: getLatestPumpUpload(tidelineData.grouped.upload),
    timezone: tidelineData.getLastTimezone(),
  };

  return dailyData;
}

/**
 * @param {object} data
 * @param {TidelineData} tidelineData
 * @param {DataUtil} dataUtil
 * @returns data param
 */
export function generatePDFStats(data, tidelineData, dataUtil) {
  const {
    bgBounds,
    bgUnits,
    latestPump: { manufacturer, deviceModel },
  } = dataUtil;

  const isAutomatedDevice = isAutomatedBasalDevice(manufacturer, deviceModel);

  const getStat = (statType) => {
    const { bgSource, days } = dataUtil;

    return getStatDefinition(dataUtil[statFetchMethods[statType]](), statType, {
      bgSource,
      days,
      bgPrefs: {
        bgBounds,
        bgUnits,
      },
      manufacturer,
    });
  };

  const basicsDateRange = _.get(data, "basics.dateRange");
  if (basicsDateRange) {
    const timePrefs = {
      timezoneName: tidelineData.getTimezoneAt(basicsDateRange[1]),
    };
    data.basics.endpoints = [basicsDateRange[0], getLocalizedCeiling(basicsDateRange[1], timePrefs).toISOString()];

    dataUtil.endpoints = data.basics.endpoints;

    data.basics.stats = {
      [commonStats.timeInRange]: getStat(commonStats.timeInRange),
      [commonStats.readingsInRange]: getStat(commonStats.readingsInRange),
      [commonStats.totalInsulin]: getStat(commonStats.totalInsulin),
      [commonStats.timeInAuto]: isAutomatedDevice ? getStat(commonStats.timeInAuto) : undefined,
      [commonStats.carbs]: getStat(commonStats.carbs),
      [commonStats.averageDailyDose]: getStat(commonStats.averageDailyDose),
      [commonStats.averageGlucose]: getStat(commonStats.averageGlucose),
      [commonStats.glucoseManagementIndicator]: getStat(commonStats.glucoseManagementIndicator)
    };
  }

  const dailyDateRanges = _.get(data, "daily.dataByDate");
  if (dailyDateRanges) {
    _.forOwn(dailyDateRanges, (_value, key) => {
      // data.daily.dataByDate[key].endpoints = [
      //   getLocalizedCeiling(dailyDateRanges[key].bounds[0], timePrefs).toISOString(),
      //   getLocalizedCeiling(dailyDateRanges[key].bounds[1], timePrefs).toISOString(),
      // ];
      dataUtil.endpoints = data.daily.dataByDate[key].endpoints;

      data.daily.dataByDate[key].stats = {
        [commonStats.timeInRange]: getStat(commonStats.timeInRange),
        [commonStats.averageGlucose]: getStat(commonStats.averageGlucose),
        [commonStats.totalInsulin]: getStat(commonStats.totalInsulin),
        [commonStats.timeInAuto]: isAutomatedDevice ? getStat(commonStats.timeInAuto) : undefined,
        [commonStats.carbs]: getStat(commonStats.carbs),
      };
    });
  }

  return data;
}
