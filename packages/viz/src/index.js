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

import CBGDateTraceLabel from './components/trends/cbg/CBGDateTraceLabel'
import FocusedRangeLabels from './components/trends/common/FocusedRangeLabels'
import Loader from './components/common/loader/Loader'
import RangeSelect from './components/trends/cbg/RangeSelect'
import TwoOptionToggle from './components/common/controls/TwoOptionToggle'
import PumpSettingsContainer from './components/settings/common/PumpSettingsContainer'
import TrendsContainer from './components/trends/common/TrendsContainer'
import BolusTooltip from './components/daily/bolustooltip/BolusTooltip'
import SMBGTooltip from './components/daily/smbgtooltip/SMBGTooltip'
import Stat from './components/common/stat/Stat'
import CBGTooltip from './components/daily/cbgtooltip/CBGTooltip'
import PhysicalTooltip from './components/daily/physicaltooltip/PhysicalTooltip'
import ParameterTooltip from './components/daily/parametertooltip/ParameterTooltip'
import WarmUpTooltip from './components/daily/warmuptooltip/WarmUpTooltip'

import reducers from './redux/reducers/'

import { formatBgValue, formatParameterValue } from './utils/format'
import { reshapeBgClassesToBgBounds } from './utils/bloodglucose'
import { getGroupDurations, getTotalBasalFromEndpoints } from './utils/basal'
import { isAutomatedBasalDevice } from './utils/device'
import { addDuration, getLocalizedCeiling, getLongDayHourFormat, getTimezoneFromTimePrefs } from './utils/datetime'
import {
  commonStats,
  getStatAnnotations,
  getStatData,
  getStatDefinition,
  getStatTitle,
  statBgSourceLabels,
  statFetchMethods
} from './utils/stat'
import DataUtil from './utils/data'
import getParametersChanges from './utils/parametersHistory'
import createPrintPDFPackage from './modules/print'
import { generatePDFStats, generatePumpSettings, selectDailyViewData } from './utils/print/data'

const components = {
  CBGDateTraceLabel,
  FocusedRangeLabels,
  Loader,
  RangeSelect,
  TwoOptionToggle,
  BolusTooltip,
  SMBGTooltip,
  Stat,
  CBGTooltip,
  PhysicalTooltip,
  ParameterTooltip,
  WarmUpTooltip
}

const containers = {
  PumpSettingsContainer,
  TrendsContainer
}

const utils = {
  basal: {
    getGroupDurations,
    getTotalBasalFromEndpoints
  },
  bg: {
    formatBgValue,
    reshapeBgClassesToBgBounds
  },
  data: {
    selectDailyViewData,
    generatePumpSettings,
    generatePDFStats,
    DataUtil
  },
  datetime: {
    addDuration,
    getLocalizedCeiling,
    getTimezoneFromTimePrefs
  },
  device: {
    isAutomatedBasalDevice
  },
  stat: {
    commonStats,
    getStatAnnotations,
    getStatData,
    getStatDefinition,
    getStatTitle,
    statBgSourceLabels,
    statFetchMethods
  }
}

export {
  components,
  containers,
  utils,
  reducers,
  createPrintPDFPackage,
  getParametersChanges,
  getLongDayHourFormat,
  formatParameterValue
}
