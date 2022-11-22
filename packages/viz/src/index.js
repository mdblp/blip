/*
 * Copyright (c) 2016-2022, Diabeloop
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
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
