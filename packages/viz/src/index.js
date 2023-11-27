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

import './styles/colors.css'

import WarmUpTooltip from './components/daily/warmuptooltip/WarmUpTooltip'

import { reshapeBgClassesToBgBounds } from './utils/bloodglucose'
import DataUtil from './utils/data'
import createPrintPDFPackage from './modules/print'
import { generatePDFStats, generatePumpSettings, selectDailyViewData } from './utils/print/data'

const components = {
  WarmUpTooltip
}

const utils = {
  bg: {
    reshapeBgClassesToBgBounds
  },
  data: {
    selectDailyViewData,
    generatePumpSettings,
    generatePDFStats,
    DataUtil
  }
}

export {
  components,
  utils,
  createPrintPDFPackage,
}
