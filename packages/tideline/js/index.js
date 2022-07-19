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

import { MS_IN_DAY, MS_IN_HOUR, MGDL_UNITS, MMOLL_UNITS } from './data/util/constants'
import format from './data/util/format'
import datetime from './data/util/datetime'
import TidelineData, { DAILY_TYPES, genRandomId } from './tidelinedata'
import BasicsChart from '../plugins/blip/basics/chartbasicsfactory'
import chartDailyFactory from '../plugins/blip/chartdailyfactory'
import nurseShark from '../plugins/nurseshark'

const { convertBG } = format

window.d3 = require('d3')
window.d3.chart = require('d3.chart')

export {
  MS_IN_DAY,
  MS_IN_HOUR,
  MGDL_UNITS,
  MMOLL_UNITS,
  DAILY_TYPES,
  TidelineData,
  BasicsChart,
  chartDailyFactory,
  nurseShark,
  convertBG,
  genRandomId,
  datetime
}
