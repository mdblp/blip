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

import _ from 'lodash';

import { AUTOMATED_BASAL_DEVICE_MODELS } from './constants';

export const getLatestPumpUpload = (uploadData = []) => {
  return _.findLast(uploadData, { deviceTags: ['insulin-pump'] });
};

export const isAutomatedBasalDevice = (pumpUpload = {}) => {
  const models = _.get(AUTOMATED_BASAL_DEVICE_MODELS, pumpUpload.source, false);
  return (_.isBoolean(models) && models) || (_.isArray(models) && _.includes(models, pumpUpload.deviceModel));
};
