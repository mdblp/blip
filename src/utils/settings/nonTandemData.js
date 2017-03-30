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
import _ from 'lodash';

import * as data from './data';

export function basalSchedules(settings) {
  return data.getScheduleNames(settings.basalSchedules);
}

export function deviceMeta(settings, timePrefs) {
  return data.getDeviceMeta(settings, timePrefs);
}

export function bolusTitle(manufacturer) {
  const BOLUS_SETTINGS_LABEL_BY_MANUFACTURER = {
    animas: 'ezCarb ezBG',
    insulet: 'Bolus Calculator',
    medtronic: 'Bolus Wizard',
  };
  return BOLUS_SETTINGS_LABEL_BY_MANUFACTURER[manufacturer];
}

export function deviceName(manufacturer) {
  const DEVICE_DISPLAY_NAME_BY_MANUFACTURER = {
    animas: 'Animas',
    insulet: 'OmniPod',
    medtronic: 'Medtronic',
  };
  return DEVICE_DISPLAY_NAME_BY_MANUFACTURER[manufacturer];
}

/**
 * basal
 *
 * @param  {Object} settings       object with pump settings data
 * @param  {String} manufacturer   one of: animas, carelink, insulet, medtronic
 * @return {Object}                object with basal title, columns and rows
 */
export function basal(schedule, settings, manufacturer) {
  const scheduleName = settings.basalSchedules[schedule].name;
  return {
    scheduleName: scheduleName,
    activeAtUpload: (scheduleName === settings.activeSchedule),
    title: scheduleLabel(scheduleName, settings.activeSchedule, manufacturer),
    columns: basalColumns(),
    rows: basalRows(schedule, settings),
  };
}

function scheduleLabel(scheduleName, activeScheduleName, manufacturer) {
  return data.getScheduleLabel(scheduleName, activeScheduleName, manufacturer, false);
}

function basalRows(schedule, settings) {
  return data.processBasalRateData(settings.basalSchedules[schedule]);
}

function basalColumns() {
  return data.startTimeAndValue('rate');
}

/**
 * sensitivity
 *
 * @param  {Object} settings       object with pump settings data
 * @param  {String} manufacturer   one of: animas, carelink, insulet, medtronic
 * @param  {String} units          MGDL_UNITS or MMOLL_UNITS
 * @return {Object}                object with sensitivity title, columns and rows
 */
export function sensitivity(settings, manufacturer, units) {
  return {
    title: sensitivityTitle(manufacturer),
    columns: sensitivityColumns(),
    rows: sensitivityRows(settings, units),
  };
}

function sensitivityTitle(manufacturer) {
  const ISF_BY_MANUFACTURER = {
    animas: 'ISF',
    insulet: 'Correction factor',
    medtronic: 'Sensitivity',
  };
  return ISF_BY_MANUFACTURER[manufacturer];
}

function sensitivityColumns() {
  return data.startTimeAndValue('amount');
}

function sensitivityRows(settings, units) {
  return data.processSensitivityData(
    settings.insulinSensitivity,
    units,
  );
}

/**
 * ratio
 *
 * @param  {Object} settings       object with pump settings data
 * @param  {String} manufacturer   one of: animas, carelink, insulet, medtronic
 * @return {Object}                object with ratio title, columns and rows
 */
export function ratio(settings, manufacturer) {
  return {
    title: ratioTitle(manufacturer),
    columns: ratioColumns(),
    rows: ratioRows(settings),
  };
}

function ratioTitle(manufacturer) {
  const CARB_RATIO_BY_MANUFACTURER = {
    animas: 'I:C Ratio',
    insulet: 'IC ratio',
    medtronic: 'Carb Ratios',
  };
  return CARB_RATIO_BY_MANUFACTURER[manufacturer];
}

function ratioColumns() {
  return data.startTimeAndValue('amount');
}

function ratioRows(settings) {
  return data.processCarbRatioData(settings.carbRatio);
}

/**
 * target
 *
 * @param  {Object} settings       object with pump settings data
 * @param  {String} manufacturer   one of: animas, carelink, insulet, medtronic
 * @param  {String} units          MGDL_UNITS or MMOLL_UNITS
 * @return {Object}                object with target title, columns and rows
 */
export function target(settings, manufacturer, units) {
  return {
    title: targetTitle(manufacturer),
    columns: targetColumns(manufacturer),
    rows: targetRows(settings, units, manufacturer),
  };
}

function targetTitle(manufacturer) {
  const BG_TARGET_BY_MANUFACTURER = {
    animas: 'BG Target',
    insulet: 'Target BG',
    medtronic: 'BG Target',
  };
  return BG_TARGET_BY_MANUFACTURER[manufacturer];
}

function targetColumns(manufacturer) {
  const BG_TARGET_COLS_BY_MANUFACTURER = {
    animas: [
      { key: 'start', label: 'Start time' },
      { key: 'columnTwo', label: 'Target' },
      { key: 'columnThree', label: 'Range' },
    ],
    insulet: [
      { key: 'start', label: 'Start time' },
      { key: 'columnTwo', label: 'Target' },
      { key: 'columnThree', label: 'Correct Above' },
    ],
    medtronic: [
      { key: 'start', label: 'Start time' },
      { key: 'columnTwo', label: 'Low' },
      { key: 'columnThree', label: 'High' },
    ],
  };
  return BG_TARGET_COLS_BY_MANUFACTURER[manufacturer];
}

function targetRows(settings, units, manufacturer) {
  const BG_TARGET_ACCESSORS_BY_MANUFACTURER = {
    animas: { columnTwo: 'target', columnThree: 'range' },
    insulet: { columnTwo: 'target', columnThree: 'high' },
    medtronic: { columnTwo: 'low', columnThree: 'high' },
  };
  return data.processBgTargetData(
    settings.bgTarget,
    units,
    BG_TARGET_ACCESSORS_BY_MANUFACTURER[manufacturer],
  );
}
